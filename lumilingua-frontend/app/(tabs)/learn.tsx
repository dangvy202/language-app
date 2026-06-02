import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image as ExpoImage } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Image, Modal, Pressable, SafeAreaView,
    ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';

import { getCrmsEndpoint, getCrmsImgEndpoint } from '@/constants/configApi';
import { useUserCache } from '@/hook/useUserCache';
import { fetchUserProfile, getLevelByCategoryId, getRankByUserId } from '@/services/api';
import { completeGoal, getGoals, saveGoals } from '@/services/apiLearn';
import { Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

const skills = [
    {
        title: 'Reading',
        subtitle: 'Improve your reading comprehension',
        lessons: '12 lessons',
        icon: '📖',
        color: '#DFF8E8',
    },
    {
        title: 'Listening',
        subtitle: 'Train your listening and understanding',
        lessons: '10 lessons',
        icon: '🎧',
        color: '#E3F0FF',
    },
    {
        title: 'Writing',
        subtitle: 'Practice your writing and grammar',
        lessons: '8 lessons',
        icon: '✍️',
        color: '#EEE5FF',
    },
    {
        title: 'Speaking',
        subtitle: 'Practice speaking and pronunciation',
        lessons: '10 lessons',
        icon: '🎙️',
        color: '#FFF0DD',
    },
];

export default function Learn() {
    const [inProgressGoals, setInProgressGoals] = useState<any[]>([]);
    const [finishedGoals, setFinishedGoals] = useState<any[]>([]);
    const [goals, setGoals] = useState<any[]>([]);
    const [loadingGoals, setLoadingGoals] = useState(false);
    const [editingGoal, setEditingGoal] = useState<any>(null);
    const [description, setDescription] = useState('');
    const [goalReading, setGoalReading] = useState('');
    const [goalListening, setGoalListening] = useState('');
    const [goalWriting, setGoalWriting] = useState('');
    const [goalSpeaking, setGoalSpeaking] = useState('');
    const [goalXp, setGoalXp] = useState('');
    const [goalModalVisible, setGoalModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<
        'progress' | 'finished' | 'add'
    >('progress');
    const [userProfile, setUserProfile] = useState<any>(null);
    const [categoryLevel, setCategoryLevel] = useState<any>(null);
    const [rank, setRank] = useState<any>(null);

    const { cache: userCache } = useUserCache();

    const refreshTokenApi = async (refreshToken: string) => {
        const endpoint = getCrmsEndpoint('v1/user/refresh');

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.notification);
        }

        return await response.json();
    };


    useEffect(() => {
        const init = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const expiredStr = await AsyncStorage.getItem('expired');

                const expired = expiredStr
                    ? parseInt(expiredStr, 10)
                    : null;

                if (!(token && expired && Date.now() < expired)) {
                    const refreshToken = await AsyncStorage.getItem(
                        'refreshToken'
                    );

                    if (refreshToken) {
                        try {
                            const res = await refreshTokenApi(refreshToken);

                            await AsyncStorage.setItem(
                                'token',
                                res.data.token || ''
                            );

                            await AsyncStorage.setItem(
                                'expired',
                                String(
                                    res.data.expired ||
                                    Date.now() + 900000
                                )
                            );
                        } catch (err) {
                            await AsyncStorage.multiRemove([
                                'token',
                                'refreshToken',
                                'expired',
                            ]);

                            router.replace('/Login');
                            return;
                        }
                    } else {
                        router.replace('/Login');
                        return;
                    }
                }

                const profile = await fetchUserProfile();
                setUserProfile(profile);

                if (userCache && userCache.length > 0) {
                    const categoryId = userCache[0].category_level;
                    const userId = userCache[0].id_user_cache;

                    const [levelData, rankData] = await Promise.all([
                        getLevelByCategoryId(categoryId),
                        getRankByUserId(userId),
                    ]);

                    setCategoryLevel(levelData);
                    setRank(rankData);
                }
            } catch (err) {
                console.log(err);

                router.replace('/Login');
            }
        };

        init();
    }, [userCache]);

    const saveGoal = async () => {
        try {
            const data = await saveGoals({
                description: description.trim(),
                goal_reading: parseInt(goalReading),
                goal_listening: parseInt(goalListening),
                goal_writing: parseInt(goalWriting),
                goal_speaking: parseInt(goalSpeaking),
                goal_xp: parseInt(goalXp),
                user_cache: parseInt(userCache[0].id_user_cache)
            });
            if (data.id_goal) {

                Alert.alert("Success", "Save goal successful");
                await loadGoals();
                setActiveTab('progress');
                setGoalModalVisible(false);

                // Reset form
                setDescription('');
                setGoalReading('');
                setGoalListening('');
                setGoalWriting('');
                setGoalSpeaking('');
                setGoalXp('');
                setEditingGoal(null);
            } else {
                Alert.alert("Fail", data.notification);
            }
        } catch (error) {
            Alert.alert("Fail", "Cannot save goals on server");
        }
    };

    const handleEditGoal = (goal: any) => {
        setEditingGoal(goal);

        setDescription(goal.description || '');

        setGoalReading(
            String(goal.goal_reading || 0)
        );

        setGoalListening(
            String(goal.goal_listening || 0)
        );

        setGoalWriting(
            String(goal.goal_writing || 0)
        );

        setGoalSpeaking(
            String(goal.goal_speaking || 0)
        );

        setGoalXp(
            String(goal.goal_xp || 0)
        );

        setActiveTab('add');
    };

    const loadGoals = async () => {
        if (!userCache?.[0]?.id_user_cache) return;

        try {
            setLoadingGoals(true);

            const userId = userCache[0].id_user_cache;

            const [progressData, finishedData] = await Promise.all([
                getGoals(userId, false),
                getGoals(userId, true),
            ]);

            setInProgressGoals(progressData);
            setFinishedGoals(finishedData);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingGoals(false);
        }
    };

    useEffect(() => {
        loadGoals();
    }, [userCache]);

    const isGoalReached = (goal: any) => {
        return (
            goal.actual_reading >= goal.goal_reading &&
            goal.actual_listening >= goal.goal_listening &&
            goal.actual_writing >= goal.goal_writing &&
            goal.actual_speaking >= goal.goal_speaking &&
            goal.actual_xp >= goal.goal_xp
        );
    };

    const handleDoneGoal = async (goal: any) => {
        try {
            await completeGoal(goal.id_goal);

            Alert.alert('Success', 'Goal completed');

            loadGoals();
        } catch (error) {
            Alert.alert('Error', 'Cannot complete goal');
        }
    };

    const calculateProgress = (goal: any) => {
        if (!goal) return 0;

        const reading =
            goal.goal_reading > 0
                ? Math.min(goal.actual_reading / goal.goal_reading, 1)
                : 1;

        const listening =
            goal.goal_listening > 0
                ? Math.min(goal.actual_listening / goal.goal_listening, 1)
                : 1;

        const writing =
            goal.goal_writing > 0
                ? Math.min(goal.actual_writing / goal.goal_writing, 1)
                : 1;

        const speaking =
            goal.goal_speaking > 0
                ? Math.min(goal.actual_speaking / goal.goal_speaking, 1)
                : 1;

        const xp =
            goal.goal_xp > 0
                ? Math.min(goal.actual_xp / goal.goal_xp, 1)
                : 1;

        return (
            ((reading + listening + writing + speaking + xp) / 5) *
            100
        );
    };

    const currentGoal = inProgressGoals?.[0];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        {userProfile?.avatar ? (
                            <ExpoImage
                                source={{
                                    uri: getCrmsImgEndpoint(`avatars/${userProfile.avatar}`),
                                }}
                                style={styles.avatar}
                            />
                        ) : (
                            <View
                                style={[
                                    styles.avatar,
                                    {
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#E5E7EB',
                                    },
                                ]}
                            >
                                <Text style={{ fontSize: 24 }}>👤</Text>
                            </View>
                        )}

                        <View>
                            <Text style={styles.helloText}>
                                Hi, {userProfile?.username || 'User'} 👋
                            </Text>

                            <Text style={styles.subText}>
                                Let's improve your English skills
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.bell}>🔔</Text>
                </View>

                {/* XP Card */}
                <View style={styles.xpCard}>
                    <View style={styles.xpTop}>
                        <View>
                            <Text style={styles.xpLabel}>YOUR LEVEL</Text>
                            <Text style={styles.level}>
                                {categoryLevel?.[0]?.level || 'A1'}
                            </Text>

                            <Text style={styles.levelSub}>
                                {categoryLevel?.[0]?.description || 'Beginner'}
                            </Text>
                        </View>

                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.xpLabel}>XP HAVE</Text>
                            <Text style={styles.xpNumber}>
                                {rank?.gain_xp || 0}
                            </Text>

                            <Text style={styles.levelSub}>
                                Rank #{rank?.rank || 0}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Goal */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Today's Goal</Text>

                        <TouchableOpacity
                            onPress={() => setGoalModalVisible(true)}
                        >
                            <Text style={styles.linkText}>Edit Goal</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.goalCard}
                        onPress={() => setGoalModalVisible(true)}
                    >
                        <View style={styles.goalRow}>
                            <View style={styles.goalIcon}>
                                <Text style={{ fontSize: 28 }}>🎯</Text>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.goalTitle}>
                                    Complete Goal
                                </Text>

                                {currentGoal ? (
                                    <>
                                        <Text style={styles.goalSubtitle}>
                                            {currentGoal?.description || 'No active goal'}
                                        </Text>
                                    </>
                                ) : (
                                    <Text style={styles.goalSubtitle}>
                                        Create your first goal
                                    </Text>
                                )}
                            </View>
                        </View>

                        {currentGoal && (
                            <>
                                <View style={styles.goalProgressBg}>
                                    <View
                                        style={[
                                            styles.goalProgressFill,
                                            {
                                                width: `${calculateProgress(currentGoal)}%`,
                                            },
                                        ]}
                                    />
                                </View>

                                <Text
                                    style={{
                                        marginTop: 8,
                                        fontWeight: '600',
                                        color: '#6B7280',
                                    }}
                                >
                                    {Math.round(calculateProgress(currentGoal))}% completed
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Skills */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Improve Your Skills
                    </Text>

                    <View style={styles.skillsContainer}>
                        {skills.map((skill) => (
                            <TouchableOpacity
                                key={skill.title}
                                style={styles.skillCard}
                                activeOpacity={0.8}
                            >
                                <View
                                    style={[
                                        styles.skillIcon,
                                        { backgroundColor: skill.color },
                                    ]}
                                >
                                    <Text style={styles.skillEmoji}>
                                        {skill.icon}
                                    </Text>
                                </View>

                                <View style={styles.skillHeader}>
                                    <Text style={styles.skillTitle}>
                                        {skill.title}
                                    </Text>

                                    <Text style={styles.arrow}>›</Text>
                                </View>

                                <Text style={styles.skillSubtitle}>
                                    {skill.subtitle}
                                </Text>

                                <Text style={styles.lessonText}>
                                    {skill.lessons}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Continue Learning */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            Continue Learning
                        </Text>

                        <TouchableOpacity>
                            <Text style={styles.linkText}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.learningCard}>
                        <Image
                            source={{
                                uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=500',
                            }}
                            style={styles.learningImage}
                        />

                        <View style={styles.learningContent}>
                            <Text style={styles.readingTag}>
                                READING
                            </Text>

                            <Text style={styles.learningTitle}>
                                The Future of Work
                            </Text>

                            <View style={styles.learningProgressBg}>
                                <View style={styles.learningProgressFill} />
                            </View>

                            <Text style={styles.percent}>60%</Text>
                        </View>
                    </View>
                </View>
                {/* Modal Goals */}
                <Modal
                    visible={goalModalVisible}
                    animationType="slide"
                    transparent
                    statusBarTranslucent
                    onRequestClose={() => setGoalModalVisible(false)}
                >
                    <Pressable
                        style={styles.modalOverlay}
                        onPress={() => setGoalModalVisible(false)}
                    >
                        <Pressable
                            style={styles.modalContent}
                            onPress={(e) => e.stopPropagation()}
                        >
                            {/* HEADER */}
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Goals</Text>
                                <TouchableOpacity
                                    onPress={() => setGoalModalVisible(false)}
                                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                                >
                                    <Text style={styles.closeIcon}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            {/* TABS */}
                            <View style={styles.tabContainer}>
                                <TouchableOpacity
                                    style={[styles.tabItem, activeTab === 'progress' && styles.tabActive]}
                                    onPress={() => setActiveTab('progress')}
                                >
                                    <Text style={activeTab === 'progress' ? styles.tabTextActive : styles.tabText}>
                                        In Progress
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.tabItem, activeTab === 'finished' && styles.tabActive]}
                                    onPress={() => setActiveTab('finished')}
                                >
                                    <Text style={activeTab === 'finished' ? styles.tabTextActive : styles.tabText}>
                                        Finished
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.tabItem, activeTab === 'add' && styles.tabActive]}
                                    onPress={() => setActiveTab('add')}
                                >
                                    <Text style={activeTab === 'add' ? styles.tabTextActive : styles.tabText}>
                                        Add Goal
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* CONTENT */}
                            <View style={styles.modalScroll}>
                                {activeTab === 'progress' && (
                                    <FlatList
                                        data={inProgressGoals}
                                        keyExtractor={(item) => item.id_goal.toString()}
                                        renderItem={({ item: goal }) => (
                                            <View style={styles.goalItem}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.goalItemTitle}>{goal.description}</Text>
                                                    <Text>Reading: {goal.actual_reading}/{goal.goal_reading}</Text>
                                                    <Text>Listening: {goal.actual_listening}/{goal.goal_listening}</Text>
                                                    <Text>Writing: {goal.actual_writing}/{goal.goal_writing}</Text>
                                                    <Text>Speaking: {goal.actual_speaking}/{goal.goal_speaking}</Text>
                                                    <Text>XP: {goal.actual_xp}/{goal.goal_xp}</Text>
                                                </View>

                                                {isGoalReached(goal) ? (
                                                    <TouchableOpacity
                                                        style={{
                                                            backgroundColor: '#22C55E',
                                                            paddingHorizontal: 15,
                                                            paddingVertical: 8,
                                                            borderRadius: 10,
                                                        }}
                                                        onPress={() => handleDoneGoal(goal)}
                                                    >
                                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Done</Text>
                                                    </TouchableOpacity>
                                                ) : (
                                                    <Text style={{ color: '#F59E0B', fontWeight: '600' }}>In Progress</Text>
                                                )}
                                            </View>
                                        )}
                                        ListEmptyComponent={
                                            <View style={styles.emptyState}>
                                                <Text style={{ color: '#6B7280', fontSize: 16 }}>
                                                    No goals in progress
                                                </Text>
                                            </View>
                                        }
                                        contentContainerStyle={styles.flatListContent}
                                        showsVerticalScrollIndicator={true}
                                    />
                                )}

                                {activeTab === 'finished' && (
                                    <FlatList
                                        data={finishedGoals}
                                        keyExtractor={(item) => item.id_goal.toString()}
                                        renderItem={({ item: goal }) => (
                                            <View style={styles.goalItem}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.goalItemTitle}>{goal.description}</Text>
                                                    <Text>📖 Reading: {goal.actual_reading}/{goal.goal_reading}</Text>
                                                    <Text>🎧 Listening: {goal.actual_listening}/{goal.goal_listening}</Text>
                                                    <Text>✍️ Writing: {goal.actual_writing}/{goal.goal_writing}</Text>
                                                    <Text>🎙️ Speaking: {goal.actual_speaking}/{goal.goal_speaking}</Text>
                                                    <Text>⭐ XP: {goal.actual_xp}/{goal.goal_xp}</Text>

                                                    <Text style={{ marginTop: 10, color: '#22C55E', fontWeight: 'bold' }}>
                                                        Completed ✅
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                        ListEmptyComponent={
                                            <View style={styles.emptyState}>
                                                <Text style={{ color: '#6B7280', fontSize: 16 }}>
                                                    Chưa có mục tiêu nào hoàn thành
                                                </Text>
                                            </View>
                                        }
                                        contentContainerStyle={styles.flatListContent}
                                        showsVerticalScrollIndicator={true}
                                    />
                                )}

                                {activeTab === 'add' && (
                                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30 }}>
                                        <TextInput placeholder="Description" value={description} onChangeText={setDescription} placeholderTextColor="#999" style={styles.input} />
                                        <TextInput placeholder="Reading Goal" value={goalReading} onChangeText={setGoalReading} placeholderTextColor="#999" keyboardType="numeric" style={styles.input} />
                                        <TextInput placeholder="Listening Goal" value={goalListening} onChangeText={setGoalListening} placeholderTextColor="#999" keyboardType="numeric" style={styles.input} />
                                        <TextInput placeholder="Writing Goal" value={goalWriting} onChangeText={setGoalWriting} placeholderTextColor="#999" keyboardType="numeric" style={styles.input} />
                                        <TextInput placeholder="Speaking Goal" value={goalSpeaking} onChangeText={setGoalSpeaking} placeholderTextColor="#999" keyboardType="numeric" style={styles.input} />
                                        <TextInput placeholder="XP Goal" value={goalXp} onChangeText={setGoalXp} placeholderTextColor="#999" keyboardType="numeric" style={styles.input} />

                                        <TouchableOpacity style={styles.saveBtn} onPress={saveGoal}>
                                            <Text style={styles.saveBtnText}>
                                                {editingGoal ? 'Update Goal' : 'Save Goal'}
                                            </Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                )}
                            </View>
                        </Pressable>
                    </Pressable>
                </Modal>
            </ScrollView>


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FF',
    },

    scrollContent: {
        padding: 20,
        paddingBottom: 120,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },

    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        marginRight: 14,
    },

    helloText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
    },

    subText: {
        color: '#6B7280',
        marginTop: 4,
    },

    bell: {
        fontSize: 24,
    },

    xpCard: {
        backgroundColor: '#FF9500',
        borderRadius: 28,
        padding: 22,
        marginBottom: 28,
    },

    xpTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },

    xpLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        marginBottom: 6,
    },

    level: {
        fontSize: 42,
        fontWeight: '800',
        color: '#fff',
    },

    levelSub: {
        color: 'rgba(255,255,255,0.8)',
    },

    xpNumber: {
        fontSize: 36,
        fontWeight: '800',
        color: '#fff',
    },

    progressBg: {
        width: '100%',
        height: 10,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 999,
        overflow: 'hidden',
    },

    progressFill: {
        width: '75%',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 999,
    },

    section: {
        marginBottom: 30,
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
    },

    linkText: {
        color: '#5B5FEF',
        fontWeight: '600',
    },

    goalCard: {
        backgroundColor: '#fff',
        borderRadius: 28,
        padding: 20,
    },

    goalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },

    goalIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFE6D5',
        marginRight: 16,
    },

    goalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },

    goalSubtitle: {
        color: '#6B7280',
        marginTop: 4,
    },

    goalProgressBg: {
        width: '100%',
        height: 10,
        backgroundColor: '#E5E7EB',
        borderRadius: 999,
        overflow: 'hidden',
    },

    goalProgressFill: {
        width: '50%',
        height: '100%',
        backgroundColor: '#FF9500',
    },

    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    skillCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 26,
        padding: 18,
        marginBottom: 16,
    },

    skillIcon: {
        width: 62,
        height: 62,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },

    skillEmoji: {
        fontSize: 28,
    },

    skillHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },

    skillTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },

    arrow: {
        color: '#9CA3AF',
        fontSize: 22,
    },

    skillSubtitle: {
        color: '#6B7280',
        lineHeight: 20,
        minHeight: 58,
    },

    lessonText: {
        marginTop: 10,
        color: '#5B5FEF',
        fontWeight: '600',
    },

    learningCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 28,
        padding: 14,
    },

    learningImage: {
        width: 110,
        height: 100,
        borderRadius: 22,
        marginRight: 14,
    },

    learningContent: {
        flex: 1,
        justifyContent: 'center',
    },

    readingTag: {
        color: '#22C55E',
        fontWeight: '700',
        fontSize: 12,
        marginBottom: 6,
    },

    learningTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 14,
    },

    learningProgressBg: {
        width: '100%',
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 999,
        overflow: 'hidden',
        marginBottom: 6,
    },

    learningProgressFill: {
        width: '60%',
        height: '100%',
        backgroundColor: '#FF9500',
    },

    percent: {
        alignSelf: 'flex-end',
        color: '#6B7280',
    },

    bottomTab: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#F3F4F6',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 14,
        paddingBottom: 28,
    },

    tabButton: {
        alignItems: 'center',
    },

    tabIcon: {
        fontSize: 24,
        marginBottom: 4,
    },

    tabLabel: {
        fontSize: 12,
        fontWeight: '600',
    },


    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    goalItem: {
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        padding: 18,
        marginBottom: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    input: {
        backgroundColor: '#F9FAFB',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 16,
        fontSize: 16,
    },

    saveBtn: {
        backgroundColor: '#FF9500',
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: 'center',
        marginTop: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        width: '90%',
        height: '85%',
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        paddingBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    modalTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: '#111827',
    },

    closeIcon: {
        fontSize: 28,
        color: '#6B7280',
        fontWeight: '300',
    },

    modalScroll: {
        flex: 1,
    },

    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        padding: 6,
        marginBottom: 24,
    },

    tabItem: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
    },

    tabActive: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },

    tabText: {
        color: '#6B7280',
        fontWeight: '600',
    },

    tabTextActive: {
        color: '#111827',
        fontWeight: '700',
    },

    goalItemTitle: {
        fontSize: 16,
        fontWeight: '600',
    },

    goalItemProgress: {
        color: '#22C55E',
        fontWeight: '700',
    },

    saveBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    emptyState: {
        padding: 40,
        alignItems: 'center',
    },

    flatListContent: {
        paddingBottom: 100,
        flexGrow: 1,
    },
});