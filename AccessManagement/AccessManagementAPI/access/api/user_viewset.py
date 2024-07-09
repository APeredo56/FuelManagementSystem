from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User, Group
from django.db import transaction
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from access.api import StationSerializer
from access.models import UserProfile, Station
from access.permissions import PermissionPolicyMixin
from access.permissions.is_access_manager import IsAccessManager


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    phone = serializers.CharField(source='userprofile.phone')
    role = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), source='userprofile.role')
    station = StationSerializer(read_only=True, source='userprofile.station')
    station_id = serializers.PrimaryKeyRelatedField(queryset=Station.objects.all(),
                                                    source='userprofile.station',
                                                    write_only=True,
                                                    required=False,
                                                    allow_null=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'phone',
                  'role', 'station_id', "station"]

    def create(self, validated_data):
        profile_data = validated_data.pop('userprofile', {})
        if not validated_data.__contains__('password'):
            raise serializers.ValidationError({"password": "This field is required."})
        password = validated_data.pop('password')
        hashed_password = make_password(password)
        with transaction.atomic():
            user = User.objects.create(password=hashed_password, **validated_data)
            UserProfile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('userprofile', {})
        station = profile_data.get('station', None)

        with transaction.atomic():
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            for attr, value in profile_data.items():
                setattr(instance.userprofile, attr, value)
            instance.userprofile.save()

            if not station:
                instance.userprofile.station = None
                instance.userprofile.save()

        return instance


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAccessManager]

    @action(detail=False, methods=['get'], url_path='me', url_name='me',
            permission_classes=[IsAuthenticated])
    def get_user_info(self, request):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='roles', url_name='roles',
            permission_classes=[IsAuthenticated])
    def roles(self, request):
        roles = Group.objects.all()
        return Response([{"id": role.id, "name": role.name} for role in roles])
