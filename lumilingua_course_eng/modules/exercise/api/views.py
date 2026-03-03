from rest_framework import viewsets, status
from rest_framework.response import Response

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

    def create(self, request, *args, **kwargs):
        id_user = request.data.get('id_user')
        id_exercise = request.data.get('id_exercise')

        if not id_user:
            return Response({"error", "Missing user"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            exercise_progress = ExerciseProgress.objects.get(user_cache_id=id_user, exercises_id=id_exercise,)
            created = False
        except ExerciseProgress.DoesNotExist:
            exercise_progress = None
            created = True

        if created:
            exercise_progress = ExerciseProgress.objects.create(
                user_cache_id=id_user,
                exercises_id=id_exercise,
                score=request.data.get('score'),
                is_completed=True,
                completed_at=request.data.get('completed_at')
            )
        else:
            exercise_progress.score = request.data.get('score')
            exercise_progress.attempts = exercise_progress.attempts + 1
            exercise_progress.is_completed = True
            exercise_progress.completed_at = request.data.get('completed_at')
            exercise_progress.save(
                update_fields=['score', 'attempts', 'is_completed', 'completed_at'])

        serializer = self.get_serializer(exercise_progress)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

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

