# Generated by Django 2.2.6 on 2020-03-17 21:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0029_auto_20200317_2142'),
    ]

    operations = [
        migrations.AlterField(
            model_name='class',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='classes', to='projects.Project', verbose_name='프로젝트'),
        ),
    ]
