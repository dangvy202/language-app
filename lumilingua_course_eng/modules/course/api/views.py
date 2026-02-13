from rest_framework import viewsets

from .filters import VocabularyFilter
from .serializers import LevelSerializer, TopicSerializer, VocabularySerializer, LanguageSerializer, MeanSerializer
from ..models import Level, Topic, Vocabulary, Language, Mean
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count

class LevelViewSet(viewsets.ModelViewSet):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer

class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

    def get_queryset(self):
        return Topic.objects.annotate(
            vocabulary_count=Count("vocabularies")
        )

class VocabularyViewSet(viewsets.ModelViewSet):
    serializer_class = VocabularySerializer
    queryset = Vocabulary.objects.all()

    filter_backends = [DjangoFilterBackend]
    filterset_class  = VocabularyFilter

class LanguageViewSet(viewsets.ModelViewSet):
    serializer_class = LanguageSerializer
    queryset = Language.objects.all()

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['language_code']

class MeanViewSet(viewsets.ModelViewSet):
    serializer_class = MeanSerializer
    queryset = Mean.objects.all()

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['language', 'vocabulary']