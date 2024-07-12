from rest_framework import authentication
from rest_framework_simplejwt.authentication import JWTAuthentication

from refinery.auth import CustomAuthUser


class CustomJWTAuth(authentication.BaseAuthentication):
    def authenticate(self, request):
        jwt_auth = JWTAuthentication()
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        bearer_token = auth_header.split()
        if len(bearer_token) <= 1:
            return None
        token = jwt_auth.get_validated_token(bearer_token[1])
        user_id = token["user_id"]
        custom_user = CustomAuthUser()
        custom_user.pk = user_id
        role = token["role"]
        custom_user.role = role
        custom_user.is_authenticated = True
        return custom_user, None
