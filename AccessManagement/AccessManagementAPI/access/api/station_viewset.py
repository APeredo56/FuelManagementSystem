from rest_framework import serializers, viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from access.models import Station
from access.permissions import PermissionPolicyMixin
from access.permissions.is_access_manager import IsAccessManager
import requests


class StationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Station
        fields = ('id', 'name', 'latitude', 'longitude')

    def get_auth_header(self):
        request = self.context.get('request')
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            raise serializers.ValidationError({"error": "Authorization header is missing."})
        return {'Authorization': auth_header}

    def create(self, validated_data):
        external_data = {
            'name': validated_data.get('name'),
            'latitude': validated_data.get('latitude'),
            'longitude': validated_data.get('longitude'),
        }

        try:
            response = requests.post(' http://127.0.0.1:8001/api/stations/',
                                     json=external_data,
                                     headers=self.get_auth_header())
            response.raise_for_status()
            external_response_data = response.json()
        except requests.RequestException as e:
            raise serializers.ValidationError({"error": str(e)})

        external_response_data.pop('fuel_types', None)
        return Station.objects.create(**external_response_data)

    def update(self, instance, validated_data):
        external_data = {
            'name': validated_data.get('name', instance.name),
            'latitude': validated_data.get('latitude', instance.latitude),
            'longitude': validated_data.get('longitude', instance.longitude),
        }

        try:
            headers = self.get_auth_header()
            response = requests.put(f'http://127.0.0.1:8001/api/stations/{instance.id}/',
                                    json=external_data,
                                    headers=headers)
            response.raise_for_status()
        except requests.RequestException as e:
            raise serializers.ValidationError({"error": str(e)})

        instance.name = validated_data.get('name', instance.name)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        instance.save()

        return instance


class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer
    permission_classes = [IsAccessManager]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            response = requests.delete(f'http://localhost:8001/api/stations/{instance.id}/',
                                       headers=self.get_serializer().get_auth_header())
            response.raise_for_status()
        except requests.RequestException as e:
            raise serializers.ValidationError({"error": str(e)})
        instance.delete()
        return Response(status=200)
