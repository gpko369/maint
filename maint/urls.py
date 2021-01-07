"""maint URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
#from django.conf.urls.static import static
#from django.conf import settings

from payment.views import test, verify, toss_verify
from accounts.views import logout, csrf_token
from graphene_django.views import GraphQLView
#from graphql_jwt.decorators import jwt_cookie
from .custsom_backend import jwt_cookie
from django.views.generic import TemplateView
from django.http import HttpResponse

urlpatterns = [
    path('admin/', admin.site.urls),
    #path("graphql/", csrf_exempt(jwt_cookie(GraphQLView.as_view(graphiql=True))))
    path("graphql/", jwt_cookie(GraphQLView.as_view(graphiql=True))),
    path("get_csrf/", csrf_token),
    path("test/", test),
    path("verify/", verify),
    path("toss_verify/", toss_verify),
    path("logout/", logout),
    path("summernote/", include('django_summernote.urls')),
    path("naverbfdbd4a385486e5e5acdf047be7e3cbc.html", TemplateView.as_view(template_name='naverbfdbd4a385486e5e5acdf047be7e3cbc.html')),
    path('robots.txt', TemplateView.as_view(template_name="robots.txt", content_type="text/plain")),
    path('sitemap.xml', TemplateView.as_view(template_name="sitemap.xml", content_type="text/xml")),
    #path("", jwt_cookie(GraphQLView.as_view(graphiql=True))),
    re_path('.*', TemplateView.as_view(template_name='index.html'))
]

#urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)