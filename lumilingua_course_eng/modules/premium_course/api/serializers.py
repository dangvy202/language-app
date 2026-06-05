from rest_framework import serializers
import random

from modules.course.api.serializers import LevelSerializer
from modules.course.models import Level
from modules.premium_course.models import Reading, SaveVocabularyReading, QuestionOptionsPremium, \
    ExerciseReadingPremium, ExerciseProgressReadingPremium, Goals

class SaveVocabularyReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaveVocabularyReading
        fields = ['id_vocabulary_reading', 'word', 'meaning', 'user_cache', 'reading']
        read_only_fields = ['created_at', 'updated_at']

class ExerciseProgressReadingPremiumSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseProgressReadingPremium
        fields = ['id_exercise_progress', 'user_cache', 'exercises', 'score', 'attempts', 'is_completed', 'completed_at']
        read_only_fields = ['created_at', 'updated_at']

class ExerciseReadingPremiumSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseReadingPremium
        fields = ['id_reading_exercise', 'name', 'description', 'icon', 'xp_receive', 'balance_learn', 'type', 'difficulty', 'reading', 'time_limit', 'points', 'question_count']
        read_only_fields = ['created_at', 'updated_at']

class QuestionPremiumSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = QuestionOptionsPremium
        fields = ['id_question_premium', 'exercise_reading_premium', 'content', 'type', 'words', 'metadata', 'correct_answer', 'points', 'image_url']
        read_only_fields = ['created_at', 'updated_at']

    def get_options(self, obj):
        if obj.type in ['multiple_choice', 'fill_blank']:
            options = QuestionOptionsPremium.objects.filter(question=obj)
            return QuestionOptionPremiumSerializer(options, many=True).data
        return []

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.type == "matching" and instance.metadata:
            pairs = instance.metadata.get("pairs", [])

            left = [{"id": p["id"], "text": p["left"]} for p in pairs]
            right = [{"id": p["id"], "text": p["right"]} for p in pairs]

            random.shuffle(right)

            data["left"] = left
            data["right"] = right

            # Not response meta data raw
            data.pop("metadata", None)
        return data

class QuestionOptionPremiumSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOptionsPremium
        fields = ['id_question_premium_option', 'question_premium', 'content', 'is_correct']
        read_only_fields = ['created_at', 'updated_at']

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goals
        fields = ['id_goal', 'description', 'goal_reading', 'goal_listening', 'goal_writing', 'goal_speaking', 'goal_xp', 'actual_reading', 'actual_listening', 'actual_writing', 'actual_speaking', 'actual_xp', 'user_cache', 'is_completed']
        read_only_fields = ['created_at', 'updated_at']

class ReadingSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField(read_only=True)
    exercises_premium = ExerciseReadingPremiumSerializer(
        source='exercise_reading',
        many=True,
        read_only=True
    )
    class Meta:
        model = Reading
        fields =  ['id_reading', 'title', 'content', 'mean_content', 'img_path', 'level', 'options', 'exercises_premium']
        read_only_fields = ['created_at', 'updated_at']

    def get_options(self, obj):
        options = Level.objects.filter(id_level=obj.level_id)
        return LevelSerializer(options, many=True).data