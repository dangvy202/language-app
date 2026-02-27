from rest_framework import viewsets
from rest_framework.decorators import action

from modules.exercise.api.serializers import ExerciseSerializer, ExerciseProgressSerializer, QuestionSerializer, \
    QuestionOptionsSerializer
from modules.exercise.models import Exercise, ExerciseProgress, Question, QuestionOptions


class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

class ExerciseProgressViewSet(viewsets.ModelViewSet):
    queryset = ExerciseProgress.objects.all()
    serializer_class = ExerciseProgressSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user_cache = self.request.query_params.get('user_cache')
        if user_cache:
            queryset = queryset.filter(user_cache=user_cache)
        return queryset

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        exercise_id = self.request.query_params.get('exercise')
        if exercise_id:
            queryset = queryset.filter(exercise_id=exercise_id)
        return queryset


class QuestionOptionsViewSet(viewsets.ModelViewSet):
    queryset = QuestionOptions.objects.all()
    serializer_class = QuestionOptionsSerializer

