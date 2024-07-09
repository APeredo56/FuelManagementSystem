from rest_framework.permissions import BasePermission


class CanViewSale(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('view_sale')


class CanAddSale(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('add_sale')
