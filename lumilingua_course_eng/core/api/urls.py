from django.urls import path, include
from rest_framework import routers
from modules.course.api.urls import levels_router, topics_router, vocabularies_router, languages_router, means_router
from modules.exercise.api.urls import exercises_router, exercise_progress_router, questions_router, \
    question_option_router
from modules.premium_course.api.urls import readings_router, save_vocabularies_reading_router, \
    question_option_premium_router, question_premium_router, exercise_reading_premium_router, \
    exercise_progress_reading_premium_router, goals_router, question_group_premium_router, listenings_router, \
    exercise_progress_listening_premium_router, exercise_listening_premium_router, \
    question_group_listening_premium_router, question_listening_premium_router, question_option_listening_premium_router
from modules.progress.api.urls import users_cache_router, certificates_router, certificate_caches_router, \
    users_note_router, histories_progress_router, category_level_router

router = routers.DefaultRouter()
#course premium
#goals
router.registry.extend(goals_router.registry)
#reading
router.registry.extend(readings_router.registry)
#save vocabulary reading
router.registry.extend(save_vocabularies_reading_router.registry)
#exercise progress reading premium
router.registry.extend(exercise_progress_reading_premium_router.registry)
#exercise reading premium
router.registry.extend(exercise_reading_premium_router.registry)
#question group premium
router.registry.extend(question_group_premium_router.registry)
#question premium
router.registry.extend(question_premium_router.registry)
#question option premium
router.registry.extend(question_option_premium_router.registry)
#listening
router.registry.extend(listenings_router.registry)
#exercise progress listening premium
router.registry.extend(exercise_progress_listening_premium_router.registry)
#exercise listening premium
router.registry.extend(exercise_listening_premium_router.registry)
#question group listening premium
router.registry.extend(question_group_listening_premium_router.registry)
#question listening premium
router.registry.extend(question_listening_premium_router.registry)
#question option listening premium
router.registry.extend(question_option_listening_premium_router.registry)
#end course premium

# course
router.registry.extend(levels_router.registry)
router.registry.extend(topics_router.registry)
router.registry.extend(vocabularies_router.registry)
router.registry.extend(languages_router.registry)
router.registry.extend(means_router.registry)
# progress
router.registry.extend(users_cache_router.registry)
router.registry.extend(certificates_router.registry)
router.registry.extend(certificate_caches_router.registry)
router.registry.extend(users_note_router.registry)
router.registry.extend(histories_progress_router.registry)
router.registry.extend(category_level_router.registry)
# exercise
router.registry.extend(exercises_router.registry)
router.registry.extend(exercise_progress_router.registry)
router.registry.extend(questions_router.registry)
router.registry.extend(question_option_router.registry)

urlpatterns = [
    path('', include(router.urls)),
]