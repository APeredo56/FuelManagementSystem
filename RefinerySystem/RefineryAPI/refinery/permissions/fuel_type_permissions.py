from rest_framework.permissions import BasePermission


class CanViewFuelType(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('view_fueltype')


class CanAddFuelType(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('add_fueltype')


class CanEditFuelType(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('change_fueltype')


class CanDeleteFuelType(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('delete_fueltype')
