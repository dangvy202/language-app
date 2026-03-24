import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useUserCache } from '@/hook/useUserCache';
import Loading from '@/component/loading';
import { useRouter } from 'expo-router';
import { getCrmsImgEndpoint } from '@/constants/configApi';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RankUser {
  rank: number;
  username: string;
  avatar?: string | null;
  xp: number;
  streak: number;
  level: number;
  isCurrentUser?: boolean;
  id_user?: number;
}

const Ranking = () => {
  const router = useRouter();
  const { cache: userCache } = useUserCache();

  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'streak' | 'xp' | 'level'>('xp');
  const [searchQuery, setSearchQuery] = useState('');

  const [rawData, setRawData] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<RankUser[]>([]);
  const [rankList, setRankList] = useState<RankUser[]>([]);
  const [filteredList, setFilteredList] = useState<RankUser[]>([]);
  const [myRank, setMyRank] = useState<RankUser | null>(null);

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/user_cache/');
        const data = await response.json();
        setRawData(data);
      } catch (error) {
        console.error('Lỗi fetch ranking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  // Xử lý sort và format dữ liệu
  useEffect(() => {
    if (rawData.length === 0) return;

    let sorted = [...rawData];

    // Sort theo tab
    if (tab === 'xp') {
      sorted.sort((a, b) => b.gain_xp - a.gain_xp);
    } else if (tab === 'streak') {
      sorted.sort((a, b) => b.streak - a.streak);
    } else if (tab === 'level') {
      sorted.sort((a, b) => b.category.level - a.category.level);
    }

    // Format thành RankUser
    const formatted: RankUser[] = sorted.map((item, index) => ({
      rank: index + 1,
      username: item.email.split('@')[0] || 'User',
      avatar: item.information?.avatar
        ? getCrmsImgEndpoint("avatars/") + item.information.avatar
        : undefined,
      xp: item.gain_xp,
      streak: item.streak,
      level: item.category?.level || 1,
      id_user: item.id_user,
      isCurrentUser: false,
    }));

    const currentUserId = userCache?.[0]?.id_user || userCache?.[0]?.idUser;
    const currentEmail = userCache?.[0]?.email?.toLowerCase();

    let myRankItem: RankUser | null = null;
    const currentIndex = formatted.findIndex((u) =>
      (currentUserId && u.id_user === currentUserId) ||
      (currentEmail && u.username.toLowerCase() === currentEmail.split('@')[0])
    );

    if (currentIndex !== -1) {
      myRankItem = {
        ...formatted[currentIndex],
        isCurrentUser: true
      };

      if (myRankItem.rank <= 3) {
        myRankItem = null;
      }
    }

    setTopUsers(formatted.slice(0, 3));
    setRankList(formatted);
    setFilteredList(formatted);
    setMyRank(myRankItem);
  }, [rawData, tab, userCache]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredList(rankList);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase().trim();
    const filtered = rankList.filter((user) =>
      user.username.toLowerCase().includes(lowerQuery)
    );
    setFilteredList(filtered);
  }, [searchQuery, rankList]);

  const medalGradients = {
    gold: ['#FFD700', '#FDB813', '#DAA520', '#B8860B'],
    silver: ['#E8ECEF', '#C0C0C0', '#A9A9A9', '#808080'],
    bronze: ['#F4A460', '#CD7F32', '#B87333', '#8C5523'],
  } as const;

  const renderTopPodium = (user: RankUser, position: number) => {
    const medalIcons = ['trophy', 'medal', 'ribbon'];
    const sizes = [118, 100, 88];
    const medalTypes = ['gold', 'silver', 'bronze'] as const;
    const currentType = medalTypes[position - 1];

    return (
      <View style={[styles.podiumItem, { marginTop: position === 1 ? 0 : position === 2 ? 18 : 28 }]}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri: user.avatar || `https://i.pravatar.cc/150?img=${position}`
            }}
            style={[
              styles.podiumAvatar,
              { width: sizes[position - 1], height: sizes[position - 1] },
            ]}
          />
          <LinearGradient
            colors={medalGradients[currentType]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.medalBadge}
          >
            <Ionicons name={medalIcons[position - 1] as any} size={36} color="white" />
          </LinearGradient>
        </View>
        <Text style={[styles.podiumName, position === 1 && { fontSize: 18 }]}>
          {user.username}
        </Text>
        <Text style={styles.podiumXp}>
          {tab === 'xp'
            ? user.xp.toLocaleString() + ' XP'
            : tab === 'streak'
              ? user.streak + ' ngày'
              : 'Level ' + user.level}
        </Text>
      </View>
    );
  };

  const renderRankItem = ({ item }: { item: RankUser }) => (
    <View style={[styles.rankCard, item.isCurrentUser && styles.currentUserCard]}>
      <Text style={[styles.rankNumberText, item.rank <= 3 ? { color: '#FFA500' } : {}]}>
        #{item.rank}
      </Text>

      <Image
        source={{ uri: item.avatar || 'https://i.pravatar.cc/150' }}
        style={styles.rankAvatar}
      />

      <View style={styles.rankInfo}>
        <Text style={styles.rankUsername}>
          {item.isCurrentUser ? 'Bạn' : item.username}
        </Text>
        <View style={styles.rankStats}>
          {tab === 'xp' && <Ionicons name="star" size={14} color="#FFA500" />}
          {tab === 'streak' && <Ionicons name="flame" size={14} color="#FF6347" />}
          {tab === 'level' && <Ionicons name="school" size={14} color="#4A90E2" />}

          <Text style={styles.rankStreak}>
            {tab === 'xp'
              ? item.xp.toLocaleString() + ' XP'
              : tab === 'streak'
                ? item.streak + ' streak'
                : 'Level ' + item.level}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) return <Loading />;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFA500', '#FF8C00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Bảng Xếp Hạng</Text>

        <View style={styles.tabContainer}>
          {(['streak', 'xp', 'level'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabButton, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && { color: '#FFA500', fontWeight: 'bold' }]}>
                {t === 'streak' ? 'Streak' : t === 'xp' ? 'XP' : 'Level'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm người dùng..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Podium Top 3 */}
        <View style={styles.podiumContainer}>
          {topUsers[1] && renderTopPodium(topUsers[1], 2)}
          {topUsers[0] && renderTopPodium(topUsers[0], 1)}
          {topUsers[2] && renderTopPodium(topUsers[2], 3)}
        </View>

        {/* Danh sách xếp hạng */}
        <FlatList
          data={filteredList}
          renderItem={renderRankItem}
          keyExtractor={(item) => item.rank.toString()}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptySearch}>
              <Ionicons name="search-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Không tìm thấy người dùng nào</Text>
            </View>
          }
          ListHeaderComponent={<View style={{ height: 16 }} />}
        />

        {/* Vị trí của bạn (nếu ngoài top 3) */}
        {myRank && (
          <View style={styles.myPositionCard}>
            <Text style={styles.myPositionTitle}>Vị trí của bạn</Text>
            <View style={styles.myPositionContent}>
              <Text style={styles.myRankNumber}>#{myRank.rank}</Text>
              <Text style={styles.myXp}>
                {tab === 'xp'
                  ? myRank.xp.toLocaleString() + ' XP'
                  : tab === 'streak'
                    ? myRank.streak + ' ngày streak'
                    : 'Level ' + myRank.level}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingTop: 50, paddingBottom: 20, alignItems: 'center' },
  backBtn: { position: 'absolute', top: 60, left: 20, zIndex: 10, padding: 8 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 16 },
  tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 30, padding: 4 },
  tabButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 26 },
  tabActive: { backgroundColor: 'white' },
  tabText: { color: 'white', fontWeight: '600' },

  searchContainer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  searchInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 30, paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: '#EEE' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },

  body: { flex: 1, paddingHorizontal: 16 },
  podiumContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginVertical: 30 },
  podiumItem: { alignItems: 'center', marginHorizontal: 12 },
  avatarWrapper: { position: 'relative' },
  podiumAvatar: { borderRadius: 999, borderWidth: 4, borderColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  medalBadge: { position: 'absolute', bottom: -16, alignSelf: 'center', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.9)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 8, overflow: 'hidden' },
  podiumName: { fontSize: 16, fontWeight: '700', marginTop: 20, color: '#333' },
  podiumXp: { fontSize: 18, fontWeight: 'bold', color: '#FFA500', marginTop: 4 },

  rankCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginVertical: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: '#f0f0f0' },
  currentUserCard: { borderColor: '#FFA500', borderWidth: 2, backgroundColor: '#FFF8E1' },
  rankNumberText: { fontSize: 22, fontWeight: 'bold', width: 50, textAlign: 'center', color: '#888' },
  rankAvatar: { width: 50, height: 50, borderRadius: 25, marginHorizontal: 12 },
  rankInfo: { flex: 1 },
  rankUsername: { fontSize: 16, fontWeight: '600', color: '#333' },
  rankStats: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  rankStreak: { fontSize: 13, color: '#FF6347', marginLeft: 6 },

  myPositionCard: { backgroundColor: '#FFF8E1', borderRadius: 20, padding: 20, marginVertical: 24, alignItems: 'center', borderWidth: 2, borderColor: '#FFA500' },
  myPositionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFA500', marginBottom: 12 },
  myPositionContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  myRankNumber: { fontSize: 32, fontWeight: 'bold', color: '#333', marginRight: 20 },
  myXp: { fontSize: 20, fontWeight: 'bold', color: '#FFA500' },

  emptySearch: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { marginTop: 16, fontSize: 16, color: '#888' },
});

export default Ranking;