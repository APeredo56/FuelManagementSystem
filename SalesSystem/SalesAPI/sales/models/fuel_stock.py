import random

from django.core.validators import MinValueValidator
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
import requests


class FuelStock(models.Model):
    quantity = models.FloatField(validators=[MinValueValidator(0.0)])
    station = models.ForeignKey('Station', on_delete=models.CASCADE)
    fuel_type = models.ForeignKey('FuelType', on_delete=models.CASCADE)
    price = models.FloatField(validators=[MinValueValidator(0.0)])


def get_token():
    url = 'http://127.0.0.1:8000/api/token/'
    data = {
        'username': 'fuel',
        'password': 'fuel'
    }
    try:
        response = requests.post(url, data=data)
        response.raise_for_status()
        token = response.json().get('access')
        return token
    except requests.RequestException as e:
        print(f"Error obtaining JWT token: {e}")
        return None


def request_fuel(instance):
    token = get_token()
    if not token:
        print("Error: No JWT token available")
        return
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }
    data = {
        'station_id': instance.station.id,
        'fuel_type_id': instance.fuel_type.id,
        'fuel_quantity': random.randint(500, 1000)
    }
    try:
        response = requests.post('http://127.0.0.1:8002/api/recharge-requests/',
                                 headers=headers, json=data)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error sending fuel recharge request: {e}")


@receiver(post_save, sender=FuelStock)
def check_quantity_post_save(sender, instance, **kwargs):
    if instance.quantity == 0:
        request_fuel(instance)
