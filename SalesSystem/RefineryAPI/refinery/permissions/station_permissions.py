from rest_framework.permissions import BasePermission


class CanViewStation(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('view_station')


class CanAddStation(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('add_station')


class CanEditStation(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('change_station')


class CanDeleteStation(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('delete_station')
