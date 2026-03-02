from django.core.exceptions import ValidationError
from django.db import models

def validate_exercise_type(value):
    valid_types = ['multiple_choice', 'sentence_order', 'matching', 'fill_blank', 'all']
    if value not in valid_types:
        raise ValidationError(f'Type must be one of: {", ".join(valid_types)}')

def validate_question_type(value):
    valid_types = ['multiple_choice', 'sentence_order', 'matching', 'fill_blank']
    if value not in valid_types:
        raise ValidationError(f'Type must be one of: {", ".join(valid_types)}')

def validate_difficulty(value):
    valid_diff = ['easy', 'medium', 'hard']
    if value and value not in valid_diff:
        raise ValidationError(f'Difficulty must be one of: {", ".join(valid_diff)}')

class Exercise(models.Model):
    id_exercise = models.AutoField(primary_key=True)
    name = models.TextField()
    description = models.TextField()
    icon = models.TextField()
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
    topic = models.ForeignKey(
        'course.Topic',
        on_delete=models.CASCADE,
        db_column='id_topic',
        related_name='exercise_topic'
    )
    time_limit = models.IntegerField()
    points = models.IntegerField(default=0)
    question_count = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tbl_exercises"
        managed = False

class ExerciseProgress(models.Model):
    id_exercise_progress = models.AutoField(primary_key=True)
    user_cache = models.ForeignKey(
        'progress.UserCache',
        on_delete=models.CASCADE,
        db_column='id_user_cache',
        related_name='user_exercise'
    )
    exercises = models.ForeignKey(
        'Exercise',
        on_delete=models.CASCADE,
        db_column='id_exercise',
        related_name='progress_exercise'
    )
    score = models.IntegerField(default=0)
    attempts = models.IntegerField(default=1)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tbl_exercises_progress"
        managed = False

class Question(models.Model):
    id_question = models.AutoField(primary_key=True)
    exercise = models.ForeignKey(
        'Exercise',
        on_delete=models.CASCADE,
        db_column='id_exercise',
        related_name='question_exercise'
    )
    content = models.TextField(null=False, blank=False)
    type = models.CharField(
        max_length=50,
        validators=[validate_question_type],
        help_text="Type exercise: multiple_choice, sentence_order, matching, fill_blank",
        null=False,
        blank=False
    )
    words = models.JSONField(
        null=True,
        blank=True,
        default=list,
        help_text="User sort order: (example['element 1', 'element 2',...])"
    )
    metadata = models.JSONField(
        null=True,
        blank=True,
        default=list,
        help_text='{"pairs":[{ "id": 1, "left": "Dog", "right": "Chó" },{ "id": 2, "left": "Cat", "right": "Mèo" },{ "id": 3, "left": "Bird", "right": "Chim" }]}'
    )
    correct_answer = models.TextField(null=True, blank=False)
    points = models.IntegerField(default=0)
    image_url = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tbl_questions"
        managed = False

class QuestionOptions(models.Model):
    id_question_option = models.AutoField(primary_key=True)
    question = models.ForeignKey(
        'Question',
        on_delete=models.CASCADE,
        db_column='id_question',
        related_name='question_option'
    )
    content = models.TextField(null=False, blank=False)
    is_correct = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tbl_question_options"
        managed = False



