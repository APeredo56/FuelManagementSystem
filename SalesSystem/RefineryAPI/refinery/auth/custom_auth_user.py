from django.contrib.auth.models import Group


class CustomAuthUser:
    pk = 0
    role = 0
    is_authenticated = False

    def has_perm(self, perm):
        if not self.is_authenticated:
            return False

        # Get the group corresponding to the user's role
        try:
            group = Group.objects.get(pk=self.role)
        except Group.DoesNotExist:
            return False

        # Get all permissions for the group
        permissions = group.permissions.all()

        # Check if the specified permission exists in the group's permissions
        for permission in permissions:
            if permission.codename == perm:
                return True

        return False

    def __str__(self):
        return "User: " + str(self.pk) + " role: " + str(self.role)
