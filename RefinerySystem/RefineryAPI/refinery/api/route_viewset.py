from rest_framework import serializers, viewsets
from refinery.models import Truck
from refinery.permissions import PermissionPolicyMixin
from refinery.permissions.truck_permissions import CanAddTruck, CanEditTruck, CanDeleteTruck, \
    CanViewTruck


class TruckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Truck
        fields = '__all__'


class TruckViewSet(PermissionPolicyMixin, viewsets.ModelViewSet):
    queryset = Truck.objects.all()
    serializer_class = TruckSerializer
    permission_classes_per_method = {
        'create': [CanAddTruck],
        'update': [CanEditTruck],
        'partial_update': [CanEditTruck],
        'destroy': [CanDeleteTruck],
        'list': [],
        'retrieve': [CanViewTruck],
    }
