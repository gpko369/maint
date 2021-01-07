from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
import requests
from random import randint
from datetime import datetime, timedelta
import json
#from projects.models import Project

# Create your models here.
# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, ):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, ):
        user = self.create_user(
            email,
            password=password,
        )

        user.is_superuser = True
        user.is_staff = True
        user.name = '관리자2'
        user.save(using=self._db)
        return user


class User(AbstractUser):
    username = None
    email = models.EmailField('이메일', unique=True)
    name = models.CharField('이름', max_length=12)
    gender = models.CharField('성별', choices=(('F', '여'), ('M', '남')), blank=True, null=True, max_length=100)
    #project_enrolled = models.ManyToManyField('projects.Project', verbose_name='참여한 프로젝트', blank=True, related_name='project_enrolling')
    birth = models.DateField('생년월일', blank=True, null=True)
    img = models.ImageField('프로필사진', upload_to="accounts/user/%Y/%m/%d", blank=True,
                            default='account/IC-EMPTY_PROFILE@2x.png')
    phone_number = models.CharField('휴대폰번호', max_length=15, null=True, blank=True)
    oauth_id = models.CharField('oauth 인증번호', max_length=45, blank=True, null=True)
    register_date = models.DateTimeField('가입 날짜', auto_now_add=True)

    agree_1 = models.BooleanField('이용약관 동의', default=True)
    agree_2 = models.BooleanField('개인정보처리방침 동의', default=True)
    agree_3 = models.BooleanField('마케팅 및 안내메일 수신 동의', default=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = '회원'
        verbose_name_plural = '회원'

    def __str__(self):
        return self.name

    def get_full_name(self):
        return self.email

    def get_short_name(self):
        return self.name


class SMSAuth(models.Model):
    phone_number = models.CharField('휴대폰번호', max_length=15, default=None)
    auth_number = models.IntegerField(blank=True, verbose_name='인증번호')
    expired_time = models.DateTimeField(verbose_name='인증번호 만료시각')
    is_verified = models.BooleanField(verbose_name='인증여부', default=False)

    # 여기서 save는 신규 발행 및 인증번호 문자 발송을 포함합니다.
    # 인증여부 변경을 위해서는 verify를 이용해주세요
    def save(self, phone_number, *args, **kwargs):
        #phone_number = kwargs.get('phone_number') if kwargs.get('phone_number') else self.user.phone_number
        print(**kwargs)
        self.auth_number = randint(1000, 10000)
        self.expired_time = datetime.now() + timedelta(minutes=5)
        self.is_verified = False
        super(SMSAuth, self).save(*args, **kwargs)
        self.send_kakao(phone_number=phone_number)

    def verify(self):
        self.is_verified = True
        super(SMSAuth, self).save()


    def send_kakao(self, phone_number, *args, **kwargs):
        phone_number = phone_number
        url = 'https://kakaoapi.aligo.in/akv10/token/create/30/s/'
        data_1 = {
            "apikey" : "hz1yf8u06vgd4v41jprosxisg9we0txw",
            'userid' : 'maintadmin',
        }
        response = requests.post(url=url, data=data_1)
        response = json.loads(response.text)
        token = response['token']
        data_1['token'] = token
        data_1['senderkey'] = "dece9debf11925d400281ab68d43656929ee60db"
        data_1['tpl_code'] = "TA_5784"
        data_1['sender'] = "01041651661"
        data_1['subject_1'] = "본인 인증"
        data_1['message_1'] = '['+str(self.auth_number)+']' + ' MAINT 본인 인증 코드입니다.'
        data_1['receiver_1'] = phone_number
        response2 = requests.post(url='https://kakaoapi.aligo.in/akv10/alimtalk/send/', data=data_1)

        return response2

    def get_list(self):
        url = 'https://kakaoapi.aligo.in/akv10/token/create/30/s/'
        data_1 = {
            "apikey": "hz1yf8u06vgd4v41jprosxisg9we0txw",
            'userid': 'maintadmin',
        }

        response = requests.post(url=url, data=data_1)
        response = json.loads(response.text)
        token = response['token']
        data_1["token"] = token
        data_1['senderkey'] = "dece9debf11925d400281ab68d43656929ee60db"
        response2 = requests.post(url='https://kakaoapi.aligo.in/akv10/template/list/', data=data_1)
        response2 = json.loads(response2.text)

        #print(response2)
        return response2

    def validate_number(self, input_number):
        if self.is_verified:
            raise Exception('이미 인증된 번호입니다')

        if self.expired_time >= datetime.now():
            input_number = int(input_number)
            if self.auth_number == input_number:
                self.is_verified = True
                self.verify()
                return self.is_verified
            else:
                self.expired_time = datetime.now()
                super(SMSAuth, self).save()
                raise Exception('인증번호가 다릅니다, 다시 발급받아 주세요')
        else:
            raise Exception('인증번호가 만료되었습니다, 다시 발급받아주세요')



class Coach(models.Model):
    name = models.CharField('이름', max_length=45)
    introduction = models.TextField('소개')
    carrer = models.TextField('경력')
    img = models.ImageField('사진', upload_to="accounts/coach/%Y/%m/%d", blank=True,
                            default='account/IC-EMPTY_PROFILE@2x.png')
    register_date = models.DateTimeField('등록 날짜', auto_now_add=True)

    def __str__(self):
        return self.name