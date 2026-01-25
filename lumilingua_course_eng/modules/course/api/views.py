from rest_framework import viewsets
from .serializers import LevelSerializer, TopicSerializer
from ..models import Level, Topic

class LevelViewSet(viewsets.ModelViewSet):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer

class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer