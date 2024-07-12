from django.db import models


class Route(models.Model):
    name = models.CharField(max_length=100)
    fuel_quantity = models.FloatField()
    fuel_price = models.FloatField()
    fuel_type = models.ForeignKey('FuelType', on_delete=models.CASCADE)
    truck = models.ForeignKey('Truck', on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    completed = models.BooleanField(default=False)
