from rest_framework import viewsets

from .serializers import UserCacheSerializer, CertificateSerializer, CertificateCacheSerializer, UserNoteSerializer, \
    HistoryProgressSerializer
from ..models import UserCache, Certificate, CertificateCache, UserNote, HistoryProgress
from django_filters.rest_framework import DjangoFilterBackend

class UserCacheViewSet(viewsets.ModelViewSet):
    queryset = UserCache.objects.all()
    serializer_class = UserCacheSerializer

class HistoryProgressViewSet(viewsets.ModelViewSet):
    queryset = HistoryProgress.objects.all()
    serializer_class = HistoryProgressSerializer

class UserNoteViewSet(viewsets.ModelViewSet):
    queryset = UserNote.objects.all()
    serializer_class = UserNoteSerializer

class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer

class CertificateCacheViewSet(viewsets.ModelViewSet):
    queryset = CertificateCache.objects.all()
    serializer_class = CertificateCacheSerializer
