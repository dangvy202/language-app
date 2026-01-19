from django.urls import path, include
from rest_framework import routers
from modules.course.api.urls import levels_router

router = routers.DefaultRouter()
router.registry.extend(levels_router.registry)

urlpatterns = [
    path('', include(router.urls)),
]