import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import Loading from '@/component/loading';
import { getCrmsEndpoint, getCrmsImgEndpoint } from "@/constants/configApi";
import { Contract } from '@/interfaces/interfaces';
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { fetchUserProfile, negotiateContractUser } from '@/services/api';
import { TextInput } from 'react-native';

const getStatusColor = (status: string) => {
    const s = status?.toUpperCase() || '';
    switch (s) {
        case 'APPROVE':
            return '#34C759';
        case 'REJECT':
            return '#FF3B30';
        case 'HOLD':
            return '#FF9500';
        case 'PENDING':
            return '#FFCC00';
        case 'PAID':
            return '#34C759';
        case 'UNPAID':
            return '#FF9500';
        default:
            return '#8E8E93';
    }
};;

const ContractStudent = () => {
    const router = useRouter();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);
    const scale = useSharedValue(1);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [showNegotiateModal, setShowNegotiateModal] = useState(false);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [newFee, setNewFee] = useState("");
    const [rawFee, setRawFee] = useState("");

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const onPinchEvent = (event: any) => {
        scale.value = event.nativeEvent.scale;
    };

    const onPinchEnd = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            scale.value = withSpring(1);
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

    useEffect(() => {
        const init = async () => {
            const token = await AsyncStorage.getItem('token');
            const expiredStr = await AsyncStorage.getItem('expired');
            const expired = expiredStr ? parseInt(expiredStr, 10) : null;

            if (!(token && expired && Date.now() < expired)) {
                const refreshToken = await AsyncStorage.getItem('refreshToken');
                if (refreshToken) {
                    try {
                        const res = await refreshTokenApi(refreshToken);
                        await AsyncStorage.setItem('token', res.data.token || '');
                        await AsyncStorage.setItem('expired', String(res.data.expired || Date.now() + 900000));
                    } catch (err) {
                        await AsyncStorage.multiRemove(['token', 'refreshToken', 'expired']);
                        router.replace('/Login');
                        return;
                    }
                } else {
                    router.replace('/Login');
                    return;
                }
            }
            const profile = await fetchUserProfile();
            setUserProfile(profile);
            await fetchContracts();
        };

        init();
    }, [router]);

    const fetchContracts = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const idUser = await AsyncStorage.getItem('idUser');

            if (!token || !idUser) throw new Error('Thiếu thông tin xác thực');

            const url = getCrmsEndpoint(`v1/mentor-subscription/id-user?id=${idUser}`);

            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) throw new Error('Lỗi khi tải hợp đồng');

            const result = await res.json();
            setContracts(result.data || []);
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách hợp đồng');
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async (contract: Contract) => {
        try {

            const token = await AsyncStorage.getItem("token");

            const url = getCrmsEndpoint("v1/mentor-subscription/paid");

            const body = {
                idUser: contract.idUser,
                idInformationStaff: contract.informationStaffResponse.idInformationStaff
            };

            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            });

            const result = await res.json();

            if (!res.ok || result.code !== 200) {
                throw new Error(result.notification || "Thanh toán thất bại");
            }

            Alert.alert("Thành công", "Thanh toán thành công!");

            fetchContracts();
            const profile = await fetchUserProfile();
            setUserProfile(profile);
        } catch (err: any) {
            Alert.alert("Lỗi", err.message);
        }
    };

    const formatVND = (amount: number | null) => {
        if (amount == null || amount === 0) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatShortVND = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + " ₫";
    };

    const formatMoney = (value: string) => {
        const number = value.replace(/\D/g, "");
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const openStaffDetail = (staff: any) => {
        setSelectedStaff(staff);
        setModalVisible(true);
    };

    if (loading) return <Loading />;

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={fetchContracts}>
                    <Text style={styles.retryText}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Hợp đồng học viên',
                    headerTintColor: 'black',
                    headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={28} color="black" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <View style={styles.container}>
                <LinearGradient colors={['#FFB703', '#FB8500']}>
                    <View style={styles.profileBox}>

                        <View style={styles.avatarCircle}>
                            {userProfile?.avatar ? (
                                <Image
                                    source={{
                                        uri: getCrmsImgEndpoint(`avatars/${userProfile.avatar}`)
                                    }}
                                    style={styles.avatarImage}
                                />
                            ) : (
                                <Ionicons name="person" size={36} color="#FF9500" />
                            )}
                        </View>

                        <View style={{ flex: 1 }}>

                            <Text style={styles.username}>
                                {userProfile?.username || "User"}
                            </Text>

                            <Text style={styles.levelText}>
                                Level {userProfile.level} • XP {userProfile.xp}
                            </Text>

                        </View>

                        <View style={styles.walletBox}>
                            <TouchableOpacity
                                style={styles.balanceCard}
                                activeOpacity={0.85}
                                onPress={() => router.push('/(tabs)/wallet')}
                            >
                                <View style={styles.balanceIcon}>
                                    <Ionicons name="wallet" size={28} color="#FF5722" />
                                </View>
                                <View >
                                    <Text style={styles.balanceLabel}>Topup Balance</Text>
                                    <Text style={styles.balanceValue}>{formatShortVND((userProfile?.wallet?.amountTopUp || 0))}</Text>
                                </View>
                                <View style={styles.topupButton}>
                                    <Ionicons name="add-circle" size={16} color="#fff" />
                                </View>
                            </TouchableOpacity>
                        </View>



                    </View>

                </LinearGradient>

                <ScrollView style={styles.body}>
                    {contracts.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="document-text-outline" size={70} color="#ddd" />
                            <Text style={styles.emptyText}>Chưa có hợp đồng nào</Text>
                        </View>
                    ) : (
                        contracts.map((contract) => {
                            const staff = contract.informationStaffResponse;
                            const canPay =
                                contract.statusUser === "APPROVE" &&
                                contract.statusStaff === "APPROVE" &&
                                (userProfile?.wallet?.amountTopUp || 0) >= (contract.agreeFee || 0) &&
                                contract.status !== "PAID";

                            const showDecisionButtons =
                                contract.statusUser === "PENDING" &&
                                contract.statusStaff === "HOLD";

                            const statusColor = getStatusColor(contract.status);
                            const statusUserColor = getStatusColor(contract.statusUser);
                            const statusStaffColor = getStatusColor(contract.statusStaff);

                            return (
                                <View key={staff.idInformationStaff} style={styles.contractCard}>
                                    {/* Header: Thông tin Học viên + Trạng thái hợp đồng */}
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.sectionTitle}>Thông tin Học viên</Text>

                                        {/* Trạng thái hợp đồng (UNPAID/PAID) - Nổi bật bên phải */}
                                        <View style={[styles.contractStatusBadge, { backgroundColor: statusColor }]}>
                                            <Text style={styles.contractStatusText}>
                                                {contract.status}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Thông tin học viên */}
                                    <View style={styles.infoRow}>
                                        <Ionicons name="mail-outline" size={20} color="#555" />
                                        <Text style={styles.infoText}>{contract.emailTrainees || 'Chưa có'}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Ionicons name="call-outline" size={20} color="#555" />
                                        <Text style={styles.infoText}>{contract.phoneTrainees || 'Chưa có'}</Text>
                                    </View>

                                    {/* Expected Fee */}
                                    <View style={styles.feeRow}>
                                        <View style={styles.feeItem}>
                                            <Text style={styles.feeLabelSmall}>Expected User</Text>
                                            <Text style={styles.feeValueSmall}>{formatVND(contract.expectedFeeUser)}</Text>
                                        </View>
                                        <View style={styles.feeItem}>
                                            <Text style={styles.feeLabelSmall}>Expected Mentor</Text>
                                            <Text style={styles.feeValueSmall}>{formatVND(contract.expectedFeeMentor)}</Text>
                                        </View>
                                    </View>

                                    {/* Phí thỏa thuận */}
                                    <View style={styles.agreeFeeSection}>
                                        <Text style={styles.agreeFeeLabel}>Phí thỏa thuận</Text>
                                        <Text style={styles.agreeFeeValue}>{formatVND(contract.agreeFee)}</Text>
                                    </View>

                                    {showDecisionButtons && (
                                        <View style={styles.actionRow}>

                                            <TouchableOpacity style={styles.approveBtn} onPress={() =>
                                                Alert.alert(
                                                    "Confirm",
                                                    "Bạn có chắc muốn ĐỒNG Ý hợp đồng này?",
                                                    [
                                                        {
                                                            text: "Yes",
                                                            onPress: async () => {
                                                                await negotiateContractUser(
                                                                    contract.idUser,
                                                                    contract.informationStaffResponse.idInformationStaff,
                                                                    "APPROVE"
                                                                );

                                                                fetchContracts();
                                                            }
                                                        },
                                                        { text: "Cancel", style: "cancel" }
                                                    ]
                                                )
                                            }>
                                                <Ionicons name="checkmark-circle-outline" size={18} color="white" />
                                                <Text style={styles.actionText}>Approve</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={styles.rejectBtn} onPress={() =>
                                                Alert.alert(
                                                    "Confirm",
                                                    "Bạn có chắc muốn HỦY BỎ hợp đồng này?",
                                                    [
                                                        {
                                                            text: "Yes",
                                                            onPress: async () => {
                                                                await negotiateContractUser(
                                                                    contract.idUser,
                                                                    contract.informationStaffResponse.idInformationStaff,
                                                                    "REJECT"
                                                                );

                                                                fetchContracts();
                                                            }
                                                        },
                                                        { text: "Cancel", style: "cancel" }
                                                    ]
                                                )
                                            }>
                                                <Ionicons name="close-circle-outline" size={18} color="white" />
                                                <Text style={styles.actionText}>Reject</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.negotiateBtn}
                                                onPress={() => {
                                                    setSelectedContract(contract);
                                                    setNewFee(String(contract.agreeFee || ""));
                                                    setShowNegotiateModal(true);
                                                }}
                                            >
                                                <Ionicons name="swap-horizontal-outline" size={18} color="white" />
                                                <Text style={styles.actionText}>Negotiate</Text>
                                            </TouchableOpacity>

                                        </View>
                                    )}

                                    {contract.status === "PAID" ? (
                                        <View style={styles.paidBadge}>
                                            <Ionicons name="checkmark-circle" size={20} color="white" />
                                            <Text style={styles.paidText}>Đã thanh toán</Text>
                                        </View>
                                    ) : canPay ? (
                                        <TouchableOpacity
                                            style={styles.payBtn}
                                            onPress={() => {
                                                Alert.alert(
                                                    "Thanh toán",
                                                    `Thanh toán ${formatVND(contract.agreeFee)} cho gia sư?`,
                                                    [
                                                        {
                                                            text: "Yes",
                                                            onPress: () => handlePay(contract),
                                                        },
                                                        { text: "Cancel" },

                                                    ]
                                                );
                                            }}
                                        >
                                            <Ionicons name="card-outline" size={18} color="white" />
                                            <Text style={styles.payBtnText}>Thanh toán ngay</Text>
                                        </TouchableOpacity>
                                    ) : null}



                                    {/* Trạng thái chi tiết */}
                                    <View style={styles.statusContainer}>
                                        <View style={styles.statusRow}>
                                            <Text style={styles.statusLabel}>User Status:</Text>
                                            <Text style={[styles.statusValue, { color: statusUserColor }]}>
                                                {contract.statusUser}
                                            </Text>
                                        </View>
                                        <View style={styles.statusRow}>
                                            <Text style={styles.statusLabel}>Mentor Status:</Text>
                                            <Text style={[styles.statusValue, { color: statusStaffColor }]}>
                                                {contract.statusStaff}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Thông tin Gia sư */}
                                    <Text style={styles.sectionTitle}>Thông tin Gia sư</Text>
                                    <TouchableOpacity
                                        style={styles.staffRow}
                                        onPress={() => openStaffDetail(staff)}
                                    >
                                        <Ionicons name="person-circle-outline" size={28} color="#FF9500" />
                                        <View style={styles.staffInfo}>
                                            <Text style={styles.staffName}>
                                                Tên gia sư: {staff.user.username}
                                            </Text>
                                            <Text style={styles.staffName}>
                                                Giới tính: {staff.user.gender}
                                            </Text>
                                            <Text style={styles.staffLink}>Nhấn để xem chi tiết →</Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={24} color="#FF9500" />
                                    </TouchableOpacity>

                                    <Text style={styles.dateText}>
                                        Tạo ngày: {formatDate(contract.createdAt)}
                                    </Text>
                                </View>
                            );
                        })
                    )}
                </ScrollView>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                                <Ionicons name="close-circle" size={32} color="#FF6347" />
                            </TouchableOpacity>

                            {selectedStaff && (
                                <>
                                    <Text style={styles.modalTitle}>Chi tiết Gia sư</Text>
                                    <Text style={styles.modalLabel}>Tên gia sư</Text>
                                    <Text style={styles.modalValue}>{selectedStaff.user.username}</Text>

                                    <Text style={styles.modalLabel}>Điểm IELTS</Text>
                                    <Text style={styles.modalValue}>
                                        Speaking: {selectedStaff.scoreSpeaking} • Reading: {selectedStaff.scoreReading} •
                                        Listening: {selectedStaff.scoreListening} • Writing: {selectedStaff.scoreWriting}
                                    </Text>

                                    <Text style={styles.modalLabel}>Lương mong đợi</Text>
                                    <Text style={styles.modalValue}>{formatVND(selectedStaff.expectedSalary)}</Text>

                                    <TouchableOpacity
                                        style={styles.certificateBtn}
                                        onPress={() => setShowCertificate(true)}
                                    >
                                        <Ionicons name="document-text-outline" size={20} color="white" />
                                        <Text style={styles.certificateBtnText}>Xem Chứng chỉ</Text>
                                    </TouchableOpacity>
                                    <Modal visible={showCertificate} transparent animationType="fade">
                                        <View style={styles.certificateOverlay}>
                                            <View style={styles.certificateBox}>
                                                <TouchableOpacity
                                                    style={styles.closeBtn}
                                                    onPress={() => {
                                                        setShowCertificate(false);
                                                        scale.value = 1;
                                                    }}
                                                >
                                                    <Ionicons name="close" size={28} color="#333" />
                                                </TouchableOpacity>

                                                <Text style={styles.certificateTitle}>
                                                    Chứng chỉ của {selectedStaff?.user?.username || "Gia sư"}
                                                </Text>

                                                {selectedStaff?.certificatePath ? (
                                                    <PinchGestureHandler
                                                        onGestureEvent={onPinchEvent}
                                                        onHandlerStateChange={onPinchEnd}
                                                    >
                                                        <Animated.Image
                                                            source={{
                                                                uri: getCrmsImgEndpoint(
                                                                    `uploads/${selectedStaff.certificatePath}`
                                                                ),
                                                            }}
                                                            style={[styles.certificateImage, animatedStyle]}
                                                            resizeMode="contain"
                                                        />
                                                    </PinchGestureHandler>
                                                ) : (
                                                    <Text
                                                        style={{
                                                            color: "#777",
                                                            marginTop: 20,
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        Gia sư chưa cập nhật chứng chỉ
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                    </Modal>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={showNegotiateModal}
                    transparent
                    animationType="slide"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>

                            <Text style={styles.modalTitle}>Thương lượng giá</Text>

                            <Text style={styles.modalLabel}>Nhập giá mới (VND)</Text>

                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={newFee}
                                placeholder="Enter new price"
                                placeholderTextColor="#999"
                                onChangeText={(text) => {

                                    const numeric = text.replace(/\D/g, "");

                                    setRawFee(numeric);

                                    setNewFee(formatMoney(numeric));
                                }}
                            />

                            <View style={{ flexDirection: "row", marginTop: 20 }}>

                                <TouchableOpacity
                                    style={styles.rejectBtn}
                                    onPress={() => setShowNegotiateModal(false)}
                                >
                                    <Text style={styles.actionText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.negotiateBtn}
                                    onPress={async () => {
                                        if (!selectedContract) return;
                                        const fee = Number(rawFee);

                                        if (!fee || fee <= 0) {
                                            Alert.alert("Lỗi", "Giá phải lớn hơn 0");
                                            return;
                                        }

                                        try {

                                            await negotiateContractUser(
                                                selectedContract?.idUser,
                                                selectedContract?.informationStaffResponse.idInformationStaff,
                                                "UNAPPROVE",
                                                fee
                                            );

                                            setShowNegotiateModal(false);

                                            fetchContracts();

                                        } catch (err) {
                                            Alert.alert("Lỗi", "Không thể thương lượng");
                                        }

                                    }}
                                >
                                    <Text style={styles.actionText}>Send Offer</Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    </View>
                </Modal>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    headerTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16
    },

    profileBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.2)",
        padding: 14,
    },

    avatarCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
        overflow: "hidden",

        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.6)",

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5
    },

    username: {
        color: "white",
        fontSize: 18,
        fontWeight: "700"
    },

    levelText: {
        color: "rgba(255,255,255,0.9)",
        fontSize: 13,
        marginTop: 2
    },

    walletBox: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 20
    },

    balanceCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        maxWidth: 180,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#ff7300',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 6,
    },
    balanceIcon: {
        width: 28,
        height: 28,
        borderRadius: 24,
        backgroundColor: '#FFF8E1',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    balanceLabel: {
        fontSize: 10,
        color: '#666',
        fontWeight: '600',
    },
    balanceValue: {
        fontSize: 13,
        fontWeight: '800',
        color: '#333',
        marginTop: 2,
    },
    topupButton: {
        backgroundColor: '#FF5722',
        width: 20,
        height: 20,
        borderRadius: 30,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    body: { flex: 1, padding: 16 },

    contractCard: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#f2f2f2",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },

    contractStatusBadge: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 14,
    },
    contractStatusText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoText: { marginLeft: 12, fontSize: 16, color: '#444' },

    feeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 14,
    },
    feeItem: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff9f0',
        padding: 12,
        borderRadius: 12,
        marginHorizontal: 4,
    },
    feeLabelSmall: { fontSize: 13, color: '#666' },
    feeValueSmall: { fontSize: 16, fontWeight: '600', color: '#FF9500', marginTop: 4 },

    agreeFeeSection: {
        marginVertical: 16,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
    },
    agreeFeeLabel: { fontSize: 15, color: '#666' },
    agreeFeeValue: { fontSize: 22, fontWeight: 'bold', color: '#FF9500', marginTop: 4 },

    statusContainer: { marginVertical: 16 },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 6,
    },
    statusLabel: { fontSize: 15, color: '#666', flex: 1 },
    statusValue: { fontSize: 16, fontWeight: '700' },

    staffRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff9f0',
        padding: 16,
        borderRadius: 16,
        marginTop: 8,
    },
    staffInfo: { flex: 1, marginLeft: 12 },
    staffName: { fontSize: 17, fontWeight: '600', color: '#222' },
    staffLink: { fontSize: 14, color: '#FF9500', marginTop: 2 },

    dateText: { fontSize: 13, color: '#888', textAlign: 'right', marginTop: 16 },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 24, width: '100%', maxWidth: 380 },
    closeBtn: { alignSelf: 'flex-end', marginBottom: 10 },
    modalTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    modalLabel: { fontSize: 15, color: '#666', marginTop: 14 },
    modalValue: { fontSize: 17, fontWeight: '600', color: '#333', marginTop: 4 },

    certificateBtn: {
        marginTop: 24,
        backgroundColor: '#FF9500',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        gap: 8,
    },
    certificateBtnText: { color: 'white', fontWeight: '600', fontSize: 16 },

    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: 'red', fontSize: 16 },
    retryBtn: { backgroundColor: '#FF9500', padding: 12, borderRadius: 12, marginTop: 10 },
    retryText: { color: 'white', fontWeight: '600' },

    emptyState: { alignItems: 'center', paddingVertical: 80 },
    emptyText: { marginTop: 20, fontSize: 17, color: '#888' },
    certificateOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },

    certificateBox: {
        width: "85%",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
    },

    certificateTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16,
    },

    certificateImage: {
        width: "100%",
        height: 300,
    },
    avatarImage: {
        width: 54,
        height: 54,
        borderRadius: 27
    },
    payBtn: {
        marginTop: 16,
        backgroundColor: "#FF9500",
        paddingVertical: 14,
        borderRadius: 16,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,

        shadowColor: "#FF9500",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5
    },

    payBtnText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16
    },

    paidBadge: {
        marginTop: 16,
        backgroundColor: "#34C759",
        paddingVertical: 10,
        borderRadius: 14,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6
    },

    paidText: {
        color: "white",
        fontWeight: "700",
        fontSize: 15
    },

    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16
    },

    approveBtn: {
        flex: 1,
        backgroundColor: "#34C759",
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 4
    },

    rejectBtn: {
        flex: 1,
        backgroundColor: "#FF3B30",
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 4
    },

    negotiateBtn: {
        flex: 1,
        backgroundColor: "#FF9500",
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 4
    },

    actionText: {
        color: "white",
        fontWeight: "600",
        marginLeft: 6
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        marginTop: 10,
        fontSize: 16
    }
});

export default ContractStudent;