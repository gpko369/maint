# Generated by Django 2.2.6 on 2020-03-17 21:40

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0027_class'),
    ]

    operations = [
        migrations.AlterField(
            model_name='class',
            name='user',
            field=models.ManyToManyField(blank=True, related_name='enrolled_class', to=settings.AUTH_USER_MODEL),
        ),
    ]