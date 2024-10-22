# Generated by Django 2.2.6 on 2019-10-23 23:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0002_auto_20191023_2333'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100, verbose_name='제목')),
                ('price', models.PositiveIntegerField(verbose_name='가격')),
                ('min_capacity', models.PositiveIntegerField(verbose_name='최소 정원')),
                ('max_capacity', models.PositiveIntegerField(verbose_name='최대 정원')),
                ('project_time', models.DateTimeField(verbose_name='프로젝트 시작 날짜')),
                ('project_intro', models.TextField(verbose_name='프로젝트 소개')),
                ('deadline', models.DateTimeField(verbose_name='모집 마감일')),
                ('place', models.CharField(max_length=100, verbose_name='장소')),
                ('coach', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.Coach', verbose_name='코치')),
            ],
        ),
    ]
