from rest_framework import serializers

from modules.premium_course.models import Reading


class ReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reading
        fields = ['id_reading', 'title', 'content', 'mean_content', 'img_path', 'level']
        read_only_fields = ['created_at', 'updated_at']