from django.urls import path, include
from rest_framework import routers
from modules.course.api.urls import levels_router, topics_router, vocabularies_router, languages_router, means_router
from modules.exercise.api.urls import exercises_router, exercise_progress_router, questions_router, \
    question_option_router
from modules.progress.api.urls import users_cache_router, certificates_router, certificate_caches_router, \
    users_note_router, histories_progress_router

router = routers.DefaultRouter()
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
# exercise
router.registry.extend(exercises_router.registry)
router.registry.extend(exercise_progress_router.registry)
router.registry.extend(questions_router.registry)
router.registry.extend(question_option_router.registry)

urlpatterns = [
    path('', include(router.urls)),
]