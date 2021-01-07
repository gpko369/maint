# Generated by Django 2.2.6 on 2019-10-23 23:33

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='MainBanners',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='banners/', verbose_name='이미지')),
                ('image_mobile', models.ImageField(upload_to='banners/', verbose_name='이미지_모바일')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('title', models.CharField(blank=True, max_length=144, null=True, verbose_name='설명')),
                ('order', models.IntegerField(default=0)),
                ('active', models.BooleanField(default=True, verbose_name='활성화')),
                ('href', models.CharField(blank=True, max_length=100, null=True, verbose_name='연결')),
                ('target', models.BooleanField(default=False, verbose_name='Target_blank')),
            ],
            options={
                'verbose_name': '배너',
                'verbose_name_plural': '배너',
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='Notice',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100, verbose_name='제목')),
                ('text', models.TextField(verbose_name='내용')),
                ('notice_date', models.DateTimeField(verbose_name='작성 날짜')),
            ],
        ),
        migrations.CreateModel(
            name='SubBanners',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='banners/', verbose_name='이미지')),
                ('image_mobile', models.ImageField(upload_to='banners/', verbose_name='이미지_모바일')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('title', models.CharField(blank=True, max_length=144, null=True, verbose_name='설명')),
                ('order', models.IntegerField(default=0)),
                ('active', models.BooleanField(default=True, verbose_name='활성화')),
                ('href', models.CharField(blank=True, max_length=100, null=True, verbose_name='연결')),
                ('target', models.BooleanField(default=False, verbose_name='Target_blank')),
            ],
            options={
                'verbose_name': '배너',
                'verbose_name_plural': '배너',
                'ordering': ['order'],
            },
        ),
    ]