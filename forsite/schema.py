import graphene
from graphene_django.types import DjangoObjectType
from .models import *

class NoticeType(DjangoObjectType):
    class Meta:
        model = Notice
        fields = '__all__'

    #아랫부분은 그냥 테스트 용도입니다.
    extra_field = graphene.String()

    def resolve_extra_field(self, info):
        return 'hello!'

class MainBannerType(DjangoObjectType):
    class Meta:
        model = MainBanner
        fields = '__all__'

    #아랫부분은 그냥 테스트 용도입니다.
    extra_field = graphene.String()

    def resolve_extra_field(self, info):
        return 'hello!'

class SubBannerType(DjangoObjectType):
    class Meta:
        model = SubBanner
        fields = '__all__'

    #아랫부분은 그냥 테스트 용도입니다.
    extra_field = graphene.String()

    def resolve_extra_field(self, info):
        return 'hello!'

class EventType(DjangoObjectType):
    class Meta:
        model = Event
        fields = '__all__'
        filter_fields = {'url_id': ['exact']}

class Query(graphene.ObjectType):
    all_notices = graphene.List(NoticeType)
    all_main_banners = graphene.List(MainBannerType)
    all_sub_banners = graphene.List(SubBannerType)
    all_events = graphene.List(EventType)
    notice = graphene.Field(NoticeType, id=graphene.ID(required=True))
    mainBanner = graphene.Field(MainBannerType, id=graphene.ID(required=True))
    subBanner = graphene.Field(SubBannerType, id=graphene.ID(required=True))
    event = graphene.Field(EventType, url_id=graphene.String(required=True))

    def resolve_all_notices(self, info, **kwargs):
        return Notice.objects.all()

    def resolve_all_main_banners(self, info, **kwargs):
        return MainBanner.objects.filter(active=True)

    def resolve_all_sub_banners(self, info, **kwargs):
        return SubBanner.objects.filter(active=True)
    
    def resolve_all_events(self, info, **kwargs):
        return Event.objects.all()

    def resolve_notice(self, info, id, **kwargs):
        return Notice.objects.get(id=id)

    def resolve_main_banner(self, info, id, **kwargs):
        return MainBanner.objects.get(id=id)

    def resolve_sub_banner(self, info, id, **kwargs):
        return SubBanner.objects.get(id=id)
    
    def resolve_event(self, info, url_id, **kwargs):
        return Event.objects.get(url_id=url_id)