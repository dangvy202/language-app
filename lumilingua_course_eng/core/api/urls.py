from django.urls import path, include
from rest_framework import routers
from modules.course.api.urls import levels_router, topics_router, vocabularies_router

router = routers.DefaultRouter()
router.registry.extend(levels_router.registry)
router.registry.extend(topics_router.registry)
router.registry.extend(vocabularies_router.registry)

urlpatterns = [
    path('', include(router.urls)),
]