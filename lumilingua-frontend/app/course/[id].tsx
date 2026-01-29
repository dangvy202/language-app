import { View, Text, Dimensions, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolate,
    runOnJS,
} from 'react-native-reanimated';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

import Loading from '@/component/loading';
import useFetch from '@/services/useFetch';
import { fetchMeanByVocabularyAndLanguage, fetchVocabularyByLevelId } from '@/services/api';
import Notfound from '@/component/404';

const { width } = Dimensions.get('window');
const SWIPE_LIMIT = width * 0.25;

export default function VocabularyByLevel() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const levelId = Number(id);

    const { data, loading, error } = useFetch(
        () => fetchVocabularyByLevelId({ levelId }),
        true
    );

    const vocabulary = data ?? [];
    const [index, setIndex] = useState(0);

    /* ===================== MEANING STATE ===================== */
    const [meaning, setMeaning] = useState<string | null>(null);
    const [example, setExample] = useState<string | null>(null);
    const [loadingMean, setLoadingMean] = useState(false);


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
            });;
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

    /* ===================== GESTURE (TINDER STYLE) ===================== */
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
        <View className="flex-1 bg-gray-100">
            {/* HEADER */}
            <View className="pt-14 pb-6 px-6 flex-row justify-between items-center">
                <Text className="text-3xl font-extrabold">
                    Level {id}
                </Text>
                <TouchableOpacity
                    onPress={() => router.back()}
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
                        className="w-[340px] h-[500px] bg-white rounded-[48px] shadow-2xl px-8 py-10"
                    >
                        {/* SPEAK */}
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
            <View className="flex-row justify-between px-16 pb-10">
                <Ionicons
                    name="chevron-back-circle"
                    size={64}
                    color={index === 0 ? '#ccc' : '#FFA500'}
                    onPress={prevCard}
                />
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
    );
}

const styles = StyleSheet.create({
    imgWord: {
        width: 230,
        height: 110
    }
})