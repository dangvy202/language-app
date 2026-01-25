from rest_framework import routers
from .views import LevelViewSet, TopicViewSet

# Level
levels_router = routers.SimpleRouter()
levels_router.register('/level', LevelViewSet)

# Topic
topics_router = routers.SimpleRouter()
topics_router.register('/topic', TopicViewSet)