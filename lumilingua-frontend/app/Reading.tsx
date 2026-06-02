// app/reading.tsx

import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';

const lessons = [
    {
        id: 1,
        title: 'Daily Routine',
        description:
            'Learn vocabulary and common expressions used in daily life.',
        image:
            'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800',
        level: 'A1',
        xp: 10,
        completed: true,
    },
    {
        id: 2,
        title: 'My Hometown',
        description:
            'Practice reading texts about cities, culture and local life.',
        image:
            'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
        level: 'A1',
        xp: 15,
        completed: true,
    },
    {
        id: 3,
        title: 'Technology Today',
        description:
            'Discover modern technology and its impact on society.',
        image:
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
        level: 'A2',
        xp: 20,
        completed: false,
    },
    {
        id: 4,
        title: 'Climate Change',
        description:
            'Understand environmental issues and global warming.',
        image:
            'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800',
        level: 'B1',
        xp: 25,
        completed: false,
    },
    {
        id: 5,
        title: 'Future Careers',
        description:
            'Explore future jobs and career opportunities.',
        image:
            'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
        level: 'B1',
        xp: 30,
        completed: false,
    },
];

export default function ReadingScreen() {
    const [filter, setFilter] = useState<
        'all' | 'completed' | 'uncompleted'
    >('all');

    const [searchText, setSearchText] = useState('');

    const [levelFilter, setLevelFilter] = useState<
        'ALL' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
    >('ALL');

    const { width } = useWindowDimensions();

    const filteredLessons = lessons.filter((item) => {
        if (filter === 'completed' && !item.completed) {
            return false;
        }

        if (filter === 'uncompleted' && item.completed) {
            return false;
        }

        if (
            levelFilter !== 'ALL' &&
            item.level !== levelFilter
        ) {
            return false;
        }

        if (
            !item.title
                .toLowerCase()
                .includes(searchText.toLowerCase())
        ) {
            return false;
        }

        return true;
    });

    const completedCount = lessons.filter(
        (item) => item.completed
    ).length;

    const progress =
        (completedCount / lessons.length) * 100;

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Reading',
                    headerTintColor: 'black',
                    headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={28} color="black" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.content}
                >
                    {/* PROGRESS */}
                    <View style={styles.progressCard}>
                        <Text style={styles.progressTitle}>
                            Weekly Progress
                        </Text>

                        <Text style={styles.progressText}>
                            {completedCount} / {lessons.length} lessons completed
                        </Text>

                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${progress}%`,
                                    },
                                ]}
                            />
                        </View>

                        <Text style={styles.xpText}>
                            ⭐ {lessons.reduce((sum, lesson) =>
                                lesson.completed
                                    ? sum + lesson.xp
                                    : sum,
                                0
                            )}{' '}
                            XP Earned
                        </Text>
                    </View>

                    {/* FILTER */}

                    <View style={styles.searchContainer}>
                        <TextInput
                            placeholder="Search lesson..."
                            placeholderTextColor="#9CA3AF"
                            value={searchText}
                            onChangeText={setSearchText}
                            style={styles.searchInput}
                        />
                    </View>

                    <View style={styles.filterContainer}>
                        <TouchableOpacity
                            style={[
                                styles.filterBtn,
                                filter === 'all' &&
                                styles.filterActive,
                            ]}
                            onPress={() =>
                                setFilter('all')
                            }
                        >
                            <Text
                                style={
                                    filter === 'all'
                                        ? styles.filterTextActive
                                        : styles.filterText
                                }
                            >
                                All
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.filterBtn,
                                filter === 'completed' &&
                                styles.filterActive,
                            ]}
                            onPress={() =>
                                setFilter('completed')
                            }
                        >
                            <Text
                                style={
                                    filter === 'completed'
                                        ? styles.filterTextActive
                                        : styles.filterText
                                }
                            >
                                Completed
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.filterBtn,
                                filter === 'uncompleted' &&
                                styles.filterActive,
                            ]}
                            onPress={() =>
                                setFilter('uncompleted')
                            }
                        >
                            <Text
                                style={
                                    filter === 'uncompleted'
                                        ? styles.filterTextActive
                                        : styles.filterText
                                }
                            >
                                Not Started
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.levelContainer}
                    >
                        {['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => (
                            <TouchableOpacity
                                key={level}
                                style={[
                                    styles.levelBtn,
                                    levelFilter === level &&
                                    styles.levelBtnActive,
                                ]}
                                onPress={() =>
                                    setLevelFilter(
                                        level as
                                        | 'ALL'
                                        | 'A1'
                                        | 'A2'
                                        | 'B1'
                                        | 'B2'
                                        | 'C1'
                                        | 'C1'
                                    )
                                }
                            >
                                <Text
                                    style={
                                        levelFilter === level
                                            ? styles.levelTextActive
                                            : styles.levelText
                                    }
                                >
                                    {level}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* LESSONS */}

                    <Text style={styles.sectionTitle}>
                        Reading Lessons
                    </Text>

                    {filteredLessons.map((lesson) => (
                        <TouchableOpacity
                            key={lesson.id}
                            activeOpacity={0.9}
                            style={styles.lessonCard}
                        >
                            <Image
                                source={{
                                    uri: lesson.image,
                                }}
                                style={[
                                    styles.lessonImage,
                                    {
                                        width: width - 40,
                                    },
                                ]}
                            />

                            <View
                                style={
                                    styles.lessonContent
                                }
                            >
                                <View
                                    style={
                                        styles.badgeRow
                                    }
                                >
                                    <View
                                        style={
                                            styles.levelBadge
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.levelBadgeText
                                            }
                                        >
                                            {lesson.level}
                                        </Text>
                                    </View>

                                    <View
                                        style={
                                            styles.xpBadge
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.xpBadgeText
                                            }
                                        >
                                            ⭐ {lesson.xp}
                                        </Text>
                                    </View>
                                </View>

                                <Text
                                    style={
                                        styles.lessonTitle
                                    }
                                >
                                    {lesson.title}
                                </Text>

                                <Text
                                    style={
                                        styles.lessonDescription
                                    }
                                >
                                    {
                                        lesson.description
                                    }
                                </Text>

                                {lesson.completed ? (
                                    <View
                                        style={
                                            styles.completedBadge
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.completedText
                                            }
                                        >
                                            ✓ Completed
                                        </Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        style={
                                            styles.startButton
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.startButtonText
                                            }
                                        >
                                            Start Lesson
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FF',
    },

    content: {
        padding: 20,
        paddingBottom: 50,
    },

    header: {
        marginBottom: 24,
    },

    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#111827',
    },

    subtitle: {
        marginTop: 6,
        color: '#6B7280',
        fontSize: 15,
    },

    progressCard: {
        backgroundColor: '#ff6200',
        padding: 20,
        borderRadius: 24,
        marginBottom: 24,
    },

    progressTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
    },

    progressText: {
        color: '#fff',
        marginTop: 8,
    },

    progressBar: {
        marginTop: 15,
        height: 10,
        borderRadius: 999,
        backgroundColor:
            'rgba(255,255,255,0.3)',
        overflow: 'hidden',
    },

    progressFill: {
        height: '100%',
        backgroundColor: '#fff',
    },

    xpText: {
        color: '#fff',
        marginTop: 12,
        fontWeight: '700',
    },

    filterContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },

    filterBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
    },

    filterActive: {
        backgroundColor: '#ff6200',
    },

    filterText: {
        color: '#6B7280',
        fontWeight: '600',
    },

    filterTextActive: {
        color: '#fff',
        fontWeight: '700',
    },

    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 15,
        color: '#111827',
    },

    lessonCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 20,
    },

    lessonImage: {
        height: 190,
    },

    lessonContent: {
        padding: 18,
    },

    badgeRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },

    levelBadge: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 12,
        marginRight: 8,
    },

    levelBadgeText: {
        color: '#ff7b00',
        fontWeight: '700',
    },

    xpBadge: {
        backgroundColor: '#FFF4E5',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 12,
    },

    xpBadgeText: {
        color: '#02d169',
        fontWeight: '700',
    },

    lessonTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
    },

    lessonDescription: {
        marginTop: 8,
        color: '#6B7280',
        lineHeight: 22,
    },

    completedBadge: {
        marginTop: 15,
        alignSelf: 'flex-start',
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
    },

    completedText: {
        color: '#16A34A',
        fontWeight: '700',
    },

    startButton: {
        marginTop: 15,
        backgroundColor: '#ff7b00',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
    },

    startButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
    searchContainer: {
        marginBottom: 20,
    },

    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 18,
        paddingVertical: 14,
        fontSize: 16,
    },

    levelContainer: {
        marginBottom: 20,
    },

    levelBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
    },

    levelBtnActive: {
        backgroundColor: '#FF9500',
    },

    levelText: {
        color: '#6B7280',
        fontWeight: '600',
    },

    levelTextActive: {
        color: '#fff',
        fontWeight: '700',
    },
});