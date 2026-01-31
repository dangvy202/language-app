from django.db import models

class Level(models.Model):
    id_level = models.AutoField(primary_key=True)
    rank = models.CharField(max_length=10, unique=True)
    level_name = models.CharField(max_length=100)
    description = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tbl_level"
        managed = False
        ordering = ['rank']
        indexes = [
            models.Index(fields=['rank'], name='idx_level_rank'),
        ]
        constraints = [
            models.UniqueConstraint(fields=['rank'], name='unique_rank_level_name'),
        ]

class Topic(models.Model):
    id_topic = models.AutoField(primary_key=True)
    name_topic = models.TextField()
    icon = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tbl_topic"
        managed = False
        ordering = ['name_topic']
        indexes = [
            models.Index(fields=['name_topic'], name='idx_name_topic'),
        ]
        constraints = [
            models.UniqueConstraint(fields=['name_topic'], name='unique_name_topic')
        ]

class Vocabulary(models.Model):
    id_vocabulary = models.AutoField(primary_key=True)
    name_vocabulary = models.CharField(max_length=255)
    ipa = models.CharField(max_length=255)
    img_path = models.ImageField(upload_to='vocabulary/',null=True,blank=True)
    level = models.ForeignKey(
        'Level',
        on_delete=models.CASCADE,
        db_column='id_level',
        related_name = 'vocabularies'
    )
    topic = models.ForeignKey(
        'Topic',
        on_delete=models.CASCADE,
        db_column='id_topic',
        related_name='vocabularies'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tbl_vocabulary'
        managed = False
        ordering = ['name_vocabulary']
        constraints = [
            models.UniqueConstraint(fields=['name_vocabulary'], name='unique_name_vocabulary')
        ]

class Language(models.Model):
    id_language = models.AutoField(primary_key=True)
    language_code = models.CharField(max_length=10)
    name_language = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tbl_language'
        managed = False
        ordering = ['language_code']
        constraints = [
            models.UniqueConstraint(fields=['language_code', 'name_language'], name='unique_language_code_name')
        ]

class Mean(models.Model):
    id_mean = models.AutoField(primary_key=True)
    mean_vocabulary = models.CharField(max_length=255)
    example_vocabulary = models.TextField()
    vocabulary = models.ForeignKey(
        'Vocabulary',
        on_delete=models.CASCADE,
        db_column='id_vocabulary',
        related_name='means'
    )
    language = models.ForeignKey(
        'Language',
        on_delete=models.CASCADE,
        db_column='id_language',
        related_name='means'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tbl_mean'
        managed = False
        ordering = ['mean_vocabulary']
