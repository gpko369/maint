# Generated by Django 2.2.6 on 2019-11-19 11:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0006_project_title_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('img', models.ImageField(upload_to='projects/image/%Y/%m/%d', verbose_name='이미지')),
                ('resolution', models.IntegerField(blank=True, null=True, verbose_name='해상도')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='projects.Project', verbose_name='프로젝트')),
            ],
        ),
    ]
