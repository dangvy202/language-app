from rest_framework import routers

from modules.progress.api.views import UserCacheViewSet, CertificateViewSet, CertificateCacheViewSet, UserNoteViewSet, \
    HistoryProgressViewSet

# User Cache
users_cache_router = routers.SimpleRouter()
users_cache_router.register(r'user_cache', UserCacheViewSet)

# History Progress
histories_progress_router = routers.SimpleRouter()
histories_progress_router.register(r'history_progress', HistoryProgressViewSet)

# User Note
users_note_router = routers.SimpleRouter()
users_note_router.register(r'user_note', UserNoteViewSet)

# Certificate
certificates_router = routers.SimpleRouter()
certificates_router.register(r'certificate', CertificateViewSet)

# Certificate Cache
certificate_caches_router = routers.SimpleRouter()
certificate_caches_router.register(r'certificate_cache', CertificateCacheViewSet)