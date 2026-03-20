import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useUserCache } from '@/hook/useUserCache';
import {
  fetchInformation,
  getApplicationSubmitted,
  getCertificateByUserId,
  getLevelByCategoryId,
  getRankByUserId,
  uploadAvatar,
} from '@/services/api';
import Loading from '@/component/loading';
import * as ImagePicker from 'expo-image-picker';
import { getCrmsEndpoint, getClientEndpoint, getCrmsImgEndpoint } from "@/constants/configApi";


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CERTIFICATE_ASPECT_RATIO = 880 / 1184;

const Profile = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const { cache: userCache, loadingCache, cacheError } = useUserCache();
  const [categoryLevel, setCategoryLevel] = useState<any>(null);
  const [certificateCache, setCertificateCache] = useState<any>(null);
  const [rank, setRank] = useState<any>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [certificateLoaded, setIsCertificateLoaded] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);

  const refreshTokenApi = async (refreshToken: string) => {
    const endpoint = getCrmsEndpoint("v1/user/refresh");

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.notification);
    }

    return await response.json();
  };

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      if (!isMounted) return;

      const token = await AsyncStorage.getItem('token');
      const expiredStr = await AsyncStorage.getItem('expired');
      const expired = expiredStr ? parseInt(expiredStr, 10) : null;

      if (token && expired && Date.now() < expired) {
        setLoadingLogin(false);
        return;
      }

      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (refreshToken) {
        setLoadingLogin(true);
        try {
          const response = await refreshTokenApi(refreshToken);
          await AsyncStorage.setItem('token', response.data.token || '');
          await AsyncStorage.setItem('expired', String(response.data.expired || Date.now() + 900000));
        } catch (err) {
          console.log('Refresh error:', err);
          await AsyncStorage.multiRemove(['token', 'refreshToken', 'expired', 'username', 'email']);
          router.replace('/Login');
        } finally {
          if (isMounted) setLoadingLogin(false);
        }
      } else {
        router.replace('/Login');
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    const loadUserName = async () => {
      const name = await AsyncStorage.getItem('username');
      setUserName(name);
    };

    loadUserName();
  }, []);

  useEffect(() => {
    const fetchInformationAccount = async () => {
      try {
        if (userCache && userCache.length > 0) {
          const categoryId = userCache[0].category_level;
          const userId = userCache[0].id_user_cache;
          const email = userCache[0].email;

          const [dataLevel, dataCertificate, dataRank, dataInformation, dataApplications] = await Promise.all([
            getLevelByCategoryId(categoryId),
            getCertificateByUserId(userId),
            getRankByUserId(userId),
            fetchInformation(email),
            getApplicationSubmitted(email),
          ]);

          if (dataInformation?.avatar) {
            setAvatar(getCrmsImgEndpoint("avatars/") + dataInformation.avatar);
          } else {
            setAvatar(null);
          }

          setCategoryLevel(dataLevel);
          setCertificateCache(dataCertificate);
          setRank(dataRank);

          if (dataApplications?.data && Array.isArray(dataApplications.data)) {
            setApplications(dataApplications.data);
          } else {
            setApplications([]);
          }
        }
      } catch (err) {
        console.error('Error loading profile data:', err);
      }
    };

    fetchInformationAccount();
  }, [userCache]);

  const pickAvatar = async () => {
    if (!userCache || userCache.length === 0) return;

    const userId = userCache[0].id_user;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) return;

    try {
      const uri = result.assets[0].uri;
      const response = await uploadAvatar(uri, userId);
      const avatarUrl = getCrmsImgEndpoint("avatars/") + response.data.avatar;
      setAvatar(avatarUrl);
    } catch (error) {
      console.log('Upload error:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove([
              'token',
              'refreshToken',
              'expired',
              'username',
              'email',
            ]);
            router.replace('/Login');
          } catch (err) {
            Alert.alert('Lỗi', 'Đăng xuất thất bại');
          }
        },
      },
    ]);
  };

  if (loadingCache || loadingLogin) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* Header Gradient */}
      <LinearGradient
        colors={['#FFA500', '#FF8C00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.avatarContainer} onPress={pickAvatar}>
          <Image
            source={
              avatar
                ? { uri: avatar }
                : require('@/assets/images/accounts/logo.jpg')
            }
            style={styles.avatar}
          />
          <View style={styles.editBadge}>
            <Ionicons name="pencil" size={16} color="white" />
          </View>
        </TouchableOpacity>

        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userLevel}>
          Level {categoryLevel?.[0]?.level ?? 0} • {userCache?.[0]?.gain_xp ?? 0} XP
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="flame" size={28} color="white" />
            <Text style={styles.statValue}>{userCache?.[0]?.streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="ribbon" size={28} color="white" />
            <Text style={styles.statValue}>{certificateCache?.length ?? 0}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="podium" size={28} color="white" />
            <Text style={styles.statValue}>{rank?.rank ?? 0}</Text>
            <Text style={styles.statLabel}>Rank</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Body */}
      <ScrollView style={styles.body}>
        {/* Current Languages */}
        <Text style={styles.sectionTitle}>Application Submitted</Text>
        {applications.length > 0 ? (
            <View
              style={{ marginVertical: 8 }}
            >
              {applications.length > 0 ? (
                <View
                  style={{ marginVertical: 12 }}
                >
                  {applications.map((app, index) => {
                    const status = (app.status || 'PENDING').toUpperCase();
                    const isActive = status === 'ACTIVE';
                    const isInactive = status === 'INACTIVE';

                    return (
                      <View
                        key={`app-${index}`}
                        style={[
                          styles.applicationCard,
                          { marginRight: index < applications.length - 1 ? 16 : 0 },
                        ]}
                      >
                        {/* Scores - dạng badge tròn */}
                        <View style={styles.scoreContainer}>
                          <View style={styles.scoreBadge}>
                            <Text style={styles.scoreLabelSmall}>Speaking</Text>
                            <Text style={styles.scoreValue}>{app.scoreSpeaking ?? '-'}</Text>
                          </View>
                          <View style={styles.scoreBadge}>
                            <Text style={styles.scoreLabelSmall}>Reading</Text>
                            <Text style={styles.scoreValue}>{app.scoreReading ?? '-'}</Text>
                          </View>
                          <View style={styles.scoreBadge}>
                            <Text style={styles.scoreLabelSmall}>Listening</Text>
                            <Text style={styles.scoreValue}>{app.scoreListening ?? '-'}</Text>
                          </View>
                          <View style={styles.scoreBadge}>
                            <Text style={styles.scoreLabelSmall}>Writing</Text>
                            <Text style={styles.scoreValue}>{app.scoreWriting ?? '-'}</Text>
                          </View>
                        </View>

                        {/* Expected Salary */}
                        <View style={styles.infoRow}>
                          <Ionicons name="cash-outline" size={20} color="#FF9500" />
                          <Text style={styles.infoText}>
                            Lương mong muốn:{' '}
                            {app.expectedSalary
                              ? new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(app.expectedSalary)
                              : 'Chưa có thông tin'}
                          </Text>
                        </View>

                        {/* Experience */}
                        {app.experienced && app.experienced.length > 0 ? (
                          <View style={styles.experienceSection}>
                            <View style={styles.infoRow}>
                              <Ionicons name="briefcase-outline" size={20} color="#FF9500" />
                              <Text style={styles.sectionSubtitle}>Kinh nghiệm</Text>
                            </View>
                            {app.experienced.map((exp: any, expIdx: number) => (
                              <View key={`exp-${expIdx}`} style={styles.experienceItem}>
                                <Text style={styles.companyName}>{exp.companyName}</Text>
                                <Text style={styles.dateRange}>
                                  {new Date(exp.fromDate).toLocaleDateString('vi-VN', {
                                    month: 'short',
                                    year: 'numeric',
                                  })}{' '}
                                  →{' '}
                                  {new Date(exp.toDate).toLocaleDateString('vi-VN', {
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </Text>
                                <Text style={styles.years}>
                                </Text>
                              </View>
                            ))}
                          </View>
                        ) : (
                          <Text style={styles.noDataText}>Chưa có kinh nghiệm được liệt kê</Text>
                        )}

                        {/* Certificate Path */}
                        {app.certificatePath && (
                          <View style={styles.infoRow}>
                            <Ionicons name="document-text-outline" size={20} color="#FF9500" />
                            <Text style={styles.infoText}>
                              Chứng chỉ: {app.certificatePath.split('/').pop() || app.certificatePath}
                            </Text>
                          </View>
                        )}
                        {/* Status Badge */}
                        <View
                          style={[
                            styles.statusBadge,
                            isActive
                              ? styles.statusActive
                              : isInactive
                                ? styles.statusInactive
                                : styles.statusPending,
                          ]}
                        >
                          <Text style={styles.statusText}>Trạng thái: {status === "ACTIVE" ? "XÁC NHẬN" : "CHƯA XÁC NHẬN"}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="document-text-outline" size={48} color="#d0d0d0" />
                  <Text style={styles.emptyText}>Chưa có đơn ứng tuyển nào</Text>
                </View>
              )}
            </View>
        ) : (
          <View style={{ paddingVertical: 20, alignItems: 'center', opacity: 0.7 }}>
            <Text>Chưa có đơn ứng tuyển nào</Text>
          </View>
        )}

        {/* Achievements / Badges */}
        <Text style={styles.sectionTitle}>Achieves</Text>
        {certificateCache && certificateCache.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.badgesScroll}
          >
            {certificateCache.map((item: any) => {
              const cert = item.certificate_detail;
              return (
                <TouchableOpacity
                  key={item.id_certificate_cache}
                  style={styles.badgeItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedCert(item);
                    setIsCertificateLoaded(false);
                    setModalVisible(true);
                  }}
                >
                  <Ionicons
                    name={cert.icon || 'star'}
                    size={40}
                    color="#FFA500"
                  />
                  <Text style={styles.badgeText} numberOfLines={1}>
                    {cert.name_certificate}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <View
            style={{
              paddingVertical: 20,
              alignItems: 'center',
              opacity: 0.6,
            }}
          >
            <Text>Chưa có chứng chỉ / thành tựu nào</Text>
          </View>
        )}

        {/* Navigate Staff */}
        <TouchableOpacity
          style={styles.becomeTutorButton}
          activeOpacity={0.8}
          onPress={() => router.push('/RegisterTutor')}
        >
          <LinearGradient
            colors={['#FFB703', '#FB8500']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.becomeTutorGradient}
          >
            <Ionicons name="school" size={32} color="white" />
            <View style={styles.becomeTutorTextContainer}>
              <Text style={styles.becomeTutorTitle}>Trở thành Gia sư</Text>
              <Text style={styles.becomeTutorDesc}>
                Dạy ngôn ngữ, kiếm tiền và lan tỏa niềm vui học tập!
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={28} color="white" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Settings List */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsList}>
          <TouchableOpacity
            onPress={() => router.push('/Information')}
            style={styles.settingItem}
          >
            <Ionicons name="person-outline" size={24} color="#FFA500" />
            <Text style={styles.settingText}>Edit information</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="settings-outline" size={24} color="#FFA500" />
            <Text style={styles.settingText}>Setting application</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="help-circle-outline" size={24} color="#FFA500" />
            <Text style={styles.settingText}>Support & FAQ</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.settingItem, { borderBottomWidth: 0 }]}
          >
            <Ionicons name="log-out-outline" size={24} color="#FF6347" />
            <Text style={[styles.settingText, { color: '#FF6347' }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Certificate Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setIsCertificateLoaded(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.certificateContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close-circle" size={36} color="#FF6347" />
            </TouchableOpacity>

            {selectedCert && (
              <ImageBackground
                source={require('@/assets/certificates/template.png')}
                style={styles.backgroundImage}
                resizeMode="contain"
                imageStyle={{ borderRadius: 16 }}
              >
                <View style={styles.overlayContent}>
                  {/* Phần trên */}
                  <View style={styles.topSection}>
                    <Text style={styles.ribbonText}>LUMILINGUA</Text>
                  </View>

                  {/* Phần giữa */}
                  <View style={styles.middleSection}>
                    <Text style={styles.recipientName}>
                      {userName}
                    </Text>

                    <Text style={styles.description}>
                      {selectedCert.certificate_detail.description_certificate}
                    </Text>
                  </View>

                  {/* Phần dưới */}
                  <View style={styles.bottomSection}>
                    <View style={styles.dateSignatureRow}>
                      <View style={styles.dateColumn}>
                        <Text style={styles.valueText}>
                          {new Date(selectedCert.received_date).toLocaleDateString(
                            'vi-VN',
                            {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            }
                          )}
                        </Text>
                      </View>

                      <View style={styles.signatureColumn}>
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureName}>
                          Lumilingua Team
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </ImageBackground>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
  },
  avatarContainer: { position: 'relative' },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  editBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#FFA500',
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
  },
  userLevel: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 24,
    width: '100%',
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center' },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  body: { flex: 1, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 24,
    marginBottom: 2,
  },
  languagesRow: { flexDirection: 'row', justifyContent: 'space-between' },
  languageCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  flag: { fontSize: 40 },
  languageName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  languageLevel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  badgesScroll: { paddingVertical: 8 },
  badgeItem: {
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
    width: 120,
  },
  badgeText: {
    fontSize: 14,
    color: '#FFA500',
    marginTop: 8,
    textAlign: 'center',
  },
  becomeTutorButton: {
    marginVertical: 10,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  becomeTutorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  becomeTutorTextContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  becomeTutorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  becomeTutorDesc: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginTop: 4,
  },
  settingsList: {
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 82,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
    color: '#333',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  certificateContainer: {
    width: SCREEN_WIDTH * 0.88,
    aspectRatio: CERTIFICATE_ASPECT_RATIO,
    maxHeight: '98%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  backgroundImage: {
    flex: 1,
  },
  overlayContent: {
    flex: 1,
    paddingHorizontal: SCREEN_WIDTH * 0.08,
    paddingTop: SCREEN_WIDTH * 0.12,
    paddingBottom: SCREEN_WIDTH * 0.10,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  ribbonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  awardedTo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    fontWeight: '500',
  },
  recipientName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#001F3F',
    textAlign: 'center',
    marginBottom: 14,
    marginTop: 54,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
    lineHeight: 15,
    paddingHorizontal: 3,
    marginBottom: 80,
  },
  bottomSection: {
    marginTop: 'auto',
  },
  dateSignatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  dateColumn: {
    alignItems: 'flex-start',
  },
  signatureColumn: {
    alignItems: 'flex-end',
  },
  labelText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 6,
  },
  valueText: {
    fontSize: 8,
    color: '#ffffff',
    fontWeight: '500',
  },
  signatureLine: {
    width: 140,
    height: 1.5,
    marginVertical: 18,
  },
  signatureName: {
    fontSize: 12,
    color: '#ffffff',
    fontStyle: 'italic',
    marginLeft: 90

  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 4,
  },
  applicationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: SCREEN_WIDTH - 32,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f3f3f3',
  },

  statusBadge: {
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    minWidth: 300,
    marginLeft: 25,
    marginBottom: 10,
    minHeight: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  statusActive: {
    backgroundColor: '#34C759',
  },

  statusInactive: {
    backgroundColor: '#FF3B30',
  },

  statusPending: {
    backgroundColor: '#8E8E93',
  },

  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },

  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,

  },

  scoreBadge: {
    backgroundColor: '#FFF5E6',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  scoreLabelSmall: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
  },

  scoreValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF9500',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  infoText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
    fontWeight: '500',
  },

  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF9500',
    marginLeft: 10,
  },

  experienceSection: {
    marginTop: 12,
  },

  experienceItem: {
    marginTop: 8,
    paddingLeft: 30,
  },

  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },

  dateRange: {
    fontSize: 13,
    color: '#555',
  },

  years: {
    fontSize: 13,
    color: '#777',
    fontStyle: 'italic',
  },

  noDataText: {
    color: '#888',
    fontStyle: 'italic',
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    marginHorizontal: 8,
  },

  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#777',
    fontWeight: '500',
  },

  editButton: {
    marginTop: 16,
    backgroundColor: "#FF9500",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
  },
});

export default Profile;