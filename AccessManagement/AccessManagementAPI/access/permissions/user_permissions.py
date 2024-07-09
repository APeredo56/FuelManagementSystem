from rest_framework.permissions import BasePermission


class CanAddUsers(BasePermission):
    def has_permission(self, request, view):
        # jwt_payload = request.auth.payload
        # print(jwt_payload)
        return request.user and request.user.has_perm('add_user')


class CanEditUsers(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('change_user')


class CanDeleteUsers(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('delete_user')
