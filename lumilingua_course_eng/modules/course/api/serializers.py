from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework import serializers
from ..models import Level, Topic, Vocabulary


class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        # fields = "__all__"
        fields = ['id_level', 'rank', 'level_name', 'created_at', 'updated_at', 'description']
        read_only_fields = ['created_at', 'updated_at']

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id_topic', 'name_topic', 'icon']
        read_only_fields = ['created_at', 'updated_at']

class VocabularySerializer(serializers.ModelSerializer):
    class Meta:
        model = Vocabulary
        fields = ['id_vocabulary', 'name_vocabulary', 'ipa', 'level', 'topic', 'img_path']
        read_only_fields = ['created_at', 'updated_at']