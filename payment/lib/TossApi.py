import requests
import json
import urllib


class TossApi:
    base_url = "https://pay.toss.im/api"

    def __init__(self, apiKey):
        self.apiKey = apiKey

    def create_payments(self, orderNo, productDesc, retCancelUrl, retUrl, amount):
        url = base_url + '/v1/payments'
        params = {
            "orderNo": orderNo,
            "amount": amount,
            "amountTaxFree": 0,
            "apiKey": self.apiKey,
            "projdecDesc": productDesc,
            "retUrl": retUrl,
            "autoExecute": true,
            "resultCallback": "127.0.0.1"
        }

        response = urllib.urlopen(url, urllib.urlencode(params))
        return response
    
    def result_callback(self):
        #결제 완료 요청을 받아 정보를 저장하는 프로세스 필요
        return self
    
    def refund(self, payToken, amount):
        url = base_url + '/v2/refunds'
        params = {
            "payToken": payToken,
            "amount": amount,
            "amountTaxFree": 0,
            "apiKey": self.apiKey
        }

        response = urllib.urlopen(url, urllib.urlencode(params))
        return response
    
    def check_status(self, payToken, orderNo):
        url = base_url + '/v1/status'
        params = {
            "payToken": payToken,
            "orderNo": orderNo,
            "apiKey": self.apiKey
        }

        response = urllib.urlopen(url, urllib.urlencode(params))
        return response