# Generated by Django 2.2.6 on 2020-02-25 12:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0020_auto_20200225_1208'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='deadline',
            field=models.DateTimeField(verbose_name='모집 마감일'),
        ),
        migrations.AlterField(
            model_name='project',
            name='project_startTime',
            field=models.DateTimeField(verbose_name='프로젝트 시작 날짜'),
        ),
    ]
