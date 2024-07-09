from django.contrib.auth.models import Group
from rest_framework.permissions import BasePermission


class IsAccessManager(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        admin_role = Group.objects.get(name='Administrador de Accesos')
        return user and user.userprofile.role.id == admin_role.id
