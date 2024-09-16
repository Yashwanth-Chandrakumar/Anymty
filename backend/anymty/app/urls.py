from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ChatViewSet, LoginView, RegisterView

router = DefaultRouter()
router.register(r'chats', ChatViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]