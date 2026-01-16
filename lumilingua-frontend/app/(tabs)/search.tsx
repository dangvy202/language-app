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

const Search = () => {
  return (
    <View style={styles.container}>
      {/* ===== HEADER ===== */}
      <LinearGradient
        colors={['#FFB703', '#FB8500']}
        style={styles.headerGradient}
      >
        {/* Top icons */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="menu" size={26} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={26} color="#000" />
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

          <Text style={styles.username}>Ten Account</Text>
          <Text style={styles.subtitle}>Học ngôn ngữ vui vẻ mỗi ngày!</Text>
        </View>
      </LinearGradient>

      {/* ===== SEARCH ===== */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={20} color="#999" />
        <TextInput
          placeholder="Tìm ngôn ngữ hoặc khóa học..."
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
      </View>

      {/* ===== CATEGORIES ===== */}
      <Text style={styles.sectionTitle}>Categories</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {/* Active */}
        <TouchableOpacity>
          <LinearGradient
            colors={['#FFB703', '#FB8500']}
            style={styles.activeTab}
          >
            <Ionicons name="book-outline" size={20} color="#fff" />
            <Text style={styles.activeTabText}>Grammar</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Inactive */}
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#666" />
          <Text style={styles.tabText}>Vocabulary</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Ionicons name="chatbubbles-outline" size={20} color="#666" />
          <Text style={styles.tabText}>Phrases</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Ionicons name="mic-outline" size={20} color="#666" />
          <Text style={styles.tabText}>Pronunciation</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ===== COURSE ===== */}
      <Text style={styles.sectionTitle}>Your course</Text>

      <ScrollView contentContainerStyle={styles.courseList}>
        <TouchableOpacity>
          <LinearGradient
            colors={['#FFF3B0', '#FFD166']}
            style={styles.courseCard}
          >
            <View style={styles.courseHeader}>
              <Ionicons name="school-outline" size={26} color="#FB8500" />
              <Text style={styles.courseTitle}>Tiếng Anh Cơ Bản</Text>
            </View>

            <Text style={styles.courseSub}>Hoàn thành 45%</Text>

            <View style={styles.progressBg}>
              <View style={styles.progressFill} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
      {/* ===== CATEGORIES ===== */}
      <Text style={styles.sectionTitle}>Categories</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {/* Active */}
        <TouchableOpacity>
          <LinearGradient
            colors={['#FFB703', '#FB8500']}
            style={styles.activeTab}
          >
            <Ionicons name="book-outline" size={20} color="#fff" />
            <Text style={styles.activeTabText}>Grammar</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Inactive */}
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#666" />
          <Text style={styles.tabText}>Vocabulary</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Ionicons name="chatbubbles-outline" size={20} color="#666" />
          <Text style={styles.tabText}>Phrases</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Ionicons name="mic-outline" size={20} color="#666" />
          <Text style={styles.tabText}>Pronunciation</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* ===== CATEGORIES ===== */}
      <Text style={styles.sectionTitle}>Categories</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {/* Active */}
        <TouchableOpacity>
          <LinearGradient
            colors={['#FFB703', '#FB8500']}
            style={styles.activeTab}
          >
            <Ionicons name="book-outline" size={20} color="#fff" />
            <Text style={styles.activeTabText}>Grammar</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Inactive */}
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#666" />
          <Text style={styles.tabText}>Vocabulary</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Ionicons name="chatbubbles-outline" size={20} color="#666" />
          <Text style={styles.tabText}>Phrases</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Ionicons name="mic-outline" size={20} color="#666" />
          <Text style={styles.tabText}>Pronunciation</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* ===== CATEGORIES ===== */}
      <Text style={styles.sectionTitle}>Categories</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {/* Active */}
        <TouchableOpacity>
          <LinearGradient
            colors={['#FFB703', '#FB8500']}
            style={styles.activeTab}
          >
            <Ionicons name="book-outline" size={20} color="#fff" />
            <Text style={styles.activeTabText}>Grammar</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Inactive */}
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#666" />
          <Text style={styles.tabText}>Vocabulary</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Ionicons name="chatbubbles-outline" size={20} color="#666" />
          <Text style={styles.tabText}>Phrases</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Ionicons name="mic-outline" size={20} color="#666" />
          <Text style={styles.tabText}>Pronunciation</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* ===== CATEGORIES ===== */}
      <Text style={styles.sectionTitle}>Categories</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {/* Active */}
        <TouchableOpacity>
          <LinearGradient
            colors={['#FFB703', '#FB8500']}
            style={styles.activeTab}
          >
            <Ionicons name="book-outline" size={20} color="#fff" />
            <Text style={styles.activeTabText}>Grammar</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Inactive */}
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#666" />
          <Text style={styles.tabText}>Vocabulary</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Ionicons name="chatbubbles-outline" size={20} color="#666" />
          <Text style={styles.tabText}>Phrases</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Ionicons name="mic-outline" size={20} color="#666" />
          <Text style={styles.tabText}>Pronunciation</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* Header */
  headerGradient: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 50,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 10,
  },
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
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#FB8500',
  },
  username: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginTop: 10,
  },
  subtitle: {
    color: '#fff',
    opacity: 0.9,
  },

  /* Search */
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    elevation: 3,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },

  /* Section */
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },

  /* Tabs */
  tabs: {
    paddingLeft: 20,
    paddingBottom: 10,
  },
  activeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    marginRight: 12,
    shadowColor: '#FB8500',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  activeTabText: {
    marginLeft: 8,
    fontWeight: '700',
    color: '#fff',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    marginRight: 12,
  },
  tabText: {
    marginLeft: 8,
    color: '#666',
  },

  /* Course */
  courseList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  courseCard: {
    padding: 22,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 10,
    color: '#333',
  },
  courseSub: {
    marginTop: 8,
    color: '#555',
  },
  progressBg: {
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginTop: 12,
  },
  progressFill: {
    width: '45%',
    height: '100%',
    backgroundColor: '#FB8500',
    borderRadius: 6,
  },
});

export default Search