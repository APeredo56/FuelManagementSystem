from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView


def set_cookie(response, key, value, expires):
    response.set_cookie(
        key,
        value,
        httponly=True,
        secure=True,
        samesite='None',
        max_age=expires,
    )


class CustomTokenObtainPairView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            response = Response({'message': str('Token Created Successfully')}, status=status.HTTP_200_OK)
            set_cookie(response, 'access', str(refresh.access_token), 1000 * 30)
            set_cookie(response, 'refresh', str(refresh), 1000 * 60 * 24)  # TODO: parametrizar expires
            return response
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')

        if not refresh_token:
            return Response({'detail': 'Refresh token not found in cookies'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data={'refresh': refresh_token})

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        access_token = serializer.validated_data['access']
        print(serializer.validated_data)
        response = Response({'detail': 'Access token refreshed successfully'}, status=status.HTTP_200_OK)
        set_cookie(response, 'access', str(access_token), 1000 * 30)
        return response
