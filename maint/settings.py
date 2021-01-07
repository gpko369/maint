"""
Django settings for maint project.

Generated by 'django-admin startproject' using Django 2.2.6.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os
import raven
from datetime import timedelta
import json
from django.core.exceptions import ImproperlyConfigured

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DSN_URL = 'https://7cfc4733eabb4629946b17634ec2a9f2@sentry.io/1875888'
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

secret_file = os.path.join(BASE_DIR, 'config/secrets.json')

with open(secret_file) as f:
    secrets = json.loads(f.read())


def get_secret(setting, secrets=secrets):
    try:
        return secrets[setting]
    except KeyError:
        error_msg = "Set the {} environment variable".format(setting)
        raise ImproperlyConfigured(error_msg)


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_secret("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = True
DEBUG = False

ALLOWED_HOSTS = ['MAINT-ALB-200012262.ap-northeast-2.elb.amazonaws.com','maint.website', '10.0.11.225', 'localhost','10.0.11.130','13.209.51.44','13.209.159.99','13.125.76.159','169.254.169.254','ec2-13-209-51-44.ap-northeast-2.compute.amazonaws.com','c412f46a.ngrok.io','maint.me','MAINT-TEST-ALB-212074218.ap-northeast-2.elb.amazonaws.com','test.maint.website','10.0.11.123:q']



# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'graphene_django',
    'sslserver',
    'accounts',
    'projects',
    'forsite',
    'hitcount',
    'corsheaders',
    'payment',
    'django_summernote',
    'storages',
    'raven.contrib.django.raven_compat'
    # 'social_django'
]

# .csv 파일에 있는 내용을 입력 Access key ID
AWS_ACCESS_KEY_ID = get_secret("AWS_ACCESS_KEY_ID")
# .csv 파일에 있는 내용을 입력 Secret access key
AWS_SECRET_ACCESS_KEY = get_secret("AWS_SECRET_ACCESS_KEY")
AWS_REGION = 'ap-northeast-2'
AWS_STORAGE_BUCKET_NAME = get_secret("AWS_STORAGE_BUCKET_NAME")  # 설정한 이름
AWS_S3_CUSTOM_DOMAIN = 's3.%s.amazonaws.com/%s' % (
    AWS_REGION, AWS_STORAGE_BUCKET_NAME)
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}

DEFAULT_FILE_STORAGE = 'config.asset_storage.MediaStorage'

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',

    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'maint.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'build'), os.path.join(BASE_DIR, 'templates')],
        #'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'maint.wsgi.application'

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'graphql_jwt.backends.JSONWebTokenBackend',
    # 'social_core.backends.kakao.KakaoOAuth2',
    'maint.custsom_backend.KakaoOauth2Custsom',
    'maint.custsom_backend.FacebookOauth2Custom'
    # 'social_core.backends.facebook.FacebookOAuth2'


]

GRAPHENE = {
    'SCHEMA': 'maint.schema.schema',
    'MIDDLEWARE': [
        'graphql_jwt.middleware.JSONWebTokenMiddleware',
    ],
}

# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'ko'

TIME_ZONE = 'Asia/Seoul'

USE_I18N = True

USE_L10N = False

USE_TZ = False

# 유저모델
AUTH_USER_MODEL = 'accounts.User'
LOGOUT_REDIRECT_URL = '/'
LOGIN_REDIRECT_URL = '/'


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'build/static'),
]
#STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')

SOCIAL_AUTH_KAKAO_KEY = get_secret("SOCIAL_AUTH_KAKAO_KEY")

SOCIAL_AUTH_FACEBOOK_KEY = get_secret("SOCIAL_AUTH_FACEBOOK_KEY")
SOCIAL_AUTH_FACEBOOK_SECRET = get_secret("SOCIAL_AUTH_FACEBOOK_SECRET")

SOCIAL_AUTH_PIPELINE = [
    # Get the information we can about the user and return it in a simple
    # format to create the user instance later. On some cases the details are
    # already part of the auth response from the provider, but sometimes this
    # could hit a provider API.
    'social_core.pipeline.social_auth.social_details',

    # Get the social uid from whichever service we're authing thru. The uid is
    # the unique identifier of the given user in the provider.
    'social_core.pipeline.social_auth.social_uid',

    # Verifies that the current auth process is valid within the current
    # project, this is where emails and domains whitelists are applied (if
    # defined).
    'social_core.pipeline.social_auth.auth_allowed',

    # Checks if the current social-account is already associated in the site.
    'social_core.pipeline.social_auth.social_user',

    # Make up a username for this person, appends a random string at the end if
    # there's any collision.
    'social_core.pipeline.user.get_username',

    # Send a validation email to the user to verify its email address.
    # Disabled by default.
    # 'social_core.pipeline.mail.mail_validation',

    # Associates the current social details with another user account with
    # a similar email address. Disabled by default.
    # 'social_core.pipeline.social_auth.associate_by_email',

    # Create a user account if we haven't found one yet.
    'social_core.pipeline.user.create_user',

    # Create the record that associates the social account with the user.
    'social_core.pipeline.social_auth.associate_user',

    # Populate the extra_data field in the social record with the values
    # specified by settings (and the default ones like access_token, etc).
    'social_core.pipeline.social_auth.load_extra_data',

    # Update the user record with any changed info from the auth service.
    'social_core.pipeline.user.user_details',
]

# SSL auto redirect
#SECURE_SSL_REDIRECT = True

SUMMERNOTE_CONFIG = {
    'attachment_filesize_limit': 2048 * 2048,
    'summernote': {
        'lang': 'ko-KR',
        'lineHeights': ['0.2', '0.3', '0.4', '0.5', '0.6', '0.8', '1.0', '1.2', '1.4', '1.5', '2.0', '3.0'],
        'fontSizeUnits': ['px'],
        'fontSizes': ['8','9','10','11','12','13','14','15','16','18','20','22','24','28','32','36','40','48','56','64'],
        'styleTags': ['p',
            { 'title': 'Blockquote', 'tag': 'blockquote', 'className': 'blockquote', 'value': 'blockquote' },
            'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
	    ],
        'fontNames': ['Nanum Barun Gothic'],
        'fontNamesIgnoreCheck': ['Nanum Barun Gothic']
    }
}

if DEBUG:
    pass
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'HOST': get_secret("DB_HOST"),
            'PORT': '5432',
            'NAME': get_secret("DB_NAME"),
            'USER': get_secret("DB_USER"),
            'PASSWORD': get_secret("DB_PASSWORD"),
        }
    }

RAVEN_CONFIG = {
    'dsn': '{}'.format(DSN_URL)
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[%(levelname)s] [%(asctime)s]  %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'file1':{
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'maxBytes': 1024 * 1024 * 10,   # 로그 파일 당 10M 까지
            'backupCount': 10,
            'filename': 'logs/logfile.log',
            'formatter':'verbose'
        },
        'file2':{
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'maxBytes': 1024 * 1024 * 10,   # 로그 파일 당 10M 까지
            'backupCount': 10,
            'filename': 'logs/errorlog.log',
            'formatter':'verbose'
        },
        'file3':{
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'maxBytes': 1024 * 1024 * 10,   # 로그 파일 당 10M 까지
            'backupCount': 10,
            'filename': 'logs/accesslog.log',
            'formatter':'verbose'
        },
        'payment':{
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'maxBytes': 1024 * 1024 * 10,   # 로그 파일 당 10M 까지
            'backupCount': 10,
            'filename': 'logs/paymentlog.log',
            'formatter':'verbose'
        },
    },
    'loggers': {
        'django': {
            'handlers':['file1'],
            'level': 'INFO',
            'propagate': True
        },
        'django.server': {
            'handlers':['file3'],
            'level': 'INFO',
            'propagate': True
        },
        'django.request': {
            'handlers':['file3'],
            'level': 'INFO',
            'propagate': True
        },
        'accounts':{
            'handlers':['file2'],
            'level': 'INFO',
            'propagate': True
        },
        'payment':{
            'handlers':['payment'],
            'level': 'DEBUG',
            'propagate': True
        },
        'projects': {
            'handlers':['file2'],
            'level': 'INFO',
            'propagate': True
        }
    }
}