# Generated by Django 2.2.6 on 2020-05-12 13:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0036_quiz_quizoptions'),
    ]

    operations = [
        migrations.AddField(
            model_name='curriculum',
            name='quiz',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='projects.Quiz'),
        ),
    ]