from rest_framework import serializers
import random

from modules.course.api.serializers import LevelSerializer
from modules.course.models import Level
from modules.premium_course.models import Reading, SaveVocabularyReading, QuestionOptionsPremium, \
    ExerciseReadingPremium, ExerciseProgressReadingPremium, Goals, QuestionPremium, QuestionGroupPremium, \
    ExerciseListeningPremium, QuestionGroupListeningPremium, QuestionListeningPremium, QuestionOptionsListeningPremium, \
    Listening, ExerciseProgressListeningPremium


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

class QuestionOptionPremiumSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOptionsPremium
        fields = ['id_question_premium_option', 'content', 'is_correct']
        read_only_fields = ['created_at', 'updated_at']

class QuestionPremiumSerializer(serializers.ModelSerializer):
    options = QuestionOptionPremiumSerializer(
        source='question_premium_option',
        many=True,
        read_only=True
    )

    class Meta:
        model = QuestionPremium
        fields = ['id_question_premium', 'content', 'type', 'words', 'metadata', 'correct_answer', 'points', 'explain_question', 'image_url', 'options']

    def get_options(self, obj):
        if obj.type in [
            'multiple_choice',
            'fill_blank',
            'true_false_notgiven',
            'summary_completion',
            'sentence_completion'
        ]:
            options = QuestionOptionsPremium.objects.filter(
                question_premium=obj
            )

            return QuestionOptionPremiumSerializer(
                options,
                many=True
            ).data

        return []

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # Matching Heading
        if instance.type == "matching_heading":
            headings = instance.metadata.get("headings", []).copy()
            random.shuffle(headings)

            data["headings"] = headings

        # Matching Information
        elif instance.type == "matching_information":
            paragraphs = instance.metadata.get("paragraphs", [])

            data["paragraphs"] = paragraphs

        # Matching Features
        elif instance.type == "matching_features":
            features = instance.metadata.get("features", []).copy()
            random.shuffle(features)

            data["features"] = features

        # Matching Sentence Endings
        elif instance.type == "matching_sentence_endings":
            endings = instance.metadata.get("endings", []).copy()
            random.shuffle(endings)

            data["endings"] = endings

        # Table Completion
        elif instance.type == "table_completion":
            data["table"] = instance.metadata

        # Flow Chart Completion
        elif instance.type == "flow_chart_completion":
            data["flow_chart"] = instance.metadata

        # Summary Completion
        elif instance.type == "summary_completion":
            data["summary"] = instance.metadata

        return data

class QuestionGroupPremiumSerializer(serializers.ModelSerializer):
    questions = QuestionPremiumSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = QuestionGroupPremium
        fields = ['id_question_premium_group', 'title', 'instruction', 'type', 'metadata', 'order_no', 'questions']
        read_only_fields = ['created_at', 'updated_at']


class ExerciseReadingPremiumSerializer(serializers.ModelSerializer):
    question_groups = QuestionGroupPremiumSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = ExerciseReadingPremium
        fields = ['id_reading_exercise', 'name', 'description', 'icon', 'xp_receive', 'balance_learn', 'type',
                  'difficulty', 'time_limit', 'points', 'question_count', 'question_groups', 'reading']
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

class ExerciseProgressListeningPremiumSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseProgressListeningPremium
        fields = ['id_exercise_progress_listening', 'user_cache', 'exercises', 'score', 'attempts', 'is_completed', 'completed_at']
        read_only_fields = ['created_at', 'updated_at']

class QuestionOptionListeningPremiumSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOptionsListeningPremium
        fields = ['id_question_listening_premium_option', 'question_premium', 'content', 'is_correct']
        read_only_fields = ['created_at', 'updated_at']

class QuestionListeningPremiumSerializer(serializers.ModelSerializer):
    options = QuestionOptionListeningPremiumSerializer(
        source='question_listening_premium_option',
        many=True,
        read_only=True
    )

    class Meta:
        model = QuestionListeningPremium
        fields = ['id_question_listening_premium', 'exercise_listening_premium', 'question_listening_group', 'content', 'type', 'words', 'metadata', 'correct_answer', 'points', 'explain_question', 'image_url', 'options']
        read_only_fields = ['created_at', 'updated_at']

    def get_options(self, obj):
        if obj.type in [
            'multiple_choice',
            'fill_blank',
            'true_false_notgiven',
            'summary_completion',
            'sentence_completion'
        ]:
            options = QuestionOptionsListeningPremium.objects.filter(
                question_premium=obj
            )

            return QuestionOptionListeningPremiumSerializer(
                options,
                many=True
            ).data

        return []

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # Matching Heading
        if instance.type == "matching_heading":
            headings = instance.metadata.get("headings", []).copy()
            random.shuffle(headings)

            data["headings"] = headings

        # Matching Information
        elif instance.type == "matching_information":
            paragraphs = instance.metadata.get("paragraphs", [])

            data["paragraphs"] = paragraphs

        # Matching Features
        elif instance.type == "matching_features":
            features = instance.metadata.get("features", []).copy()
            random.shuffle(features)

            data["features"] = features

        # Matching Sentence Endings
        elif instance.type == "matching_sentence_endings":
            endings = instance.metadata.get("endings", []).copy()
            random.shuffle(endings)

            data["endings"] = endings

        # Table Completion
        elif instance.type == "table_completion":
            data["table"] = instance.metadata

        # Flow Chart Completion
        elif instance.type == "flow_chart_completion":
            data["flow_chart"] = instance.metadata

        # Summary Completion
        elif instance.type == "summary_completion":
            data["summary"] = instance.metadata

        return data

class QuestionGroupListeningPremiumSerializer(serializers.ModelSerializer):
    questions_listening = QuestionListeningPremiumSerializer(
        source='questions',
        many=True,
        read_only=True
    )
    class Meta:
        model = QuestionGroupListeningPremium
        fields = ['id_question_listening_premium_group', 'exercise_listening_premium', 'title', 'instruction', 'type', 'metadata', 'order_no', 'questions_listening']
        read_only_fields = ['created_at', 'updated_at']

class ExerciseListeningPremiumSerializer(serializers.ModelSerializer):
    question_groups = QuestionGroupListeningPremiumSerializer(
        source='question_listening_exercise_groups',
        many=True,
        read_only=True
    )
    class Meta:
        model = ExerciseListeningPremium
        fields = ['id_listening_exercise', 'name', 'description', 'icon', 'xp_receive', 'balance_learn', 'type',
                  'difficulty', 'time_limit', 'points', 'question_count', 'question_groups', 'listening']
        read_only_fields = ['created_at', 'updated_at']

class ListeningSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField(read_only=True)
    exercise_listening_premium = ExerciseListeningPremiumSerializer(
        source='exercise_listening',
        many=True,
        read_only=True
    )
    class Meta:
        model = Listening
        fields = ['id_listening', 'title', 'description', 'audio_path', 'transcript', 'duration', 'level', 'img_path', 'options', 'exercise_listening_premium']
        read_only_fields = ['created_at', 'updated_at']

    def get_options(self, obj):
        options = Level.objects.filter(id_level=obj.level_id)
        return LevelSerializer(options, many=True).data