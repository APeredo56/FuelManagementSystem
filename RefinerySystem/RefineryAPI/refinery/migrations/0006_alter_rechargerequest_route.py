# Generated by Django 5.0.6 on 2024-07-11 06:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('refinery', '0005_alter_rechargerequest_completed'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rechargerequest',
            name='route',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='refinery.route'),
        ),
    ]
