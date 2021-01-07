from social_core.backends.kakao import KakaoOAuth2
from social_core.backends.facebook import FacebookOAuth2
from datetime import datetime
from functools import wraps
from graphql_jwt.settings import jwt_settings

class KakaoOauth2Custsom(KakaoOAuth2):

    def get_user_details(self, response):
        """Return user details from Kakao account"""
        kaccount_email = response.get('kaccount_email', '')
        properties = response.get('properties', '')
        nickname = properties.get('nickname') if properties else ''
        return {
            'username': nickname,
            'email': kaccount_email if kaccount_email else str(hash(datetime.now().strftime("%m/%d/%Y, %H:%M:%S")))[:10]+"@kakao.com",
            'fullname': nickname,
            'first_name': nickname[1:] if nickname else '',
            'last_name': nickname[0] if nickname else '',
            'name' : nickname,
        }

class FacebookOauth2Custom(FacebookOAuth2):

    def get_user_details(self, response):
        """Return user details from Facebook account"""
        fullname, first_name, last_name = self.get_user_names(
            response.get('name', ''),
            response.get('first_name', ''),
            response.get('last_name', '')
        )
        uid = response.get('id')
        return {'username': response.get('username', response.get('name')),
                'email': response.get('email', uid+'@facebook.com'),
                'fullname': fullname,
                'first_name': first_name,
                'last_name': last_name,
                'name' : fullname}


def jwt_cookie(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        request.jwt_cookie = True
        response = view_func(request, *args, **kwargs)
        if hasattr(request, 'jwt_token'):
            expires = datetime.utcnow() + jwt_settings.JWT_EXPIRATION_DELTA

            if getattr(request, 'jwt_token') == 'logout':
                response.delete_cookie('JWT')
            else:
                response.set_cookie(
                    jwt_settings.JWT_COOKIE_NAME,
                    request.jwt_token,
                    expires=expires,
                    httponly=True,
                    secure=jwt_settings.JWT_COOKIE_SECURE)

                if hasattr(request, 'jwt_refresh_token'):
                    refresh_token = request.jwt_refresh_token
                    expires = refresh_token.created +\
                        jwt_settings.JWT_REFRESH_EXPIRATION_DELTA

                    response.set_cookie(
                        jwt_settings.JWT_REFRESH_TOKEN_COOKIE_NAME,
                        refresh_token.token,
                        expires=expires,
                        httponly=True,
                        secure=jwt_settings.JWT_COOKIE_SECURE)

        return response
    return wrapped_view