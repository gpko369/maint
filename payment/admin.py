from django.contrib import admin
from .models import Apply, Payment, Coupon

# Register your models here.

@admin.register(Apply)
class ApplyAdmin(admin.ModelAdmin):
    list_display = ['id','p_class', 'user', 'price', 'order_id','created_at']
    list_display_links = list_display
    search_fields = ['p_class__project__title', 'user__name', 'order_id']
# admin.site.register(Payment)

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'description', 'amount', 'user', 'is_used']
    list_display_links = list_display
    search_fields = ['code', 'user__name']
    list_filter = ['is_used']

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id',  'apply', 'price', 'status', 'verified']
    list_display_links =  ['id',  'apply', 'price']
    search_fields = ['apply__user__name']
    list_filter = ['verified', 'apply__p_class']
    actions = ['do_update', 'do_cancel']

    def do_update(self, request, queryset):
        total = queryset.count()
        if total > 0:
            for order in queryset:
                order.update()
            self.message_user(request, '{}건의 정보를 갱신했습니다'.format(total))
        else:
            self.message_user(request, '갱신할 결제내역이 없습니다')
    do_update.short_description = '선택한 결제내역 정보 갱신하기'

    def do_cancel(self, request, queryset):
        queryset = queryset.filter(verified=True)
        total = queryset.count()
        if total > 0:
            for order in queryset:
                order.cancel()
            self.message_user(request, '{}건의 결제를 취소했습니다.'.format(total))
        else:
            self.message_user(request, '취소할 결제가 없습니다.')

    do_cancel.short_description = '선택된 결제에 대해 결제취소요청하기'