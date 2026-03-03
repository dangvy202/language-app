import Loading from '@/component/loading';
import { fetchExerciseQuestions, submitExerciseProgress } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Animated, Easing } from 'react-native';
import { useUserCache } from '@/hook/useUserCache';

export default function ExerciseScreen() {
  const { id, time_limit } = useLocalSearchParams();
  const router = useRouter();

  const exerciseId = Number(id);
  const totalTime = Number(time_limit);

  const { cache: userCache, loadingCache, cacheError } = useUserCache();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [progressAnim] = useState(new Animated.Value(1))
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userSentence, setUserSentence] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<{ leftId: number; rightId: number }[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'complete' | null>(null);
  const [correctAnswerDisplay, setCorrectAnswerDisplay] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [expireAt, setExpireAt] = useState<number>(0);
  const urgentAnim = useRef(new Animated.Value(1)).current;

  const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null);
  const [wrongSound, setWrongSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    if (!totalTime) return;

    const expire = Date.now() + totalTime * 1000;
    setExpireAt(expire);
  }, [totalTime]);

  useEffect(() => {
    if (feedback === 'complete') {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [feedback]);

  useEffect(() => {
    if (timeLeft <= 10 && timeLeft > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(urgentAnim, { toValue: 0.4, duration: 600, useNativeDriver: true }),
          Animated.timing(urgentAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      urgentAnim.setValue(1);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (!totalTime || totalTime <= 0) return;

    const expire = Date.now() + totalTime * 1000;
    setExpireAt(expire);

    // Animation progress từ 1 → 0
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: totalTime * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      const remain = Math.max(0, Math.floor((expire - Date.now()) / 1000));
      setTimeLeft(remain);

      if (remain <= 0) {
        clearInterval(interval);
        handleTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [totalTime]);

  const handleTimeUp = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setFeedback('complete');
  };

  const handleSubmitProgress = async () => {
    try {
      if (!userCache || userCache.length === 0) {
          router.push('/Login');
          return;
      }
      await submitExerciseProgress({
        id_user: userCache[0].id_user_cache,
        id_exercise: exerciseId,
        score: score,
        completed_at: new Date().toISOString(),
      });

      console.log('Submit progress success');
    } catch (err) {
      console.log('Submit progress error:', err);
    }
  };

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

  useEffect(() => {
    setSelectedOption(null);
    setUserSentence([]);
    setSelectedLeft(null);
    setMatchedPairs([]);
    setFeedback(null);
    setCorrectAnswerDisplay('');
  }, [currentIndex]);

  const handleSelect = (optionId: number) => {
    setSelectedOption(optionId);
  };

  const handleWordClick = (word: string) => {
    if (userSentence.includes(word)) {
      setUserSentence(prev => prev.filter(w => w !== word));
    } else {
      setUserSentence(prev => [...prev, word]);
    }
  };

  const checkSentenceOrder = () => {
    const userAnswer = userSentence.join(' ').trim().toLowerCase();
    const correctAnswer = currentQuestion.correct_answer?.trim().toLowerCase() || '';
    return userAnswer === correctAnswer;
  };

  const handleSelectLeft = (leftId: number) => {
    if (selectedLeft === leftId) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(leftId);
    }
  };

  const handleSelectRight = (rightId: number) => {
    if (!selectedLeft) return;

    const alreadyMatched = matchedPairs.some(p => p.leftId === selectedLeft && p.rightId === rightId);
    if (alreadyMatched) {
      setMatchedPairs(prev => prev.filter(p => !(p.leftId === selectedLeft && p.rightId === rightId)));
    } else {
      setMatchedPairs(prev => [...prev, { leftId: selectedLeft, rightId }]);
    }

    setSelectedLeft(null);
  };

  const checkMatching = () => {
    if (!currentQuestion.left || !currentQuestion.right) return false;

    if (matchedPairs.length !== currentQuestion.left.length) return false;

    for (const pair of matchedPairs) {
      if (pair.leftId !== pair.rightId) {
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    let isCorrect = false;
    let correctText = '';

    if (currentQuestion.type === 'sentence_order') {
      isCorrect = checkSentenceOrder();
      correctText = currentQuestion.correct_answer || '(Không có đáp án đúng)';
    } else if (currentQuestion.type === 'matching') {
      isCorrect = checkMatching();

      if (isCorrect) {
        correctText = 'Đã nối đúng tất cả cặp từ!';
      } else {
        const correctPairsText = currentQuestion.left
          ?.map((leftItem: any) => {
            const rightItem = currentQuestion.right?.find(
              (r: any) => r.id === leftItem.id
            );
            return rightItem
              ? `${leftItem.text} → ${rightItem.text}`
              : '';
          })
          .join('\n');

        correctText = correctPairsText || 'Kiểm tra lại backend';
      }
    } else {
      if (!selectedOption) return;

      const selected = currentQuestion.options?.find(
        (o: any) => o.id_option === selectedOption || o.id_question_option === selectedOption
      );
      if (!selected) return;

      isCorrect = selected.is_correct;

      const correctOption = currentQuestion.options?.find((o: any) => o.is_correct === true);
      correctText = correctOption
        ? (correctOption.content || correctOption.option_text || correctOption.text || 'Đáp án đúng')
        : '(Không có đáp án đúng - kiểm tra backend)';
    }

    setCorrectAnswerDisplay(correctText);

    if (isCorrect) {
      setScore(prev => prev + (currentQuestion.points || 10));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await correctSound?.replayAsync();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      await wrongSound?.replayAsync();
    }

    setFeedback(isCorrect ? 'correct' : 'wrong');
  };

  const handleNext = () => {
    setFeedback(null);
    setSelectedOption(null);
    setUserSentence([]);
    setSelectedLeft(null);
    setMatchedPairs([]);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFeedback('complete');
    }
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
  if (feedback === 'complete') {
    return (
      <LinearGradient colors={['#1E1E2F', '#0F0F1A']} style={styles.gradient}>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
          <Animated.View
            style={[
              styles.completeContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Ionicons
              name="trophy"
              size={120}
              color="#FFD700"
              style={styles.completeTrophy}
            />

            <Text style={styles.completeTitle}>Hoàn thành xuất sắc!</Text>

            <View style={styles.completeScoreBox}>
              <Text style={styles.completeScore}>{score}</Text>
              <Text style={styles.completeScoreLabel}>ĐIỂM</Text>
            </View>

            <Text style={styles.completeMessage}>
              Bạn đã hoàn thành bài tập với {score} điểm. {'\n'}
              Tiếp tục cố lên nhé!
            </Text>

            <TouchableOpacity
              style={styles.completeButtonPrimary}
              onPress={async () => {
                await handleSubmitProgress();
                router.back();
              }}
            >
              <Text style={styles.completeButtonText}>LƯU & QUAY LẠI</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.completeButtonSecondary}
              onPress={() => {
                setCurrentIndex(0);
                setScore(0);
                setFeedback(null);
                setSelectedOption(null);
                setUserSentence([]);
                setSelectedLeft(null);
                setMatchedPairs([]);
              }}
            >
              <Text style={styles.completeButtonTextSecondary}>
                LÀM LẠI
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
  return (
    <LinearGradient colors={['#1E1E2F', '#0F0F1A']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
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

          {/* Timeline countdown */}
          <View style={styles.countdownContainer}>
            <View style={styles.countdownCircle}>
              {/* Ring gradient xoay */}
              <Animated.View
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    borderRadius: 50,
                    borderWidth: 5,
                    borderColor: 'transparent',
                    borderTopColor: timeLeft <= 10 ? '#F44336' : timeLeft <= 30 ? '#FF9800' : '#4CAF50',
                    transform: [
                      {
                        rotate: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['-90deg', '270deg'],
                        }),
                      },
                    ],
                  },
                ]}
              />

              {/* Inner circle + icon + time */}
              <Animated.View style={[
                styles.countdownInner,
                { opacity: timeLeft <= 10 ? urgentAnim : 1 },
              ]}>
                <Ionicons name="hourglass" size={22} color="#FFFFFF" style={{ marginBottom: 4 }} />
                <Text style={[
                  styles.countdownText,
                  timeLeft <= 10 && { color: '#F44336', fontSize: 9 },
                ]}>
                  {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
                  {(timeLeft % 60).toString().padStart(2, '0')}
                </Text>
              </Animated.View>
            </View>

            {/* Score */}
            <View style={styles.scoreContainer}>
              <Ionicons name="trophy" size={28} color="#FFD700" />
              <Text style={styles.scoreText}>{score}</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.questionTitle}>{currentQuestion.content || 'Câu hỏi'}</Text>

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

          {currentQuestion.type === 'sentence_order' ? (
            <>
              <View style={styles.sentenceOrderContainer}>
                {(() => {
                  let wordsArray = currentQuestion.words;
                  if (typeof wordsArray === 'string') {
                    try {
                      wordsArray = JSON.parse(wordsArray);
                    } catch (e) {
                      console.error('Lỗi parse words:', e);
                      wordsArray = [];
                    }
                  }
                  return Array.isArray(wordsArray) ? (
                    wordsArray.map((word: string, idx: number) => (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          styles.wordChip,
                          userSentence.includes(word) && styles.wordUsed,
                        ]}
                        onPress={() => handleWordClick(word)}
                        disabled={!!feedback}
                      >
                        <Text style={styles.wordText}>{word}</Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={{ color: 'red', textAlign: 'center' }}>
                      Lỗi: Dữ liệu words không hợp lệ
                    </Text>
                  );
                })()}
              </View>

              <View style={styles.userSentenceBox}>
                {userSentence.length === 0 ? (
                  <Text style={styles.placeholderText}>Click các từ để xây câu</Text>
                ) : (
                  userSentence.map((word, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.userWordChip}
                      onPress={() => handleWordClick(word)}
                      disabled={!!feedback}
                    >
                      <Text style={styles.userWordText}>{word}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </>
          ) : currentQuestion.type === 'matching' ? (
            <View style={styles.matchingContainer}>
              <View style={styles.matchingColumn}>
                <Text style={styles.matchingTitle}>Từ tiếng Anh</Text>
                {currentQuestion.left?.map((item: any) => {
                  const isSelected = selectedLeft === item.id;
                  const isMatched = matchedPairs.some(p => p.leftId === item.id);

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.matchingItem,
                        isSelected && styles.matchingSelected,
                        isMatched && styles.matchingMatched,
                      ]}
                      onPress={() => handleSelectLeft(item.id)}
                      disabled={!!feedback || isMatched}
                    >
                      <Text style={styles.matchingText}>{item.text}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.matchingColumn}>
                <Text style={styles.matchingTitle}>Nghĩa tiếng Việt</Text>
                {currentQuestion.right?.map((item: any) => {
                  const isMatched = matchedPairs.some(p => p.rightId === item.id);

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.matchingItem,
                        isMatched && styles.matchingMatched,
                      ]}
                      onPress={() => handleSelectRight(item.id)}
                      disabled={!!feedback || isMatched || !selectedLeft}
                    >
                      <Text style={styles.matchingText}>{item.text}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : (
            <View style={styles.optionsContainer}>
              {currentQuestion.options?.map((option: any) => {
                const optionId = option.id_option || option.id_question_option;
                const isSelected = selectedOption === optionId;
                const isCorrectOption = option.is_correct === true;

                const optionStyle = [
                  styles.optionButton,
                  isSelected && styles.optionSelected,
                  feedback === 'correct' && isCorrectOption && styles.optionCorrect,
                  feedback === 'wrong' && isSelected && !isCorrectOption && styles.optionWrong,
                ];

                return (
                  <TouchableOpacity
                    key={optionId}
                    style={optionStyle}
                    onPress={() => handleSelect(optionId)}
                    disabled={!!feedback}
                  >
                    <Text style={styles.optionText}>{option.content || option.option_text}</Text>
                    {feedback && isSelected && (
                      <Ionicons
                        name={feedback === 'correct' ? 'checkmark-circle' : 'close-circle'}
                        size={24}
                        color="white"
                        style={{ marginLeft: 12 }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Feedback box */}
          {feedback &&  (
            <View style={[
              styles.feedbackBox,
              feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong
            ]}>
              <Text style={styles.feedbackText}>
                {feedback === 'correct' ? 'Tuyệt!' : 'Sai rồi!'}
              </Text>
              {feedback === 'wrong' && correctAnswerDisplay && (
                <Text style={styles.correctAnswerText}>
                  Đáp án đúng: {correctAnswerDisplay}
                </Text>
              )}
            </View>
          )}
        </ScrollView>

        {/* Nút KIỂM TRA / TIẾP TỤC */}
        {!feedback ? (
          <TouchableOpacity
            style={[
              styles.submitButton,
              ((!selectedOption && currentQuestion.type !== 'sentence_order' && currentQuestion.type !== 'matching') ||
                (currentQuestion.type === 'sentence_order' && userSentence.length === 0) ||
                (currentQuestion.type === 'matching' && matchedPairs.length === 0)) && styles.submitDisabled,
            ]}
            disabled={
              (currentQuestion.type !== 'sentence_order' && currentQuestion.type !== 'matching' && !selectedOption) ||
              (currentQuestion.type === 'sentence_order' && userSentence.length === 0) ||
              (currentQuestion.type === 'matching' && matchedPairs.length !== currentQuestion.left?.length)
            }
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>KIỂM TRA</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={feedback === 'correct' ? styles.nextButtonCorrect : styles.nextButtonWrong}
            onPress={handleNext}
          >
            {feedback === 'correct' ? (
              <Text style={styles.nextTextCorrect}>TIẾP TỤC</Text>
            ) : (
              <Text style={styles.nextTextWrong}>ĐÃ HIỂU</Text>
            )}
          </TouchableOpacity>
        )}
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
  content: { padding: 24, paddingBottom: 180 },
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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
    flex: 1,
  },
  sentenceOrderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 24,
  },
  wordChip: {
    backgroundColor: '#2A2A3F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    margin: 6,
    borderWidth: 1,
    borderColor: '#444',
  },
  wordUsed: {
    opacity: 0.5,
    backgroundColor: '#3A3A5F',
  },
  wordText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  userSentenceBox: {
    backgroundColor: '#2A2A3F',
    borderRadius: 20,
    padding: 20,
    minHeight: 120,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 16,
    borderWidth: 2,
    borderColor: '#444',
  },
  userWordChip: {
    backgroundColor: '#3A3A5F',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    margin: 6,
  },
  userWordText: {
    color: 'white',
    fontSize: 16,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    alignSelf: 'center',
  },

  matchingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
  },
  matchingColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  matchingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  matchingItem: {
    backgroundColor: '#2A2A3F',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginVertical: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  matchingSelected: {
    borderColor: '#BB86FC',
    backgroundColor: '#3A3A5F',
  },
  matchingMatched: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
    opacity: 0.8,
  },
  matchingText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },

  feedbackBox: {
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
  },
  feedbackCorrect: {
    backgroundColor: '#4CAF50',
  },
  feedbackWrong: {
    backgroundColor: '#F44336',
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  correctAnswerText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
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
  nextButtonCorrect: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 6,
  },
  nextButtonWrong: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
    backgroundColor: 'red',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 6,
  },
  nextTextCorrect: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  nextTextWrong: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  completeBox: {
    marginTop: 40,
    marginHorizontal: 24,
    paddingVertical: 40,
    paddingHorizontal: 32,
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    elevation: 8,
  },
  completeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
  },
  completeSubText: {
    fontSize: 18,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 10,
  },
  continueText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdownCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 47, 0.9)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    marginRight: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  countdownInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E1E2F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  countdownText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  countdownUrgent: {
    color: '#F44336',
    fontSize: 9,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.4)',
  },
  scoreText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '900',
    marginLeft: 8,
  },
  completeContainer: {
    marginTop: 60,
    marginHorizontal: 24,
    padding: 32,
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#4CAF50',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
completeTrophy: {
  marginBottom: 24,
  shadowColor: '#FFD700',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.6,
  shadowRadius: 10,
},
completeTitle: {
  fontSize: 32,
  fontWeight: 'bold',
  color: '#4CAF50',
  marginBottom: 16,
  textAlign: 'center',
},
completeScoreBox: {
  flexDirection: 'row',
  alignItems: 'baseline',
  marginVertical: 16,
},
completeScore: {
  fontSize: 64,
  fontWeight: '900',
  color: '#FFD700',
},
completeScoreLabel: {
  fontSize: 24,
  color: '#FFD700',
  marginLeft: 8,
},
completeMessage: {
  fontSize: 18,
  color: '#E0E0E0',
  textAlign: 'center',
  marginBottom: 32,
  lineHeight: 28,
},
completeButtonPrimary: {
  backgroundColor: '#4CAF50',
  paddingVertical: 18,
  paddingHorizontal: 60,
  borderRadius: 30,
  marginBottom: 16,
  elevation: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
},
completeButtonText: {
  color: 'white',
  fontSize: 20,
  fontWeight: 'bold',
},
completeButtonSecondary: {
  backgroundColor: 'transparent',
  borderWidth: 2,
  borderColor: '#4CAF50',
  paddingVertical: 16,
  paddingHorizontal: 60,
  borderRadius: 30,
},
completeButtonTextSecondary: {
  color: '#4CAF50',
  fontSize: 18,
  fontWeight: 'bold',
},
});