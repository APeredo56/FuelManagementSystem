from django.contrib.auth.models import Group
from rest_framework.permissions import BasePermission


class IsStationManager(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        admin_role = Group.objects.get(name='Administrador de Surtidor')
        return user and user.role == admin_role.id
