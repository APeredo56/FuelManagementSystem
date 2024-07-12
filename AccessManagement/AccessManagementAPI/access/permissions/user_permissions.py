from rest_framework.permissions import BasePermission


def user_has_group_permission(user, perm_codename):
    if user.is_authenticated:
        user_groups = user.groups.all()
        for group in user_groups:
            if group.permissions.filter(codename=perm_codename).exists():
                return True

    return False


class CanAddUsers(BasePermission):
    def has_permission(self, request, view):
        # jwt_payload = request.auth.payload
        # print(jwt_payload)
        return user_has_group_permission(request.user, 'add_user')


class CanEditUsers(BasePermission):
    def has_permission(self, request, view):
        return user_has_group_permission(request.user, 'change_user')


class CanDeleteUsers(BasePermission):
    def has_permission(self, request, view):
        return user_has_group_permission(request.user, 'delete_user')


class CanViewUsers(BasePermission):
    def has_permission(self, request, view):
        return user_has_group_permission(request.user, 'view_user')
