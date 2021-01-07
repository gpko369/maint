import graphene
from graphene_django.types import DjangoObjectType
from graphql_jwt.decorators import login_required
from .models import *
from projects.models import Project, Class
from payment.models import Coupon
from .lib.BootpayApi import BootpayApi
from maint.slack import slack_notify
from hashlib import sha3_256
from maint.aligo import send_kakao_register_complete, send_kakao_purchase_complete
from accounts.models import SMSAuth
import logging
import requests


logger = logging.getLogger('payment')

class ApplyType(DjangoObjectType):
    class Meta:
        model = Apply
    paid = graphene.Boolean()

    def resolve_paid(self, info):
        return self.is_paid()

class CouponType(DjangoObjectType):
    class Meta:
        model = Coupon

    check = graphene.Boolean()

    @login_required
    def resolve_check(self, info):
        return self.user == info.context.user and self.check_expire()

class PaymentType(DjangoObjectType):
    class Meta:
        model = Payment

class Query(object):
    my_apply = graphene.List(ApplyType)
    my_coupon = graphene.List(CouponType)
    my_payment = graphene.List(PaymentType)

    @login_required
    def resolve_my_apply(self, info, **kwargs):
        return Apply.objects.filter(user=info.context.user).select_related('enrolled_class__project')

    @login_required
    def resolve_my_coupon(self, info, **kwargs):
        return Coupon.objects.filter(user=info.context.user)

    @login_required
    def resolve_my_payment(self, info, **kwargs):
        return Payment.objects.filter(apply__user=info.context.user).select_related('apply')


class CreateApply(graphene.Mutation):
    class Arguments:
        #project_id = graphene.ID(required=True)
        coupon_id = graphene.ID()
        quantity = graphene.Int()
        class_id = graphene.ID()

    apply = graphene.Field(ApplyType)
    message = graphene.String()

    @login_required
    def mutate(self, info, coupon_id, class_id, quantity=1,  **kwargs):
        user = info.context.user
        #project = Project.objects.get(id=project_id)
        p_class = Class.objects.get(id=class_id)
        apply = Apply.objects.filter(user=user, p_class=p_class)


        message = '성공적으로 신청되었습니다'
        if apply:
            apply = apply.first()
            if Payment.objects.filter(apply=apply, verified=True):
                message = '이미 결제 완료된 신청건이 존재합니다. 관리자에게 기존 결제건 취소요청을 해주세요'
            else:
                message = '기존 신청건이 있어 불러옵니다'
        else:
            apply = Apply()
            apply.user = user
            apply.p_class = p_class
            apply.save()
        

        #apply.save()
        
        if quantity >= 1:
            apply.update_price_quantity(quantity)

        
        if not coupon_id==-1:
            #해당하는 쿠폰 찾기
            coupon = Coupon.objects.filter(id=coupon_id)
            #유저의 모든 쿠폰 불러오기
            allUserCoupon = Coupon.objects.filter(user=user)

            if coupon:
                coupon = coupon[0]
                if not Payment.objects.filter(apply=coupon.apply, verified=True):
                    if coupon.user == user and coupon.check_expire():
                        for userCoupon in allUserCoupon:
                            if userCoupon.apply:
                                userCoupon.apply = None
                                userCoupon.save()
                            elif userCoupon.apply:
                                if not Payment.objects.filter(apply=userCoupon.apply, verified=True):
                                    userCoupon.apply = None
                                    userCoupon.save()

                        coupon.apply = apply
                        print(coupon)
                        #coupon.is_used = True
                        coupon.save()

                        apply.update_price()
                    elif not coupon.check_expire():
                        raise Exception('만료된 쿠폰입니다')
        
        
        apply_alert_message = [
            {
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "*["+ str(apply.p_class.project.title) +"]* 프로젝트의 결제가 시작되었습니다.:tada::tada:"
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
                                "text": ":pencil2: *이름* \n" + str(apply.user.name)
                            },
                            {
                                "type": "mrkdwn",
                                "text": ":female_sign: *성별* :male_sign: \n" + str(apply.user.gender)
                            }
                        ]
                    },
                    {
                        "type":"section",
                        "fields":[
                            {
                                "type": "mrkdwn",
                                "text": ":calendar: *생년월일* \n" + str(apply.user.birth)
                            },
                            {
                                "type": "mrkdwn",
                                "text": ":phone: *연락처* \n" + str(apply.user.phone_number)
                            }
                        ]
                    },
                    {
                        "type":"section",
                        "fields":[
                            {
                                "type": "mrkdwn",
                                "text": "*:heavy_multiplication_x: 수량* \n" + str(apply.quantity)
                            },
                            {
                                "type": "mrkdwn",
                                "text": "*:credit_card: 수강반* \n" + str(apply.p_class.name)
                            }
                          ]
                    },{
                        "type":"section",
                        "fields":[
                            {
                                "type": "mrkdwn",
                                "text": "*:credit_card: 결제 금액* \n" + str(apply.price)
                            }
                          ]
                    },
                    {
                        "type": "divider"
                    }
                ]
            }
        ]
        slack_notify(channel='#test',attachments=apply_alert_message)
        #SMSAuth.get_list(self)
        #send_kakao_register_complete(phone_number=str(apply.user.phone_number), project=str(apply.project.title))
        
        

        return CreateApply(apply=apply, message=message)

class DeleteApply(graphene.Mutation):
    class Arguments:
        apply_id = graphene.ID(required=True)

    message = graphene.String()

    @login_required
    def mutate(self, info, apply_id, **kwargs):
        apply = Apply.objects.get(id=apply_id)
        if apply.user == info.context.user:
            apply.delete()
            return DeleteApply(message='삭제되었습니다')
        else:
            raise PermissionError

class RemoveProject(graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)

    message = graphene.String()

    @login_required
    def mutate(self, info, project_id, **kwargs):
        project = Project.objects.get(id=project_id)
        user = info.context.user
        if project in user.project_enrolled.all():
            user.project_enrolled.remove(project)
            if user.apply_set.filter(project=project):
                apply = user.apply_set.filter(project=project).first()
                p_class = apply.p_class
                p_class.users.remove(user)
                apply.is_canceled=True
                p_class.save()
                apply.save()
                if Payment.objects.filter(apply=apply):
                    apply.payment.cancel(reason='프로젝트를 취소하였습니다')

            return RemoveProject(message='제거되었습니다')
        else:
            raise Exception('해당 프로젝트가 없습니다')

class RemoveClass(graphene.Mutation):
    class Arguments:
        p_class_id = graphene.ID(required=True)

    message = graphene.String()

    @login_required
    def mutate(self, info, p_class_id, **kwargs):
        p_class = Class.objects.get(id=p_class_id)
        user = info.context.user
        if p_class in user.enrolled_class.all():
            user.enrolled_class.remove(p_class)
            if user.apply_set.filter(p_class=p_class):
                apply = user.apply_set.filter(p_class=p_class).first()
                p_class = apply.p_class
                p_class.users.remove(user)
                apply.is_canceled=True
                p_class.save()
                apply.save()
                if Payment.objects.filter(apply=apply):
                    apply.payment.cancel(reason='프로젝트를 취소하였습니다')

            return RemoveProject(message='제거되었습니다')
        else:
            raise Exception('해당 프로젝트가 없습니다')

class CreateCoupon(graphene.Mutation):
    class Arguments:
        amount = graphene.Int()
        description = graphene.String()
        due = graphene.Date()
        min_price = graphene.Int()
        max_price = graphene.Int()
        identifier = graphene.String()
    
    coupon = graphene.Field(CouponType)
    
    @login_required
    def mutate(self, info, amount, description, due, min_price, max_price, identifier, **kwargs):
        user = info.context.user
        #백엔드 쪽에서 식별자를 통한 쿠폰 중복 발급 방지 기능 필요
        coupon = Coupon(amount=amount, description=description, user=user, due=due, min_price=min_price, max_price=max_price, identifier=identifier)
        if Coupon.objects.filter(identifier=identifier, user=user):
            raise Exception('이미 지급된 쿠폰입니다.')
        coupon.save()
        
        return CreateCoupon(coupon=coupon)




class RegisterCoupon(graphene.Mutation):
    class Arguments:
        coupon_code = graphene.String(required=True)

    coupon = graphene.Field(CouponType)

    @login_required
    def mutate(self, info, coupon_code, **kwargs):
        user = info.context.user
        coupon = Coupon.objects.filter(code=coupon_code)
        if coupon:
            coupon = coupon.first()
            if coupon.user:
                raise Exception('이미 등록된 쿠폰입니다')
            else:
                coupon.user = user
                coupon.save()
                return RegisterCoupon(coupon=coupon)
        else:
            raise Exception('코드가 정확하지 않습니다')

class TossRequest(graphene.Mutation):
    class Arguments:
        apply_id = graphene.ID(required=True)

    code = graphene.String()
    status = graphene.String()
    payToken = graphene.String()
    checkoutPage = graphene.String()

    @login_required
    def mutate(self, info, apply_id, **kwargs):
        logger.debug("(toss_1)결제 생성 요청")
        apply = Apply.objects.get(id=apply_id)
        if not apply:
            raise Exception('신청건이 없습니다')

        if Payment.objects.filter(apply_id=apply) and apply.payment.verified:
            raise Exception('이미 결제 완료된 신청입니다')

        if apply.user != info.context.user:
            raise Exception('권한이 없습니다')

        url = "https://pay.toss.im/api/v2/payments"
        data = {
            'orderNo' : apply.id,
            'amount' : str(apply.price),
            'amountTaxFree' : "0",
            'productDesc' : apply.p_class.__str__(),
            'apiKey' : "sk_test_Y5kmly7y8lY5kmv6xm2l",
            'autoExecute' : "true",
            'resultCallback' : "https://test.maint.website/toss_verify/",
            # 'callbackVersion' : 'V2',
            'retUrl' : "https://test.maint.website/purchaseComplete",
            'retCancelUrl' : "https://test.maint.website/project/" + str(apply.p_class.project.id) + "/order"
        }

        # apiKey : "sk_live_Bz2lqy1MNpBz2lGdV4kp", #실거래용

        res = requests.post(url, json=data, headers={'Content-Type': "application/json"})
        res = res.json()
        #print(res)
        code = res['code']
        if code == -1:
            raise Exception(res['msg'])
        status = res['status']
        payToken = res['payToken']
        #print('res_paytoken', payToken, len(payToken))
        checkoutPage = res['checkoutPage']

        #apply의 payToken을 업데이트 해줍니다.
        apply.paytoken = payToken
        apply.save()

        return TossRequest(code=code, status=status, payToken=payToken, checkoutPage=checkoutPage)

class TossVerifyPayment(graphene.Mutation):
    logger.debug("토스_결제검증 불러오기")
    class Arguments:
        #receipt_id = graphene.String(required=True)
        apply_id = graphene.ID(required=True)

    payment = graphene.Field(PaymentType)

    @login_required
    def mutate(self, info, apply_id, **kwargs):
        logger.debug("토스_(1)결제 검증 시작")
        apply = Apply.objects.get(id=apply_id)
        if not apply:
            raise Exception('문제가 발생했습니다')

        if not apply.paytoken:
            raise Exception('결제된 내역이 없습니다')

        paytoken = apply.paytoken

        #실거래용 apikey로 바꿔주세요
        url = "https://pay.toss.im/api/v2/status"
        data = {
            "apiKey" : "sk_test_Y5kmly7y8lY5kmv6xm2l",
            "payToken" : paytoken
        }

        res = requests.post(url, json=data, headers={'Content-Type': "application/json"})
        res = res.json()
        print(res)

        if Payment.objects.filter(apply_id=apply):
            payment = apply.payment
            if res['payStatus'] == "PAY_COMPLETE" and str(res['amount']) == str(payment.price):
                payment.verified = True
                payment.save()
            return TossVerifyPayment(payment=payment)
        else:
            raise Exception('결제가 완료되지 않았습니다.')








class VerifyPayment(graphene.Mutation):
    logger.debug("결제검증 불러오기")
    class Arguments:
        receipt_id = graphene.String(required=True)
        apply_id = graphene.ID(required=True)

    payment = graphene.Field(PaymentType)

    @login_required
    def mutate(self, info, receipt_id, apply_id, **kwargs):
        logger.debug("(1)결제 검증 시작")
        apply = Apply.objects.get(id=apply_id)
        if not apply:
            raise Exception('문제가 발생했습니다')

        bootpay = BootpayApi(
            "5dc13d864f74b4002ec5f510",
            "kpOvhvspGIRD9recMQcTi8HMcZiQptuKS1hajdVdAug="
        )

        #디버깅
        if bootpay:
            logger.debug("(2)부트페이 불러옴")

        result = bootpay.get_access_token()
        ###### 한 프로젝트에는 1번만 결제 가능합니다.
        # print(result)

        #디버깅
        if result:
            logger.debug("(3)토큰 불러옴")
        if result['status'] is not 200:
            logger.debug("[토큰 불러오기]문제가 발생했습니다")
            raise Exception('문제가 발생했습니다')
        else:
            verify_result = bootpay.verify(receipt_id)
            if verify_result:
                logger.debug("(4)부트페이 검증 결과 불러옴")
            if verify_result['status'] is 200:
                response = verify_result['data']
                if response:
                    logger.debug("(5)부트페이 검증 결과 데이터 불러옴")
                if Payment.objects.filter(apply=apply):
                    payment = apply.payment
                    is_updated = True
                    before_verified = payment.verified
                    logger.debug("(6-1)기존 결제 결과가 존재함")
                else:
                    payment = Payment()
                    payment.apply = apply
                    is_updated = False
                    before_verified = False
                    logger.debug("(6-2)새로운 결제 진행")


                #Apply User와 Payment 생성을 시도하는 User가 일치하는지 검증을 수행합니다.
                if apply.user != info.context.user:
                    raise Exception

                payment.receipt_id = receipt_id
                payment.price = response['price']
                payment.method = response['method']
                payment.requested_at = response['requested_at']
                payment.purchased_at = response['purchased_at']
                payment.receipt_url = response['receipt_url']
                payment.status = response['status']
                logger.debug("(7)유저 정보 입력 완료")

                if response['status'] is 1 and response['price'] == apply.price:
                    payment.verified = True
                    logger.debug("(8-1)결제 검증 완료")
                    
                else:
                    payment.verified = False
                    logger.debug("(8-2)결제 검증 실패")

                if is_updated and before_verified != payment.verified:
                    payment.save(update_fields=['verified'])
                else:
                    payment.save()

                logger.debug("(9)결제 정보 저장")
                if payment.verified == True and payment.apply.p_class not in payment.apply.user.enrolled_class.all():
                    p_class = apply.p_class
                    user = payment.apply.user
                    user.enrolled_class.add(payment.apply.p_class)
                    #p_class.users.add(user)
                    #user.save()
                    #p_class.save()
                    # payment_alert_message= [
                    #     {
                    #         "blocks": [
                    #             {
                    #                 "type": "section",
                    #                 "text": {
                    #                     "type": "mrkdwn",
                    #                     "text": "*["+ str(payment.apply.project.title) +"]* 프로젝트의 결제가 완료되었습니다.:tada::tada:"
                    #                 }
                    #             },
                    #             {
                    #                 "type": "section",
                    #                 "text": {
                    #                     "type": "mrkdwn",
                    #                     "text": ":clipboard: *결제 정보* :clipboard:"
                    #                 }
                    #             },
                    #             {
                    #                 "type": "divider"
                    #             },
                    #             {
                    #                 "type": "section",
                    #                 "fields": [
                    #                     {
                    #                         "type": "mrkdwn",
                    #                         "text": ":pencil2: *이름* \n" + str(payment.user.name)
                    #                     },
                    #                     {
                    #                         "type": "mrkdwn",
                    #                         "text": ":woman: *성별* :man: \n" + str(payment.user.gender)
                    #                     }
                    #                 ]
                    #             },
                    #             {
                    #                 "type":"section",
                    #                 "fields":[
                    #                     {
                    #                         "type": "mrkdwn",
                    #                         "text": ":calendar: *생년월일* \n" + str(payment.user.birth)
                    #                     },
                    #                     {
                    #                         "type": "mrkdwn",
                    #                         "text": ":phone: *연락처* \n" + str(payment.user.phone_number)
                    #                     }
                    #                 ]
                    #             },
                    #             {
                    #                 "type":"section",
                    #                 "fields":[
                    #                     {
                    #                         "type": "mrkdwn",
                    #                         "text": "*:credit_card: 수강반* \n" + str(payment.apply.p_class.name)
                    #                     },
                    #                     {
                    #                         "type": "mrkdwn",
                    #                         "text": "*:credit_card: 결제 금액* \n" + str(payment.price)
                    #                     }
                    #                 ]
                    #             },
                    #             {
                    #                 "type": "divider"
                    #             }
                    #         ]
                    #     }
                    # ]
                    # slack_notify(channel='결제완료',attachments=payment_alert_message)
                    # send_kakao_purchase_complete(phone_number=str(payment.apply.user.phone_number), order_id=str(payment.apply.order_id), project=str(payment.apply.project.title), price=str(payment.apply.price))

                return VerifyPayment(payment=payment)
            else:
                if verify_result['message']:
                    logger.debug("(오류)" + verify_result['message'])
                    raise Exception(verify_result['message'])
                else:
                    logger.debug("[검증 상태]문제가 발생했습니다")
                    raise Exception('문제가 발생했습니다')



# class UseCoupon(graphene.Mutation):
#     class Arguments:
#         #coupon_id = graphene.LIST(graphene.ID(required=True))
#         coupon_id = graphene.List(graphene.ID(), required=True)
#         apply_id = graphene.ID(required=True)
#
#     r_coupon = graphene.Field(CouponType)
#     @login_required
#     def mutate(self, info, coupon_id, apply_id, **kwargs):
#         user = info.context.user
#         coupons = Coupon.objects.filter(id__in=coupon_id)
#         apply = Apply.objects.get(id=apply_id)
#         for coupon in coupons:
#             if coupon.user == user:
#                 coupon.apply = apply
#                 coupon.is_used = True
#                 coupon.save()
#         apply.update_price()
#         return UseCoupon(r_coupon=coupon)

class Mutation(graphene.ObjectType):
    create_apply = CreateApply.Field()
    delete_apply = DeleteApply.Field()
    create_coupon = CreateCoupon.Field()
    register_coupon = RegisterCoupon.Field()
    verify_payment = VerifyPayment.Field()
    verify_toss = TossVerifyPayment.Field()
    remove_project = RemoveProject.Field()
    remove_class = RemoveClass.Field()
    create_toss = TossRequest.Field()
    #use_coupon = UseCoupon.Field()




