import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ReadingExamScreen() {
    const { id, time_limit } = useLocalSearchParams();
    const router = useRouter();

    const [data, setData] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(600);

    useEffect(() => {
        setTimeout(() => {
            setData({
                title: 'AI and the Future of Work',
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
                passage:
                    'Artificial Intelligence is transforming industries worldwide. Many jobs are being automated, while new opportunities are created in technology, data science, and AI development. The key to thriving in this new era is continuous learning and adaptability.',
                questions: [
                    {
                        id: 1,
                        question: 'What is AI mainly doing to the workforce?',
                        options: ['Creating jobs only', 'Automating jobs', 'Removing all jobs', 'No impact'],
                        correct: 'Automating jobs',
                    },
                    {
                        id: 2,
                        question: 'Which field is growing due to AI?',
                        options: ['Agriculture', 'Data Science', 'Fishing', 'Construction only'],
                        correct: 'Data Science',
                    },
                ],
            });
        }, 300);
    }, []);

    useEffect(() => {
        if (submitted) return;
        const t = setInterval(() => {
            setTime((p) => (p > 0 ? p - 1 : 0));
        }, 1000);
        return () => clearInterval(t);
    }, [submitted]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const selectAnswer = (qid: number, option: string) => {
        if (submitted) return;
        setAnswers((p) => ({ ...p, [qid]: option }));
    };

    const submit = () => {
        let c = 0;
        data.questions.forEach((q: any) => {
            if (answers[q.id] === q.correct) c++;
        });
        setScore(c);
        setSubmitted(true);
    };

    const retry = () => {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
        setTime(600);
    };

    if (!data) {
        return (
            <View style={styles.loading}>
                <Text style={styles.loadingText}>Loading exam...</Text>
            </View>
        );
    }

    const answeredCount = Object.keys(answers).length;
    const progressPercentage = (answeredCount / data.questions.length) * 100;

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <LinearGradient colors={['#1E2937', '#334155']} style={styles.header}>
                <View style={styles.headerContent}>
                    {/* LEFT: Back + Timer */}
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={26} color="#fff" />
                        </TouchableOpacity>

                        <View style={styles.timerBox}>
                            <Ionicons name="time-outline" size={20} color="#FF6B00" />
                            <Text style={styles.timer}>{formatTime(time)}</Text>
                        </View>
                    </View>

                    {/* CENTER: Progress Bar */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${progressPercentage}%` },
                                ]}
                            />
                        </View>
                    </View>

                    {/* RIGHT: Progress Count (0/2) */}
                    <View style={styles.progressCount}>
                        <Text style={styles.progressText}>
                            {answeredCount} / {data.questions.length}
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Image source={{ uri: data.image }} style={styles.heroImage} />
                <Text style={styles.title}>{data.title}</Text>

                <View style={styles.passageCard}>
                    <View style={styles.passageHeader}>
                        <Ionicons name="book-outline" size={22} color="#FF6B00" />
                        <Text style={styles.passageTitle}>Reading Passage</Text>
                    </View>
                    <Text style={styles.passage}>{data.passage}</Text>
                </View>

                {data.questions.map((q: any, index: number) => (
                    <View key={q.id} style={styles.questionCard}>
                        <Text style={styles.questionNumber}>Question {index + 1}</Text>
                        <Text style={styles.question}>{q.question}</Text>

                        {q.options.map((op: string) => {
                            const selected = answers[q.id] === op;
                            const isCorrect = submitted && op === q.correct;
                            const isWrong = submitted && selected && op !== q.correct;

                            return (
                                <TouchableOpacity
                                    key={op}
                                    onPress={() => selectAnswer(q.id, op)}
                                    style={[
                                        styles.option,
                                        selected && !submitted && styles.selectedOption,
                                        isCorrect && styles.correctOption,
                                        isWrong && styles.wrongOption,
                                    ]}
                                    disabled={submitted}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            isCorrect && styles.correctText,
                                            isWrong && styles.wrongText,
                                        ]}
                                    >
                                        {op}
                                    </Text>
                                    {isCorrect && <Ionicons name="checkmark-circle" size={24} color="#16A34A" />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}

                {submitted && (
                    <View style={styles.resultCard}>
                        <Text style={styles.resultTitle}>🎉 Your Score</Text>
                        <Text style={styles.score}>
                            {score} <Text style={styles.total}>/ {data.questions.length}</Text>
                        </Text>
                        <Text style={styles.resultMessage}>
                            {score === data.questions.length
                                ? "Perfect! You're a genius! 🔥"
                                : score >= data.questions.length / 2
                                ? 'Well done! Keep improving!'
                                : 'Good effort! Try again!'}
                        </Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.cta}>
                {!submitted ? (
                    <TouchableOpacity
                        style={[styles.button, answeredCount < data.questions.length && styles.buttonDisabled]}
                        onPress={submit}
                        disabled={answeredCount < data.questions.length}
                    >
                        <Text style={styles.buttonText}>Submit Exam</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.retryButton} onPress={retry}>
                        <Text style={styles.buttonText}>Try Again</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },

    loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
    loadingText: { fontSize: 18, color: '#64748B' },

    header: {
        height: 100,
        paddingVertical: 18,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 30
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    backButton: { padding: 4 },
    timerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 107, 0, 0.15)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 30,
        gap: 6,
    },
    timer: { color: '#FF6B00', fontWeight: '700', fontSize: 16 },

    /* Progress Bar ở giữa */
    progressContainer: {
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 20,
    },
    progressBar: {
        height: 9,
        width: '100%',
        maxWidth: 260,
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 999,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FF6B00',
        borderRadius: 999,
    },

    /* Progress Count (0/2) bên phải */
    progressCount: {
        minWidth: 50,
        alignItems: 'flex-end',
    },
    progressText: {
        color: '#E2E8F0',
        fontWeight: '700',
        fontSize: 15,
    },

    content: { padding: 16, paddingBottom: 100 },

    heroImage: { width: '100%', height: 220, borderRadius: 20, marginBottom: 20 },
    title: { fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 20, lineHeight: 32 },

    passageCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 8,
    },
    passageHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
    passageTitle: { fontSize: 18, fontWeight: '700', color: '#FF6B00' },
    passage: { fontSize: 16.5, lineHeight: 26, color: '#334155' },

    questionCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 15,
        elevation: 6,
    },
    questionNumber: { color: '#FF6B00', fontWeight: '700', marginBottom: 8 },
    question: { fontSize: 17.5, fontWeight: '700', color: '#1E2937', marginBottom: 16, lineHeight: 26 },

    option: {
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedOption: { backgroundColor: '#FFF7ED', borderColor: '#FF6B00' },
    correctOption: { backgroundColor: '#DCFCE7', borderColor: '#16A34A' },
    wrongOption: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
    optionText: { fontSize: 16, fontWeight: '600', color: '#334155', flex: 1 },
    correctText: { color: '#166534', fontWeight: '700' },
    wrongText: { color: '#991B1B', fontWeight: '700' },

    resultCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.1,
        shadowRadius: 25,
        elevation: 10,
    },
    resultTitle: { fontSize: 20, fontWeight: '700', color: '#64748B', marginBottom: 8 },
    score: { fontSize: 52, fontWeight: '900', color: '#FF6B00', marginVertical: 8 },
    total: { fontSize: 24, color: '#94A3B8', fontWeight: '600' },
    resultMessage: { fontSize: 16, color: '#475569', textAlign: 'center', marginTop: 8 },

    cta: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    button: {
        backgroundColor: '#FF6B00',
        paddingVertical: 18,
        borderRadius: 18,
        alignItems: 'center',
    },
    buttonDisabled: { backgroundColor: '#94A3B8' },
    retryButton: {
        backgroundColor: '#16A34A',
        paddingVertical: 18,
        borderRadius: 18,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});