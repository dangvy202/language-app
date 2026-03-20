import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getSupportFAQ } from '@/services/api';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQGroup {
  topic: string;
  items: FAQItem[];
  icon: string;
  color: string;
}

export default function SupportFAQ() {
  const router = useRouter();
  const [faqGroups, setFaqGroups] = useState<FAQGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [expandedQ, setExpandedQ] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getSupportFAQ();

        if (res.code === 200 && res.data && Array.isArray(res.data)) {
          const grouped = res.data.reduce(
            (
              acc: Record<string, { items: FAQItem[]; icon: string }>,
              item: any
            ) => {
              const topic = item.featureAppResponse?.featureName || 'Khác';
              const icon = item.featureAppResponse?.icon || 'help-circle-outline';

              if (!acc[topic]) {
                acc[topic] = {
                  items: [],
                  icon: icon,
                };
              }

              acc[topic].items.push({
                q: item.question,
                a: item.answer,
              });

              return acc;
            },
            {}
          );

          const groups: FAQGroup[] = Object.entries(grouped).map(([topic, data]) => {
            const d = data as any;

            return {
              topic,
              items: d.items,
              icon: d.icon,
              color: '#FFA500',
            };
          });

          setFaqGroups(groups);
        } else {
          setError('Không tải được dữ liệu FAQ từ server');
        }
      } catch (err: any) {
        setError(err.message || 'Lỗi kết nối khi tải FAQ');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQ();
  }, []);

  const toggleTopic = (topic: string) => {
    setExpandedTopic(expandedTopic === topic ? null : topic);
    if (expandedTopic !== topic) setExpandedQ(null);
  };

  const toggleQuestion = (q: string) => {
    setExpandedQ(expandedQ === q ? null : q);
  };

  const openSupportEmail = async () => {
    const email = 'support@lumilingua.com';
    const subject = 'Hỗ trợ từ Lumilingua App';
    const body = `Xin chào team,\n\nTôi gặp vấn đề: ...\nEmail đăng ký: ...\nThiết bị: ${Platform.OS} ${Platform.Version}\nPhiên bản app: ...`;

    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      if (await Linking.canOpenURL(url)) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Không mở được email', 'Vui lòng gửi thủ công đến support@lumilingua.com');
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể mở ứng dụng email');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA500" />
        <Text style={styles.loadingText}>Đang tải FAQ...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={60} color="#FF6347" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => {
            setLoading(true);
            setError(null);
          }}
        >
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Gradient */}
      <LinearGradient
        colors={['#FFA500', '#FF8C00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hỗ trợ & FAQ</Text>
        <Text style={styles.headerSubtitle}>Giải đáp nhanh hoặc liên hệ trực tiếp</Text>
      </LinearGradient>

      {/* FAQ Content */}
      <View style={styles.content}>
        {faqGroups.map((group) => (
          <Animated.View
            key={group.topic}
            entering={FadeInDown.duration(400).springify()}
            style={styles.card}
          >
            <TouchableOpacity
              style={styles.topicRow}
              onPress={() => toggleTopic(group.topic)}
              activeOpacity={0.8}
            >
              <View style={[styles.topicIcon, { backgroundColor: `${group.color}20` }]}>
                <Ionicons name={group.icon as any} size={26} color={group.color} />
              </View>
              <Text style={styles.topicText}>{group.topic}</Text>
              <Ionicons
                name={expandedTopic === group.topic ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#FFA500"
              />
            </TouchableOpacity>

            {expandedTopic === group.topic && (
              <View style={styles.questionsWrap}>
                {group.items.map((item: FAQItem) => (
                  <View key={item.q} style={styles.questionCard}>
                    <TouchableOpacity
                      style={styles.questionRow}
                      onPress={() => toggleQuestion(item.q)}
                    >
                      <Text style={styles.question}>{item.q}</Text>
                      <Ionicons
                        name={expandedQ === item.q ? 'remove' : 'add'}
                        size={22}
                        color="#FFA500"
                      />
                    </TouchableOpacity>

                    {expandedQ === item.q && (
                      <Animated.View entering={FadeInDown} style={styles.answerBox}>
                        <Text style={styles.answer}>{item.a}</Text>
                      </Animated.View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </Animated.View>
        ))}
      </View>

      <View style={styles.contactCard}>
        <Text style={styles.contactTitle}>Cần hỗ trợ thêm?</Text>
        <Text style={styles.contactDesc}>
          Đội ngũ Lumilingua sẵn sàng giúp bạn 24/7
        </Text>

        <TouchableOpacity style={styles.emailBtn} onPress={openSupportEmail}>
          <LinearGradient
            colors={['#FFA500', '#FF8C00']}
            style={styles.btnGradient}
          >
            <Ionicons name="mail-outline" size={22} color="white" />
            <Text style={styles.btnText}>Gửi email hỗ trợ</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
  },
  errorText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 18,
    color: '#FF6347',
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginTop: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#FFF8E1',
  },
  topicIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  topicText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  questionsWrap: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  questionCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  question: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingRight: 16,
    lineHeight: 22,
  },
  answerBox: {
    padding: 16,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    marginBottom: 12,
  },
  answer: {
    fontSize: 15,
    color: '#555',
    lineHeight: 24,
  },
  contactCard: {
    margin: 20,
    padding: 28,
    backgroundColor: '#FFF8E1',
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  contactTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  contactDesc: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emailBtn: {
    width: '85%',
    borderRadius: 30,
    overflow: 'hidden',
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  btnText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 12,
  },
});