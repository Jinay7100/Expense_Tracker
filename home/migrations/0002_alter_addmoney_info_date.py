# Generated by Django 4.2.5 on 2023-09-28 06:42

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='addmoney_info',
            name='Date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
