# Generated by Django 2.2.6 on 2019-12-03 14:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0010_auto_20191203_1256'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='status',
            field=models.CharField(choices=[('0', '0'), ('1', '1'), ('2', '2')], default=0, max_length=10, verbose_name='상태'),
        ),
    ]
