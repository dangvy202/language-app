from rest_framework import serializers
import random
from modules.exercise.models import Exercise, ExerciseProgress, Question, QuestionOptions


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id_exercise', 'icon', 'name', 'description', 'xp_receive', 'balance_learn', 'type', 'difficulty', 'topic', 'time_limit', 'points', 'question_count']
        read_only_fields = ['created_at', 'updated_at']

class ExerciseProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseProgress
        fields = ['id_exercise_progress', 'user_cache', 'exercises', 'score', 'attempts', 'is_completed', 'completed_at']
        read_only_fields = ['created_at', 'updated_at']

class QuestionSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Question
        fields = "__all__"
        read_only_fields = ['created_at', 'updated_at']

    def get_options(self, obj):
        if obj.type in ['multiple_choice', 'fill_blank']:
            options = QuestionOptions.objects.filter(question=obj)
            return QuestionOptionsSerializer(options, many=True).data
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

class QuestionOptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOptions
        fields = ['id_question_option', 'question', 'content', 'is_correct']
        read_only_fields = ['created_at', 'updated_at']
