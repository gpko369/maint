# Generated by Django 2.2.6 on 2019-12-13 17:10

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0014_auto_20191211_1823'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='project_startTime',
            field=models.DateTimeField(default=datetime.datetime(2019, 12, 13, 17, 10, 58, 316594), verbose_name='프로젝트 시작 날짜'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='project',
            name='project_time',
            field=models.TextField(verbose_name='프로젝트 시간'),
        ),
    ]
