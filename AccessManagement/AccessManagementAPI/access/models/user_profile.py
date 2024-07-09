from django.contrib.auth.models import User, Group
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    phone = models.CharField(max_length=20)
    station = models.ForeignKey('Station', on_delete=models.SET_NULL, null=True, blank=True)
    role = models.ForeignKey(Group, on_delete=models.CASCADE)
