from rest_framework import viewsets

from modules.premium_course.api.serializers import ReadingSerializer, SaveVocabularyReadingSerializer, \
    QuestionOptionPremiumSerializer, QuestionPremiumSerializer, ExerciseReadingPremiumSerializer, \
    ExerciseProgressReadingPremiumSerializer
from modules.premium_course.models import Reading, SaveVocabularyReading, QuestionOptionsPremium, QuestionPremium, \
    ExerciseReadingPremium, ExerciseProgressReadingPremium


class ReadingViewSet(viewsets.ModelViewSet):
    queryset = Reading.objects.all()
    serializer_class = ReadingSerializer

class SaveVocabularyReadingViewSet(viewsets.ModelViewSet):
    queryset = SaveVocabularyReading.objects.all()
    serializer_class = SaveVocabularyReadingSerializer

class ExerciseProgressReadingPremiumViewSet(viewsets.ModelViewSet):
    queryset = ExerciseProgressReadingPremium.objects.all()
    serializer_class = ExerciseProgressReadingPremiumSerializer

class ExerciseReadingPremiumViewSet(viewsets.ModelViewSet):
    queryset = ExerciseReadingPremium.objects.all()
    serializer_class = ExerciseReadingPremiumSerializer

class QuestionPremiumViewSet(viewsets.ModelViewSet):
    queryset = QuestionPremium.objects.all()
    serializer_class = QuestionPremiumSerializer

class QuestionOptionPremiumViewSet(viewsets.ModelViewSet):
    queryset = QuestionOptionsPremium.objects.all()
    serializer_class = QuestionOptionPremiumSerializer
