# Generated by Django 5.0.6 on 2024-07-11 20:04

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('refinery', '0006_alter_rechargerequest_route'),
    ]

    operations = [
        migrations.AddField(
            model_name='rechargerequest',
            name='deliver_order',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='rechargerequest',
            name='route',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='recharge_requests', to='refinery.route'),
        ),
    ]
