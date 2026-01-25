from rest_framework import serializers
from ..models import Level, Topic

class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        # fields = "__all__"
        fields = ['id_level', 'rank', 'level_name', 'created_at', 'updated_at', 'description']
        read_only_fields = ['created_at', 'updated_at']

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id_topic', 'name_topic']
        read_only_fields = ['created_at', 'updated_at']