# Generated by Django 2.2.6 on 2020-04-17 23:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('forsite', '0007_auto_20200417_1401'),
    ]

    operations = [
        migrations.AddField(
            model_name='subbanner',
            name='button_text',
            field=models.CharField(blank=True, max_length=20, null=True, verbose_name='버튼 텍스트'),
        ),
    ]
