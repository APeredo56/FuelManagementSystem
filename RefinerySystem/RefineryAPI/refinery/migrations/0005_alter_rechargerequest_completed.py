# Generated by Django 5.0.6 on 2024-07-10 23:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('refinery', '0004_alter_route_completed_alter_route_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rechargerequest',
            name='completed',
            field=models.BooleanField(default=False),
        ),
    ]
