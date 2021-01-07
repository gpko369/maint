import graphene
from graphene_django.types import DjangoObjectType
from graphql_jwt.decorators import login_required
from .models import *
from django.contrib.auth.password_validation import validate_password
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from maint.slack import slack_notify

class UserType(DjangoObjectType):
    class Meta:
        model = User
        exclude = ['oauth_id']

    #아랫부분은 그냥 테스트 용도입니다.
    extra_field = graphene.String()

    def resolve_extra_field(self, info):
        return 'hello!'

class CoachType(DjangoObjectType):
    class Meta:
        model = Coach
        fields = '__all__'

    #아랫부분은 그냥 테스트 용도입니다.
    extra_field = graphene.String()

    def resolve_extra_field(self, info):
        return self.img.url

class SMSAuthType(DjangoObjectType):
    class Meta:
        model = SMSAuth
        fields = '__all__'


class Query(object):
    all_users = graphene.List(UserType)
    all_coaches = graphene.List(CoachType)
    mypage = graphene.Field(UserType)
    me = graphene.Field(UserType)
    user = graphene.Field(UserType, id=graphene.ID(required=True))
    coach = graphene.Field(CoachType, id=graphene.ID(required=True))

    def resolve_all_users(self, info, **kwargs):
        return User.objects.all()

    @login_required
    def resolve_mypage(self, info):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception('Not logged in!')
        return user

    @login_required
    def resolve_me(self, info):
        user = info.context.user
        print(info.context.COOKIES)
        if not user.is_authenticated:
            raise Exception('Not logged in!')
        return user

    def resolve_all_coaches(self, info, **kwargs):
        return Coach.objects.all()

    def resolve_coach(self, info, id, **kwargs):
        return Coach.objects.get(id=id)

    def resolve_user(self, info, id, **kwargs):
        return User.objects.get(id=id)

class CoachMutation(graphene.Mutation):
    class Arguments:
        # The input arguments for this mutation
        name = graphene.String(required=True)
        id = graphene.ID()
        carrer = graphene.String()

    coach = graphene.Field(CoachType)

    #ID값이 넘어오는 경우는 Update / 넘어오지 않으면 Create
    @login_required
    def mutate(self, info, name, carrer, **kwargs):
        id = kwargs.get('id')
        if id:
            u_coach = Coach.objects.get(pk=id)
            u_coach.name = name
            u_coach.carrer = carrer
            if bool(info.context.FILES):
                # 이곳은 프론트단에서 어떻게 이미지 파일이 넘어오는지 확인이 필요!
                u_coach.img = info.context.FILES.items
            u_coach.save()
        else:
            u_coach = Coach(name=name, carrer=carrer)
            u_coach.save()

        return CoachMutation(coach=u_coach)

class UserMutation(graphene.Mutation):
    class Arguments:
        # The input arguments for this mutation
        # 프론트에서 required 처리를 하도록 합니다.
        id = graphene.ID()
        email = graphene.String()
        password = graphene.String()
        name = graphene.String()
        gender = graphene.String()
        birth = graphene.Date()
        phone = graphene.String()
        agree_1 = graphene.Boolean()
        agree_2 = graphene.Boolean()
        agree_3 = graphene.Boolean()

    user = graphene.Field(UserType)

    # ID값이 넘어오는 경우는 Update / 넘어오지 않으면 Create
    # password validation은 이용하나 아직 email validation은 이용 X

    @login_required
    def mutate(self, info, email=None, name=None, password=None, birth=None, gender=None, phone=None, agree_1=None,agree_2=None,agree_3=None, **kwargs):
        id = kwargs.get('id')
        #장고의 기본 패스워드 검증을 이용합니다.
        #validate_password(password=password)
        if id:
            if info.context.user.is_authenticated:
                r_user = User.objects.get(pk=id)
                r_user.email = email if email else r_user.email
                r_user.name = name if name else r_user.name
                r_user.gender = gender if gender else r_user.gender
                r_user.birth = birth if birth else r_user.birth
                r_user.phone_number = phone if phone else r_user.phone_number
                r_user.agree_1 = agree_1 if agree_1!=None else r_user.agree_1
                r_user.agree_2 = agree_2 if agree_2!=None else r_user.agree_2
                r_user.agree_3 = agree_3 if agree_3!=None else r_user.agree_3
                #r_user.set_password(password)
                if password:
                    validate_password(password=password)
                    r_user.set_password(password)

                if bool(info.context.FILES):
                    # 이곳은 프론트단에서 어떻게 이미지 파일이 넘어오는지 확인이 필요!
                    # 회원가입할때 굳이 프로필사진을 받을 필요는 없을듯!
                    r_user.img = info.context.FILES.items
                r_user.save()
            else:
                raise PermissionError("로그인이 필요합니다")
        else:
            r_user = User(name=name, email=email, birth=birth, gender=gender)
            r_user.set_password(password)
            r_user.save()

        return UserMutation(user=r_user)

class RegisterMutation(graphene.Mutation):
    class Arguments:
        email = graphene.String()
        password = graphene.String()
        name = graphene.String()
        gender = graphene.String()
        birth = graphene.Date()
        phone = graphene.String()
        agree_1 = graphene.Boolean()
        agree_2 = graphene.Boolean()
        agree_3 = graphene.Boolean()
    
    user = graphene.Field(UserType)

    def mutate(self, info, email=None, name="익명", password=None, birth=None, gender=None, phone=None, agree_1=True, agree_2=True,agree_3=True, **kwargs):
        #장고의 기본 패스워드 검증을 이용합니다.
        #validate_password(password=password)
        r_user = User(name=name, email=email, birth=birth, gender=gender, phone_number=phone, agree_1=agree_1, agree_2=agree_2, agree_3=agree_3)
        r_user.set_password(password)
        r_user.save()

        return UserMutation(user=r_user)


class csrf_token(graphene.Mutation):
    token = graphene.String()

    @csrf_exempt
    def mutate(self, info, **kwargs):
        token = get_token(info.context)
        return csrf_token(token=token)


# class PhoneNumberMutation(graphene.Mutation):
#     class Arguments:
#         phone_number = graphene.String(required=True)
#
#     result = graphene.Boolean()
#
#     @login_required
#     def mutate(self, info, phone_number, **kwargs):
#         user = info.context.user
#         user.phone_number = phone_number
#         user.save()
#
#         return PhoneNumberMutation(result=True)

class EmailDuplicateCheck(graphene.Mutation):
    class Arguments:
        email = graphene.String()
    
    result = graphene.Boolean()

    def mutate(self, info, email, *args, **kwargs):
        user = User.objects.filter(email=email)
        if user:
            result = True
        else:
            result = False
        return EmailDuplicateCheck(result=result)

class SMSAuthMutation(graphene.Mutation):
    class Arguments:
        auth_number = graphene.String()
        phone_number = graphene.String(required=True)

    result = graphene.String()

    def mutate(self, info, *args, **kwargs):
        auth_number = kwargs.get('auth_number')
        phone_number = kwargs.get('phone_number')

        same_phone_user = User.objects.filter(phone_number=phone_number)

        if same_phone_user:
            return SMSAuthMutation(result='이미 해당 번호로 가입한 회원이 존재합니다.')
        
        try:
            sms_auth = SMSAuth.objects.get(phone_number=phone_number)
        except SMSAuth.DoesNotExist:
            sms_auth = None

        if not sms_auth:
            sms_auth = SMSAuth()
            sms_auth.phone_number = phone_number

        # auth_number가 넘어오는 경우 sms 인증번호 검증을 시작합니다
        if auth_number:
            sms_auth.validate_number(input_number=auth_number)

            return SMSAuthMutation(result='인증에 성공하였습니다')

        sms_auth.save(phone_number=phone_number)

        return SMSAuthMutation(result='인증번호가 발송되었습니다')



        # #휴대폰 번호가 입력된 경우 인증번호 발송까지의 과정을 거칩니다
        # if phone_number and not auth_number:
        #     print(1)
        #     #기존 휴대폰 번호가 있는 경우
        #     if SMSAuth.objects.filter(user=user):
        #         sms_auth = user.smsauth
        #     # 신규로 휴대폰 번호를 등록하는 경우
        #     else:
        #         sms_auth = SMSAuth()
        #         sms_auth.user = user
        #     sms_auth.save(phone_number=phone_number)
        #     message = '인증번호가 발송되었습니다'
        #
        # # 인증 번호가 입력된 경우, 검증과정을 거친 후, 검증 결과 값과 휴대폰 번호를 리턴합니다
        # elif (not phone_number) and auth_number:
        #     print(2)
        #     if SMSAuth.objects.filter(user=user):
        #         sms_auth = user.smsauth
        #         sms_auth.validate_number(input_number=auth_number)
        #         user.phone_number = phone_number
        #     else:
        #         raise Exception('휴대폰 번호를 먼저 입력해 주세요')

        return SMSAuthMutation(result=message)







class Mutation(graphene.ObjectType):
    register_user = RegisterMutation.Field()
    update_coach = CoachMutation.Field()
    update_user = UserMutation.Field()
    sms_auth = SMSAuthMutation.Field()
    csrf_token = csrf_token.Field()
    email_duplicate_check = EmailDuplicateCheck.Field()

