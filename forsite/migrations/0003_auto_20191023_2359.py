# Generated by Django 2.2.6 on 2019-10-23 23:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('forsite', '0002_auto_20191023_2334'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='mainbanner',
            options={'ordering': ['order'], 'verbose_name': '메인 배너', 'verbose_name_plural': '메인 배너'},
        ),
        migrations.AlterModelOptions(
            name='subbanner',
            options={'ordering': ['order'], 'verbose_name': '서브 배너', 'verbose_name_plural': '서브 배너'},
        ),
    ]
