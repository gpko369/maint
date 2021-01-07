from django.db import models

# Create your models here.

class Notice(models.Model):
    title = models.CharField('제목', max_length=100)
    text = models.TextField('내용')
    notice_date = models.DateTimeField('작성 날짜')

    def __str__(self):
        return self.title

class MainBanner(models.Model):
    image = models.ImageField(upload_to='banners/', verbose_name='이미지')
    image_mobile = models.ImageField(upload_to='banners/', verbose_name='이미지_모바일')
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=144, verbose_name='설명', blank=True, null=True)
    tag = models.CharField(max_length=10, verbose_name='태그',blank=True, null=True)
    content = models.TextField('내용', blank=True)
    order = models.IntegerField(default=0)
    active = models.BooleanField(default=True, verbose_name='활성화')
    href = models.CharField(verbose_name='연결', blank=True, null=True, max_length=100)
    external_link = models.BooleanField(default=False, verbose_name='외부 링크 여부')
    target = models.BooleanField(default=False, verbose_name='Target_blank')

    class Meta:
        ordering = ['order']
        verbose_name = '메인 배너'
        verbose_name_plural = '메인 배너'

    def __str__(self):
        return self.title

class SubBanner(models.Model):
    image = models.ImageField(upload_to='banners/', verbose_name='이미지')
    image_mobile = models.ImageField(upload_to='banners/', verbose_name='이미지_모바일')
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=144, verbose_name='설명', blank=True, null=True)
    content = models.TextField('내용', blank=True)
    order = models.IntegerField(default=0)
    active = models.BooleanField(default=True, verbose_name='활성화')
    button_text = models.CharField(verbose_name='버튼 텍스트', blank=True, null=True, max_length=20)
    href = models.CharField(verbose_name='연결', blank=True, null=True, max_length=100)
    external_link = models.BooleanField(default=False, verbose_name='외부 링크 여부')
    target = models.BooleanField(default=False, verbose_name='Target_blank')

    class Meta:
        ordering = ['order']
        verbose_name = '서브 배너'
        verbose_name_plural = '서브 배너'

    def __str__(self):
        return self.title

class Event(models.Model):
    title = models.CharField(max_length=50, verbose_name="이벤트명")
    url_id = models.CharField(max_length=20, verbose_name="url 식별자")
    content = models.TextField('내용')

    class Meta:
        verbose_name = '이벤트'
        verbose_name_plural = "이벤트"

    def __str__(self):
        return self.title