from django.db import models


class Truck(models.Model):
    plate = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    capacity = models.FloatField()
    user_id = models.IntegerField(null=True, blank=True)
