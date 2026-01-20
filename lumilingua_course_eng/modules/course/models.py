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