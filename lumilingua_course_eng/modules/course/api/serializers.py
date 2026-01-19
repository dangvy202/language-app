from rest_framework import serializers
from ..models import Level

class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        # fields = "__all__"
        fields = ['id_level', 'rank', 'level_name', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']