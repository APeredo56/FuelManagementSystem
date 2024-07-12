from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

import refinery.api
from refinery.api import FuelTypeSerializer, TruckSerializer
from refinery.models import Route, FuelType, Truck
from refinery.permissions import PermissionPolicyMixin
from refinery.permissions.route_permissions import CanAddRoute, CanEditRoute, CanDeleteRoute, \
    CanViewRoute


class RouteSerializer(serializers.ModelSerializer):
    fuel_type = FuelTypeSerializer(read_only=True)
    fuel_type_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=FuelType.objects.all(),
        source='fuel_type'
    )
    truck = TruckSerializer(read_only=True)
    truck_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Truck.objects.all(),
        source='truck'
    )

    class Meta:
        model = Route
        fields = '__all__'


class RouteViewSet(PermissionPolicyMixin, viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    permission_classes_per_method = {
        'create': [CanAddRoute],
        'update': [CanEditRoute],
        'partial_update': [CanEditRoute],
        'destroy': [CanDeleteRoute],
        'list': [CanViewRoute],
        'retrieve': [CanViewRoute],
    }

    @action(detail=False, methods=['get'], url_path='by-driver/(?P<driver_id>\d+)',
            url_name='by-driver', permission_classes=[CanViewRoute])
    def get_by_driver(self, request, driver_id=None):
        truck = Truck.objects.filter(user_id=driver_id).first()
        route = Route.objects.filter(truck=truck, completed=False).first()
        serializer = self.get_serializer(route)
        return Response(serializer.data)
