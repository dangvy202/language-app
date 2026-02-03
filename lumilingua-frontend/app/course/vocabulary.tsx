import Loading from '@/component/loading';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
    Image
} from 'react-native';



import Notfound from '@/component/404';
import { Level, Topic } from '@/interfaces/interfaces';
import { fetchLevel, fetchTopic, saveOrUpdateUserCache } from '@/services/api';
import useFetch from '@/services/useFetch';

type VocabularyItem = Level | Topic;

export default function LearnVocabulary() {
    const router = useRouter();
    const [loadingLogin, setLoadingLogin] = useState(false);

    const refreshTokenApi = async (refreshToken: string) => {
        const endpoint = "http://localhost:8888/api/v1/user/refresh";

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
                    await AsyncStorage.setItem('expired', response.data.expired || '');
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


    const [activeTab, setActiveTab] = useState<'level' | 'topic'>('level');

    const levelFetch = useFetch(() => fetchLevel({ query: "" }), true);
    const topicFetch = useFetch(() => fetchTopic({ query: "" }), true);

    const currentFetch = activeTab === 'level' ? levelFetch : topicFetch;
    const currentData: VocabularyItem[] = currentFetch.data ?? [];

    const isLoading = currentFetch.loading;
    const error = currentFetch.error;

    const handleTabChange = (tab: 'level' | 'topic') => {
        setActiveTab(tab);
    };

    const handleLevelPress = (level: Level) => {
        router.push(`/course/level/${level.id_level}`);
    };

    const handleTopicPress = (topic: Topic) => {
        router.push(`/course/topic/${topic.name_topic}`);
    };

    const renderItem = ({ item }: { item: VocabularyItem }) => (
        <TouchableOpacity
            className="bg-white rounded-2xl p-5 mb-4 shadow-md border border-orange-100"
            onPress={() => {
                if ('id_level' in item) {
                    handleLevelPress(item as Level);
                } else if ('id_topic' in item) {
                    handleTopicPress(item as Topic);
                }
            }}
        >
            <View className="flex-row justify-between items-center mb-3">
                {'rank' in item ? (
                    // Level item
                    <>
                        <Text className="text-2xl font-bold text-[#2E2A47]">{item.rank}</Text>
                        <View className="bg-orange-100 px-4 py-2 rounded-full">
                            <Text className="text-orange-600 font-medium">{item.level_name}</Text>
                        </View>
                    </>
                ) : (
                    // Topic item
                    <>
                        <View className="flex-row items-center">
                            <Ionicons name={item.icon as any} size={28} color="#FFA500" />
                            <Text className="ml-3 text-xl font-bold text-[#2E2A47]">{item.name_topic}</Text>
                        </View>
                        <View className="bg-orange-100 px-3 py-1 rounded-full">
                            {/* <Text className="text-orange-600 font-medium">{item.count || 'N/A'} từ</Text> */}
                        </View>
                    </>
                )}
            </View>

            {/* Progress bar */}
            <View className="mb-4">
                <Text className="text-gray-600 mb-2">Progress: {10}%</Text>
                <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <View
                        className="h-full bg-[#FFA500]"
                        style={{ width: `${10}%` }}
                    />
                </View>
            </View>

            <View className="flex-row justify-end">
                <Text className="text-[#FFA500] font-medium">Continuous →</Text>
            </View>
        </TouchableOpacity>
    );

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
                            }
                            return `topic-${item.id_topic}`;
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

                {/* Bottom button */}
                {/* <View className="absolute bottom-6 left-6 right-6">
                    <TouchableOpacity
                        className="bg-[#FFA500] py-5 rounded-2xl items-center shadow-xl"
                        onPress={() => {
                            // Alert.alert('Ôn tập', 'Chức năng đang phát triển!');
                        }}
                    >
                        <Text className="text-white text-lg font-bold">Ôn tập từ vựng hôm nay</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        </>

    );
}