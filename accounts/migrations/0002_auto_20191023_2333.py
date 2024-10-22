# Generated by Django 2.2.6 on 2019-10-23 23:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Coach',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=45, verbose_name='이름')),
                ('introduction', models.TextField(verbose_name='소개')),
                ('carrer', models.TextField(verbose_name='경력')),
                ('img', models.ImageField(blank=True, default='account/IC-EMPTY_PROFILE@2x.png', upload_to='accounts/coach/%Y/%m/%d', verbose_name='사진')),
                ('register_date', models.DateTimeField(auto_now_add=True, verbose_name='등록 날짜')),
            ],
        ),
        migrations.AlterField(
            model_name='user',
            name='img',
            field=models.ImageField(blank=True, default='account/IC-EMPTY_PROFILE@2x.png', upload_to='accounts/user/%Y/%m/%d', verbose_name='프로필사진'),
        ),
    ]
