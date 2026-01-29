from rest_framework import serializers
from ..models import Level, Topic, Vocabulary, Language, Mean


class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
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

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id_language', 'language_code', 'name_language']
        read_only_fields = ['created_at', 'updated_at']

class MeanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mean
        fields = ['id_mean', 'mean_vocabulary', 'example_vocabulary', 'language', 'vocabulary']
        read_only_fields = ['created_at', 'updated_at']