# Generated by Django 2.2.6 on 2020-02-25 15:39

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0023_auto_20200225_1216'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='latitude',
        ),
        migrations.RemoveField(
            model_name='project',
            name='longtitude',
        ),
        migrations.AddField(
            model_name='project',
            name='earlybird_due',
            field=models.DateField(default=django.utils.timezone.now, verbose_name='얼리버드 마감일'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='project',
            name='max_capacity',
            field=models.PositiveIntegerField(default=20, verbose_name='최대 정원'),
        ),
        migrations.AlterField(
            model_name='project',
            name='min_capacity',
            field=models.PositiveIntegerField(default=1, verbose_name='최소 정원'),
        ),
    ]
