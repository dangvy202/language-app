from rest_framework import routers

from modules.exercise.api.views import ExerciseViewSet, ExerciseProgressViewSet, QuestionViewSet, QuestionOptionsViewSet

# Exercise
exercises_router = routers.SimpleRouter()
exercises_router.register(r'exercise', ExerciseViewSet)

# Exercise Progress
exercise_progress_router = routers.SimpleRouter()
exercise_progress_router.register(r'exercise_progress', ExerciseProgressViewSet)

# Question
questions_router = routers.SimpleRouter()
questions_router.register(r'question', QuestionViewSet)

# Question Option
question_option_router = routers.SimpleRouter()
question_option_router.register(r'question_option', QuestionOptionsViewSet)
