from django.shortcuts import render
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt


def logout(request):
    #print(request.COOKIES.get('JWT'))
    response = JsonResponse({'result' : 'success'})
    response.delete_cookie('JWT')
    return response

def csrf_token(request):
    token = get_token(request)
    response = JsonResponse({'token' : token })
    response.set_cookie('csrftoken', token)
    return response