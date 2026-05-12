import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import Loading from '@/component/loading';
import { fetchUserCache, saveOrUpdateUserCache } from '@/services/api';
import useFetch from '@/services/useFetch';
import { connectSocket, disconnectSocket } from '@/services/webSocket';

export default function Index() {
  const [userName, setUserName] = useState<string | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [email, setEmail] = useState<string | null>(null);
  const [isStreakLoading, setIsStreakLoading] = useState(true);
  const [notifications, setNotifications] = useState(0);
  const [notificationList, setNotificationList] = useState<
    { text: string; route: string; isUser?: boolean; price?: string }[]
  >([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [learnedBalance, setLearnedBalance] = useState(1240);
  const [topupBalance, setTopupBalance] = useState(45009);

  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const name = await AsyncStorage.getItem("username");
      setUserName(name);

      const storedEmail = await AsyncStorage.getItem("email");
      const storedIdUser = await AsyncStorage.getItem("idUser");
      const storedPhone = await AsyncStorage.getItem("phone");

      if (!storedEmail) {
        router.replace('/Login');
        return;
      }

      const idUserNumber = storedIdUser ? Number(storedIdUser) : null;
      if (idUserNumber === null || Number.isNaN(idUserNumber)) {
        return;
      }

      await saveOrUpdateUserCache({
        id_user: idUserNumber,
        email: storedEmail,
        phone: storedPhone as string,
      });

      setEmail(storedEmail);
    };

    loadUser();
  }, [router]);

  useEffect(() => {
    const setupSocket = async () => {
      const idUser = await AsyncStorage.getItem("idUser");
      if (!idUser) return;

      connectSocket(idUser, (rawMessage) => {
        let messageText = "Có thông báo mới về hợp đồng";
        let route = "/ContractStudent";
        let isUser = true;
        let price = null;

        try {
          const parsed = typeof rawMessage === 'string'
            ? JSON.parse(rawMessage)
            : rawMessage;

          messageText = parsed.message || messageText;
          isUser = parsed.isUser !== undefined ? parsed.isUser : true;
          price = parsed.price;

          route = isUser ? "/ContractStudent" : "/ContractTutor";
        } catch (e) {
          messageText = String(rawMessage);
        }

        setNotifications((prev) => prev + 1);

        setNotificationList((prev) => [
          {
            text: messageText,
            route: route,
            isUser: isUser,
            price: price
          },
          ...prev
        ]);
      });
    };

    setupSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  const { data, loading: fetchLoading, error } = useFetch(
    () => fetchUserCache({ email: email! }),
    !!email
  );

  useEffect(() => {
    if (fetchLoading) {
      setIsStreakLoading(true);
      return;
    }

    if (data && data.length > 0) {
      const userCache = data[0];
      const fetchedStreak = userCache?.streak ?? 0;
      setStreak(fetchedStreak);
      AsyncStorage.setItem('streak', fetchedStreak.toString());
    } else if (error) {
      setStreak(0);
    }
    setIsStreakLoading(false);
  }, [data, fetchLoading, error]);

  const formatVND = (price?: string | number) => {
    if (!price) return '';
    const num = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(num) || num === 0) return '';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(num);
  };

  if (fetchLoading || !email || isStreakLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={{ paddingBottom: 15 }}>
        <LinearGradient colors={['#FFB703', '#FB8500']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setShowMenu(true)}>
              <Ionicons name="menu" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={24} color="white" />
              <Text style={styles.streakText}>{streak} ngày</Text>
            </View>

            <View style={styles.vipBadge}>
              <Ionicons name="diamond" size={16} color="#28d5f7" />
              <Text style={styles.vipText}>VIP</Text>
            </View>

            <TouchableOpacity style={{ position: "relative" }} onPress={() => setShowDialog(true)}>
              <Ionicons name="notifications-outline" size={28} color="#fff" />

              {notifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>{notifications}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.headerContent}>
            <View style={styles.avatarWrapper}>
              <Image
                source={require('@/assets/images/accounts/logo.jpg')}
                style={styles.avatar}
              />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.hi}>Hi, </Text>
              <Text style={styles.username}>{userName || 'User'}</Text>
            </View>

            <Text style={styles.subtitle}>
              ”Learn to earn. Enjoy your day with LumiLingua!”
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Balance Cards */}
      <View style={styles.balanceContainer}>
        <View style={styles.balanceCard}>
          <View style={styles.balanceIcon}>
            <Ionicons name="book" size={28} color="#FFB703" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.balanceLabel}>Learned Balance</Text>
            <Text style={styles.balanceValue}>{learnedBalance.toLocaleString()} XP</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.balanceCard}
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/wallet')}
        >
          <View style={styles.balanceIcon}>
            <Ionicons name="wallet" size={28} color="#FF5722" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.balanceLabel}>Topup Balance</Text>
            <Text style={styles.balanceValue}>{topupBalance.toLocaleString()} đ</Text>
          </View>
          <View style={styles.topupButton}>
            <Ionicons name="add-circle" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {/* ================= SHOP SECTION ================= */}

      <Text style={styles.title}>Shop</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.shopScroll}
      >
        {/* BALANCE LEARN */}
        <TouchableOpacity
          style={styles.shopCard}
          activeOpacity={0.9}
          onPress={() => router.push('/ShopBalanceLearn')}
        >
          <LinearGradient
            colors={['#FFD54F', '#FFB300']}
            style={styles.shopGradient}
          >
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135755.png',
              }}
              style={styles.shopImage}
            />

            <View>
              <Text style={styles.shopTitle}>
                Balance Learn
              </Text>

              <Text style={styles.shopSubtitle}>
                Exchange XP rewards
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* TOPUP SHOP */}
        <TouchableOpacity
          style={styles.shopCard}
          activeOpacity={0.9}
          onPress={() => router.push('/ShopBalanceTopup')}
        >
          <LinearGradient
            colors={['#FF8A65', '#F4511E']}
            style={styles.shopGradient}
          >
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/2489/2489756.png',
              }}
              style={styles.shopImage}
            />

            <View>
              <Text style={styles.shopTitle}>
                Topup Shop
              </Text>

              <Text style={styles.shopSubtitle}>
                Recharge & VIP
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ADVERTISEMENT */}
        <TouchableOpacity
          style={styles.shopCard}
          activeOpacity={0.9}
          onPress={() => router.push('/Advertisement')}
        >
          <LinearGradient
            colors={['#7EE081', '#1FAF38']}
            style={styles.shopGradient}
          >
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png',
              }}
              style={styles.shopImage}
            />

            <View>
              <Text style={styles.shopTitle}>
                Advertisement
              </Text>

              <Text style={styles.shopSubtitle}>
                Watch ads earn XP
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* ================= FREE LEARN ================= */}

      <Text style={styles.title}>Free Learn</Text>

      <View style={styles.freeLearnGrid}>
        <TouchableOpacity style={styles.learnBox}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
            }}
            style={styles.learnImage}
          />

          <Text style={styles.learnBoxText}>
            Dictionary
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.learnBox}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/2583/2583344.png',
            }}
            style={styles.learnImage}
          />

          <Text style={styles.learnBoxText}>
            Ranking
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.learnBox}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
            }}
            style={styles.learnImage}
          />

          <Text style={styles.learnBoxText}>
            Social App
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.learnBox}
          onPress={() => router.push('/course/vocabulary')}
        >
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/2436/2436874.png',
            }}
            style={styles.learnImage}
          />

          <Text style={styles.learnBoxText}>
            Vocabulary
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notification Dialog */}
      {showDialog && (
        <View style={styles.notificationDialogOverlay}>
          <View style={styles.notificationDialog}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => { setShowDialog(false); setNotifications(0); }} hitSlop={10}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.notificationList} showsVerticalScrollIndicator={false}>
              {notificationList.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="notifications-off-outline" size={60} color="#ccc" />
                  <Text style={styles.emptyText}>Không có thông báo nào</Text>
                  <Text style={styles.emptySubText}>Bạn sẽ nhận được thông báo khi có cập nhật hợp đồng</Text>
                </View>
              ) : (
                notificationList.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.notificationItem}
                    activeOpacity={0.7}
                    onPress={() => {
                      setShowDialog(false);
                      setNotifications(0);
                      if (item.route) router.push(item.route as any);
                    }}
                  >
                    <View style={styles.notificationIcon}>
                      <Ionicons name="document-text-outline" size={24} color="#FB8500" />
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationTextDialog}>
                        {item.text}
                        {formatVND(item.price)}
                      </Text>
                      <Text style={styles.notificationTime}>Vừa xong</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>

            {notificationList.length > 0 && (
              <TouchableOpacity
                style={styles.markAllReadButton}
                onPress={() => {
                  setNotificationList([]);
                  setNotifications(0);
                  setShowDialog(false);
                }}
              >
                <Text style={styles.markAllReadText}>Đánh dấu tất cả đã đọc</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* ==================== MENU HAMBURGER ĐÃ LÀM ĐẸP ==================== */}
      {showMenu && (
        <View style={styles.menuOverlay}>
          {/* Backdrop */}
          <TouchableOpacity
            style={styles.menuBackdrop}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          />

          {/* Menu Container */}
          <View style={styles.menuContainer}>
            {/* Menu Header with Gradient */}
            <LinearGradient
              colors={['#fb5800', '#fb5800']}
              style={styles.menuHeader}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.menuHeaderTitle}>Menu</Text>
                <TouchableOpacity onPress={() => setShowMenu(false)} hitSlop={10}>
                  <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.menuHeaderSubtitle}>LumiLingua</Text>
            </LinearGradient>

            {/* Menu Items */}
            <View style={styles.menuContent}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  router.push('/ShopBalanceLearn');
                }}
              >
                <Ionicons name="book-outline" size={26} color="#FFB703" />
                <Text style={styles.menuItemText}>Shop of Balance Learn</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  router.push('/ShopBalanceTopup');
                }}
              >
                <Ionicons name="wallet-outline" size={26} color="#FF5722" />
                <Text style={styles.menuItemText}>Shop of Balance Topup</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  router.push('/Advertisement');
                }}
              >
                <Ionicons name="megaphone-outline" size={26} color="#62b807" />
                <Text style={styles.menuItemText}>Advertisement for receive balance learn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'android' ? 40 : 50,
    paddingBottom: 10
  },
  headerContent: { alignItems: 'center', marginTop: 10 },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#046994',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 4,
  },

  vipText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 13,
  },
  streakContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  streakText: { color: 'white', fontWeight: 'bold', marginLeft: 6 },
  avatarWrapper: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#FB8500' },
  hi: { fontSize: 20, color: '#fff', marginTop: 10 },
  username: { fontSize: 26, fontWeight: '800', color: '#fff', marginTop: 10 },
  subtitle: { paddingBottom: 15, color: '#fff', opacity: 0.9, textAlign: 'center', marginHorizontal: 20, marginTop: 8 },

  balanceContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: -25, marginBottom: 20, gap: 12 },
  balanceCard: { flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', shadowColor: '#ff7300', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6 },
  balanceIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF8E1', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  balanceLabel: { fontSize: 10, color: '#666', fontWeight: '600' },
  balanceValue: { fontSize: 13, fontWeight: '800', color: '#333', marginTop: 2 },
  topupButton: { backgroundColor: '#FF5722', width: 20, height: 20, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },

  body: { flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginTop: 10, marginBottom: 15 },


  categoriesScroll: { paddingLeft: 20, marginBottom: 10, height: 100 },
  categoryTab: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, marginRight: 12 },
  activeCategoryTab: { backgroundColor: '#FFF3E0' },
  activeCategoryText: { marginLeft: 8, color: '#FFA500', fontWeight: 'bold' },

  coursesContainer: { paddingHorizontal: 16, marginBottom: 10 },
  course: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, overflow: 'hidden' },
  courseHeader: { flexDirection: 'row', alignItems: 'center' },
  courseFlag: { fontSize: 28, marginRight: 12 },
  courseTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  analysisTitle: { color: '#555', marginTop: 4 },
  learnedAnalysis: { height: 8, backgroundColor: '#ddd', borderRadius: 4, marginTop: 8 },
  continueButton: { backgroundColor: '#FFA500', alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 30, marginTop: 16 },
  continueText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  teachersScroll: { paddingLeft: 20, marginBottom: 30, height: 265 },
  teacherCard: { width: 220, marginRight: 16, borderRadius: 20, overflow: 'hidden', elevation: 6 },
  teacherGradient: { padding: 16, alignItems: 'center', flex: 1 },
  teacherAvatarContainer: { position: 'relative' },
  teacherAvatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#FFA500', marginBottom: 12 },
  onlineBadge: { position: 'absolute', bottom: 8, right: -4, backgroundColor: '#4CAF50', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 2, borderColor: 'white' },
  onlineText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  teacherName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  teacherLang: { fontSize: 14, color: '#666', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  ratingText: { marginLeft: 6, fontSize: 14, color: '#FFA500', fontWeight: '600' },
  informationButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFA500', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 30 },
  informationText: { color: 'white', fontWeight: 'bold', marginLeft: 8, fontSize: 14 },

  notificationBadge: { position: "absolute", top: -5, right: -5, backgroundColor: "red", borderRadius: 10, minWidth: 18, height: 18, justifyContent: "center", alignItems: "center", paddingHorizontal: 4 },
  notificationText: { color: "white", fontSize: 11, fontWeight: "bold" },

  notificationDialogOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  notificationDialog: { width: "88%", maxHeight: "70%", backgroundColor: "white", borderRadius: 20, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 15 },
  dialogHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dialogTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
  notificationList: { maxHeight: 420 },
  notificationItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  notificationIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF8E1', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  notificationContent: { flex: 1 },
  notificationTextDialog: { fontSize: 15, color: '#000000', lineHeight: 22, fontWeight: '600' },
  notificationTime: { fontSize: 12, color: '#999', marginTop: 4 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#888', marginTop: 16 },
  emptySubText: { fontSize: 14, color: '#aaa', textAlign: 'center', marginTop: 6, paddingHorizontal: 40 },
  markAllReadButton: { paddingVertical: 14, backgroundColor: '#f8f8f8', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee' },
  markAllReadText: { color: '#FB8500', fontWeight: '600', fontSize: 15 },

  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1100,
  },
  menuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#fff',
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 25,
    elevation: 20,
    overflow: 'hidden',
  },
  menuHeader: {
    paddingTop: Platform.OS === 'android' ? 55 : 65,
    paddingBottom: 25,
    paddingHorizontal: 25,
  },
  menuHeaderTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
  },
  menuHeaderSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  menuContent: {
    flex: 1,
    paddingTop: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 25,
  },







  shopScroll: {
    paddingLeft: 20,
    paddingRight: 10,
    marginBottom: 30,
  },

  shopCard: {
    width: 190,
    height: 210,
    marginRight: 16,
    borderRadius: 30,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,

    elevation: 8,
  },

  shopGradient: {
    flex: 1,
    padding: 22,
    justifyContent: 'space-between',
  },

  shopImage: {
    width: 85,
    height: 85,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 4,
  },

  shopTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },

  shopSubtitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },

  /* FREE LEARN */

  freeLearnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 40,
  },

  learnBox: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 26,
    paddingVertical: 28,
    alignItems: 'center',
    marginBottom: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 5,
  },

  learnImage: {
    width: 62,
    height: 62,
    resizeMode: 'contain',
  },

  learnBoxText: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
});