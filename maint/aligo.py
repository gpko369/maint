import requests
import json


def send_kakao_register_complete(phone_number, project):
    phone_number = phone_number
    url = 'https://kakaoapi.aligo.in/akv10/token/create/30/s/'
    data_1 = {
        "apikey": "hz1yf8u06vgd4v41jprosxisg9we0txw",
        'userid': 'maintadmin',
    }
    response = requests.post(url=url, data=data_1)
    response = json.loads(response.text)
    token = response['token']
    data_1['token'] = token
    data_1['senderkey'] = "dece9debf11925d400281ab68d43656929ee60db"
    data_1['tpl_code'] = "TA_5430"
    data_1['sender'] = "01041651661"
    data_1['subject_1'] = "결제 완료"
    data_1['message_1'] = '안녕하세요, 마인트입니다. ['+ str(project) +'] 프로젝트 결제 완료해주셔서 감사합니다.\n\n프로젝트 모집 완료 시 단톡방 초대해드리고, 안내사항 공지해드리겠습니다.\n\n'
    data_1['button_1'] = json.dumps({'button':[{'name': '메인 페이지','linkType': 'WL','linkMo': 'https://maint.me','linkPc': 'https://maint.me'}]})
    data_1['receiver_1'] = phone_number
    response2 = requests.post(url='https://kakaoapi.aligo.in/akv10/alimtalk/send/', data=data_1)

    return response2

def send_kakao_purchase_complete(phone_number,order_id, project, price):
    phone_number = phone_number
    url = 'https://kakaoapi.aligo.in/akv10/token/create/30/s/'
    data_1 = {
        "apikey": "hz1yf8u06vgd4v41jprosxisg9we0txw",
        'userid': 'maintadmin',
    }
    response = requests.post(url=url, data=data_1)
    response = json.loads(response.text)
    token = response['token']
    data_1['token'] = token
    data_1['senderkey'] = "dece9debf11925d400281ab68d43656929ee60db"
    data_1['tpl_code'] = "TA_8750"
    data_1['sender'] = "01064787630"
    data_1['subject_1'] = "프로젝트 결제 완료 (예예"
    data_1['message_1'] = "안녕하세요, 마인트입니다.\n결제가 완료되었습니다.\n\n주문번호 : "+ str(order_id) +"\n프로젝트명 : "+ str(project) +"\n결제금액 : "+ str(price) + "원\n\n※ 모집 마감일이 지나고, 최대 2일 이내에 해당 프로젝트의 개설 여부와 추후 진행방식을 공유해드릴 예정입니다. 조금만 기다려주시면 감사하겠습니다.\n\n※ 기타 [문의사항]이 있다면?\n▷ 마인트 고객센터(02-876-3233)\n▷ 하단 ‘상담원과 대화하기’"
    data_1['receiver_1'] = phone_number
    response2 = requests.post(url='https://kakaoapi.aligo.in/akv10/alimtalk/send/', data=data_1)

    return response2