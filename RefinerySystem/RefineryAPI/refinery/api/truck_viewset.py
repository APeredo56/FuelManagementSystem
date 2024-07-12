from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from refinery.models import Truck, Route
from refinery.permissions import PermissionPolicyMixin
from refinery.permissions.truck_permissions import CanAddTruck, CanEditTruck, CanDeleteTruck, \
    CanViewTruck


class TruckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Truck
        fields = '__all__'

    def update(self, instance, validated_data):
        if 'user_id' not in validated_data:
            instance.user_id = None
        instance = super().update(instance, validated_data)
        return instance


class TruckViewSet(PermissionPolicyMixin, viewsets.ModelViewSet):
    queryset = Truck.objects.all()
    serializer_class = TruckSerializer
    permission_classes_per_method = {
        'create': [CanAddTruck],
        'update': [CanEditTruck],
        'partial_update': [CanEditTruck],
        'destroy': [CanDeleteTruck],
        'list': [CanViewTruck],
        'retrieve': [CanViewTruck],
    }

    @action(detail=False, methods=['get'], url_path='ready', url_name='ready',
            permission_classes=[CanViewTruck])
    def get_ready(self, request):
        truck_routes = Route.objects.filter(completed=False).values_list('truck_id', flat=True)
        trucks = Truck.objects.exclude(id__in=truck_routes).filter(user_id__isnull=False)
        serializer = self.get_serializer(trucks, many=True)
        return Response(serializer.data)
