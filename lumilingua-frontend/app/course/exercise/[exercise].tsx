import Loading from '@/component/loading';
import { fetchExerciseQuestions } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import * as Haptics from 'expo-haptics';


export default function ExerciseScreen() {
  const { exercise } = useLocalSearchParams<{ exercise: string }>();
  const router = useRouter();

  const exerciseId = Number(exercise);

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null);
  const [wrongSound, setWrongSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    const loadSounds = async () => {
      try {
        const { sound: correct } = await Audio.Sound.createAsync(
          require('@/assets/sound/true-sound.mp3')
        );
        const { sound: wrong } = await Audio.Sound.createAsync(
          require('@/assets/sound/false-sound.mp3')
        );

        setCorrectSound(correct);
        setWrongSound(wrong);
      } catch (err) {
        console.log('Lỗi load âm thanh:', err);
      }
    };

    loadSounds();

    return () => {
      correctSound?.unloadAsync();
      wrongSound?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!exerciseId || isNaN(exerciseId)) {
        setError('ID bài tập không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchExerciseQuestions(exerciseId);

        const questionList = Array.isArray(data) ? data : data.results || data.questions || [];
        setQuestions(questionList);

        if (questionList.length === 0) {
          setError('Bài tập này chưa có câu hỏi');
        }
      } catch (err: any) {
        setError(err.message || 'Không thể tải bài tập');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [exerciseId]);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (optionId: number) => {
    setSelectedOption(optionId);
  };

  const handleSubmit = async () => {
    if (!selectedOption) return;

    const selected = currentQuestion.options.find(
      (o: any) => o.id_option === selectedOption || o.id_question_option === selectedOption
    );
    if (!selected) return;

    const isCorrect = selected.is_correct;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      if (isCorrect) {
        await correctSound?.replayAsync();
      } else {
        await wrongSound?.replayAsync();
      }
    } catch (err) {
      console.log('Lỗi phát âm thanh:', err);
    }

    setShowFeedback(true);

    setTimeout(() => {
      Alert.alert(
        isCorrect ? 'Tuyệt vời!' : 'Sai rồi!',
        isCorrect ? 'Bạn chọn đúng đáp án!' : `Đáp án đúng là "${currentQuestion.options.find((o: any) => o.is_correct)?.option_text}"`,
        [
          {
            text: currentIndex < questions.length - 1 ? 'Tiếp theo' : 'Hoàn thành',
            onPress: () => {
              setShowFeedback(false);
              setSelectedOption(null);

              if (currentIndex < questions.length - 1) {
                setCurrentIndex(currentIndex + 1);
              } else {
                Alert.alert(
                  'Hoàn thành bài tập!',
                  'Bạn đã làm xong tất cả câu hỏi.',
                  [{ text: 'Quay lại', onPress: () => router.back() }]
                );
              }
            },
          },
        ]
      );
    }, 800);
  };

  if (loading) return <Loading />;
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1E2F' }}>
        <Text style={{ color: 'white', fontSize: 18, marginBottom: 20 }}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#FFA500', fontSize: 16 }}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1E2F' }}>
        <Text style={{ color: 'white', fontSize: 18 }}>Không có câu hỏi nào</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#1E1E2F', '#0F0F1A']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${((currentIndex + 1) / questions.length) * 100}%` },
                ]}
              />
            </View>
          </View>

          <View style={styles.heartsContainer}>
            <Ionicons name="flash" size={28} color="#FFD700" />
            <Text style={styles.heartsText}>25</Text>
          </View>
        </View>

        {/* Nội dung câu hỏi */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.questionTitle}>{currentQuestion.content || currentQuestion.question_text || 'Câu hỏi'}</Text>

          {currentQuestion.example && (
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleText}>
                {currentQuestion.example.replace(
                  currentQuestion.highlight_word || '',
                  <Text style={styles.highlightWord}>{currentQuestion.highlight_word || ''}</Text>
                )}
              </Text>
            </View>
          )}

          {/* Các lựa chọn */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options?.map((option: any) => (
              <TouchableOpacity
                key={option.id_option || option.id_question_option}
                style={[
                  styles.optionButton,
                  selectedOption === (option.id_option || option.id_question_option) && styles.optionSelected,
                  showFeedback && option.is_correct && styles.optionCorrect,
                  showFeedback && selectedOption === (option.id_option || option.id_question_option) && !option.is_correct && styles.optionWrong,
                ]}
                onPress={() => handleSelect(option.id_option || option.id_question_option)}
                disabled={showFeedback}
              >
                <Text style={styles.optionText}>{option.option_text || option.content}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Nút KIỂM TRA */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !selectedOption && styles.submitDisabled,
          ]}
          disabled={!selectedOption || showFeedback}
          onPress={handleSubmit}
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