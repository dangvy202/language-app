import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    KeyboardAvoidingView,
    TextInput,
    Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { getClientEndpoint } from '@/constants/configApi';
import Loading from '@/component/loading';
import { StatsItem } from '@/interfaces/interfaces';

export default function ReadingExamScreen() {
    const { id, time_limit } = useLocalSearchParams();
    const router = useRouter();
    const [showFullPassage, setShowFullPassage] = useState(false);
    const [data, setData] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(600);
    const [expandedExplain, setExpandedExplain] = useState<number | null>(null);

    useEffect(() => {
        fetchReading();
    }, []);

    const fetchReading = async () => {
        try {
            const response = await fetch(getClientEndpoint(`reading/${id}/`));
            const result = await response.json();
            setData(result);
            setTime(result.exercises_premium?.[0]?.time_limit || 1800);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (submitted) return;
        const t = setInterval(() => {
            setTime((p) => (p > 0 ? p - 1 : 0));
        }, 1000);
        return () => clearInterval(t);
    }, [submitted]);

    useEffect(() => {
        if (time === 0 && !submitted) {
            submit();
        }
    }, [time]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const selectAnswer = (qid: number, option: string) => {
        if (submitted) return;
        setAnswers((p) => ({ ...p, [qid]: option }));
    };


    if (!data) {
        return <Loading />
    }

    const exercise = data?.exercises_premium?.[0];

    const questionGroups = exercise?.question_groups || [];

    const submit = () => {
        let totalScore = 0;

        questionGroups.forEach((group: any) => {
            group.questions.forEach((q: any) => {
                if (isCorrectAnswer(q)) {
                    totalScore += Number(q.points);
                }
            });
        });

        setScore(totalScore);
        setSubmitted(true);
    };

    const retry = () => {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
        setTime(exercise?.time_limit || 1800);
    };

    const isCorrectAnswer = (q: any) => {
        const userAnswer =
            answers[q.id_question_premium]?.trim().toLowerCase();

        if (q.options?.length > 0) {
            const correctOption = q.options.find(
                (x: any) => x.is_correct
            )?.content?.trim().toLowerCase();

            return userAnswer === correctOption;
        }

        return (
            userAnswer ===
            q.correct_answer?.trim().toLowerCase()
        );
    };

    const totalQuestions = questionGroups.reduce((sum: number, group: any) => sum + group.questions.length, 0);

    const answeredCount = Object.keys(answers).length;
    const progressPercentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

    const getStats = (): StatsItem[] => {
        return questionGroups.map((group: any) => {
            let correct = 0;
            let wrong = 0;
            let skipped = 0;

            group.questions.forEach((q: any) => {
                const answer = answers[q.id_question_premium];

                if (!answer) {
                    skipped++;
                } else if (isCorrectAnswer(q)) {
                    correct++;
                } else {
                    wrong++;
                }
            });

            return {
                title: group.title,
                total: group.questions.length,
                correct,
                wrong,
                skipped,
            };
        });
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
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
                                {answeredCount} / {totalQuestions}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <Image source={{ uri: data.img_path }} style={styles.heroImage} />
                    <Text style={styles.title}>{data.title}</Text>

                    <View style={styles.passageCard}>
                        <View style={styles.passageHeader}>
                            <Ionicons name="book-outline" size={22} color="#FF6B00" />
                            <Text style={styles.passageTitle}>Reading Passage</Text>
                        </View>
                        <Text
                            style={styles.passage}
                            selectable
                            numberOfLines={showFullPassage ? undefined : 10}
                        >
                            {data.content}
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                setShowFullPassage(!showFullPassage)
                            }
                        >
                            <Text style={{ color: '#FF6B00' }}>
                                {showFullPassage
                                    ? 'Hide Passage ▲'
                                    : 'Show Full Passage ▼'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {questionGroups.map((group: any) => (
                        <View
                            key={group.id_question_premium_group}
                            style={{ marginBottom: 24 }}
                        >
                            <View
                                style={{
                                    backgroundColor: '#FFF7ED',
                                    padding: 16,
                                    borderRadius: 16,
                                    marginBottom: 12,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: '700',
                                        color: '#EA580C',
                                    }}
                                >
                                    {group.title}
                                </Text>

                                <Text
                                    style={{
                                        marginTop: 8,
                                        color: '#475569',
                                    }}
                                >
                                    {group.instruction}
                                </Text>
                            </View>

                            {group.questions.map((q: any) => (
                                <View
                                    key={q.id_question_premium}
                                    style={styles.questionCard}
                                >
                                    <Text style={styles.question}>
                                        {q.content}
                                    </Text>

                                    {q.options?.length > 0 ? (
                                        q.options.map((op: any) => {
                                            const selected = answers[q.id_question_premium] === op.content;
                                            const isCorrect = op.is_correct;
                                            const isWrong = selected && !op.is_correct;
                                            return (
                                                <TouchableOpacity
                                                    key={
                                                        op.id_question_premium_option
                                                    }
                                                    onPress={() =>
                                                        selectAnswer(
                                                            q.id_question_premium,
                                                            op.content
                                                        )
                                                    }
                                                    style={[
                                                        styles.option,
                                                        !submitted &&
                                                        selected &&
                                                        styles.selectedOption,

                                                        submitted &&
                                                        isCorrect &&
                                                        styles.correctOption,

                                                        submitted &&
                                                        isWrong &&
                                                        styles.wrongOption,
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.optionText,
                                                            submitted && isCorrect && styles.correctText,
                                                            submitted && isWrong && styles.wrongText,
                                                        ]}
                                                    >
                                                        {op.content}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })
                                    ) : (
                                        <TextInput
                                            value={
                                                answers[q.id_question_premium] || ''
                                            }
                                            onChangeText={(text) =>
                                                selectAnswer(
                                                    q.id_question_premium,
                                                    text
                                                )
                                            }
                                            placeholderTextColor="#999"
                                            placeholder="Type your answer..."
                                            style={{
                                                borderWidth: 1,
                                                borderColor: '#CBD5E1',
                                                borderRadius: 12,
                                                padding: 14,
                                                fontSize: 16,
                                                backgroundColor: '#fff',
                                            }}
                                        />
                                    )}
                                    {submitted && (
                                        <>
                                            {q.explain_question && (
                                                <>
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            setExpandedExplain(
                                                                expandedExplain === q.id_question_premium
                                                                    ? null
                                                                    : q.id_question_premium
                                                            )
                                                        }
                                                        style={styles.explainButton}
                                                    >
                                                        <Ionicons
                                                            name={
                                                                expandedExplain === q.id_question_premium
                                                                    ? 'chevron-up'
                                                                    : 'chevron-down'
                                                            }
                                                            size={18}
                                                            color="#FF6B00"
                                                        />
                                                        <Text style={styles.explainButtonText}>
                                                            Explanation
                                                        </Text>
                                                    </TouchableOpacity>

                                                    {expandedExplain === q.id_question_premium && (
                                                        <View style={styles.explainCard}>
                                                            <Text style={styles.explainTitle}>
                                                                💡 Explanation
                                                            </Text>

                                                            <Text style={styles.explainText}>
                                                                {q.explain_question}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </>
                                            )}

                                            <View
                                                style={{
                                                    marginTop: 10,
                                                    padding: 12,
                                                    borderRadius: 12,
                                                    backgroundColor: isCorrectAnswer(q)
                                                        ? '#DCFCE7'
                                                        : '#FEE2E2',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: isCorrectAnswer(q)
                                                            ? '#166534'
                                                            : '#991B1B',
                                                        fontWeight: '700',
                                                    }}
                                                >
                                                    {isCorrectAnswer(q)
                                                        ? '✓ Correct'
                                                        : `✗ Correct Answer: ${q.options?.find((x: any) => x.is_correct)?.content ||
                                                        q.correct_answer
                                                        }`}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                </View>
                            ))}
                        </View>
                    ))}

                    {submitted && (
                        <View style={styles.resultCard}>
                            <Text style={styles.resultTitle}>Your Score</Text>
                            <Text style={styles.score}>
                                {score} <Text style={styles.total}>/ {exercise.points}</Text>
                            </Text>
                            <Text style={styles.resultMessage}>
                                {score === exercise.points
                                    ? "Perfect! You're a genius! 🔥"
                                    : score >= exercise.points / 2
                                        ? 'Well done! Keep improving!'
                                        : 'Good effort! Try again!'}
                            </Text>
                            <View style={styles.statsCard}>
                                <Text style={styles.statsTitle}>
                                    Detailed Statistics
                                </Text>

                                {getStats().map((item, index) => (
                                    <View
                                        key={index}
                                        style={styles.statsRow}
                                    >
                                        <Text style={styles.statsType}>
                                            {item.title}
                                        </Text>

                                        <Text style={styles.statsNumber}>
                                            {item.total}
                                        </Text>

                                        <Text
                                            style={[
                                                styles.statsNumber,
                                                { color: '#16A34A' },
                                            ]}
                                        >
                                            {item.correct}
                                        </Text>

                                        <Text
                                            style={[
                                                styles.statsNumber,
                                                { color: '#DC2626' },
                                            ]}
                                        >
                                            {item.wrong}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                    )}
                </ScrollView>

                <View style={styles.cta}>
                    {!submitted ? (
                        <TouchableOpacity
                            style={[styles.button, answeredCount < totalQuestions && styles.buttonDisabled]}
                            onPress={submit}
                            disabled={answeredCount < totalQuestions}
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
        </KeyboardAvoidingView>

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
    explainButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#FFF7ED',
    },

    explainButtonText: {
        marginLeft: 6,
        color: '#FF6B00',
        fontWeight: '700',
    },

    explainCard: {
        marginTop: 10,
        backgroundColor: '#FFF7ED',
        borderRadius: 14,
        padding: 14,
        borderLeftWidth: 4,
        borderLeftColor: '#FF6B00',
    },

    explainTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#EA580C',
        marginBottom: 8,
    },

    explainText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#475569',
    },
    statsCard: {
        marginTop: 24,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 16,
    },

    statsTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        color: '#0F172A',
    },

    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },

    statsType: {
        flex: 3,
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
    },

    statsNumber: {
        flex: 1,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '700',
    },
});