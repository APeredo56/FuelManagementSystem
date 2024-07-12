from django.db import models


class RechargeRequest(models.Model):
    fuel_quantity = models.FloatField()
    station_id = models.IntegerField()
    fuel_type = models.ForeignKey('FuelType', on_delete=models.CASCADE)
    route = models.ForeignKey('Route', on_delete=models.SET_NULL, null=True, blank=True,
                              related_name='recharge_requests')
    completed = models.BooleanField(default=False)
    deliver_order = models.IntegerField(null=True, blank=True)


