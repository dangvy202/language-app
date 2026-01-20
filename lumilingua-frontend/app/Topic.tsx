import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Topic() {
  const units = [
    {
      id: 1,
      title: 'Unit 1: Greetings & Introductions',
      progress: 100,
      totalLessons: 8,
      completedLessons: 8,
      icon: 'chatbubble-ellipses-outline',
    },
    {
      id: 2,
      title: 'Unit 2: Numbers & Time',
      progress: 75,
      totalLessons: 10,
      completedLessons: 7.5,
      icon: 'time-outline',
    },
    {
      id: 3,
      title: 'Unit 3: Family & Friends',
      progress: 30,
      totalLessons: 12,
      completedLessons: 3.6,
      icon: 'people-outline',
    },
    {
      id: 4,
      title: 'Unit 4: Food & Shopping',
      progress: 0,
      totalLessons: 9,
      completedLessons: 0,
      icon: 'restaurant-outline',
    },
    {
      id: 5,
      title: 'Unit 5: Daily Routines',
      progress: 0,
      totalLessons: 11,
      completedLessons: 0,
      icon: 'sunny-outline',
    },
  ];

  const currentCourse = {
    flag: '🇬🇧',
    name: 'Tiếng Anh Cơ Bản',
    overallProgress: 45,
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#FFB703', '#FB8500']} style={styles.headerGradient}>
        <View style={styles.header}>
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={24} color="white" />
            <Text style={styles.streakText}>7 ngày</Text>
          </View>
        </View>

        {/* Course */}
        <View style={styles.courseInfo}>
          <Text style={styles.courseFlagBig}>{currentCourse.flag}</Text>
          <View>
            <Text style={styles.courseName}>{currentCourse.name}</Text>
            <Text style={styles.courseProgressText}>
              Hoàn thành {currentCourse.overallProgress}%
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Container */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Overall progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${currentCourse.overallProgress}%` },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            Tổng tiến độ khóa học
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Các bài học</Text>

        {/* list units */}
        {units.map((unit) => (
          <TouchableOpacity key={unit.id} style={styles.unitCard} activeOpacity={0.9}>
            <LinearGradient
              colors={
                unit.progress === 100
                  ? ['#E8F5E9', '#C8E6C9']
                  : unit.progress > 0
                  ? ['#FFF3E0', '#FFE0B2']
                  : ['#FAFAFA', '#EEEEEE']
              }
              style={styles.unitGradient}
            >
              <View style={styles.unitHeader}>
                <View style={styles.unitIconContainer}>
                  <Ionicons name="chatbubble-ellipses-outline" size={32} color="#FFA500" />
                </View>
                <View style={styles.unitInfo}>
                  <Text style={styles.unitTitle}>{unit.title}</Text>
                  <Text style={styles.unitSubtitle}>
                    {unit.completedLessons}/{unit.totalLessons} bài
                  </Text>
                </View>

                {unit.progress === 100 ? (
                  <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
                ) : (
                  <Ionicons name="play-circle" size={40} color="#FFA500" />
                )}
              </View>

              {/* Mini progress bar */}
              <View style={styles.miniProgressContainer}>
                <View style={styles.miniProgressBg}>
                  <View
                    style={[
                      styles.miniProgressFill,
                      { width: `${unit.progress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.miniProgressText}>{unit.progress}%</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  headerGradient: {
    paddingTop: Platform.OS === 'android' ? 40 : 50,
    paddingBottom: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  backButton: {
    padding: 4,
  },

  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6,
  },

  courseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  courseFlagBig: {
    fontSize: 48,
    marginRight: 16,
  },
  courseName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  courseProgressText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },

  content: {
    flex: 1,
    backgroundColor: '#fff',
  },

  progressContainer: {
    margin: 20,
    marginBottom: 10,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFA500',
    borderRadius: 6,
  },
  progressLabel: {
    textAlign: 'center',
    marginTop: 8,
    color: '#555',
    fontSize: 15,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 16,
  },

  unitCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  unitGradient: {
    padding: 20,
  },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unitIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,165,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  unitInfo: {
    flex: 1,
  },
  unitTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  unitSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  miniProgressContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniProgressBg: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: '#FFA500',
    borderRadius: 4,
  },
  miniProgressText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFA500',
  },
});