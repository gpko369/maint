# Generated by Django 2.2.6 on 2020-04-20 11:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('forsite', '0008_subbanner_button_text'),
    ]

    operations = [
        migrations.AddField(
            model_name='mainbanner',
            name='external_link',
            field=models.BooleanField(default=False, verbose_name='외부 링크 여부'),
        ),
        migrations.AddField(
            model_name='subbanner',
            name='external_link',
            field=models.BooleanField(default=False, verbose_name='외부 링크 여부'),
        ),
    ]
