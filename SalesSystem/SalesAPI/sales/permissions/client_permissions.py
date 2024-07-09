from rest_framework.permissions import BasePermission


class CanViewClient(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('view_client')


class CanAddClient(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('add_client')


class CanEditClient(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('change_client')


class CanDeleteClient(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('delete_client')
