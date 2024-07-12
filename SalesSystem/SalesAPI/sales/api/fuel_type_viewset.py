from django.shortcuts import get_object_or_404
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from sales.models import FuelType, Station
from sales.permissions import PermissionPolicyMixin
from sales.permissions.fuel_type_permissions import CanAddFuelType, CanEditFuelType, CanDeleteFuelType, CanViewFuelType


class FuelTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FuelType
        fields = '__all__'


class FuelTypeViewSet(PermissionPolicyMixin, viewsets.ModelViewSet):
    queryset = FuelType.objects.all()
    serializer_class = FuelTypeSerializer
    permission_classes_per_method = {
        'create': [CanAddFuelType],
        'update': [CanEditFuelType],
        'partial_update': [CanEditFuelType],
        'destroy': [CanDeleteFuelType],
        'list': [],
        'retrieve': [CanViewFuelType],
    }

