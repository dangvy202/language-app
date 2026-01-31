from rest_framework import routers

from modules.progress.api.views import UserCacheViewSet, CertificateViewSet, CertificateCacheViewSet, UserNoteViewSet

# User Cache
users_cache_router = routers.SimpleRouter()
users_cache_router.register(r'user_cache', UserCacheViewSet)

# User Note
users_note_router = routers.SimpleRouter()
users_note_router.register(r'user_note', UserNoteViewSet)

# Certificate
certificates_router = routers.SimpleRouter()
certificates_router.register(r'certificate', CertificateViewSet)

# Certificate Cache
certificate_caches_router = routers.SimpleRouter()
certificate_caches_router.register(r'certificate_cache', CertificateCacheViewSet)