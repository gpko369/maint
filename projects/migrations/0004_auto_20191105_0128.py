# Generated by Django 2.2.6 on 2019-11-05 01:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0003_auto_20191105_0127'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='latitude',
            field=models.FloatField(blank=True, null=True, verbose_name='위도'),
        ),
        migrations.AlterField(
            model_name='project',
            name='longtitude',
            field=models.FloatField(blank=True, null=True, verbose_name='경도'),
        ),
    ]
