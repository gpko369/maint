# Generated by Django 2.2.6 on 2019-12-03 03:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0009_auto_20191203_0302'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='apply',
            name='is_paid',
        ),
    ]