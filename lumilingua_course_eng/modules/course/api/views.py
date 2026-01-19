from rest_framework import viewsets
from .serializers import LevelSerializer
from ..models import Level

class LevelViewSet(viewsets.ModelViewSet):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer