# Generated by Django 2.2.6 on 2019-12-03 03:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0007_payment_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coupon',
            name='code',
            field=models.CharField(blank=True, max_length=1, verbose_name='코드'),
        ),
    ]
