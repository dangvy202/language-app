from rest_framework import serializers

from modules.exercise.models import Exercise, ExerciseProgress, Question, QuestionOptions


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id_exercise', 'icon', 'name', 'description', 'type', 'difficulty', 'topic', 'time_limit', 'points', 'question_count']
        read_only_fields = ['created_at', 'updated_at']

class ExerciseProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseProgress
        fields = ['id_exercise_progress', 'user_cache', 'exercises', 'score', 'attempts', 'is_completed', 'completed_at']
        read_only_fields = ['created_at', 'updated_at']

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id_question', 'exercise', 'content', 'type', 'correct_answer', 'points', 'image_url']
        read_only_fields = ['created_at', 'updated_at']

class QuestionOptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOptions
        fields = ['id_question_option', 'question', 'content', 'is_correct']
        read_only_fields = ['created_at', 'updated_at']
