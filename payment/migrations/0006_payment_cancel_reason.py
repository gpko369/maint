# Generated by Django 2.2.6 on 2019-11-26 00:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0005_coupon_apply'),
    ]

    operations = [
        migrations.AddField(
            model_name='payment',
            name='cancel_reason',
            field=models.TextField(blank=True, null=True, verbose_name='취소이유'),
        ),
    ]