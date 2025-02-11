# Generated by Django 5.0.6 on 2024-06-27 22:15
from django.contrib.auth.hashers import make_password
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sales', '0001_initial'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    def insertData(apps, schema_editor):
        Group = apps.get_model('auth', 'Group')
        Permission = apps.get_model('auth', 'Permission')

        access_manager_group = Group(name='Administrador de Accesos')
        access_manager_group.save()

        station_manager_group = Group(name='Administrador de Surtidor')
        station_manager_group.save()

        refinery_manager_group = Group(name='Administrador de Refinería')
        refinery_manager_group.save()

        salesperson_group = Group(name='Vendedor')
        salesperson_group.save()

        driver_group = Group(name='Conductor')
        driver_group.save()

        add_station = Permission.objects.get(codename='add_station')
        change_station = Permission.objects.get(codename='change_station')
        delete_station = Permission.objects.get(codename='delete_station')
        view_station = Permission.objects.get(codename='view_station')

        add_pump = Permission.objects.get(codename='add_pump')
        change_pump = Permission.objects.get(codename='change_pump')
        delete_pump = Permission.objects.get(codename='delete_pump')
        view_pump = Permission.objects.get(codename='view_pump')

        add_fueltype = Permission.objects.get(codename='add_fueltype')
        change_fueltype = Permission.objects.get(codename='change_fueltype')
        delete_fueltype = Permission.objects.get(codename='delete_fueltype')
        view_fueltype = Permission.objects.get(codename='view_fueltype')

        add_sale = Permission.objects.get(codename='add_sale')
        view_sale = Permission.objects.get(codename='view_sale')

        add_client = Permission.objects.get(codename='add_client')
        change_client = Permission.objects.get(codename='change_client')
        delete_client = Permission.objects.get(codename='delete_client')
        view_client = Permission.objects.get(codename='view_client')

        access_manager_permissions = [
            add_station,
            change_station,
            delete_station,
            view_station,
        ]

        station_manager_permissions = [
            view_station,
            add_pump, change_pump, delete_pump, view_pump,
            add_fueltype, change_fueltype, delete_fueltype, view_fueltype,
            view_sale, add_fueltype,
            add_client, change_client, delete_client, view_client,
        ]

        salesperson_permissions = [
            view_sale,
            add_sale,
            view_station,
            view_client, add_client,
        ]

        driver_permissions = [
            view_station,
            change_fueltype,
        ]

        refinery_manager_permissions = [
            view_station,
        ]

        access_manager_group.permissions.set(access_manager_permissions)
        station_manager_group.permissions.set(station_manager_permissions)
        salesperson_group.permissions.set(salesperson_permissions)
        driver_group.permissions.set(driver_permissions)
        refinery_manager_group.permissions.set(refinery_manager_permissions)

    operations = [
        migrations.RunPython(insertData),
    ]
