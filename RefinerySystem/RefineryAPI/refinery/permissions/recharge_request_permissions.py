from rest_framework.permissions import BasePermission


class CanViewRechargeRequest(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('view_rechargerequest')


class CanAddRechargeRequest(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('add_rechargerequest')


class CanEditRechargeRequest(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('change_rechargerequest')


class CanDeleteRechargeRequest(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('delete_rechargerequest')
