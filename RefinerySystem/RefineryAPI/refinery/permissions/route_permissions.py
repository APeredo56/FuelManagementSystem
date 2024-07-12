from rest_framework.permissions import BasePermission


class CanViewRoute(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('view_route')


class CanAddRoute(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('add_route')


class CanEditRoute(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('change_route')


class CanDeleteRoute(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('delete_route')
