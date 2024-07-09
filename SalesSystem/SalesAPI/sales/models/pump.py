from django.db import models


class Pump(models.Model):
    code = models.CharField(max_length=100)
    station = models.ForeignKey('Station', on_delete=models.CASCADE)
    fuel_types = models.ManyToManyField('FuelType')
