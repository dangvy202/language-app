import django_filters
from modules.course.models import Vocabulary


class VocabularyFilter(django_filters.FilterSet):
    topic = django_filters.CharFilter(method='filter_topic')

    class Meta:
        model = Vocabulary
        fields = ['level', 'topic']

    def filter_topic(self, queryset, name, value):
        if value.isdigit():
            return queryset.filter(topic_id=int(value))
        return queryset.filter(topic__name_topic__iexact=value)
