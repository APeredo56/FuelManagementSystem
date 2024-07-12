from django.shortcuts import get_object_or_404
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from refinery.api import FuelTypeSerializer, RouteSerializer
from refinery.models import RechargeRequest, FuelType, Route
from refinery.permissions import PermissionPolicyMixin
from refinery.permissions.recharge_request_permissions import CanAddRechargeRequest, CanEditRechargeRequest, \
    CanDeleteRechargeRequest, CanViewRechargeRequest
import requests


class RechargeRequestSerializer(serializers.ModelSerializer):
    fuel_type = FuelTypeSerializer(read_only=True)
    fuel_type_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=FuelType.objects.all(),
        source='fuel_type'
    )
    route = RouteSerializer(read_only=True)
    route_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Route.objects.all(),
        source='route',
        required=False
    )

    class Meta:
        model = RechargeRequest
        fields = '__all__'

    def create(self, validated_data):
        station_id = validated_data.get('station_id')
        fuel_type = validated_data.get('fuel_type')
        recharge_request = RechargeRequest.objects.filter(station_id=station_id, fuel_type=fuel_type).first()
        if recharge_request:
            raise serializers.ValidationError(
                {"error": "Recharge request for this station and fuel type already exists."})
        recharge_request = super().create(validated_data)
        return recharge_request


def get_station_details(station_id, auth_header):
    url = f'http://127.0.0.1:8001/api/stations/{station_id}/'
    response = requests.get(url, headers=auth_header)
    if response.status_code == 200:
        return response.json()
    else:
        return serializers.ValidationError({'error': 'Station not found'})


class RechargeRequestViewSet(PermissionPolicyMixin, viewsets.ModelViewSet):
    queryset = RechargeRequest.objects.all()
    serializer_class = RechargeRequestSerializer
    permission_classes_per_method = {
        'create': [CanAddRechargeRequest],
        'update': [CanEditRechargeRequest],
        'partial_update': [CanEditRechargeRequest],
        'destroy': [CanDeleteRechargeRequest],
        'list': [CanViewRechargeRequest],
        'retrieve': [CanViewRechargeRequest],
    }
    @action(detail=False, methods=['get'], permission_classes=[CanViewRechargeRequest],
            url_path='uncompleted-by-fuel-type/(?P<fuel_type_id>\d+)', url_name='uncompleted-by-fuel-type')
    def get_uncompleted_by_fuel_type(self, request, fuel_type_id=None):
        fuel_type = get_object_or_404(FuelType, pk=fuel_type_id)
        if not fuel_type:
            return Response({'error': 'Fuel type not found'}, status=404)

        auth_header = {'Authorization': request.headers.get('Authorization')}
        recharge_requests = RechargeRequest.objects.filter(fuel_type=fuel_type, completed=False, route=None)

        data = []
        for request in recharge_requests:
            station_details = get_station_details(request.station_id, auth_header)
            if station_details:
                request_data = RechargeRequestSerializer(request).data
                request_data['station'] = station_details
                data.append(request_data)
        return Response(data)

    @action(detail=False, methods=['delete'], permission_classes=[CanDeleteRechargeRequest],
            url_path='station/(?P<station_id>\d+)/fuel-type/(?P<fuel_type_id>\d+)',
            url_name='delete-by-station-fuel-type')
    def delete_by_station_fuel_type(self, request, station_id=None, fuel_type_id=None):
        fuel_type = get_object_or_404(FuelType, pk=fuel_type_id)
        recharge_request = RechargeRequest.objects.filter(station_id=station_id, fuel_type=fuel_type).first()
        if not recharge_request:
            return Response({'error': 'Recharge request not found'}, status=404)
        recharge_request.delete()
        return Response(status=204)

    @action(detail=True, methods=['post'], permission_classes=[CanEditRechargeRequest],
            url_path='assign-route', url_name='assign-route')
    def assign_route(self, request, pk=None):
        recharge_request = self.get_object()
        print(request.data)
        recharge_request.route = Route.objects.get(pk=request.data.get('route_id'))
        recharge_request.save()
        return Response(self.get_serializer(recharge_request).data)

    @action(detail=True, methods=['put'], permission_classes=[CanEditRechargeRequest],
            url_path='complete', url_name='complete')
    def complete(self, request, pk=None):
        recharge_request = self.get_object()
        route = recharge_request.route
        if not route:
            return Response({'error': 'Recharge request is not assigned to a route'}, status=400)
        price = route.fuel_price
        auth_header = {'Authorization': request.headers.get('Authorization')}
        url = "http://127.0.0.1:8001/api/fuel-stock/recharge-fuel/"
        data = {
            'station_id': recharge_request.station_id,
            'fuel_type_id': recharge_request.fuel_type_id,
            'quantity': recharge_request.fuel_quantity,
            'price': price
        }
        response = requests.post(url, data=data, headers=auth_header)
        if response.status_code != 200:
            return Response({'error': 'Error recharging fuel'}, status=500)
        recharge_request.completed = True
        recharge_request.save()
        recharge_requests = RechargeRequest.objects.filter(route=route).order_by('deliver_order')
        if recharge_requests.count() == recharge_requests.filter(completed=True).count():
            route.completed = True
            route.save()
        return Response(self.get_serializer(recharge_request).data)

    @action(detail=False, methods=['get'], permission_classes=[CanViewRechargeRequest],
            url_path='by-route/(?P<route_id>\d+)', url_name='by-route')
    def get_by_route(self, request, route_id=None):
        route = get_object_or_404(Route, pk=route_id)
        recharge_requests = RechargeRequest.objects.filter(route=route).order_by('deliver_order')

        auth_header = {'Authorization': request.headers.get('Authorization')}
        data = []
        for request in recharge_requests:
            station_details = get_station_details(request.station_id, auth_header)
            if station_details:
                request_data = RechargeRequestSerializer(request).data
                request_data['station'] = station_details
                data.append(request_data)

        return Response(data)

