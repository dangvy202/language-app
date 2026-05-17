from rest_framework import routers

from modules.premium_course.api.views import ReadingViewSet

# Reading
readings_router = routers.SimpleRouter()
readings_router.register(r'reading', ReadingViewSet)