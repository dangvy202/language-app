from rest_framework import viewsets, status
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta

from .serializers import UserCacheSerializer, CertificateSerializer, CertificateCacheSerializer, UserNoteSerializer, \
    HistoryProgressSerializer
from ..models import UserCache, Certificate, CertificateCache, UserNote, HistoryProgress
from .serializers import UserCacheSerializer

class UserCacheViewSet(viewsets.ModelViewSet):
    queryset = UserCache.objects.all()
    serializer_class = UserCacheSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        email = self.request.query_params.get('email')
        if email:
            queryset = queryset.filter(email=email)
        return queryset

    def create(self, request, *args, **kwargs):
        id_user = request.data.get('id_user')
        email = request.data.get('email')
        phone = request.data.get('phone')

        if not id_user or not email or not phone:
            return Response({"error", "Missing user or email or phone"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_cache = UserCache.objects.get(id_user=id_user)
            created = False
        except UserCache.DoesNotExist:
            user_cache = None
            created = True

        today = timezone.now().date()
        last_login_date = user_cache.last_login.date() if user_cache and user_cache.last_login else None

        if last_login_date:
            if last_login_date == today:
                new_streak = user_cache.streak  # lasted_login_streak
            elif last_login_date == today - timezone.timedelta(days=1):
                new_streak = user_cache.streak + 1  # increase_streak
            else:
                new_streak = 1  #reset_streak
        else:
            new_streak = 1  #fisrt_time_streak

        if created:
            user_cache = UserCache.objects.create(
                id_user=id_user,
                email=email,
                phone=phone,
                streak=new_streak,
                last_login=timezone.now(),
            )
        else:
            user_cache.streak = new_streak
            user_cache.email = email or user_cache.email
            user_cache.phone = phone or user_cache.phone
            user_cache.last_login = timezone.now()
            user_cache.save(update_fields=['streak', 'email', 'phone', 'last_login'])

        serializer = self.get_serializer(user_cache)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

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
