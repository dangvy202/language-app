// App.tsx hoặc HomeScreen.tsx

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header Gradient */}
      <LinearGradient
        colors={['#FFA500', '#FF8C00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity>
            <Ionicons name="menu" size={28} color="white" />
          </TouchableOpacity>
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={24} color="white" />
            <Text style={styles.streakText}>7 ngày</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.mascotContainer}>
          <Image
            source={require('@/assets/images/accounts/logo.jpg')} // mascot mèo vẫy tay, crop tròn, nền trong suốt nếu có
            style={styles.mascot}
          />
          <Text style={styles.appName}>LumiLingua</Text>
          <Text style={styles.slogan}>Học ngôn ngữ vui vẻ mỗi ngày!</Text>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            placeholder="Tìm ngôn ngữ hoặc khóa học..."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Danh mục</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        {['Grammar', 'Vocabulary', 'Phrases', 'Pronunciation', 'Listening'].map((cat, index) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryTab,
              index === 0 && styles.activeCategoryTab,
            ]}
          >
            <Ionicons
              name={
                cat === 'Grammar'
                  ? 'book-outline'
                  : cat === 'Vocabulary'
                  ? 'chatbubble-ellipses-outline'
                  : cat === 'Phrases'
                  ? 'chatbubbles-outline'
                  : cat === 'Pronunciation'
                  ? 'mic-outline'
                  : 'ear-outline'
              }
              size={20}
              color={index === 0 ? '#FFA500' : '#666'}
            />
            <Text
              style={[
                styles.categoryText,
                index === 0 && styles.activeCategoryText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Your Courses */}
      <Text style={styles.sectionTitle}>Khóa học của bạn</Text>
      <ScrollView style={styles.coursesScroll}>
        <TouchableOpacity style={styles.courseCard}>
          <LinearGradient
            colors={['#FFF8E1', '#FFE082']}
            style={styles.cardGradient}
          >
            <View style={styles.courseHeader}>
              <Text style={styles.courseFlag}>🇬🇧</Text>
              <Text style={styles.courseTitle}>Tiếng Anh Cơ Bản</Text>
            </View>
            <Text style={styles.courseProgressText}>Hoàn thành 45%</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '45%' }]} />
            </View>
            <TouchableOpacity style={styles.continueButton}>
              <Text style={styles.continueText}>Tiếp tục</Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>

        {/* Thêm card khác tương tự */}
      </ScrollView>

      {/* Bottom Nav placeholder - dùng @react-navigation/bottom-tabs thật */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerGradient: { paddingTop: Platform.OS === 'android' ? 40 : 60 },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: { color: 'white', fontWeight: 'bold', marginLeft: 6 },
  mascotContainer: { alignItems: 'center', paddingVertical: 20 },
  mascot: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
  },
  slogan: {
    fontSize: 16,
    color: 'white',
    opacity: 0.95,
    marginTop: 4,
  },
  searchContainer: { padding: 16, backgroundColor: '#fff' },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 30,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 14 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  categoriesScroll: { paddingLeft: 20 },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    marginRight: 12,
  },
  activeCategoryTab: {
    backgroundColor: '#FFF3E0',
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  categoryText: { marginLeft: 8, fontSize: 15, color: '#666', fontWeight: '600' },
  activeCategoryText: { color: '#FFA500', fontWeight: 'bold' },
  coursesScroll: { paddingHorizontal: 16 },
  courseCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  cardGradient: { padding: 20 },
  courseHeader: { flexDirection: 'row', alignItems: 'center' },
  courseFlag: { fontSize: 28, marginRight: 12 },
  courseTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  courseProgressText: { color: '#555', marginTop: 8, fontSize: 14 },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFA500',
    borderRadius: 5,
  },
  continueButton: {
    backgroundColor: '#FFA500',
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 16,
  },
  continueText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default HomeScreen;