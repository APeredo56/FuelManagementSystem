from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from refinery.api import FuelTypeViewSet
from refinery.api.recharge_request_viewset import RechargeRequestViewSet
from refinery.api.route_viewset import RouteViewSet
from refinery.api.truck_viewset import TruckViewSet

router = routers.DefaultRouter()
router.register(r'fuel-types', FuelTypeViewSet)
router.register(r'trucks', TruckViewSet)
router.register(r'recharge-requests', RechargeRequestViewSet)
router.register(r'routes', RouteViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-token-auth/', views.obtain_auth_token)
]
