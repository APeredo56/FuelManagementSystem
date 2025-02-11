from django.db import models


class Station(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    fuel_types = models.ManyToManyField('FuelType')
