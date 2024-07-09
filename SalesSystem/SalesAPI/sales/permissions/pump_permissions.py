from rest_framework.permissions import BasePermission


class CanViewPump(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('view_pump')


class CanAddPump(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('add_pump')


class CanEditPump(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('change_pump')


class CanDeletePump(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('delete_pump')
