from rest_framework.permissions import BasePermission


class CanViewTruck(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('view_truck')


class CanAddTruck(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('add_truck')


class CanEditTruck(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('change_truck')


class CanDeleteTruck(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('delete_truck')
