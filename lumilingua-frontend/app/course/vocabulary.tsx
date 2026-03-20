import Loading from '@/component/loading';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import Notfound from '@/component/404';
import { useUserCache } from '@/hook/useUserCache';
import { Exercise, ExerciseProgress, Level, Topic } from '@/interfaces/interfaces';
import { fetchExercise, fetchLevel, fetchTopic, getExerciseProgress, getHistoryProgress } from '@/services/api';
import useFetch from '@/services/useFetch';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { getCrmsEndpoint, getClientEndpoint } from "@/constants/configApi";


type VocabularyItem = Level | Topic | Exercise;

export default function LearnVocabulary() {
    const router = useRouter();
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [progressMap, setProgressMap] = useState<Record<number, number>>({});
    const [exerciseProgressMap, setExerciseProgressMap] = useState<Record<number, ExerciseProgress>>([]);
    const { cache: userCache, loadingCache, cacheError } = useUserCache();

    const refreshTokenApi = async (refreshToken: string) => {
        const endpoint = getCrmsEndpoint("v1/user/refresh");

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
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
        let isMounted = true;

        const checkAuth = async () => {
            if (!isMounted) return;

            const token = await AsyncStorage.getItem('token');
            const expiredStr = await AsyncStorage.getItem('expired');
            const expired = expiredStr ? parseInt(expiredStr, 10) : null;

            if (token && expired && Date.now() < expired) {
                setLoadingLogin(false);
                return;
            }

            const refreshToken = await AsyncStorage.getItem('refreshToken');

            if (refreshToken) {
                setLoadingLogin(true);
                try {
                    const response = await refreshTokenApi(refreshToken);
                    await AsyncStorage.setItem('token', response.data.token || '');
                    await AsyncStorage.setItem('expired', String(response.data.expired || Date.now() + 900000));
                } catch (err) {
                    console.log('Refresh error:', err);
                    await AsyncStorage.multiRemove(['token', 'refreshToken', 'expired', 'username', 'email']);
                    router.replace('/Login');
                } finally {
                    if (isMounted) setLoadingLogin(false);
                }
            } else {
                router.replace('/Login');
            }
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, [router]);
    
    useFocusEffect(
        useCallback(() => {
            if (!userCache || userCache.length === 0) return;

            const userCacheId = Number(userCache[0]?.id_user_cache);
            if (!userCacheId) return;

            const fetchAllProgress = async () => {
            try {
                const progressList = await getHistoryProgress(userCacheId);
                const progressMap: Record<number, number> = {};
                progressList.forEach((item: any) => {
                progressMap[item.topic] = item.progress_percent ?? 0;
                });
                setProgressMap(progressMap);

                const exerciseProgressList = await getExerciseProgress(userCacheId);
                const exerciseMap: Record<number, ExerciseProgress> = {};
                exerciseProgressList.forEach((item: any) => {
                    exerciseMap[item.exercises] = {
                        attempts: item.attempts ?? 0,
                        completed_at: item.completed_at ?? "",
                        exercises: item.exercises,
                        id_exercise_progress: item.id_exercise_progress ?? 0,
                        is_completed: item.is_completed ?? false,
                        score: item.score ?? 0,
                    };
                });
                setExerciseProgressMap(exerciseMap);
            } catch (err) {
                console.log("Fetch progress error:", err);
            } 
            };

            fetchAllProgress();
        }, [userCache])
    );

    const [activeTab, setActiveTab] = useState<'level' | 'topic' | 'exercise'>('level');

    const levelFetch = useFetch(() => fetchLevel({ query: "" }), true);
    const topicFetch = useFetch(() => fetchTopic({ query: "" }), true);
    const exerciseFetch = useFetch(() => fetchExercise({ query: "" }), true);

    let currentFetch;

    if (activeTab === 'level') {
        currentFetch = levelFetch
    } else if (activeTab === 'topic') {
        currentFetch = topicFetch
    } else {
        currentFetch = exerciseFetch
    }

    const currentData: VocabularyItem[] = currentFetch.data ?? [];

    const isLoading = currentFetch.loading;
    const error = currentFetch.error;

    const handleTabChange = (tab: 'level' | 'topic' | 'exercise') => {
        setActiveTab(tab);
    };

    const handleLevelPress = (level: Level) => {
        router.push(`/course/level/${level.id_level}`);
    };

    const handleTopicPress = (topic: Topic) => {
        router.push(`/course/topic/${topic.name_topic}`);
    };

    const handleExercisePress = (exercise: Exercise) => {
        router.push({
            pathname: '/course/exercise/[id]',
            params: { 
                id: exercise.id_exercise,
                time_limit: exercise.time_limit
            },
        })
    };

    const getProgressColor = (progress: number) => {
        if (progress === 100) return "#22C55E";
        if (progress >= 50) return "#ff9100";
        if (progress >= 30) return "#ddce00";
        return "#EF4444";
    };

    const rs = {
        score: 85,
        attempts: 3,
        isCompleted: true,
        completedAt: "2026-02-25T10:20:00"
    }

    const renderItem = ({ item, index }: { item: VocabularyItem; index: number }) => {
        const isTopic = 'id_topic' in item;
        const isExercise = 'id_exercise' in item;

        const progress =
            'id_topic' in item
                ? progressMap[item.id_topic] || 0
                : 0;
        const progressColor = getProgressColor(progress);

        const exerciseProgress = 'id_exercise' in item ? exerciseProgressMap[item.id_exercise] : null;

        let isLocked = false;
        if (isTopic && activeTab === 'topic') {
            if (index === 0) {
                isLocked = false;
            } else {
                const prevItem = currentData[index - 1] as Topic;
                const prevProgress = progressMap[prevItem.id_topic] || 0;

                if (prevProgress < 100) {
                    isLocked = true;
                }
            }
        }

        return (
            <TouchableOpacity
                disabled={isLocked}
                className={`bg-white rounded-2xl p-5 mb-4 shadow-md border 
                    ${isLocked ? 'opacity-50 border-gray-200' : 'border-orange-100'}`}
                onPress={() => {
                    if (isLocked) return;

                    if ('id_level' in item) {
                        handleLevelPress(item as Level);
                    } else if ('id_topic' in item) {
                        handleTopicPress(item as Topic);
                    } else if ('id_exercise' in item) {
                        handleExercisePress(item as Exercise);
                    }
                }}
            >
                <View className="flex-row justify-between items-center mb-3">
                    {'rank' in item ? (
                        // Level item
                        <>
                            <View className="flex-row items-center">
                                <View className="w-12 h-12 bg-orange-100 rounded-xl items-center justify-center mr-3">
                                    <Text className="text-lg font-bold text-[#FFA500]">
                                        {item.rank}
                                    </Text>
                                </View>
                                <View className="flex-1 mr-3">
                                    <Text className="text-xl font-bold text-[#2E2A47]">
                                        {item.level_name}
                                    </Text>

                                    <Text
                                        className="text-sm text-gray-500 mt-1"
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {item.description}
                                    </Text>
                                </View>
                            </View>
                        </>
                    ) : isTopic ? (
                        // Topic item
                        <>
                            <View className="flex-row items-center">
                                <Ionicons
                                    name={item.icon as any}
                                    size={28}
                                    color="#FFA500"
                                />
                                <Text className="ml-3 text-xl font-bold text-[#2E2A47]">
                                    {item.name_topic}
                                </Text>
                            </View>
                            <View className="bg-orange-100 px-3 py-1 rounded-full">
                                <Text>{item.vocabulary_count} words</Text>
                            </View>
                        </>
                    ) : (
                        // Exercise item
                        <>
                            <View className="bg-white rounded-2xl p-4 mb-4 relative">

                                {/* DONE Badge */}
                                {exerciseProgress?.is_completed && (
                                    <View className="absolute top-3 right-3 bg-green-500 px-2 py-1 rounded-full">
                                        <Text className="text-white text-xs font-bold">DONE</Text>
                                    </View>
                                )}

                                {/* Top section */}
                                <View className="flex-row items-start">
                                    <View className="w-12 h-12 bg-orange-100 rounded-xl items-center justify-center">
                                        <Ionicons
                                            name={(item.icon as any) || 'fitness-outline'}
                                            size={26}
                                            color="#FFA500"
                                        />
                                    </View>

                                    <View className="ml-4 flex-1">
                                        <Text className="text-lg font-bold text-[#2E2A47]">
                                            {item.name}
                                        </Text>

                                        <Text
                                            className="text-sm text-gray-500 mt-1"
                                            numberOfLines={2}
                                        >
                                            {item.description || 'Bài tập kiểm tra kỹ năng'}
                                        </Text>
                                    </View>
                                </View>

                                {/* Divider */}
                                <View className="h-px bg-gray-100 my-4" />

                                {/* Bottom info row (Exam Info) */}
                                <View className="flex-row flex-wrap gap-2">

                                    {/* Difficulty */}
                                    <View
                                        className={`px-3 py-1 rounded-full
                                            ${item.difficulty === 'easy'
                                                ? 'bg-green-100'
                                                : item.difficulty === 'medium'
                                                    ? 'bg-yellow-100'
                                                    : 'bg-red-100'
                                            }`}
                                    >
                                        <Text
                                            className={`text-xs font-semibold
                                                ${item.difficulty === 'easy'
                                                    ? 'text-green-600'
                                                    : item.difficulty === 'medium'
                                                        ? 'text-yellow-600'
                                                        : 'text-red-600'
                                                }`}
                                        >
                                            {item.difficulty?.toUpperCase() || 'MEDIUM'}
                                        </Text>
                                    </View>

                                    {/* Questions */}
                                    <View className="bg-blue-100 px-3 py-1 rounded-full">
                                        <Text className="text-xs font-medium text-blue-600">
                                            {item.question_count || 0} câu hỏi
                                        </Text>
                                    </View>

                                    {/* Time */}
                                    <View className="bg-purple-100 px-3 py-1 rounded-full">
                                        <Text className="text-xs font-medium text-purple-600">
                                            {item.time_limit / 60} phút
                                        </Text>
                                    </View>

                                    {/* Points */}
                                    <View className="bg-orange-100 px-3 py-1 rounded-full">
                                        <Text className="text-xs font-medium text-orange-600">
                                            {item.points || 0} điểm
                                        </Text>
                                    </View>

                                    {/* Type */}
                                    <View className="bg-gray-100 px-3 py-1 rounded-full">
                                        <Text className="text-xs font-medium text-gray-600">
                                            {item.type}
                                        </Text>
                                    </View>
                                </View>
                                {/* USER RESULT SECTION */}
                                {exerciseProgress?.is_completed && (
                                    <>
                                        <View className="h-px bg-gray-100 my-4" />

                                        <View className="flex-row flex-wrap gap-2">

                                            {/* Score */}
                                            <View className="bg-indigo-100 px-3 py-1 rounded-full">
                                                <Text className="text-xs font-medium text-indigo-600">
                                                    Score: {exerciseProgress?.score || 0}
                                                </Text>
                                            </View>

                                            {/* Attempts */}
                                            <View className="bg-teal-100 px-3 py-1 rounded-full">
                                                <Text className="text-xs font-medium text-teal-600">
                                                    Attempts: {exerciseProgress?.attempts || 0}
                                                </Text>
                                            </View>

                                            {/* Completed Status */}
                                            <View
                                                className={`px-3 py-1 rounded-full
                                                    ${exerciseProgress?.is_completed
                                                        ? 'bg-green-100'
                                                        : 'bg-gray-200'
                                                    }`}
                                            >
                                                <Text
                                                    className={`text-xs font-medium
                                                        ${exerciseProgress?.is_completed
                                                            ? 'text-green-600'
                                                            : 'text-gray-600'
                                                        }`}
                                                >
                                                    {exerciseProgress?.is_completed ? 'Completed' : 'Not Completed'}
                                                </Text>
                                            </View>

                                            {/* Completed Date */}
                                            {exerciseProgress?.completed_at && (
                                                <View className="bg-pink-100 px-3 py-1 rounded-full">
                                                    <Text className="text-xs font-medium text-pink-600">
                                                        {new Date(exerciseProgress?.completed_at).toLocaleDateString()}
                                                    </Text>
                                                </View>
                                            )}

                                        </View>
                                    </>
                                )}

                            </View>
                        </>
                    )}
                </View>

                {/* Progress bar */}
                {'id_topic' in item && (
                    <View className="mb-5">
                        {/* Top row: description + percent */}
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-sm text-gray-500">
                                Learning progress
                            </Text>

                            <Text
                                className="text-sm font-semibold"
                                style={{ color: progressColor }}
                            >
                                {progress}%
                            </Text>
                        </View>

                        {/* Progress bar */}
                        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <View
                                className="h-full rounded-full"
                                style={{
                                    width: `${progress}%`,
                                    backgroundColor: progressColor,
                                }}
                            />
                        </View>
                    </View>
                )}

                <View className="flex-row justify-end items-center">
                    {isLocked ? (
                        <Ionicons name="lock-closed" size={20} color="#9CA3AF" />
                    ) : (
                        <Text className="text-[#FFA500] font-medium">
                            Continuous →
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <>
            <Stack.Screen
                options={{
                    title: '',
                    headerTintColor: 'black',
                    headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={28} color="black" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <View className="flex-1 bg-gray-50">
                {/* Header */}
                <View className="bg-[#FFA500] from-orange-600 to-orange-600 pt-12 pb-8 px-6 shadow-lg rounded-b-3xl">
                    <View className="flex-row items-center">
                        <Ionicons name="book-outline" size={44} color="white" className="mr-4" />
                        <View>
                            <Text className="text-white text-4xl font-black">Vocabularies</Text>
                            <Text className="text-orange-100 text-base mt-1 opacity-90">
                                Học từ vựng theo cách của bạn
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Tabs */}
                <View className="flex-row px-6 mt-4 mb-2 bg-white border-b border-gray-200">
                    <TouchableOpacity
                        className={`flex-1 py-4 items-center border-b-4 ${activeTab === 'level' ? 'border-[#FFA500]' : 'border-transparent'}`}
                        onPress={() => handleTabChange('level')}
                    >
                        <Text
                            className={`text-lg font-medium ${activeTab === 'level' ? 'text-[#FFA500]' : 'text-gray-600'}`}
                        >
                            Level
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`flex-1 py-4 items-center border-b-4 ${activeTab === 'topic' ? 'border-[#FFA500]' : 'border-transparent'}`}
                        onPress={() => handleTabChange('topic')}
                    >
                        <Text
                            className={`text-lg font-medium ${activeTab === 'topic' ? 'text-[#FFA500]' : 'text-gray-600'}`}
                        >
                            Topic
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`flex-1 py-4 items-center border-b-4 ${activeTab === 'exercise' ? 'border-[#FFA500]' : 'border-transparent'}`}
                        onPress={() => handleTabChange('exercise')}
                    >
                        <Text
                            className={`text-lg font-medium ${activeTab === 'exercise' ? 'text-[#FFA500]' : 'text-gray-600'}`}
                        >
                            Exercises
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                {isLoading ? (
                    <Loading />
                ) : error ? (
                    <View className="flex-1 items-center justify-center px-6">
                        <Ionicons name="alert-circle-outline" size={80} color="#FF3B30" />
                        <Text className="mt-6 text-xl font-bold text-red-600 text-center">
                            Error
                        </Text>
                        <Text className="mt-2 text-base text-gray-600 text-center">
                            {error.message || 'Không thể tải dữ liệu'}
                        </Text>
                        <TouchableOpacity
                            onPress={currentFetch.refetch}
                            className="mt-8 bg-[#FFA500] px-10 py-4 rounded-full shadow-lg"
                        >
                            <Text className="text-white text-lg font-bold">Try again</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList<VocabularyItem>
                        data={currentData}
                        keyExtractor={(item) => {
                            if ('id_level' in item) {
                                return `level-${item.id_level}`;
                            } else if ('id_topic' in item) {
                                return `topic-${item.id_topic}`;
                            }
                            return `exercise-${item.id_exercise}`;
                        }}
                        renderItem={renderItem}
                        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={isLoading}
                                onRefresh={currentFetch.refetch}
                                colors={['#FFA500']}
                                tintColor="#FFA500"
                            />
                        }
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center py-20">
                                <Notfound />
                            </View>
                        }
                    />
                )}


                <View className="absolute bottom-6 left-6 right-6">
                    <TouchableOpacity
                        className="bg-[#FFA500] py-5 rounded-2xl items-center shadow-xl"
                        onPress={() => {
                            if (activeTab === 'level') {
                                Alert.alert('Ôn tập', 'Chức năng ôn từ đã note đang phát triển!');
                            }
                        }}
                    >
                        <Text className="text-white text-lg font-bold">
                            Ôn tập các từ đã note
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>

    );
}