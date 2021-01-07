from django.db import models
from projects.models import Project, Class
from accounts.models import User
from datetime import datetime, date
from django.db.models import Sum
from .lib.BootpayApi import BootpayApi
from django.http import Http404
from hashlib import sha3_256
from django.db.models.signals import post_save
from maint.slack import slack_notify
from maint.aligo import send_kakao_register_complete, send_kakao_purchase_complete

# Create your models here.
class Apply(models.Model):
    #project = models.ForeignKey(Project, verbose_name='프로젝트', on_delete=models.CASCADE, null=True, blank=True)
    p_class = models.ForeignKey(Class, verbose_name='수강반', on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, verbose_name='회원', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='신청 시각')
    price = models.IntegerField('가격', blank=True, null=True)
    quantity = models.IntegerField('수량',blank=True, null=True, default=1)
    order_id = models.CharField('주문 번호', max_length=13, blank=True, null=True)
    is_canceled = models.BooleanField('취소여부', default=False)
    paytoken = models.CharField('토스_페이토큰', blank=True, null=True, max_length=200)

    def __str__(self):
        return '{} - {}'.format(self.p_class, self.user)

    def save(self, *args, **kwargs):
        if not self.id:
            super(Apply, self).save(*args, **kwargs)
        if not self.order_id:
            self.order_id = hash(datetime.now().strftime("%m/%d/%Y, %H:%M:%S")+str(self.id)) % (10**8)
        if not self.price:
            self.price = self.p_class.project.price
        super(Apply, self).save(*args, **kwargs)

    def update_price(self, *args, **kwargs):
        coupons = self.coupon.all()
        coupon_price = coupons[len(coupons)-1].amount

        self.price = self.price - coupon_price
        super(Apply, self).save(*args, **kwargs)
    
    def update_price_quantity(self, quantity, *args, **kwargs):
        self.quantity = quantity
        if (quantity == 1):
            self.price = self.p_class.project.price
        elif (quantity == 2):
            self.price = int(self.p_class.project.price + (self.p_class.project.price * 0.8))
        elif (quantity == 3):
            self.price = int(self.p_class.project.price + (self.p_class.project.price * 0.8) + (self.p_class.project.price * 0.7))
        elif (quantity == 4):
            self.price = int(self.p_class.project.price + (self.p_class.project.price * 0.8) + (self.p_class.project.price * 0.7) + (self.p_class.project.price * 0.6))

        super(Apply, self).save(*args,**kwargs)

    def is_paid(self):
        payment = Payment.objects.filter(apply=self)
        if payment:
            payment = payment.first()
            if payment.verified:
                return True
        return False


class Coupon(models.Model):
    amount = models.PositiveIntegerField('금액')
    code = models.CharField('코드', max_length=8, blank=True)
    description = models.CharField(max_length=144)
    is_used = models.BooleanField('사용 여부', default=False)
    user = models.ForeignKey(User, verbose_name='회원', related_name='coupon', on_delete=models.CASCADE, null=True, blank=True)
    apply = models.ForeignKey(Apply, verbose_name='해당 신청', related_name='coupon', on_delete=models.SET_NULL, null=True, blank=True)
    due = models.DateField(verbose_name='마감기한')
    identifier = models.CharField('식별자', max_length=10, blank=True)
    min_price = models.PositiveIntegerField('최소 가격', default=0)
    max_price = models.PositiveIntegerField('최대 가격', default=999999999)

    def __str__(self):
        return self.description

    def save(self, *args, **kwargs):
        if not self.code:
            hash_text = sha3_256(datetime.now().strftime("%m/%d/%Y, %H:%M:%S").encode('UTF-8'))
            self.code = hash_text.hexdigest()[:7]

        if self.apply and self.is_used == False:
            self.is_used = True

        elif self.apply is None and self.is_used == True:
            self.is_used = False

        super(Coupon, self).save(*args, **kwargs)

    def check_expire(self):
        return date.today() < self.due

class Payment(models.Model):
    #user = models.ForeignKey(User, verbose_name='회원', on_delete=models.CASCADE)
    apply = models.OneToOneField(Apply, verbose_name='신청', on_delete=models.CASCADE)
    status = models.IntegerField('결제 상태')
    method = models.CharField('결제 수단', max_length=10)
    receipt_id = models.CharField('영수증 ID', max_length=200)
    purchased_at = models.CharField('결제 승인 시각', max_length=20, blank=True, null=True)
    requested_at = models.CharField('결제 요청 시각', max_length=20, blank=True, null=True)
    verified = models.BooleanField('결제검증 여부', default=False)
    price = models.CharField('가격', max_length=20)
    receipt_url = models.CharField("영수증 링크", max_length=200, blank=True)
    cancel_reason = models.TextField('취소이유', blank=True, null=True)

    def __str__(self):
        return self.apply.user.name

    @property
    def api(self):
        bootpay = BootpayApi(
            "5dc13d864f74b4002ec5f510",
            "kpOvhvspGIRD9recMQcTi8HMcZiQptuKS1hajdVdAug="
        )
        return bootpay

    def update(self, commit=True):
        if self.receipt_id:
            try:
                bootpay = self.api
                result = bootpay.get_access_token()
                verify_result = bootpay.verify(self.receipt_id)
                response = verify_result['data']
            except Exception as e:
                raise e
            self.status = response['status']

            if self.status == 1 and self.apply.price == response['price']:
                self.verified = True
            elif self.status == 1 and self.apply.price != response['price']:
                self.verified = False
                self.cancel()
            else:
                self.verified = False

            if self.verified == True and self.apply.p_class not in self.apply.user.enrolled_class.all():
                user = self.apply.user
                user.enrolled_class.add(self.apply.p_class)
                user.save()
        if commit:
            self.save()

    def cancel(self, reason='관리자의 취소', commit=True):
        if self.receipt_id:
            try:
                bootpay = self.api
                result = bootpay.get_access_token()
                if result['status'] is 200:
                    cancel_result = bootpay.cancel(self.receipt_id, self.price, self.apply.user.name, reason)
                    #print(cancel_result)
                    if cancel_result['status'] is 200:
                        self.update()
                        self.cancel_reason = reason
                    else:
                        return cancel_result['message']

            except Exception as e:
                raise e

        if commit:
            self.save()


def notify_payment_created(sender, instance, created, update_fields, **kwargs):
    payment = instance
    can_pass = True
    if created or update_fields:
        if update_fields:
            text = "정상적으로 처리되었습니다"
        elif instance.verified:
            text = '완료되었습니다'
        else:
            can_pass = False
            text = "생성되었으나 완료되지 않았습니다"

        payment_alert_message = [
            {
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "*[" + str(payment.apply.p_class.project.title) + "]* 프로젝트의 결제가 {}.:tada::tada:".format(text)
                        }
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": ":clipboard: *결제 정보* :clipboard:"
                        }
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "section",
                        "fields": [
                            {
                                "type": "mrkdwn",
                                "text": ":pencil2: *이름* \n" + str(payment.apply.user.name)
                            },
                            {
                                "type": "mrkdwn",
                                "text": ":woman: *성별* :man: \n" + str(payment.apply.user.gender)
                            }
                        ]
                    },
                    {
                        "type": "section",
                        "fields": [
                            {
                                "type": "mrkdwn",
                                "text": ":calendar: *생년월일* \n" + str(payment.apply.user.birth)
                            },
                            {
                                "type": "mrkdwn",
                                "text": ":phone: *연락처* \n" + str(payment.apply.user.phone_number)
                            }
                        ]
                    },
                    {
                        "type": "section",
                        "fields": [
                            {
                                "type": "mrkdwn",
                                "text": "*:credit_card: 수강반* \n" + str(payment.apply.p_class.name)
                            },
                            {
                                "type": "mrkdwn",
                                "text": "*:credit_card: 결제 금액* \n" + str(payment.price)
                            }
                        ]
                    },
                    {
                        "type": "divider"
                    }
                ]
            }
        ]

        slack_notify(channel='결제완료', attachments=payment_alert_message)
        # slack_notify(channel='test_notify', attachments=payment_alert_message)
        if can_pass:
           send_kakao_purchase_complete(phone_number=str(payment.apply.user.phone_number),
                                         order_id=str(payment.apply.order_id), project=str(payment.apply.p_class.project.title),
                                         price=str(payment.apply.price))


post_save.connect(notify_payment_created, sender=Payment)
