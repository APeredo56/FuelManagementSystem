from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from sales.api import FuelTypeSerializer, AddFuelTypesSerializer
from sales.models import Station, FuelType, FuelStock
from sales.permissions import PermissionPolicyMixin
from sales.permissions.is_station_manager import IsStationManager
from sales.permissions.station_permissions import CanAddStation, CanEditStation, CanDeleteStation, CanViewStation
import requests


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


def get_token():
    url = 'http://127.0.0.1:8000/api/token/'
    data = {
        'username': 'fuel',
        'password': 'fuel'
    }
    try:
        response = requests.post(url, data=data)
        response.raise_for_status()
        token = response.json().get('access')
        return token
    except requests.RequestException as e:
        print(f"Error obtaining JWT token: {e}")
        return None


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
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        fuel_types = serializer.validated_data['fuel_types_ids']
        station.fuel_types.set(fuel_types)
        station.save()
        for fuel_type in fuel_types:
            FuelStock.objects.get_or_create(
                station=station,
                fuel_type=fuel_type,
                defaults={'quantity': 0, 'price': 0.0},
            )

        current_fuel_types = station.fuel_types.all()
        for fuel_stock in FuelStock.objects.filter(station=station):
            if fuel_stock.fuel_type not in current_fuel_types:
                headers = {'Authorization': 'Bearer ' + get_token()}
                url = f'http://127.0.0.1:8002/api/recharge-requests/station/{station.id}/fuel-type/{fuel_stock.fuel_type.id}/'
                response = requests.delete(url, headers=headers)
                if response.status_code != 204:
                    return Response({'error': 'Error deleting recharge requests'}, status=500)
                fuel_stock.delete()

        return Response({'status': 'fuel types added'})

    @action(detail=True, methods=['get'], permission_classes=[IsStationManager],
            url_path='fuel-types', url_name='list-fuel-types')
    def get_fuel_types(self, request, pk=None):
        station = self.get_object()
        fuel_types = station.fuel_types.all()
        serializer = FuelTypeSerializer(fuel_types, many=True)
        return Response(serializer.data)
