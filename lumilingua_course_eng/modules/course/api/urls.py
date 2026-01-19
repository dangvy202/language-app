from rest_framework import routers
from .views import LevelViewSet

levels_router = routers.SimpleRouter()

levels_router.register('/level', LevelViewSet)