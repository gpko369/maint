# Generated by Django 2.2.6 on 2019-11-19 12:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0007_projectimage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='title_image',
            field=models.ImageField(blank=True, default='projects/IC-EMPTY_PROFILE@2x.png', upload_to='projects/title_image/%Y/%m/%d', verbose_name='대표 이미지'),
        ),
    ]
