# Generated by Django 2.2.6 on 2019-12-03 12:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0010_remove_apply_is_paid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='apply',
            name='price',
            field=models.IntegerField(blank=True, null=True, verbose_name='가격'),
        ),
        migrations.AlterField(
            model_name='coupon',
            name='code',
            field=models.CharField(blank=True, max_length=8, verbose_name='코드'),
        ),
    ]
