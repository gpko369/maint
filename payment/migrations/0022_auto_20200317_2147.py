# Generated by Django 2.2.6 on 2020-03-17 21:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0030_auto_20200317_2147'),
        ('payment', '0021_coupon_identifier'),
    ]

    operations = [
        migrations.AddField(
            model_name='apply',
            name='p_class',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='projects.Class', verbose_name='수강반'),
        ),
        migrations.AlterField(
            model_name='apply',
            name='project',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='projects.Project', verbose_name='프로젝트'),
        ),
    ]
