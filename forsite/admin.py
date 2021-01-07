from django.contrib import admin
from.models import *
from django_summernote.admin import SummernoteModelAdmin

class EventAdmin(SummernoteModelAdmin):
    summernote_fields = ['content']

class MainBannerAdmin(SummernoteModelAdmin):
    summernote_fields = ['content']

class SubBannerAdmin(SummernoteModelAdmin):
    summernote_fields = ['content']

# Register your models here.
admin.site.register(Notice)
admin.site.register(MainBanner, MainBannerAdmin)
admin.site.register(SubBanner, SubBannerAdmin)
admin.site.register(Event, EventAdmin)