import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { ListeningItem } from '@/interfaces/interfaces';
import { getClientEndpoint } from '@/constants/configApi';
import Loading from '@/component/loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getCrmsEndpoint } from '@/constants/configApi';
import { useUserCache } from '@/hook/useUserCache';
import { getProgressListeningPremium } from '@/services/apiLearn';
import { PieChart } from "react-native-gifted-charts";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function ListeningScreen() {
    const [selectedSlice, setSelectedSlice] = useState({
        label: 'Avg Score',
        value: '0',
        color: '#ff6200',
    });
    const [lessons, setLessons] = useState<ListeningItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<
        'all' | 'completed' | 'uncompleted'
    >('all');
    const { cache: userCache, loadingCache, cacheError } = useUserCache();
    const router = useRouter();
    const [loadingLogin, setLoadingLogin] = useState(true);

    const [searchText, setSearchText] = useState('');

    const [levelFilter, setLevelFilter] = useState<
        'ALL' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
    >('ALL');


    const { width } = useWindowDimensions();

    const refreshTokenApi = async (refreshToken: string) => {
        const endpoint = getCrmsEndpoint('v1/user/refresh');

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                refreshToken,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.notification);
        }

        return await response.json();
    };

    const loadListening = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                getClientEndpoint('listening/')
            );

            const data = await response.json();

            setLessons(data || []);
        } catch (err) {
            console.log('Load listening error:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadData = async () => {
        if (!userCache?.[0]?.id_user_cache) return;

        try {
            setLoading(true);

            const [listeningData, progressData] =
                await Promise.all([
                    fetch(
                        getClientEndpoint('listening/')
                    ).then(res => res.json()),
                    getProgressListeningPremium(
                        userCache[0].id_user_cache
                    )
                ]);

            const lessonsWithProgress =
                listeningData.map((lesson: any) => {

                    const exerciseId =
                        lesson.exercise_listening_premium?.[0]
                            ?.id_listening_exercise;

                    const progress =
                        progressData.find(
                            (p: any) =>
                                p.exercises === exerciseId
                        );
                    return {
                        ...lesson,
                        completed: progress?.is_completed ?? false,
                        score: progress ? progress.score : null,
                        attempts: progress ? progress.attempts : null,
                        completedAt: progress ? progress.completed_at : null,
                    };
                });

            setLessons(lessonsWithProgress);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('token');
            const expiredStr = await AsyncStorage.getItem('expired');

            const expired = expiredStr ? parseInt(expiredStr, 10) : null;

            if (token && expired && Date.now() < expired) {
                if (isMounted) {
                    setLoadingLogin(false);
                }
                return;
            }

            const refreshToken =
                await AsyncStorage.getItem(
                    'refreshToken'
                );

            if (refreshToken) {
                try {
                    const response =
                        await refreshTokenApi(
                            refreshToken
                        );

                    await AsyncStorage.setItem(
                        'token',
                        response.data.token || ''
                    );

                    await AsyncStorage.setItem(
                        'expired',
                        String(
                            response.data.expired ||
                            Date.now() + 900000
                        )
                    );
                } catch (error) {
                    console.log(
                        'Refresh token error:',
                        error
                    );

                    await AsyncStorage.multiRemove([
                        'token',
                        'refreshToken',
                        'expired',
                        'username',
                        'email',
                    ]);

                    router.replace('/Login');
                    return;
                }
            } else {
                router.replace('/Login');
                return;
            }

            if (isMounted) {
                setLoadingLogin(false);
            }
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (loadingLogin) return;

        loadListening();
    }, [loadingLogin]);

    useFocusEffect(
        useCallback(() => {
            if (
                loadingLogin ||
                !userCache?.[0]?.id_user_cache
            ) {
                return;
            }

            loadData();
        }, [loadingLogin, userCache])
    );

    const filteredLessons = lessons.filter((item) => {

        // level
        if (levelFilter !== 'ALL' && item.options?.[0]?.rank !== levelFilter) {
            return false;
        }

        // search
        if (!item.title.toLowerCase().includes(searchText.toLowerCase())) {
            return false;
        }

        // completed filter
        if (filter === 'completed' && !item.completed) {
            return false;
        }

        if (filter === 'uncompleted' && item.completed) {
            return false;
        }

        return true;
    });

    const completedLessons = lessons.filter(
        lesson => 
            lesson.score !== null &&
            lesson.score !== undefined &&
            !isNaN(Number(lesson.score))
    );

    const excellentCount = completedLessons.filter(
        lesson => lesson.score! >= 90
    ).length;

    const goodCount = completedLessons.filter(
        lesson => lesson.score! >= 70 &&
            lesson.score! < 90
    ).length;

    const averageCount = completedLessons.filter(
        lesson => lesson.score! >= 50 &&
            lesson.score! < 70
    ).length;

    const needPracticeCount = completedLessons.filter(
        lesson => lesson.score! < 50
    ).length;

    const averageScore =
        completedLessons.length > 0
            ? (
                completedLessons.reduce(
                    (sum, lesson) => sum + lesson.score!,
                    0
                ) / completedLessons.length
            ).toFixed(1)
            : 'No Data';

    useEffect(() => {
        setSelectedSlice({
            label: 'Avg Score',
            value: String(averageScore),
            color: '#ff6200',
        });
    }, [averageScore]);

    const handleStartLesson = (lesson: any) => {
        router.push({
            pathname: '/course/listening/[id]',
            params: {
                id: lesson.exercise_listening_premium?.[0]?.id_listening_exercise,
                time_limit: lesson.exercise_listening_premium?.[0]?.time_limit,
            },
        });
    };

    // const handleReviewLesson = (lesson: any) => {
    //     router.push({
    //         pathname: '/course/listening/[id]',
    //         params: {
    //             id: lesson.exercise_listening_premium?.[0]?.id_listening_exercise,
    //             time_limit: lesson.exercise_listening_premium?.[0]?.time_limit,
    //             mode: 'review',        // mode review
    //         },
    //     });
    // };

    const chartData = [
        {
            value: excellentCount,
            color: '#3B82F6',
            text: 'Excellent',
            onPress: () =>
                setSelectedSlice({
                    label: 'Excellent',
                    value: `${excellentCount}/${completedLessons.length}`,
                    color: '#3B82F6',
                }),
        },
        {
            value: goodCount,
            color: '#22C55E',
            text: 'Good',
            onPress: () =>
                setSelectedSlice({
                    label: 'Good',
                    value: `${goodCount}/${completedLessons.length}`,
                    color: '#22C55E',
                }),
        },
        {
            value: averageCount,
            color: '#FB923C',
            text: 'Average',
            onPress: () =>
                setSelectedSlice({
                    label: 'Average',
                    value: `${averageCount}/${completedLessons.length}`,
                    color: '#FB923C',
                }),
        },
        {
            value: needPracticeCount,
            color: '#FACC15',
            text: 'Need Practice',
            onPress: () =>
                setSelectedSlice({
                    label: 'Need Practice',
                    value: `${needPracticeCount}/${completedLessons.length}`,
                    color: '#FACC15',
                }),
        }
    ].filter(item => item.value > 0);

    const resetToAverage = () => {
        setSelectedSlice({
            label: 'Avg Score',
            value: String(averageScore),
            color: '#ff6200',
        });
    };

    if (loading || loadingLogin) return <Loading />;

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Listening',
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
                    {/* ANALYTIC */}
                    <View style={styles.analyticsCard}>
                        <Text style={styles.analyticsTitle}>
                            Learning Listening Analytics
                        </Text>

                        <PieChart
                            donut
                            radius={90}
                            innerRadius={55}
                            data={chartData}
                            focusOnPress
                            centerLabelComponent={() => (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={resetToAverage}
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                            color: selectedSlice.color,
                                        }}
                                    >
                                        {selectedSlice.value}
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: '#6B7280',
                                        }}
                                    >
                                        {selectedSlice.label}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />

                        <View style={styles.legendContainer}>
                            <View style={styles.legendItem}>
                                <View
                                    style={[
                                        styles.legendDot,
                                        { backgroundColor: '#3B82F6' }
                                    ]}
                                />
                                <Text>Excellent</Text>
                            </View>

                            <View style={styles.legendItem}>
                                <View
                                    style={[
                                        styles.legendDot,
                                        { backgroundColor: '#22C55E' }
                                    ]}
                                />
                                <Text>Good</Text>
                            </View>

                            <View style={styles.legendItem}>
                                <View
                                    style={[
                                        styles.legendDot,
                                        { backgroundColor: '#FB923C' }
                                    ]}
                                />
                                <Text>Average</Text>
                            </View>

                            <View style={styles.legendItem}>
                                <View
                                    style={[
                                        styles.legendDot,
                                        { backgroundColor: '#FACC15' }
                                    ]}
                                />
                                <Text>Need Practice</Text>
                            </View>
                        </View>

                        <View style={styles.analyticsStats}>
                            <Text>
                                📚 Completed: {completedLessons.length}
                            </Text>

                            <Text>
                                🏆 Avg Score: {averageScore}
                            </Text>
                        </View>
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
                                        | 'C2'
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
                        Listening Lessons
                    </Text>

                    {filteredLessons.map((lesson) => (
                        <TouchableOpacity
                            key={lesson.id_listening}
                            activeOpacity={0.9}
                            style={styles.lessonCard}
                        >
                            <Image
                                source={{
                                    uri: lesson.img_path,
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
                                <View style={styles.badgeRow}>
                                    <View style={styles.levelBadge}>
                                        <Text style={styles.levelBadgeText}>
                                            {lesson.options?.[0]?.rank}
                                        </Text>
                                    </View>

                                    <View style={styles.xpBadge}>
                                        <Text style={styles.xpBadgeText}>
                                            ⭐ {lesson?.exercise_listening_premium?.[0]?.xp_receive}
                                        </Text>
                                    </View>

                                    <View style={styles.targetScore}>
                                        <Text style={styles.targetScoreText}>
                                            🥇 {lesson?.exercise_listening_premium?.[0]?.points}
                                        </Text>
                                    </View>

                                    <View
                                        style={[
                                            styles.statusBadge,
                                            lesson.completed
                                                ? styles.completedStatus
                                                : styles.notCompletedStatus,
                                        ]}
                                    >
                                        <Text style={styles.statusText}>
                                            {lesson.completed
                                                ? '✓ Completed'
                                                : '⏳ Not Started'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.chipRow}>
                                    <View style={styles.chip}>
                                        <Text style={styles.chipText}>
                                            🎯 {lesson.exercise_listening_premium?.[0]?.difficulty}
                                        </Text>
                                    </View>

                                    <View style={styles.chip}>
                                        <Text style={styles.chipText}>
                                            📚 {lesson.exercise_listening_premium?.[0]?.type}
                                        </Text>
                                    </View>

                                    <View style={styles.chip}>
                                        <Text style={styles.chipText}>
                                            ⏱ {lesson.exercise_listening_premium?.[0]?.time_limit / 60} phút
                                        </Text>
                                    </View>

                                    <View style={styles.chip}>
                                        <Text style={styles.chipText}>
                                            ❓ {lesson.exercise_listening_premium?.[0]?.question_count} Questions
                                        </Text>
                                    </View>
                                </View>
                                {lesson.completed && (
                                    <>

                                        <View className="h-px bg-gray-100 my-4" />
                                        <View style={styles.progressChipRow}>
                                            <View
                                                style={[
                                                    styles.chip,
                                                    styles.scoreChip,
                                                ]}
                                            >
                                                <Text style={styles.chipText}>
                                                    🏆 {lesson.score} score
                                                </Text>
                                            </View>

                                            <View
                                                style={[
                                                    styles.chip,
                                                    styles.attemptChip,
                                                ]}
                                            >
                                                <Text style={styles.chipText}>
                                                    🔄 {lesson.attempts} Attempts
                                                </Text>
                                            </View>

                                            <View
                                                style={[
                                                    styles.chip,
                                                    styles.dateChip,
                                                ]}
                                            >
                                                <Text style={styles.chipText}>
                                                    📅 {new Date(
                                                        lesson.completedAt!
                                                    ).toLocaleDateString('vi-VN')}
                                                </Text>
                                            </View>
                                        </View>
                                        <View className="h-px bg-gray-100 my-4" />
                                    </>
                                )}

                                <Text
                                    style={
                                        styles.lessonTitle
                                    }
                                >
                                    {lesson.title}
                                </Text>

                                <Text style={styles.lessonDescription}>
                                    {lesson.description}
                                </Text>

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.mainButton,
                                            lesson.completed && styles.restartButton,
                                        ]}
                                        onPress={() => handleStartLesson(lesson)}
                                    >
                                        <Ionicons 
                                            name={lesson.completed ? "refresh-outline" : "play-circle"} 
                                            size={20} 
                                            color="#fff" 
                                        />
                                        <Text style={styles.mainButtonText}>
                                            {lesson.completed ? "Restart" : "Start Lesson"}
                                        </Text>
                                    </TouchableOpacity>

                                    {/* {lesson.completed && (
                                        <TouchableOpacity
                                            style={styles.reviewButton}
                                            onPress={() => handleReviewLesson(lesson)}
                                        >
                                            <Ionicons name="eye-outline" size={20} color="#fff" />
                                            <Text style={styles.reviewButtonText}>Review</Text>
                                        </TouchableOpacity>
                                    )} */}
                                </View>
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
        marginRight: 8
    },

    xpBadgeText: {
        color: '#01d4e7',
        fontWeight: '700',
    },

    targetScore: {
        backgroundColor: '#f84b5a',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 12,
    },

    targetScoreText: {
        color: '#f3f7f8',
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
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },

    chip: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },

    chipText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 12,
        marginLeft: 8,
    },

    completedStatus: {
        backgroundColor: '#DCFCE7',
    },

    notCompletedStatus: {
        backgroundColor: '#FEE2E2',
    },

    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    restartButton: {
        backgroundColor: '#16A34A',
    },
    progressChipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 10,
    },

    scoreChip: {
        backgroundColor: '#FEF3C7',
    },

    attemptChip: {
        backgroundColor: '#DBEAFE',
    },

    dateChip: {
        backgroundColor: '#DCFCE7',
    },
    analyticsCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        alignItems: 'center',
    },

    analyticsTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
        color: '#111827',
    },

    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },

    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },

    analyticsStats: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
        buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        gap: 12,
    },

    mainButton: {
        flex: 1,
        backgroundColor: '#ff7b00',
        borderRadius: 16,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    reviewButton: {
        flex: 1,
        backgroundColor: '#4F46E5',
        borderRadius: 16,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    mainButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15.5,
    },

    reviewButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15.5,
    },
});