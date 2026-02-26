import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Mock data giống ảnh bạn gửi
const mockQuestion = {
    question: '"Arrival" có nghĩa là...',
    example: 'I bought tickets for a flight that lands at 10 a.m. because I prefer an early arrival.',
    highlightWord: 'arrival',
    options: [
        'leaving a place',
        'staying at a place',
        'getting to a place',
    ],
    correctAnswer: 'getting to a place',
    hearts: 25,
};

export default function ExerciseScreen() {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleSelect = (option: string) => {
        setSelectedOption(option);
        setShowFeedback(true);

        const isCorrect = option === mockQuestion.correctAnswer;
        setTimeout(() => {
            Alert.alert(
                isCorrect ? 'Tuyệt vời!' : 'Sai rồi!',
                isCorrect ? 'Bạn đúng rồi!' : `Đáp án đúng là "${mockQuestion.correctAnswer}"`,
                [{ text: 'Tiếp theo', onPress: () => setShowFeedback(false) }]
            );
        }, 800);
    };

    return (
        <LinearGradient colors={['#1E1E2F', '#0F0F1A']} style={styles.gradient}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.closeButton}>
                        <Ionicons name="close" size={32} color="white" />
                    </TouchableOpacity>

                    <View style={styles.progressBarContainer}>
                        <View style={styles.progressBg}>
                            <View style={[styles.progressFill, { width: '76%' }]} /> {/* 76% giống ảnh */}
                        </View>
                    </View>

                    <View style={styles.heartsContainer}>
                        <Ionicons name="flash" size={28} color="#FFD700" />
                        <Text style={styles.heartsText}>{mockQuestion.hearts}</Text>
                    </View>
                </View>

                {/* Câu hỏi chính */}
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.questionTitle}>"Arrival" có nghĩa là...</Text>

                    <View style={styles.exampleContainer}>
                        {/* <View style={styles.speakerButton}>
              <Ionicons name="volume-high" size={28} color="#2196F3" />
            </View> */}

                        <Text style={styles.exampleText}>
                            I bought tickets for a flight that lands at 10 a.m. because I prefer an early{' '}
                            <Text style={styles.highlightWord}>{mockQuestion.highlightWord}</Text>.
                        </Text>
                    </View>

                    {/* Các lựa chọn */}
                    <View style={styles.optionsContainer}>
                        {mockQuestion.options.map((option, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.optionButton,
                                    selectedOption === option && styles.optionSelected,
                                    showFeedback && option === mockQuestion.correctAnswer && styles.optionCorrect,
                                    showFeedback && selectedOption === option && option !== mockQuestion.correctAnswer && styles.optionWrong,
                                ]}
                                onPress={() => handleSelect(option)}
                                disabled={showFeedback}
                            >
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                {/* Nút KIỂM TRA (Submit) */}
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        !selectedOption && styles.submitDisabled,
                    ]}
                    disabled={!selectedOption || showFeedback}
                    onPress={() => {
                        // Mock submit
                        setShowFeedback(true);
                        const isCorrect = selectedOption === mockQuestion.correctAnswer;
                        Alert.alert(
                            isCorrect ? 'Đúng rồi!' : 'Sai rồi!',
                            isCorrect ? 'Bạn đã chọn đúng!' : `Đáp án đúng là "${mockQuestion.correctAnswer}"`,
                            [{ text: 'Tiếp theo', onPress: () => setShowFeedback(false) }]
                        );
                    }}
                >
                    <Text style={styles.submitText}>KIỂM TRA</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 8,
    },
    closeButton: { padding: 8 },
    progressBarContainer: { flex: 1, marginHorizontal: 16 },
    progressBg: {
        height: 12,
        backgroundColor: '#333',
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FFA500',
    },
    heartsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    heartsText: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    content: { padding: 24, paddingBottom: 120 },
    questionTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 24,
        textAlign: 'center',
    },
    exampleContainer: {
        backgroundColor: '#2A2A3F',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
    },
    speakerButton: {
        backgroundColor: '#2196F3',
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    exampleText: {
        fontSize: 18,
        color: '#E0E0E0',
        lineHeight: 28,
        textAlign: 'center',
    },
    highlightWord: {
        color: '#BB86FC',
        fontWeight: 'bold',
    },
    optionsContainer: {
        marginTop: 16,
    },
    optionButton: {
        backgroundColor: '#2A2A3F',
        paddingVertical: 20,
        borderRadius: 16,
        marginVertical: 8,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#444',
    },
    optionSelected: {
        borderColor: '#BB86FC',
    },
    optionCorrect: {
        backgroundColor: '#4CAF50',
        borderColor: '#388E3C',
    },
    optionWrong: {
        backgroundColor: '#F44336',
        borderColor: '#D32F2F',
    },
    optionText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '600',
    },
    submitButton: {
        position: 'absolute',
        bottom: 20,
        left: 24,
        right: 24,
        backgroundColor: '#FB8500',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        elevation: 6,
    },
    submitDisabled: {
        backgroundColor: '#666',
    },
    submitText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
});