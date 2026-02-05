import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import Notfound from '@/component/404';
import Loading from '@/component/loading';
import { useUserCache } from '@/hook/useUserCache';
import { fetchMeanByVocabularyAndLanguage, fetchVocabularyByTopic, saveHistoryProgress } from '@/services/api';
import useFetch from '@/services/useFetch';

const { width } = Dimensions.get('window');
const SWIPE_LIMIT = width * 0.25;

export default function VocabularyByTopic() {
    const router = useRouter();

    const { topic } = useLocalSearchParams<{ topic: string }>();
    const [email, setEmail] = useState<string | null>(null);
    const { cache: userCache, loadingCache, cacheError } = useUserCache();

    const nameTopic = String(topic);

    const { data, loading, error } = useFetch(
        () => fetchVocabularyByTopic({ nameTopic }),
        true
    );

    const vocabulary = data ?? [];
    const [index, setIndex] = useState(0);

    /* ===================== MEANING STATE ===================== */
    const [meaning, setMeaning] = useState<string | null>(null);
    const [example, setExample] = useState<string | null>(null);
    const [loadingMean, setLoadingMean] = useState(false);

    /* ===================== NEW STATES FOR UI (giả lập) ===================== */
    const [isRecording, setIsRecording] = useState(false); // giả lập đang ghi âm
    const [isSaved, setIsSaved] = useState(false); // giả lập đã bookmark



    useEffect(() => {
        if (!vocabulary[index]) return;

        const vocabId = vocabulary[index].id_vocabulary;

        setLoadingMean(true);

        fetchMeanByVocabularyAndLanguage({
            vocabulary: vocabId,
            language: 1,
        }).then((res) => {
            if (Array.isArray(res) && res.length > 0) {
                setMeaning(res[0].mean_vocabulary);
                setExample(res[0].example_vocabulary);
            } else {
                setMeaning(null);
                setExample(null);
            }
        })
            .catch(() => {
                setMeaning(null);
                setExample(null);
            })
            .finally(() => {
                setLoadingMean(false);
            });
    }, [index, vocabulary]);

    // const { dataUserCacge, loading: fetchLoading, error } = useFetch(
    //     () => fetchUserCache({ email: email! }),
    //     !!email
    // );

    /* ===================== ANIMATION ===================== */
    const translateX = useSharedValue(0);
    const rotateZ = useSharedValue(0);

    /* ===================== UTILS ===================== */
    const vibrate = () =>
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const speak = (text?: string) => {
        if (!text) return;
        Speech.stop();
        Speech.speak(text, { language: 'en-US', rate: 0.9 });
    };

    const nextCard = () => {
        if (index < vocabulary.length - 1) {
            vibrate();
            setIndex(i => i + 1);
        }
        translateX.value = 0;
        rotateZ.value = 0;
    };

    const prevCard = () => {
        if (index > 0) {
            vibrate();
            setIndex(i => i - 1);
        }
        translateX.value = 0;
        rotateZ.value = 0;
    };

    const toggleRecord = () => {
        setIsRecording(prev => !prev);
        vibrate();
        // Sau này: start/stop recording + gọi API pronunciation scoring
    };

    const toggleSave = () => {
        setIsSaved(prev => !prev);
        vibrate();
        // Sau này: lưu vào AsyncStorage hoặc gửi API save bookmark
    };

    const saveProgress = async () => {
        if (!userCache || userCache.length === 0) {
            console.warn("Không có userCache để lưu tiến độ");
            return;
        }

        const userCacheId = userCache[0].id_user_cache; // lấy từ cache

        try {
            // Ví dụ params bạn cần truyền (thay đổi theo API thật của bạn)
            const result = await saveHistoryProgress({
                isFinished: false,                  // false vì chưa hoàn thành, chỉ lưu tiến độ giữa chừng
                finished_date: new Date().toISOString(),
                duration: "00:12:45",               // bạn cần tính thời gian thực tế (dùng useRef + setInterval)
                user_cache: userCacheId,
                topic: Number(topic),               // topic từ params
                id_vocabulary_progress: word?.id_vocabulary || null, // hoặc array nếu lưu nhiều
                // thêm field khác nếu cần: learned_words, streak update, v.v.
            });

            console.log("Lưu tiến độ thành công:", result);
            // Có thể toast.success("Đã lưu tiến độ!")
        } catch (err) {
            console.error("Lỗi khi lưu tiến độ:", err);
            // toast.error("Không lưu được tiến độ")
        }
    };

    const handleConfirmExit = () => {
        console.log("handleConfirmExit call");

        // Mobile: dùng Alert native
        Alert.alert(
            "Exit the topic?",
            "Do you want to save the progress of learned?",
            [
                {
                    text: "Do not save",
                    style: "destructive",
                    onPress: () => {
                        console.log("Chọn: Done save");
                        router.back();
                    },
                },
                {
                    text: "Save and exit",
                    onPress: async () => {
                        console.log("Chọn: Save and exit");
                        await saveProgress();
                        router.back();
                    },
                },
                {
                    text: "Cancel",
                    style: "cancel",
                    onPress: () => console.log("Chọn: Hủy"),
                },
            ],
            { cancelable: true }
        );
    };
    /* ===================== GESTURE ===================== */
    const gesture = Gesture.Pan()
        .onUpdate(e => {
            translateX.value = e.translationX;
            rotateZ.value = interpolate(
                e.translationX,
                [-width, 0, width],
                [-12, 0, 12]
            );
        })
        .onEnd(() => {
            if (translateX.value > SWIPE_LIMIT) {
                translateX.value = withTiming(width, {}, () =>
                    runOnJS(prevCard)()
                );
            } else if (translateX.value < -SWIPE_LIMIT) {
                translateX.value = withTiming(-width, {}, () =>
                    runOnJS(nextCard)()
                );
            } else {
                translateX.value = withSpring(0);
                rotateZ.value = withSpring(0);
            }
        });

    const cardStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { rotateZ: `${rotateZ.value}deg` },
        ],
    }));

    /* ===================== STATES ===================== */
    if (loading) return <Loading />;

    if (error || vocabulary.length === 0) {
        return (
            <Notfound />
        );
    }

    const word = vocabulary[index];
    const progress = Math.round(
        ((index + 1) / vocabulary.length) * 100
    );

    return (
        <>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />

            <View className="flex-1 bg-gray-100">
                {/* HEADER */}
                <View className="pt-14 pb-6 px-6 flex-row justify-between items-center">
                    <Text className="text-3xl font-extrabold">
                        Topic {nameTopic}
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            console.log("=== NÚT CLOSE ĐÃ ĐƯỢC BẤM ===");
                            vibrate(); // rung nhẹ để biết có nhận touch không
                            handleConfirmExit();
                        }}
                        className="bg-black/10 p-2 rounded-full"
                    >
                        <Ionicons name="close" size={28} />
                    </TouchableOpacity>
                </View>

                {/* PROGRESS */}
                <View className="px-6 mb-4">
                    <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <View
                            className="h-full bg-orange-400 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </View>
                </View>

                {/* CARD */}
                <View className="flex-1 items-center justify-center">
                    <GestureDetector gesture={gesture}>
                        <Animated.View
                            style={cardStyle}
                            className="w-[340px] h-[500px] bg-white rounded-[48px] shadow-2xl px-8 py-10 relative"
                        >
                            {/* BOOKMARK */}
                            <TouchableOpacity
                                onPress={toggleSave}
                                className="absolute top-6 left-6 bg-orange-100 p-3 rounded-full shadow z-10"
                            >
                                <Ionicons
                                    name={isSaved ? "bookmark" : "bookmark-outline"}
                                    size={28}
                                    color={isSaved ? "#FFA500" : "#666"}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => speak(word.name_vocabulary)}
                                className="absolute top-6 right-6 bg-orange-100 p-4 rounded-full shadow"
                            >
                                <Ionicons
                                    name="volume-high"
                                    size={28}
                                    color="#FFA500"
                                />
                            </TouchableOpacity>

                            <View className="items-center mt-12">
                                <Text className="text-5xl font-extrabold text-center mb-3">
                                    {word.name_vocabulary}
                                </Text>

                                <Text className="text-xl text-gray-400 mb-8">
                                    {word.ipa}
                                </Text>

                                <View className="mb-7">
                                    <Image
                                        source={{ uri: word.img_path }}
                                        style={styles.imgWord}
                                    />
                                </View>

                                <View className="bg-orange-50 px-6 py-4 rounded-2xl mb-6">
                                    <Text className="text-3xl font-bold text-orange-600 text-center">
                                        {loadingMean ? '...' : meaning ?? 'No meaning'}
                                    </Text>
                                </View>

                                <Text className="text-lg text-gray-500 italic text-center leading-7 mb-5">
                                    “{loadingMean ? '...' : example ?? 'No example'}”
                                </Text>
                            </View>
                        </Animated.View>
                    </GestureDetector>
                </View>

                {/* BUTTONS */}
                <View className="flex-row items-center justify-between px-10 pb-10">
                    {/* Prev */}
                    <Ionicons
                        name="chevron-back-circle"
                        size={64}
                        color={index === 0 ? '#ccc' : '#FFA500'}
                        onPress={prevCard}
                    />

                    <View className="flex-1 items-center">
                        <TouchableOpacity
                            onPress={toggleRecord}
                            className={`p-5 rounded-full shadow-lg
                        ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-orange-100'}`}
                        >
                            <Ionicons
                                name="mic"
                                size={36}
                                color={isRecording ? "white" : "#FFA500"}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Next */}
                    <Ionicons
                        name="chevron-forward-circle"
                        size={64}
                        color={
                            index === vocabulary.length - 1
                                ? '#ccc'
                                : '#FFA500'
                        }
                        onPress={nextCard}
                    />
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    imgWord: {
        width: 230,
        height: 110
    }
});