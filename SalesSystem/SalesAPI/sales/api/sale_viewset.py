from django.shortcuts import get_object_or_404
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from sales.api import PumpSerializer, FuelTypeSerializer, ClientSerializer
from sales.models import Sale, FuelType, Pump, FuelStock, Client
from sales.permissions import PermissionPolicyMixin
from sales.permissions.is_station_manager import IsStationManager
from sales.permissions.sale_permissions import CanViewSale, CanAddSale


class SaleSerializer(serializers.ModelSerializer):
    pump = PumpSerializer(read_only=True)
    pump_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Pump.objects.all(),
        source='pump'
    )
    fuel_type = FuelTypeSerializer(read_only=True)
    fuel_type_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=FuelType.objects.all(),
        source='fuel_type')
    fuel_price = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    total = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    client = ClientSerializer(read_only=True)
    client_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Client.objects.all(),
        source='client'
    )

    class Meta:
        model = Sale
        fields = '__all__'

    def create(self, validated_data):
        pump = validated_data.pop('pump')
        fuel_quantity = validated_data.get('fuel_quantity')
        fuel_type = validated_data.pop('fuel_type')
        fuel_stock = get_object_or_404(FuelStock, fuel_type=fuel_type, station=pump.station)
        if fuel_stock.quantity < fuel_quantity:
            raise serializers.ValidationError({"error": "Insufficient fuel stock."})
        fuel_price = fuel_stock.price
        total = fuel_price * fuel_quantity
        sale = Sale.objects.create(pump=pump, fuel_type=fuel_type, fuel_price=fuel_price, total=total, **validated_data)
        fuel_stock.quantity -= fuel_quantity
        fuel_stock.save()
        return sale


class SaleViewSet(PermissionPolicyMixin, viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]
    permission_classes_per_method = {
        'create': [CanAddSale],
        'list': [CanViewSale],
        'retrieve': [CanViewSale],
    }

    def update(self, request, *args, **kwargs):
        raise serializers.ValidationError({"error": "Update operation is not allowed."})

    def partial_update(self, request, *args, **kwargs):
        raise serializers.ValidationError({"error": "Partial update operation is not allowed."})

    def destroy(self, request, *args, **kwargs):
        raise serializers.ValidationError({"error": "Delete operation is not allowed."})

    @action(detail=True, methods=['post'], url_path='cancel', url_name='cancel',
            permission_classes=[IsStationManager])
    def cancel_sale(self, request, pk=None):
        sale = get_object_or_404(Sale, pk=pk)
        fuel_stock = get_object_or_404(FuelStock, station=sale.pump.station, fuel_type=sale.fuel_type)
        fuel_stock.quantity += sale.fuel_quantity
        fuel_stock.save()
        sale.is_valid = False
        sale.save()
        return Response(SaleSerializer(sale).data)

    @action(detail=False, methods=['get'], url_path='by-station/(?P<station_id>\d+)',
            url_name='by-station')
    def get_by_station(self, request, station_id=None):
        get_object_or_404(FuelStock, station=station_id)
        sales = Sale.objects.filter(pump__station=station_id).order_by('-date')
        serializer = self.get_serializer(sales, many=True)
        return Response(serializer.data)
