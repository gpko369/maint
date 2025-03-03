# Generated by Django 2.2.6 on 2019-11-05 01:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('projects', '0003_auto_20191105_0127'),
    ]

    operations = [
        migrations.CreateModel(
            name='Coupon',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.PositiveIntegerField(verbose_name='금액')),
                ('code', models.CharField(max_length=15, verbose_name='코드')),
                ('description', models.CharField(max_length=144)),
                ('is_used', models.BooleanField(default=False, verbose_name='사용 여부')),
            ],
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Apply',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_paid', models.BooleanField(verbose_name='결제여부')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='신청 시각')),
                ('payment', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='payment.Payment', verbose_name='결재 정보')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projects.Project', verbose_name='프로젝트')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='회원')),
            ],
        ),
    ]
