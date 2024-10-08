from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ChatRoomViewSet, LoginView, RegisterView, cron_view

router = DefaultRouter()
router.register(r'chatrooms', ChatRoomViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('cron/', cron_view, name='cron'),
]