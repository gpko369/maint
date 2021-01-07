# Generated by Django 2.2.6 on 2020-04-13 15:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0031_auto_20200325_1502'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='deadline',
        ),
        migrations.RemoveField(
            model_name='project',
            name='project_DayinWeek',
        ),
        migrations.RemoveField(
            model_name='project',
            name='project_reward',
        ),
        migrations.RemoveField(
            model_name='project',
            name='project_reward_condition',
        ),
        migrations.RemoveField(
            model_name='project',
            name='project_startTime',
        ),
        migrations.AddField(
            model_name='class',
            name='project_DayinWeek',
            field=models.CharField(blank=True, choices=[('월', '월'), ('화', '화'), ('수', '수'), ('목', '목'), ('금', '금'), ('토', '토'), ('일', '일')], max_length=2, verbose_name='프로젝트 요일'),
        ),
        migrations.AlterField(
            model_name='projectintro',
            name='project_process',
            field=models.TextField(verbose_name='코치 소개'),
        ),
        migrations.AlterField(
            model_name='projectintro',
            name='project_special',
            field=models.TextField(verbose_name='마인트 소개'),
        ),
        migrations.AlterField(
            model_name='projectintro',
            name='project_toLearn',
            field=models.TextField(verbose_name='프로젝트 소개'),
        ),
    ]