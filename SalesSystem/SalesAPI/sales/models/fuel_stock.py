from django.core.validators import MinValueValidator
from django.db import models


class FuelStock(models.Model):
    quantity = models.FloatField(validators=[MinValueValidator(0.0)])
    station = models.ForeignKey('Station', on_delete=models.CASCADE)
    fuel_type = models.ForeignKey('FuelType', on_delete=models.CASCADE)
    price = models.FloatField(validators=[MinValueValidator(0.0)])
