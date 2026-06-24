from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets,status
from datetime import date

from modules.premium_course.api.serializers import ReadingSerializer, SaveVocabularyReadingSerializer, \
    QuestionOptionPremiumSerializer, QuestionPremiumSerializer, ExerciseReadingPremiumSerializer, \
    ExerciseProgressReadingPremiumSerializer, GoalSerializer, QuestionGroupPremiumSerializer, ListeningSerializer, \
    ExerciseProgressListeningPremiumSerializer, ExerciseListeningPremiumSerializer, \
    QuestionGroupListeningPremiumSerializer, QuestionListeningPremiumSerializer, \
    QuestionOptionListeningPremiumSerializer
from modules.premium_course.models import Reading, SaveVocabularyReading, QuestionOptionsPremium, QuestionPremium, \
    ExerciseReadingPremium, ExerciseProgressReadingPremium, Goals, QuestionGroupPremium, Listening, \
    ExerciseProgressListeningPremium, ExerciseListeningPremium, QuestionGroupListeningPremium, QuestionListeningPremium, \
    QuestionOptionsListeningPremium
from modules.progress.models import UserCache, CategoryLevel

class ListeningViewSet(viewsets.ModelViewSet):
    queryset = Listening.objects.all()
    serializer_class = ListeningSerializer

class ExerciseProgressListeningPremiumViewSet(viewsets.ModelViewSet):
    queryset = ExerciseProgressListeningPremium.objects.all()
    serializer_class = ExerciseProgressListeningPremiumSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user_cache = self.request.query_params.get('user_cache')
        if user_cache:
            queryset = queryset.filter(user_cache=user_cache)
        return queryset

    def create(self, request, *args, **kwargs):
        id_user = request.data.get('id_user')
        id_exercise_progress_listening = request.data.get('id_exercise_progress_listening')

        if not id_user:
            return Response({"error", "Missing user"}, status=status.HTTP_400_BAD_REQUEST)

        if not id_exercise_progress_listening:
            return Response({"error": "Missing exercise"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            exercise_progress_listening_premium = ExerciseProgressListeningPremium.objects.get(user_cache_id=id_user, exercises_id=id_exercise_progress_listening)
            created = False
        except ExerciseProgressListeningPremium.DoesNotExist:
            exercise_progress_listening_premium = None
            created = True

        if created:
            exercise_progress_listening_premium = ExerciseProgressListeningPremium.objects.create(
                user_cache_id=id_user,
                exercises_id=id_exercise_progress_listening,
                score=request.data.get('score'),
                is_completed=True,
                completed_at=request.data.get('completed_at')
            )

            exercises_listening_premium = ExerciseListeningPremium.objects.get(id_listening_exercise=id_exercise_progress_listening)
            user_cache = UserCache.objects.get(id_user_cache=id_user)
            category_level = list(CategoryLevel.objects.all())

            left = 0
            right = len(category_level) - 1

            target = user_cache.gain_xp + exercises_listening_premium.xp_receive
            best_level = category_level[0]

            while left <= right:
                mid = left + (right - left) // 2
                level = category_level[mid]

                if target >= level.xp_level:
                    best_level = level
                    left = mid + 1
                else:
                    right = mid - 1

            user_cache.gain_xp = target
            user_cache.category_level = best_level
            user_cache.save(update_fields=['gain_xp', 'category_level'])
        else:
            exercise_progress_listening_premium.score = request.data.get('score')
            exercise_progress_listening_premium.attempts = exercise_progress_listening_premium.attempts + 1
            exercise_progress_listening_premium.is_completed = True
            exercise_progress_listening_premium.completed_at = request.data.get('completed_at')
            exercise_progress_listening_premium.save(
                update_fields=['score', 'attempts', 'is_completed', 'completed_at'])

        serializer = self.get_serializer(exercise_progress_listening_premium)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class ExerciseListeningPremiumViewSet(viewsets.ModelViewSet):
    queryset = ExerciseListeningPremium.objects.all()
    serializer_class = ExerciseListeningPremiumSerializer

class QuestionGroupListeningPremiumViewSet(viewsets.ModelViewSet):
    queryset = QuestionGroupListeningPremium.objects.all()
    serializer_class = QuestionGroupListeningPremiumSerializer

class QuestionListeningPremiumViewSet(viewsets.ModelViewSet):
    queryset = QuestionListeningPremium.objects.all()
    serializer_class = QuestionListeningPremiumSerializer

class QuestionOptionListeningPremiumViewSet(viewsets.ModelViewSet):
    queryset = QuestionOptionsListeningPremium.objects.all()
    serializer_class = QuestionOptionListeningPremiumSerializer





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

    def create(self, request, *args, **kwargs):
        id_user = request.data.get('id_user')
        id_reading_exercise = request.data.get('id_reading_exercise')

        if not id_user:
            return Response({"error", "Missing user"}, status=status.HTTP_400_BAD_REQUEST)

        if not id_reading_exercise:
            return Response({"error": "Missing exercise"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            exercise_progress_reading_premium = ExerciseProgressReadingPremium.objects.get(user_cache_id=id_user, exercises_id=id_reading_exercise)
            created = False
        except ExerciseProgressReadingPremium.DoesNotExist:
            exercise_progress_reading_premium = None
            created = True

        if created:
            exercise_progress_reading_premium = ExerciseProgressReadingPremium.objects.create(
                user_cache_id=id_user,
                exercises_id=id_reading_exercise,
                score=request.data.get('score'),
                is_completed=True,
                completed_at=request.data.get('completed_at')
            )

            exercises_reading_premium = ExerciseReadingPremium.objects.get(id_reading_exercise=id_reading_exercise)
            user_cache = UserCache.objects.get(id_user_cache=id_user)
            category_level = list(CategoryLevel.objects.all())

            left = 0
            right = len(category_level) - 1

            target = user_cache.gain_xp + exercises_reading_premium.xp_receive
            best_level = category_level[0]

            while left <= right:
                mid = left + (right - left) // 2
                level = category_level[mid]

                if target >= level.xp_level:
                    best_level = level
                    left = mid + 1
                else:
                    right = mid - 1

            user_cache.gain_xp = target
            user_cache.category_level = best_level
            user_cache.save(update_fields=['gain_xp', 'category_level'])
        else:
            exercise_progress_reading_premium.score = request.data.get('score')
            exercise_progress_reading_premium.attempts = exercise_progress_reading_premium.attempts + 1
            exercise_progress_reading_premium.is_completed = True
            exercise_progress_reading_premium.completed_at = request.data.get('completed_at')
            exercise_progress_reading_premium.save(
                update_fields=['score', 'attempts', 'is_completed', 'completed_at'])

        serializer = self.get_serializer(exercise_progress_reading_premium)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

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