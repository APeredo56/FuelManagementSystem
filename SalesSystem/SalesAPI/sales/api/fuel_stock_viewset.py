from django.shortcuts import get_object_or_404
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from sales.api import FuelTypeSerializer, StationSerializer
from sales.models import FuelStock, Station, FuelType
from sales.permissions import PermissionPolicyMixin


class FuelStockSerializer(serializers.ModelSerializer):
    fuel_type = FuelTypeSerializer(read_only=True)
    fuel_type_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=FuelType.objects.all(),
        source='fuel_type')
    station = StationSerializer(read_only=True)
    station_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Station.objects.all(),
        source='station')

    class Meta:
        model = FuelStock
        fields = '__all__'

    def create(self, validated_data):
        station = validated_data.get('station')
        fuel_type = validated_data.get('fuel_type')
        fuel_stock = FuelStock.objects.filter(station=station, fuel_type=fuel_type).first()
        if fuel_stock:
            raise serializers.ValidationError(
                {"error": "Fuel stock for this station and fuel type already exists."})
        fuel_stock = super().create(validated_data)
        return fuel_stock


class FuelStockViewSet(PermissionPolicyMixin, viewsets.ModelViewSet):
    queryset = FuelStock.objects.all()
    serializer_class = FuelStockSerializer
    permission_classes = [IsAuthenticated]
    permission_classes_per_method = {}

    @action(detail=False, methods=['get'], url_path='by-station/(?P<station_id>\d+)',
            url_name='by-station')
    def get_by_station(self, request, station_id=None):
        get_object_or_404(Station, pk=station_id)
        fuel_stock = FuelStock.objects.filter(station=station_id)
        serializer = self.get_serializer(fuel_stock, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='by-fuel-type/(?P<fuel_type_id>\d+)',
            url_name='by-fuel-type', permission_classes=[])
    def get_by_fuel_type(self, request, fuel_type_id=None):
        fuel_type = get_object_or_404(FuelType, pk=fuel_type_id)
        fuel_stock = FuelStock.objects.filter(fuel_type=fuel_type).order_by('-quantity')
        serializer = self.get_serializer(fuel_stock, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='recharge-fuel', url_name='recharge-fuel')
    def recharge_fuel(self, request):
        station_id = request.data.get('station_id')
        fuel_type_id = request.data.get('fuel_type_id')
        quantity = request.data.get('quantity')
        price = request.data.get('price')
        fuel_stock = FuelStock.objects.filter(station_id=station_id, fuel_type_id=fuel_type_id).first()
        if not fuel_stock:
            return Response({'error': 'Fuel stock not found'}, status=404)
        fuel_stock.quantity += float(quantity)
        fuel_stock.price = price
        fuel_stock.save()
        serializer = self.get_serializer(fuel_stock)
        return Response(serializer.data)
