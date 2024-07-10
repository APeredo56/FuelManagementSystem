from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from sales.api import StationViewSet, PumpViewSet, SaleViewSet, FuelTypeViewSet, FuelStockViewSet, ClientViewSet

router = routers.DefaultRouter()
router.register(r'stations', StationViewSet)
router.register(r'pumps', PumpViewSet)
router.register(r'sales', SaleViewSet)
router.register(r'fuel-types', FuelTypeViewSet)
router.register(r'fuel-stock', FuelStockViewSet)
router.register(r'clients', ClientViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-token-auth/', views.obtain_auth_token)
]
