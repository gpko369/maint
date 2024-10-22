# Generated by Django 2.2.6 on 2019-12-03 13:48

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0013_merge_20191203_1337'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coupon',
            name='due',
            field=models.DateTimeField(verbose_name='마감기한'),
        ),
        migrations.AlterField(
            model_name='coupon',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='coupon', to=settings.AUTH_USER_MODEL, verbose_name='회원'),
        ),
    ]
