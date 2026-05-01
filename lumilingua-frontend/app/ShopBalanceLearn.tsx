import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCrmsEndpoint, getCrmsImgEndpoint } from '@/constants/configApi';
import { fetchCategoriesByStatusActive, fetchUserProfile, purchasePackageApi } from '@/services/api';
import Loading from '@/component/loading';

export default function ShopBalanceLearn() {
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const benefits = [
    'Học không giới hạn tất cả nội dung',
    'Lộ trình cá nhân hóa theo trình độ',
    'Không quảng cáo - tập trung 100%',
    'Thống kê & theo dõi tiến độ chi tiết',
  ];

  const formatExpiredDate = (expiredDate: string | null | undefined): string => {
    if (!expiredDate) return 'Không xác định';

    if (expiredDate === 'permanently' || expiredDate.toLowerCase() === 'permanent') {
      return 'Sử dụng vĩnh viễn ♾️';
    }

    try {
      const parts = expiredDate.split(' ');
      if (parts.length < 5) return 'Không xác định';

      const monthStr = parts[1];
      const dayStr = parts[2];
      const yearStr = parts[5];

      const monthMap: { [key: string]: number } = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };

      const month = monthMap[monthStr];
      const day = parseInt(dayStr, 10);
      const year = parseInt(yearStr, 10);

      if (!month && month !== 0 || isNaN(day) || isNaN(year)) {
        return 'Không xác định';
      }

      const date = new Date(year, month, day);

      const formattedDay = String(date.getDate()).padStart(2, '0');
      const formattedMonth = String(date.getMonth() + 1).padStart(2, '0');

      return `Hết hạn: ${formattedDay}/${formattedMonth}/${year}`;
    } catch (error) {
      console.log('Parse expiredDate error:', error);
      return 'Không xác định';
    }
  };

  const refreshTokenApi = async (refreshToken: string) => {
    const endpoint = getCrmsEndpoint("v1/user/refresh");
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.notification || 'Refresh token failed');
    }
    return await response.json();
  };

  const getValidToken = async () => {
    const token = await AsyncStorage.getItem('token');
    const expiredStr = await AsyncStorage.getItem('expired');
    const expired = expiredStr ? parseInt(expiredStr, 10) : null;

    if (token && expired && Date.now() < expired) return token;

    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
      router.replace('/Login');
      return null;
    }

    try {
      const res = await refreshTokenApi(refreshToken);

      await AsyncStorage.setItem('token', res.data.token);
      await AsyncStorage.setItem(
        'expired',
        String(res.data.expired || Date.now() + 900000)
      );

      return res.data.token;
    } catch {
      await AsyncStorage.multiRemove(['token', 'refreshToken', 'expired']);
      router.replace('/Login');
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getValidToken();
        if (!token) return;

        const categories = await fetchCategoriesByStatusActive();
        const mappedPlans = categories.map((item: any) => ({
          id: item.idCategoryLevel,
          title: item.nameCategoryLevel,
          subtitle: item.description,
          price: item.actualPrice ?? item.price ?? 0,
          expiredDate: item.expiredDate,
          imgPath: item.imgPath,
        }));

        setPlans(mappedPlans);

        const userProfile = await fetchUserProfile();
        setWalletBalance(userProfile.wallet?.amountLearn ?? 0);

        if (mappedPlans.length > 0) {
          setSelectedPlan(mappedPlans[0].id);
        }
      } catch (err) {
        Alert.alert('Lỗi', 'Không load được dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePurchase = async () => {
    try {
      const token = await getValidToken();
      if (!token) return;

      if (!selectedPlanData) {
        Alert.alert("Lỗi", "Chưa chọn gói");
        return;
      }

      const request = {
        walletId: await AsyncStorage.getItem('walletId'),
        packageCategoryId: selectedPlanData.id,
        amtType: 'AMT_LEARN',
      };

      await purchasePackageApi(request, token);

      Alert.alert("Thành công", "Mua gói thành công 🎉");

      const userProfile = await fetchUserProfile();
      setWalletBalance(userProfile.wallet?.amountLearn ?? 0);

    } catch (err: any) {
      Alert.alert("Lỗi", err.message);
      console.log(err.message);
    }
  };

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);
  const priceNumber = selectedPlanData?.price || 0;
  const missing = priceNumber - walletBalance;

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Balance Learn Pro</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* WALLET */}
        <View style={styles.walletBox}>
          <View style={styles.walletRow}>
            <Ionicons name="wallet" size={24} color="#4CAF50" />
            <Text style={styles.walletTitle}>Ví Balance Learn</Text>
          </View>

          <Text style={styles.balanceText}>
            {walletBalance.toLocaleString()} đ
          </Text>

          <Text style={styles.balanceSub}>Số dư hiện tại của bạn</Text>
        </View>

        {/* TITLE */}
        <Text style={styles.pageTitle}>Nâng cấp để học tốt hơn 🚀</Text>
        <Text style={styles.pageSubtitle}>
          Truy cập toàn bộ nội dung & tăng tốc kỹ năng của bạn
        </Text>

        {/* BENEFITS */}
        <View style={styles.benefitsBox}>
          {benefits.map((item, index) => (
            <View key={index} style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* PLANS */}
        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              {plan.imgPath ? (
                <Image
                  source={{
                    uri: getCrmsImgEndpoint(`categories/${plan.imgPath}`)
                  }}
                  style={styles.planImage}
                  resizeMode="contain"
                />
              ) : (
                <Ionicons name="diamond-outline" size={62} color="#FF5722" />
              )}

              <Text style={styles.planTitle}>{plan.title}</Text>
              <Text style={styles.planSubtitle}>{plan.subtitle}</Text>

              <Text style={styles.price}>
                {plan.price.toLocaleString()} đ
              </Text>

              {/* Expired Date đã được format đẹp */}
              <Text style={styles.desc}>
                {formatExpiredDate(plan.expiredDate)}
              </Text>

              <View
                style={[
                  styles.selectBtn,
                  selectedPlan === plan.id && styles.activeBtn,
                ]}
              >
                <Text style={styles.selectText}>
                  {selectedPlan === plan.id ? 'Đã chọn ✓' : 'Chọn'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* MISSING AMOUNT */}
        {missing > 0 && (
          <Text style={styles.missingText}>
            Bạn cần thêm {missing.toLocaleString()} đ
          </Text>
        )}
      </ScrollView>

      {/* CTA BUTTON */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          disabled={missing > 0}
          onPress={handlePurchase} 
          style={[
            styles.buyBtn,
            missing > 0 && { backgroundColor: '#ccc' },
          ]}
        >
          <Text style={styles.buyText}>
            {missing > 0 ? 'Nạp thêm để mua' : 'Thanh toán ngay'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },

  header: {
    backgroundColor: '#fd7905',
    paddingTop: Platform.OS === 'android' ? 50 : 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  walletBox: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 18,
    borderRadius: 18,
    elevation: 5,
  },

  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  walletTitle: {
    marginLeft: 8,
    fontWeight: '600',
  },

  balanceText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4CAF50',
    marginTop: 8,
  },

  balanceSub: {
    fontSize: 13,
    color: '#888',
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 20,
    paddingHorizontal: 20,
  },

  pageSubtitle: {
    color: '#666',
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  benefitsBox: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },

  benefitItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  benefitText: {
    marginLeft: 10,
    fontSize: 15,
  },

  plansContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },

  planCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },

  selectedCard: {
    borderColor: '#FFB703',
  },

  planTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
  },

  planSubtitle: {
    color: '#777',
    marginBottom: 8,
  },

  price: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF5722',
    marginVertical: 8,
  },

  desc: {
    textAlign: 'center',
    marginTop: 6,
    fontSize: 15,
    color: '#555',
    fontWeight: '500',
  },

  selectBtn: {
    marginTop: 15,
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 20,
  },

  activeBtn: {
    backgroundColor: '#4CAF50',
  },

  selectText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  missingText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#FF5722',
    fontWeight: '600',
    fontSize: 15,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  buyBtn: {
    backgroundColor: '#fd7905',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
  },

  buyText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },

  planImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
    marginBottom: 12,
  },
});