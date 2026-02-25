import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useState, useRef } from 'react';
import { Alert, Dimensions, Image, Linking, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
import { fetchMeanByVocabularyAndLanguage, fetchVocabularyByTopic, saveHistoryProgress, saveNoteVocabulary } from '@/services/api';
import useFetch from '@/services/useFetch';
import { useSavedVocabulary } from '@/hook/useUserNote';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');
const SWIPE_LIMIT = width * 0.25;

const msToHHMMSS = (ms: any) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0'),
    ].join(':');
};

export default function VocabularyByTopic() {
    const router = useRouter();

    const { topic } = useLocalSearchParams<{ topic: string }>();
    const { cache: userCache, loadingCache, cacheError } = useUserCache();
    const startTimeRef = useRef<number | null>(null);
    const { isSavedVocabulary, reload } = useSavedVocabulary(userCache?.[0]?.id_user_cache);
    const recordingRef = useRef<Audio.Recording | null>(null);


    useEffect(() => {
        startTimeRef.current = Date.now();
    }, []);

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

    /* ===================== USER NOTE ===================== */
    const [isSaved, setIsSaved] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [contentNote, setContentNote] = useState('');
    const [descriptionNote, setDescriptionNote] = useState('');

    /* ===================== NEW STATES FOR UI (giả lập) ===================== */
    const [isRecording, setIsRecording] = useState(false); // giả lập đang ghi âm
    const [recording, setRecording] = useState<Audio.Recording | null>(null);



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

    const toggleRecord = async () => {
        try {
            if (!isRecording) {
            // Bật chế độ ghi âm trên iOS (bắt buộc)
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                interruptionModeIOS: 1, // 1 = DoNotMix (không mix với app khác)
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                interruptionModeAndroid: 1, // 1 = DoNotMix cho Android
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });

            // Yêu cầu quyền micro
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                'Quyền micro cần thiết',
                'Vui lòng cho phép ứng dụng truy cập micro trong cài đặt để luyện phát âm.',
                [
                    { text: 'Đóng', style: 'cancel' },
                    { text: 'Mở cài đặt', onPress: () => Linking.openSettings() }
                ]
                );
                return;
            }

                setIsRecording(true);
                const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );
                setRecording(recording);
                await recording.startAsync();
                console.log('Bắt đầu ghi âm...');
            } else {
                await recording?.stopAndUnloadAsync();
                setIsRecording(false);
                const uri = recording?.getURI();
                console.log('Ghi âm xong, file:', uri);
                // TODO: gửi uri lên server nếu cần
                setRecording(null); // clear ref
            }
        } catch (err) {
            console.error('Ghi âm lỗi:', err);
            setIsRecording(false);
        }
    };
    
    const toggleSave = () => {
        vibrate();

        if (isSaved) {
            setIsSaved(false);
        } else {
            setShowModal(true);
        }
    };

    const handleSaveNote = async () => {
        try {
            if (!userCache || userCache.length === 0) {
                Alert.alert("User not found");
                return;
            }

            const vocabId = word.id_vocabulary;
            const userCacheId = userCache[0].id_user_cache;

            const payload = {
                id_user_cache: userCacheId,
                id_vocabulary: vocabId,
                content_note: contentNote,
                description_note: descriptionNote,
            };

            await saveNoteVocabulary(payload);

            await reload();

            setShowModal(false);
            setContentNote("");
            setDescriptionNote("");
            vibrate();

        } catch (err) {
            Alert.alert("Error saving note");
        }
    };


    const saveProgress = async () => {
        if (!userCache || userCache.length === 0) {
            console.warn("Không có userCache để lưu tiến độ");
            return;
        }

        const vocabularyLastedOfTopic = vocabulary[vocabulary.length - 1]
        const userCacheId = userCache[0].id_user_cache;
        const isFinished = vocabularyLastedOfTopic?.id_vocabulary === word?.id_vocabulary ? true : false
        let duration = null;

        if (isFinished && startTimeRef.current) {
            const endTime = Date.now();
            const diffMs = endTime - startTimeRef.current;
            duration = msToHHMMSS(diffMs);
        }

        const onePercentWord = 100 / vocabulary.length
        let progressPercent = 0

        for (let i = 0; i <= index; i++) {
            progressPercent += onePercentWord
        }

        try {
            const result = await saveHistoryProgress({
                isFinished: isFinished,
                finished_date: isFinished ? new Date().toISOString() : null,
                duration: isFinished ? duration : null,
                user_cache: userCacheId,
                progress_percent: progressPercent,
                topic: Number(vocabulary[index].topic),
                id_vocabulary_progress: word?.id_vocabulary || null
            });

            console.log("Save successful:", result);
        } catch (err) {
            console.error("Failures save progress:", err);
        }
    };

    const handleConfirmExit = () => {
        console.log("handleConfirmExit call");
        if (Platform.OS === 'web') {
            // Fallback cho web (browser)
            const wantSave = window.confirm(
                "Bạn có muốn lưu tiến độ trước khi thoát không?"
            );

            if (wantSave) {
                saveProgress().then(() => {
                    router.back();
                });
            } else {
                router.back();
            }
            return;
        }
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

            <Modal
                visible={showModal}
                transparent
                animationType="fade"
            >
                <View className="flex-1 justify-center items-center bg-black/40">
                    <View className="w-[90%] bg-white rounded-2xl p-5">

                        <Text className="text-lg font-bold mb-4 text-[#2E2A47]">
                            Add Vocabulary Note
                        </Text>

                        <TextInput
                            placeholder="Content note..."
                            placeholderTextColor="#9CA3AF"
                            value={contentNote}
                            onChangeText={setContentNote}
                            className="border border-gray-300 rounded-lg p-3 mb-3"
                        />

                        <TextInput
                            placeholder="Description note..."
                            placeholderTextColor="#9CA3AF"
                            value={descriptionNote}
                            onChangeText={setDescriptionNote}
                            multiline
                            numberOfLines={3}
                            className="border border-gray-300 rounded-lg p-3 mb-4"
                        />

                        <View className="flex-row justify-between mt-2">

                            <TouchableOpacity
                                onPress={() => setShowModal(false)}
                                className="flex-1 mr-2 bg-[#EF4444] border border-gray-300 py-3 rounded-xl items-center"
                            >
                                <Text className="text-white font-semibold">
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleSaveNote}
                                className="flex-1 ml-2 bg-[#22C55E] py-3 rounded-xl items-center"
                            >
                                <Text className="text-white font-semibold">
                                    Save
                                </Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </View>
            </Modal>

            <View className="flex-1 bg-gray-100">
                {/* HEADER */}
                <View className="pt-14 pb-6 px-6 flex-row justify-between items-center">
                    <Text className="text-3xl font-extrabold">
                        Topic {nameTopic}
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            vibrate();
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
                                    name={isSavedVocabulary(word.id_vocabulary) ? "bookmark" : "bookmark-outline"}
                                    size={28}
                                    color={isSavedVocabulary(word.id_vocabulary) ? "#FFA500" : "#666"}
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
                                ${isRecording ? 'bg-red-500' : 'bg-orange-100'}`}
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