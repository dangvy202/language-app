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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";


export default function Index() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const loadUserName = async () => {
      const name = await AsyncStorage.getItem("username");
      setUserName(name);
    };

    loadUserName();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header với mascot */}
      <View style={{ paddingBottom: 15 }}>
        <LinearGradient colors={['#FFB703', '#FB8500']}>
          <View style={styles.header}>
            <TouchableOpacity>
              <Ionicons name="menu" size={28} color="#fff" />
            </TouchableOpacity>
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={24} color="white" />
              <Text style={styles.streakText}>7 ngày</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Avatar + Title */}
          <View style={styles.headerContent}>
            <View style={styles.avatarWrapper}>
              <Image
                source={require('@/assets/images/accounts/logo.jpg')}
                style={styles.avatar}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.hi}>Hi, </Text>
              <Text style={styles.username}>{userName}</Text>
            </View>
            <Text style={styles.subtitle}>”Learn to earn. Enjoy your day with LumiLingua!”</Text>
          </View>
        </LinearGradient>
      </View>

      {/* ScrollView */}
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search bar */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput
            placeholder="Tìm ngôn ngữ hoặc khóa học..."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>

        {/* Categories */}
        <Text style={styles.title}>Categories</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          <TouchableOpacity style={[styles.categoryTab, styles.activeCategoryTab]}>
            <Ionicons name="book-outline" size={24} color="#FFA500" />
            <Text style={styles.activeCategoryText}>Grammar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryTab}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#666" />
            <Text style={styles.categoryText}>Vocabulary</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryTab}>
            <Ionicons name="chatbubbles-outline" size={24} color="#666" />
            <Text style={styles.categoryText}>Phrases</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryTab}>
            <Ionicons name="mic-outline" size={24} color="#666" />
            <Text style={styles.categoryText}>Pronunciation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryTab}>
            <Ionicons name="ear-outline" size={24} color="#666" />
            <Text style={styles.categoryText}>Listening</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Your course */}
        <Text style={styles.title}>Your course</Text>

        <View style={styles.coursesContainer}>
          <TouchableOpacity style={styles.course}>
            <LinearGradient colors={['#FFECB3', '#FFE082']} style={{ padding: 20 }}>
              <View style={styles.courseHeader}>
                <Text style={styles.courseFlag}>🇬🇧</Text>
                <Text style={styles.courseTitle}>Tiếng Anh Cơ Bản</Text>
              </View>
              <Text style={styles.analysisTitle}>Hoàn thành 45%</Text>
              <View style={styles.learnedAnalysis}>
                <View
                  style={{ width: '45%', height: '100%', backgroundColor: '#FFA500', borderRadius: 4 }}
                />
              </View>
              <TouchableOpacity style={styles.continueButton}>
                <Text style={styles.continueText}>Tiếp tục</Text>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Teacher Suggestion */}
        <Text style={styles.title}>Teacher Suggest</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.teachersScroll}
        >
          {/* Teacher Card 1 */}
          <TouchableOpacity style={styles.teacherCard}>
            <LinearGradient colors={['#FFF8E1', '#FFE082']} style={styles.teacherGradient}>
              <View style={styles.teacherAvatarContainer}>
                <Image
                  source={{
                    uri: 'https://thumbs.dreamstime.com/z/charming-vector-illustration-featuring-two-variations-cute-chibi-style-female-character-depicted-dark-hair-395145253.jpg',
                  }}
                  style={styles.teacherAvatar}
                />
                <View style={styles.onlineBadge}>
                  <Text style={styles.onlineText}>Online</Text>
                </View>
              </View>

              <Text style={styles.teacherName}>Maria S.</Text>
              <Text style={styles.teacherLang}>Tiếng Anh • Pháp</Text>

              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#FFA500" />
                <Ionicons name="star" size={16} color="#FFA500" />
                <Ionicons name="star" size={16} color="#FFA500" />
                <Ionicons name="star" size={16} color="#FFA500" />
                <Ionicons name="star-half" size={16} color="#FFA500" />
                <Text style={styles.ratingText}>4.8 (120)</Text>
              </View>

              <TouchableOpacity style={styles.informationButton}>
                <Ionicons name="information-circle" size={18} color="white" />
                <Text style={styles.informationText}>Information</Text>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>

          {/* Teacher Card 2 */}
          <TouchableOpacity style={styles.teacherCard}>
            <LinearGradient colors={['#FFF8E1', '#FFE082']} style={styles.teacherGradient}>
              <View style={styles.teacherAvatarContainer}>
                <Image
                  source={{
                    uri: 'https://thumbs.dreamstime.com/b/smiling-female-character-d-render-digital-art-cartoon-style-ideal-websites-apps-presentations-cheerful-d-cartoon-woman-394946649.jpg',
                  }}
                  style={styles.teacherAvatar}
                />
                <View style={[styles.onlineBadge, { backgroundColor: '#4CAF50' }]}>
                  <Text style={styles.onlineText}>Online</Text>
                </View>
              </View>

              <Text style={styles.teacherName}>Jean P.</Text>
              <Text style={styles.teacherLang}>Tiếng Tây Ban Nha</Text>

              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#FFA500" />
                <Ionicons name="star" size={16} color="#FFA500" />
                <Ionicons name="star" size={16} color="#FFA500" />
                <Ionicons name="star" size={16} color="#FFA500" />
                <Ionicons name="star" size={16} color="#FFA500" />
                <Text style={styles.ratingText}>5.0 (85)</Text>
              </View>

              <TouchableOpacity style={styles.informationButton}>
                <Ionicons name="information-circle" size={18} color="white" />
                <Text style={styles.informationText}>Information</Text>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // Header css
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'android' ? 40 : 50,
    paddingBottom: 10,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 10,
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
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  subtitle: {
    paddingBottom: 15,
    color: '#fff',
    opacity: 0.9,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#FB8500',
  },
  hi: { fontSize: 20, color: '#fff', marginTop: 10 },
  username: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginTop: 10,
  },

  // Body ScrollView
  body: {
    flex: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 15,
  },

  // Search css
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  searchWrapper: {
    padding: 26,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    marginHorizontal: 15,
    borderRadius: 30,
    paddingVertical: 12,
    elevation: 3,
    marginBottom: 20,
  },

  // Categories css
  categoriesScroll: {
    paddingLeft: 20,
    marginBottom: 10,
    height: 100
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  activeCategoryText: {
    marginLeft: 8,
    color: '#FFA500',
    fontWeight: 'bold',
  },
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
  },

  // Course css
  coursesContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  course: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  courseHeader: { flexDirection: 'row', alignItems: 'center' },
  courseFlag: { fontSize: 28, marginRight: 12 },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  analysisTitle: {
    color: '#555',
    marginTop: 4,
  },
  learnedAnalysis: {
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginTop: 8,
  },
  continueButton: {
    backgroundColor: '#FFA500',
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 16,
  },
  continueText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Teacher Suggestion css
  teachersScroll: {
    paddingLeft: 20,
    marginBottom: 30,
    height: 265,
  },
  teacherCard: {
    width: 220,
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.15,
    // shadowRadius: 10,
    elevation: 6,
  },
  teacherGradient: {
    padding: 16,
    alignItems: 'center',
    flex: 1,
  },
  teacherAvatarContainer: {
    position: 'relative',
  },
  teacherAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFA500',
    marginBottom: 12,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 8,
    right: -4,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  onlineText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  teacherName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  teacherLang: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#FFA500',
    fontWeight: '600',
  },
  informationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  informationText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
});