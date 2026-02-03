from django.db import models

class UserCache(models.Model):
    id_user_cache = models.AutoField(primary_key=True)
    streak = models.IntegerField(default=0)
    id_user = models.IntegerField(null=False,blank=False)
    email = models.CharField(max_length=255,null=False,blank=False)
    phone = models.CharField(max_length=255,null=False,blank=False)
    last_login = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tbl_user_cache"
        managed = False
        constraints = [
            models.UniqueConstraint(fields=['id_user'], name='unique_id_user'),
            models.UniqueConstraint(fields=['email'], name='unique_email'),
            models.UniqueConstraint(fields=['phone'], name='unique_phone')
        ]

class HistoryProgress(models.Model):
    id_history_progress = models.AutoField(primary_key=True)
    isFinished = models.BooleanField(default=False)
    finished_date = models.DateTimeField(null=True, blank=True)
    duration = models.DurationField(null=True, blank=True)
    user_cache = models.ForeignKey(
        'UserCache',
        on_delete=models.CASCADE,
        db_column='id_user_cache',
        related_name='user_learn'
    )
    topic = models.ForeignKey(
        'course.Topic',
        on_delete=models.CASCADE,
        db_column='id_topic',
        related_name='history_topic'
    )
    id_vocabulary_progress = models.IntegerField(default=0, null=False, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tbl_history_progress"
        managed = False
        constraints = [
            models.UniqueConstraint(fields=['user_cache', 'topic'], name='unique_history_user_topic')
        ]

class UserNote(models.Model):
    id_note = models.AutoField(primary_key=True)
    content_note = models.TextField()
    description_note = models.TextField()
    user_cache = models.ForeignKey(
        'UserCache',
        on_delete=models.CASCADE,
        db_column='id_user_cache',
        related_name='user_notes'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tbl_user_note"
        managed = False

class Certificate(models.Model):
    id_certificate = models.AutoField(primary_key=True)
    name_certificate = models.TextField()
    description_certificate = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tbl_certificate"
        managed = False
        constraints = [
            models.UniqueConstraint(fields=['name_certificate'], name='unique_name_certificate')
        ]

class CertificateCache(models.Model):
    id_certificate_cache = models.AutoField(primary_key=True)
    received_date = models.DateTimeField(null=False, blank=False,)
    user_cache = models.ForeignKey(
        'UserCache',
        on_delete=models.CASCADE,
        db_column='id_user_cache',
        related_name='user_certificate_caches'
    )
    certificate = models.ForeignKey(
        'Certificate',
        on_delete=models.CASCADE,
        db_column='id_certificate',
        related_name='certificate_caches'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tbl_certificate_cache'
        managed = False
        constraints = [
            models.UniqueConstraint(fields=['user_cache', 'certificate'], name='unique_user_certificate')
        ]