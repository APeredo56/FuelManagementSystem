from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from sales.api import FuelTypeSerializer, AddFuelTypesSerializer
from sales.models import Station, FuelType
from sales.permissions import PermissionPolicyMixin
from sales.permissions.is_station_manager import IsStationManager
from sales.permissions.station_permissions import CanAddStation, CanEditStation, CanDeleteStation, CanViewStation


class StationSerializer(serializers.ModelSerializer):
    fuel_types = FuelTypeSerializer(many=True, read_only=True)
    fuel_types_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=FuelType.objects.all(),
        source='fuel_types',
        required=False)

    class Meta:
        model = Station
        fields = '__all__'


class StationViewSet(PermissionPolicyMixin, viewsets.ModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer
    permission_classes = [IsAuthenticated]
    permission_classes_per_method = {
        'create': [CanAddStation],
        'update': [CanEditStation],
        'partial_update': [CanEditStation],
        'destroy': [CanDeleteStation],
        'list': [CanViewStation],
        'retrieve': [CanViewStation],
    }

    @action(detail=True, methods=['post'], permission_classes=[IsStationManager],
            url_path='assign-fuel-types', url_name='assign-fuel-types')
    def assign_fuel_types(self, request, pk=None):
        station = self.get_object()
        serializer = AddFuelTypesSerializer(data=request.data)
        if serializer.is_valid():
            fuel_types = serializer.validated_data['fuel_types_ids']
            station.fuel_types.set(fuel_types)
            station.save()
            return Response({'status': 'fuel types added'})
        else:
            return Response(serializer.errors, status=400)

    @action(detail=True, methods=['get'], permission_classes=[IsStationManager],
            url_path='fuel-types', url_name='list-fuel-types')
    def get_fuel_types(self, request, pk=None):
        station = self.get_object()
        fuel_types = station.fuel_types.all()
        serializer = FuelTypeSerializer(fuel_types, many=True)
        return Response(serializer.data)
