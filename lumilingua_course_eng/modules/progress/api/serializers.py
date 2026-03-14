from rest_framework import serializers
from ..models import UserCache, Certificate, CertificateCache, UserNote, HistoryProgress, CategoryLevel


class UserCacheSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCache
        fields = ['id_user_cache', 'streak', 'id_user', 'email', 'phone', 'gain_xp', 'category_level']
        read_only_fields = ['created_at', 'updated_at']

class HistoryProgressSerializer(serializers.ModelSerializer):
    finished_date = serializers.DateTimeField(allow_null=True, required=False)
    class Meta:
        model = HistoryProgress
        fields = ['id_history_progress', 'isFinished', 'finished_date', 'duration', 'user_cache', 'topic', 'progress_percent', 'id_vocabulary_progress']
        read_only_fields = ['created_at', 'updated_at']

class UserNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNote
        fields = ['id_note', 'content_note', 'description_note', 'user_cache', 'vocabulary']
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

class CategoryLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryLevel
        fields = ['id_category_level', 'level', 'xp_level', 'condition']
        read_only_fields = ['created_at', 'updated_at']