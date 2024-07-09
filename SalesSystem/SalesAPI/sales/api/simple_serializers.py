from rest_framework import serializers

from sales.models import FuelType


class AddFuelTypesSerializer(serializers.Serializer):
    fuel_types_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=FuelType.objects.all(),
    )
