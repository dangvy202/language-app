from rest_framework import viewsets
from .serializers import LevelSerializer, TopicSerializer, VocabularySerializer
from ..models import Level, Topic, Vocabulary
from django_filters.rest_framework import DjangoFilterBackend

class LevelViewSet(viewsets.ModelViewSet):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer

class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

class VocabularyViewSet(viewsets.ModelViewSet):
    serializer_class = VocabularySerializer
    queryset = Vocabulary.objects.all()

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['level', 'topic']