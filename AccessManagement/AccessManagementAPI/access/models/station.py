from django.db import models


class Station(models.Model):
    id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
