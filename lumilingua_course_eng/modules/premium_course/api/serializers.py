from rest_framework import serializers

from modules.premium_course.models import Reading, SaveVocabularyReading, QuestionOptionsPremium, \
    ExerciseReadingPremium, ExerciseProgressReadingPremium


class ReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reading
        fields = ['id_reading', 'title', 'content', 'mean_content', 'img_path', 'level']
        read_only_fields = ['created_at', 'updated_at']

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
    class Meta:
        model = QuestionOptionsPremium
        fields = ['id_question_premium', 'exercise_reading_premium', 'content', 'type', 'words', 'metadata', 'correct_answer', 'points', 'image_url']
        read_only_fields = ['created_at', 'updated_at']

class QuestionOptionPremiumSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOptionsPremium
        fields = ['id_question_premium_option', 'question_premium', 'content', 'is_correct']
        read_only_fields = ['created_at', 'updated_at']