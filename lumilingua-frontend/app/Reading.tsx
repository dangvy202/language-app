import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { ReadingItem } from '@/interfaces/interfaces';
import { getClientEndpoint } from '@/constants/configApi';
import Loading from '@/component/loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getCrmsEndpoint } from '@/constants/configApi';

export default function ReadingScreen() {
    const [lessons, setLessons] = useState<ReadingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<
        'all' | 'completed' | 'uncompleted'
    >('all');
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

    const loadReading = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                getClientEndpoint('reading/')
            );

            const data = await response.json();

            setLessons(data || []);
        } catch (err) {
            console.log('Load reading error:', err);
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

            // token còn hạn
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

            // refresh token
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

        loadReading();
    }, [loadingLogin]);

    const filteredLessons = lessons.filter((item) => {
    if (
        levelFilter !== 'ALL' &&
        item.options?.[0]?.rank !== levelFilter
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

    const completedCount = 0

    const progress =
        (completedCount / lessons.length) * 100;

    if (loading || loadingLogin) return <Loading />;

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
                            ⭐ 0
                            {/* {lessons.reduce((sum, lesson) =>
                                lesson.completed
                                    ? sum + lesson.xp
                                    : sum,
                                0
                            )}{' '} */}
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
                        Reading Lessons
                    </Text>

                    {filteredLessons.map((lesson) => (
                        <TouchableOpacity
                            key={lesson.id_reading}
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
                                            {lesson.options?.[0]?.rank}
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
                                            ⭐ 10
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

                                <Text style={styles.lessonDescription}>
                                    {lesson.content.slice(0, 120)}...
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
        color: '#01d4e7',
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