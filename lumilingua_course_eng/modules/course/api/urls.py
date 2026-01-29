from rest_framework import routers
from .views import LevelViewSet, TopicViewSet, VocabularyViewSet, LanguageViewSet, MeanViewSet

# Level
levels_router = routers.SimpleRouter()
levels_router.register(r'level', LevelViewSet)

# Topic
topics_router = routers.SimpleRouter()
topics_router.register(r'topic', TopicViewSet)

# Vocabulary
vocabularies_router = routers.SimpleRouter()
vocabularies_router.register(r'vocabulary', VocabularyViewSet)

# Language
languages_router = routers.SimpleRouter()
languages_router.register(r'language', LanguageViewSet)

# Mean
means_router = routers.SimpleRouter()
means_router.register(r'mean', MeanViewSet)