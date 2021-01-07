# Generated by Django 2.2.6 on 2020-04-28 18:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0013_auto_20200421_2222'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='agree_3',
            field=models.BooleanField(default=True, verbose_name='마케팅 및 안내메일 수신 동의'),
        ),
        migrations.AlterField(
            model_name='user',
            name='agree_1',
            field=models.BooleanField(default=True, verbose_name='이용약관 동의'),
        ),
        migrations.AlterField(
            model_name='user',
            name='agree_2',
            field=models.BooleanField(default=True, verbose_name='개인정보처리방침 동의'),
        ),
    ]
