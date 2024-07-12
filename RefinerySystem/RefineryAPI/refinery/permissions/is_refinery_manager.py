from django.contrib.auth.models import Group
from rest_framework.permissions import BasePermission


class IsRefineryManager(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        admin_role = Group.objects.get(name='Administrador de Refinería')
        return user and user.role == admin_role.id
