from django.contrib import admin
from .models import *
# Register your models here.


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id','name','email']
    list_display_links = ['id','name','email']
    list_filter = ['enrolled_class']
    search_fields = ['name','email']

@admin.register(Coach)
class CoachAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'register_date']
    list_display_links = ['id', 'name', 'register_date']
    search_fields = ['name']

@admin.register(SMSAuth)
class SMSAuthAdmin(admin.ModelAdmin):
    list_display = ['phone_number', 'auth_number', 'is_verified']
    list_display_links = ['phone_number', 'auth_number', 'is_verified']
    list_filter = ['is_verified']