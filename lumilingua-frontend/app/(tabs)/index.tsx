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
  View
} from 'react-native';

export default function Index() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header với mascot */}
      <View style={{paddingBottom: 15}}>
        <LinearGradient colors={['#FFB703', '#FB8500']}>
          <View style={styles.header}>
            <TouchableOpacity >
            <Ionicons name="menu" size={28} color="#fff" />
            </TouchableOpacity>
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
            <Text style={styles.username}>Ten Account</Text>
            <Text style={styles.subtitle}>Học ngôn ngữ vui vẻ mỗi ngày!</Text>
          </View>      
        </LinearGradient>
      </View>
    
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

      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
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

      {/* Course grid / list */}
      <Text style={styles.title}>Your course</Text>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        
        {/* Card example */}
        <TouchableOpacity style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          overflow: 'hidden'
        }}>
          <LinearGradient colors={['#FFECB3', '#FFE082']} style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>Tiếng Anh Cơ Bản</Text>
            <Text style={{ color: '#555', marginTop: 4 }}>Hoàn thành 45%</Text>
            {/* Progress bar */}
            <View style={{ height: 8, backgroundColor: '#ddd', borderRadius: 4, marginTop: 8 }}>
              <View style={{ width: '45%', height: '100%', backgroundColor: '#FFA500', borderRadius: 4 }} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Thêm nhiều card tương tự cho các khóa khác */}
      </ScrollView>
      

      {/* Bottom Tab Nav (dùng @react-navigation/bottom-tabs) */}
      {/* Home | Explore | Profile | Settings - icon màu #FFA500 khi active */}
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesScroll: { paddingLeft: 20 },
  categoryText: { marginLeft: 8, fontSize: 15, color: '#666', fontWeight: '600' },
  activeCategoryText: { marginLeft: 8, color: '#FFA500', fontWeight: 'bold' },
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'android' ? 40 : 40,
    paddingBottom: 10,
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
  username: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 15,
  },
})
