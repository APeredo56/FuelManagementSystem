from django.shortcuts import get_object_or_404
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from sales.api import FuelTypeSerializer
from sales.models import Pump, FuelType, Station
from sales.permissions.pump_permissions import CanAddPump, CanEditPump, CanDeletePump, CanViewPump


class PumpSerializer(serializers.ModelSerializer):
    fuel_types = FuelTypeSerializer(many=True, read_only=True)
    fuel_types_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=FuelType.objects.all(),
        source='fuel_types')

    class Meta:
        model = Pump
        fields = ['id', 'code', 'station', 'fuel_types', 'fuel_types_ids']

    def validate_fuel_types_ids(self, value):
        station = self.initial_data.get('station')
        station_instance = Station.objects.get(pk=station)
        station_fuel_types = station_instance.fuel_types.all()

        for fuel_type in value:
            if fuel_type not in station_fuel_types:
                raise serializers.ValidationError(f"Fuel type {fuel_type.name} is not assigned to the station.")

        return value


class PumpViewSet(viewsets.ModelViewSet):
    queryset = Pump.objects.all()
    serializer_class = PumpSerializer
    permission_classes = [IsAuthenticated]
    permission_classes_per_method = {
        'create': [CanAddPump],
        'update': [CanEditPump],
        'partial_update': [CanEditPump],
        'destroy': [CanDeletePump],
        'list': [CanViewPump],
        'retrieve': [CanViewPump],
    }

    @action(detail=False, methods=['get'], url_path='by-station/(?P<station_id>\d+)',
            url_name='by-station')
    def get_by_station(self, request, station_id=None):
        get_object_or_404(Station, pk=station_id)
        pumps = Pump.objects.filter(station=station_id)
        serializer = self.get_serializer(pumps, many=True)
        return Response(serializer.data)
