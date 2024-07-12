from django.db import models


class FuelType(models.Model):
    name = models.CharField(max_length=100)
