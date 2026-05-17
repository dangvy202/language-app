from rest_framework import viewsets

from modules.premium_course.api.serializers import ReadingSerializer
from modules.premium_course.models import Reading


class ReadingViewSet(viewsets.ModelViewSet):
    queryset = Reading.objects.all()
    serializer_class = ReadingSerializer