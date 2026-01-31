from rest_framework import serializers
from ..models import UserCache, Certificate, CertificateCache, UserNote


class UserCacheSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCache
        fields = ['id_user_cache', 'streak', 'id_user', 'email', 'phone']
        read_only_fields = ['created_at', 'updated_at']

class UserNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNote
        fields = ['id_note', 'content_note', 'description_note', 'user_cache']
        read_only_fields = ['created_at', 'updated_at']

class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = ['id_certificate', 'name_certificate', 'description_certificate']
        read_only_fields = ['created_at', 'updated_at']

class CertificateCacheSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificateCache
        fields = ['id_certificate_cache', 'received_date', 'user_cache', 'certificate']
        read_only_fields = ['created_at', 'updated_at']
