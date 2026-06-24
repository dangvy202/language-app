from rest_framework import routers

from modules.exercise.api.urls import question_option_router
from modules.premium_course.api.views import ReadingViewSet, SaveVocabularyReadingViewSet, QuestionOptionPremiumViewSet, \
    QuestionPremiumViewSet, ExerciseReadingPremiumViewSet, ExerciseProgressReadingPremiumViewSet, GoalViewSet, \
    QuestionGroupPremiumViewSet, ListeningViewSet, ExerciseProgressListeningPremiumViewSet, \
    ExerciseListeningPremiumViewSet, QuestionGroupListeningPremiumViewSet, QuestionListeningPremiumViewSet, \
    QuestionOptionListeningPremiumViewSet

# Goals
goals_router = routers.SimpleRouter()
goals_router.register(r'goal', GoalViewSet)

# Reading
readings_router = routers.SimpleRouter()
readings_router.register(r'reading', ReadingViewSet)

# Save vocabulary reading
save_vocabularies_reading_router = routers.SimpleRouter()
save_vocabularies_reading_router.register(r'save_vocabulary_reading', SaveVocabularyReadingViewSet)

# exercise progress reading premium
exercise_progress_reading_premium_router = routers.SimpleRouter()
exercise_progress_reading_premium_router.register(r'exercise_progress_reading_premium', ExerciseProgressReadingPremiumViewSet)

# exercise reading premium
exercise_reading_premium_router = routers.SimpleRouter()
exercise_reading_premium_router.register(r'exercise_reading_premium', ExerciseReadingPremiumViewSet)

# Question group
question_group_premium_router = routers.SimpleRouter()
question_group_premium_router.register(r'question_group_premium', QuestionGroupPremiumViewSet)

# Question premium
question_premium_router = routers.SimpleRouter()
question_premium_router.register(r'question_premium', QuestionPremiumViewSet)

# Question option premium
question_option_premium_router = routers.SimpleRouter()
question_option_premium_router.register(r'question_option_premium', QuestionOptionPremiumViewSet)

# Listening
listenings_router = routers.SimpleRouter()
listenings_router.register(r'listening', ListeningViewSet)

# exercise progress listening premium
exercise_progress_listening_premium_router = routers.SimpleRouter()
exercise_progress_listening_premium_router.register(r'exercise_progress_listening_premium', ExerciseProgressListeningPremiumViewSet)

# exercise listening premium
exercise_listening_premium_router = routers.SimpleRouter()
exercise_listening_premium_router.register(r'exercise_listening_premium', ExerciseListeningPremiumViewSet)

# Question group listening
question_group_listening_premium_router = routers.SimpleRouter()
question_group_listening_premium_router.register(r'question_group_listening_premium', QuestionGroupListeningPremiumViewSet)

# Question listening premium
question_listening_premium_router = routers.SimpleRouter()
question_listening_premium_router.register(r'question_listening_premium', QuestionListeningPremiumViewSet)

# Question option listening premium
question_option_listening_premium_router = routers.SimpleRouter()
question_option_listening_premium_router.register(r'question_option_listening_premium', QuestionOptionListeningPremiumViewSet)
