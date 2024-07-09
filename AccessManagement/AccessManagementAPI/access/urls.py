from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from access.api import UserViewSet, StationViewSet
from access.auth import CustomTokenObtainPairView

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'stations', StationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-token-auth/', views.obtain_auth_token)
]
