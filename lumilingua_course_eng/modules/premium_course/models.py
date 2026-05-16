from django.db import models
from django.core.exceptions import ValidationError


def validate_exercise_type(value):
    valid_types = ['multiple_choice', 'sentence_order', 'matching', 'fill_blank', 'all']
    if value not in valid_types:
        raise ValidationError(f'Type must be one of: {", ".join(valid_types)}')

def validate_difficulty(value):
    valid_diff = ['easy', 'medium', 'hard']
    if value and value not in valid_diff:
        raise ValidationError(f'Difficulty must be one of: {", ".join(valid_diff)}')

class ExerciseProgressReadingPremium(models.Model):
    id_exercise_progress = models.AutoField(primary_key=True)
    user_cache = models.ForeignKey(
        'progress.UserCache',
        on_delete=models.CASCADE,
        db_column='id_user_cache',
        related_name='user_exercise_progress_premium',
        to_field = 'id_user_cache',
    )
    exercises = models.ForeignKey(
        'ExerciseReadingPremium',
        on_delete=models.CASCADE,
        db_column='id_reading_exercise',
        related_name='progress_exercise_premium'
    )
    score = models.IntegerField(default=0)
    attempts = models.IntegerField(default=1)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tbl_exercises_progress_reading_premium"
        managed = False

class ExerciseReadingPremium(models.Model):
    id_reading_exercise = models.AutoField(primary_key=True)
    name = models.TextField()
    description = models.TextField()
    icon = models.TextField()
    xp_receive = models.IntegerField()
    balance_learn = models.IntegerField()
    type = models.CharField(
        max_length=50,
        validators=[validate_exercise_type],
        help_text="Type exercise: multiple_choice, sentence_order, matching, fill_blank, all",
        null=False,
        blank=False
    )
    difficulty = models.CharField(
        max_length=20,
        validators=[validate_difficulty],
        help_text="Difficulty: easy, medium, hard",
        blank=False,
        null=False,
    )
    reading = models.ForeignKey(
        'Reading',
        on_delete=models.CASCADE,
        db_column='id_reading',
        to_field='id_reading',
        related_name='exercise_reading'
    )
    time_limit = models.IntegerField()
    points = models.IntegerField(default=0)
    question_count = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tbl_exercises_reading_premium"
        managed = False

class SaveVocabularyReading(models.Model):
    id_vocabulary_reading = models.AutoField(primary_key=True)
    word = models.TextField()
    meaning = models.TextField()
    user_cache = models.ForeignKey(
        'progress.UserCache',
        on_delete=models.CASCADE,
        db_column='id_user_cache',
        to_field='id_user_cache',
        related_name='user_save_vocabulary'
    )
    reading = models.ForeignKey(
        'Reading',
        on_delete=models.CASCADE,
        db_column='id_reading',
        related_name='reading_vocabulary'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = "tbl_save_reading_vocabulary"
        managed = False
        ordering = ['word']
        constraints = [
            models.UniqueConstraint(fields=['user_cache', 'word', 'reading'], name='unique_user_word_reading')
        ]

class Reading(models.Model):
    id_reading = models.AutoField(primary_key=True)
    title = models.TextField()
    content = models.TextField()
    mean_content = models.TextField()
    level = models.ForeignKey(
        'course.Level',
        on_delete=models.CASCADE,
        db_column='id_level',
        to_field='id_level',
        related_name='reading_level'
    )
    img_path = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tbl_reading"
        managed = False
        ordering = ['title']
        indexes = [
            models.Index(fields=['title'], name='idx_title'),
        ]
        constraints = [
            models.UniqueConstraint(fields=['title'], name='unique_title')
        ]