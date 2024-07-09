from django.db import models


class Sale(models.Model):
    sale_name = models.CharField(max_length=100)
    nit = models.IntegerField()
    client = models.ForeignKey('Client', on_delete=models.CASCADE)
    fuel_quantity = models.FloatField()
    total = models.FloatField()
    fuel_price = models.FloatField()
    fuel_type = models.ForeignKey('FuelType', on_delete=models.CASCADE)
    pump = models.ForeignKey('Pump', on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    is_valid = models.BooleanField(default=True)
