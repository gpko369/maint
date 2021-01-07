from django.shortcuts import render, HttpResponse
from .lib.BootpayApi import BootpayApi
from .models import Apply, Payment
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from accounts.models import User
import ipaddress
import logging
from django.http import Http404

logger = logging.getLogger('payment')

import requests
# Create your views here.

def test(request):
    return render(request, 'pay_test.html', {})

# Mutation 방식으로

@csrf_exempt
def toss_verify(request):
    # 이곳은 Toss의 feedback을 받아 실행됩니다.
    # 다만 부트페이와 다르게 IP 대역폭 검증을 위한 정보가 부재합니다.
    print('post', request.POST)
    if request.method == "POST":
        order_id = request.POST.get('orderNo')
        status = request.POST.get('status')
        paytoken = request.POST.get('payToken')
        receipt_id = request.POST.get('transactionId')
        sales_check_url = request.POST.get('salesCheckLinkUrl')
        amount = int(request.POST.get('amount'))
        apply = Apply.objects.filter(paytoken=paytoken)
       # print('paytoken :', paytoken, len(paytoken))
        #print(apply)


       # print(1)

        if not apply:
            raise Http404('신청건이 확인되지 않습니다')
        else:
            apply = apply.first()

        if apply.price != amount:
            raise Http404('결제 금액이 일치하지 않습니다')


       # print(1.2)

        if Payment.objects.filter(apply=apply):
            payment = Payment.objects.filter(apply=apply).first()

        else:
            payment = Payment()
            payment.apply = apply

        #print(2)

        if status == 'PAY_SUCCESS':
            payment.status = 1
            payment.verified = True
        else:
            payment.status = 999
            payment.verified = False

        payment.receipt_id = receipt_id
        payment.purchased_at = request.POST.get('paidTs')
        payment.requested_at = payment.purchased_at
        payment.price = amount
        payment.method = 'toss'
        payment.receipt_url = sales_check_url if sales_check_url else 'toss'
        payment.save()

        #print(3)

        return HttpResponse("OK", content_type='text/plain')





@csrf_exempt
def verify(request):
    # 이곳은 부트페이의 feedback을 받아 실행됩니다.
    if request.method == "POST":

        # 해당 request가 BootPay의 서버로 부터 온 것인지 IP 검증을 수행합니다.
        b_ip = int(ipaddress.IPv4Address(request.headers['X-Forwarded-For']))
        ip_min = int(ipaddress.IPv4Address("223.130.82.0"))
        ip_max = int(ipaddress.IPv4Address("223.130.82.24"))

        if b_ip > ip_max or b_ip < ip_min:
            print(b_ip, ip_min, ip_max)
            print(request.headers['X-Forwarded-For'])
            raise Exception('부트페이 서버의 IP 주소와 다릅니다')

        receipt_id = request.POST.get('receipt_id')

        #callback으로 인자를 넘겨받습니다. 프론트 페이지 변수 설정이 필요합니다.
        apply_id = request.POST.get('params[apply_id]')
        user_id = request.POST.get('params[user_id]')

        user = User.objects.get(id=user_id)

        logger.debug("(1)결제 검증 시작")
        apply = Apply.objects.get(id=apply_id)
        if not apply:
            raise Exception('문제가 발생했습니다')

        bootpay = BootpayApi(
            "5dc13d864f74b4002ec5f510",
            "kpOvhvspGIRD9recMQcTi8HMcZiQptuKS1hajdVdAug="
        )

        # 디버깅
        if bootpay:
            logger.debug("(2)부트페이 불러옴")

        result = bootpay.get_access_token()
        ###### 한 프로젝트에는 1번만 결제 가능합니다.
        # print(result)

        # 디버깅
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

                # Apply User와 Payment 생성을 시도하는 User가 일치하는지 검증을 수행합니다.
                if apply.user != user:
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
                    print('verified')
                    logger.debug("(8-1)결제 검증 완료")

                else:
                    payment.verified = False
                    print('not verified')
                    print(request.POST)
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

            else:
                if verify_result['message']:
                    logger.debug("(오류)" + verify_result['message'])
                    raise Exception(verify_result['message'])
                else:
                    logger.debug("[검증 상태]문제가 발생했습니다")
                    raise Exception('문제가 발생했습니다')


        return HttpResponse("OK", content_type='text/plain')

    # 이곳은 클라이언트에서 주문완료가 된 경우 실행됩니다.
    '''
    if request.method == "GET":
        receipt_id = request.GET.get('receipt_id')
        apply_id = request.GET.get('apply_id')
        apply = Apply.objects.get(id=apply_id)
        if not apply:
            raise Exception('문제가 발생했습니다')


        ###### 한 프로젝트에는 1번만 결제 가능합니다.
        if result['status'] is not 200:
            raise Exception('문제가 발생했습니다')
        else:
            verify_result = bootpay.verify(receipt_id)

            #print(verify_result)
            if verify_result['status'] is 200:
                response = verify_result['data']
                if Payment.objects.filter(apply=apply):
                    payment = apply.payment
                else:
                    payment = Payment()
                    payment.apply = apply

                payment.user = request.user
                payment.receipt_id = receipt_id
                payment.price = response['price']
                payment.method = response['method']
                payment.requested_at = response['requested_at']
                payment.purchased_at = response['purchased_at']
                payment.status = response['status']

                if response['status'] is 1 and response['price'] is apply.price:
                    payment.verified = True
                else:
                    payment.verified = False
                payment.save()

                return JsonResponse({'result' : payment.verified })
            else:
                if verify_result['message']:
                    raise Exception(verify_result['message'])

            raise Exception('문제가 발생했습니다')





    #     token = result['data']['token']
    #
    # #엑세스 토큰을 발급받은 후
    # headers = {'Authorization': token}
    # response = requests.get("https://api.bootpay.co.kr/receipt/"+ receipt_id, headers=headers)
    '''