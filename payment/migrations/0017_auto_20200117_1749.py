# Generated by Django 2.2.6 on 2020-01-17 17:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0016_apply_quantity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coupon',
            name='due',
            field=models.DateField(verbose_name='마감기한'),
        ),
    ]
