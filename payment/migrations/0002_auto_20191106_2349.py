# Generated by Django 2.2.6 on 2019-11-06 23:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('payment', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='coupon',
            name='due',
            field=models.DateField(default=django.utils.timezone.now, verbose_name='마감기한'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='coupon',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='coupon', to=settings.AUTH_USER_MODEL, verbose_name='회원'),
            preserve_default=False,
        ),
    ]
