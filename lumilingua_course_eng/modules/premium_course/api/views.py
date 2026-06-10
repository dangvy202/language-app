from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets,status
from datetime import date

from modules.premium_course.api.serializers import ReadingSerializer, SaveVocabularyReadingSerializer, \
    QuestionOptionPremiumSerializer, QuestionPremiumSerializer, ExerciseReadingPremiumSerializer, \
    ExerciseProgressReadingPremiumSerializer, GoalSerializer, QuestionGroupPremiumSerializer
from modules.premium_course.models import Reading, SaveVocabularyReading, QuestionOptionsPremium, QuestionPremium, \
    ExerciseReadingPremium, ExerciseProgressReadingPremium, Goals, QuestionGroupPremium


class ReadingViewSet(viewsets.ModelViewSet):
    queryset = Reading.objects.all()
    serializer_class = ReadingSerializer

class SaveVocabularyReadingViewSet(viewsets.ModelViewSet):
    queryset = SaveVocabularyReading.objects.all()
    serializer_class = SaveVocabularyReadingSerializer

class ExerciseProgressReadingPremiumViewSet(viewsets.ModelViewSet):
    queryset = ExerciseProgressReadingPremium.objects.all()
    serializer_class = ExerciseProgressReadingPremiumSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user_cache = self.request.query_params.get('user_cache')
        if user_cache:
            queryset = queryset.filter(user_cache=user_cache)
        return queryset

class ExerciseReadingPremiumViewSet(viewsets.ModelViewSet):
    queryset = ExerciseReadingPremium.objects.all()
    serializer_class = ExerciseReadingPremiumSerializer

class QuestionGroupPremiumViewSet(viewsets.ModelViewSet):
    queryset = QuestionGroupPremium.objects.all()
    serializer_class = QuestionGroupPremiumSerializer

class QuestionPremiumViewSet(viewsets.ModelViewSet):
    queryset = QuestionPremium.objects.all()
    serializer_class = QuestionPremiumSerializer

class QuestionOptionPremiumViewSet(viewsets.ModelViewSet):
    queryset = QuestionOptionsPremium.objects.all()
    serializer_class = QuestionOptionPremiumSerializer

class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goals.objects.all()
    serializer_class = GoalSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        user_cache = self.request.query_params.get('user_cache')
        is_completed = self.request.query_params.get('is_completed')

        if user_cache:
            queryset = queryset.filter(user_cache=user_cache)

        if is_completed:
            queryset = queryset.filter(
                is_completed=is_completed.lower() == 'true'
            )

        return queryset

    @action(detail=True, methods=['patch'])
    def complete(self, request, pk=None):
        goal = self.get_object()

        goal.is_completed = True
        goal.save()

        return Response({
            "message": "Goal completed"
        })

    def create(self, request, *args, **kwargs):

        user_cache = request.data.get('user_cache')

        unfinished_goal = Goals.objects.filter(user_cache_id=user_cache, is_completed=False).exists()

        if unfinished_goal:
            return Response(
                {
                    "notification": "You must complete current goal first"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        is_today_goal = Goals.objects.filter(user_cache_id=user_cache, created_at__date=date.today()).exists()

        if is_today_goal:
            return Response(
                {
                    "notification": "You already created goal today"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().create(
            request,
            *args,
            **kwargs
        )