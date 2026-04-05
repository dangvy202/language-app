import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Alert, Image } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCrmsEndpoint, getCrmsImgEndpoint } from "@/constants/configApi";
import { fetchUserProfile, negotiateContractStaff } from "@/services/api";
import { Contract } from "@/interfaces/interfaces";
import Loading from "@/component/loading";
import { Modal, TextInput } from "react-native";


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

const ContractTutor = () => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [negoVisible, setNegoVisible] = useState(false);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [newFee, setNewFee] = useState("");

    const refreshTokenApi = async (refreshToken: string) => {
        const endpoint = getCrmsEndpoint("v1/user/refresh");

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            throw new Error("Refresh token failed");
        }

        return await response.json();
    };

    useEffect(() => {
        const init = async () => {

            const token = await AsyncStorage.getItem("token");
            const expiredStr = await AsyncStorage.getItem("expired");
            const expired = expiredStr ? parseInt(expiredStr, 10) : null;

            if (!(token && expired && Date.now() < expired)) {

                const refreshToken = await AsyncStorage.getItem("refreshToken");

                if (refreshToken) {
                    try {

                        const res = await refreshTokenApi(refreshToken);

                        await AsyncStorage.setItem("token", res.data.token);
                        await AsyncStorage.setItem(
                            "expired",
                            String(res.data.expired)
                        );

                    } catch (err) {

                        await AsyncStorage.multiRemove([
                            "token",
                            "refreshToken",
                            "expired",
                        ]);

                        router.replace("/Login");
                        return;
                    }
                } else {

                    router.replace("/Login");
                    return;

                }
            }

            const profile = await fetchUserProfile();
            setUserProfile(profile);

            await fetchContracts();
        };

        init();
    }, []);

    const fetchContracts = async () => {
        setLoading(true);

        try {
            const token = await AsyncStorage.getItem("token");
            const idUser = await AsyncStorage.getItem("idUser");

            if (!token || !idUser) throw new Error("Missing authentication");

            const url = getCrmsEndpoint(
                `v1/mentor-subscription/id-staff?id=${idUser}`
            );

            const res = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error("Load contract failed");

            const result = await res.json();

            setContracts(result.data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const hideEmail = (email: string): string => {
        if (!email || !email.includes('@')) return email;

        const [localPart, domain] = email.split('@');
        if (localPart.length <= 3) return email;

        const visible = localPart.slice(0, 2);
        const hidden = '*'.repeat(Math.max(0, localPart.length - 2));

        return `${visible}${hidden}@${domain}`;
    };

    const hidePhone = (phone: string): string => {
        if (!phone || phone.length < 7) return phone;

        const visibleStart = phone.slice(0, 2);
        const visibleEnd = phone.slice(-2);
        const hidden = '*'.repeat(phone.length - 6);

        return `${visibleStart}${hidden}${visibleEnd}`;
    };

    const formatCurrencyInput = (value: string) => {
        const numeric = value.replace(/\D/g, "");

        if (!numeric) return "";

        return Number(numeric).toLocaleString("vi-VN");
    };

    const handleFeeChange = (text: string) => {
        const formatted = formatCurrencyInput(text);
        setNewFee(formatted);
    };

    const monthlyPaid = Array(12).fill(0);

    contracts.forEach((contract) => {
        if (contract.status === "PAID" && contract.userPaidAt) {
            const paidDate = new Date(contract.userPaidAt);
            const month = paidDate.getMonth();           // 0 = January, 11 = December
            monthlyPaid[month] += contract.agreeFee || 0;
        }
    });

    const maxPaidValue = Math.max(...monthlyPaid, 1);

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
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <LinearGradient
                colors={['#FFF4E6', '#FFD8A8', '#fca94b']}
                style={styles.gradientBackground}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={28} color="#1F2937" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Hợp đồng giảng viên</Text>
                    </View>

                    {/* Main Projection Card */}
                    <View style={styles.mainCard}>
                        <Text style={styles.mainTitle}>
                            Hi, <Text style={styles.highlight}>{userProfile?.username || "User"}</Text>{'\n'}
                            The LumiLingua team hopes you have a great experience working with us.
                        </Text>
                        {/* Investment & Return Pills */}
                        <View style={styles.pillsContainer}>
                            {/* Investment */}
                            <View style={styles.pill}>
                                <View style={styles.pillHeader}>
                                    <View style={[styles.dot, { backgroundColor: '#FF8A00' }]} />
                                    <Text style={styles.pillLabel}>Balance Topup</Text>
                                </View>
                                <Text style={styles.pillValue}>{formatVND(userProfile?.wallet?.amountTopUp || 0)}</Text>
                            </View>

                            {/* Withdraw */}
                            <View style={styles.pill}>
                                <View style={styles.pillHeader}>
                                    <View style={[styles.dot, { backgroundColor: '#1F2937' }]} />
                                    <Text style={styles.pillLabel}>Withdraw</Text>
                                </View>
                                <Text style={styles.pillValue}>$75,292.40</Text>
                            </View>
                        </View>
                    </View>

                    {/* Chart Section */}
                    {/* ================== CHART SECTION ================== */}
                    <View style={styles.chartSection}>
                        <View style={styles.chartHeader}>
                            <Text style={styles.chartTitle}>Thu nhập theo tháng</Text>
                            <Text style={styles.chartSubtitle}>
                                {contracts.filter(c => c.status === 'PAID').length} hợp đồng đã thanh toán
                            </Text>
                        </View>

                        <View style={styles.chartContainer}>
                            {/* Dashed Lines */}
                            <View style={styles.dashedLines}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <View key={i} style={styles.dashedLine} />
                                ))}
                            </View>

                            {/* Bars */}
                            <View style={styles.bars}>
                                {monthlyPaid.map((value, index) => {
                                    const height = Math.max((value / maxPaidValue) * 180, 8);
                                    const isCurrentMonth = index === new Date().getMonth();
                                    const isActive = activeIndex === index;

                                    return (
                                        <Pressable
                                            key={index}
                                            onPressIn={() => setActiveIndex(index)}
                                            onPressOut={() => setActiveIndex(null)}
                                            style={styles.barContainer}
                                        >
                                            {isActive && value > 0 && (
                                                <View style={styles.tooltip}>
                                                    <Text style={styles.tooltipText}>
                                                        {formatVND(value)}
                                                    </Text>
                                                </View>
                                            )}

                                            <View
                                                style={[
                                                    styles.bar,
                                                    {
                                                        height,
                                                        backgroundColor: isCurrentMonth ? "#FF8A00" : "#CBD5E1",
                                                    },
                                                ]}
                                            />
                                        </Pressable>
                                    );
                                })}
                            </View>

                            {/* Month Labels */}
                            <View style={styles.monthLabels}>
                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                                    <Text
                                        key={index}
                                        style={[
                                            styles.monthText,
                                            index === new Date().getMonth() && styles.activeMonth,
                                        ]}
                                    >
                                        {month}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    </View>

                    <ScrollView>
                        {contracts.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="document-text-outline" size={70} color="#ffffff" />
                                <Text style={styles.emptyText}>Chưa có hợp đồng nào</Text>
                            </View>
                        ) : (
                            contracts.map((contract) => {
                                const staff = contract.informationStaffResponse;
                                const canNegotiate =
                                    contract.statusUser === "HOLD" &&
                                    contract.statusStaff === "PENDING" &&
                                    contract.status !== "PAID";

                                const isApproved =
                                    contract.statusUser === "APPROVE" &&
                                    contract.statusStaff === "APPROVE";

                                const waitingPayment =
                                    isApproved && contract.status === "UNPAID";

                                const statusColor = getStatusColor(contract.status);
                                const statusUserColor = getStatusColor(contract.statusUser);
                                const statusStaffColor = getStatusColor(contract.statusStaff);

                                return (
                                    <View key={`${contract.idUser}-${staff.idInformationStaff}-${contract.createdAt}`} style={styles.contractCard}>
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
                                        {/* Email - Chỉ hiển thị một phần */}
                                        <View style={styles.infoRow}>
                                            <Ionicons name="mail-outline" size={20} color="#555" />
                                            <Text style={styles.infoText}>
                                                {contract.emailTrainees
                                                    ? hideEmail(contract.emailTrainees)
                                                    : 'Chưa có'}
                                            </Text>
                                        </View>

                                        {/* Số điện thoại - Chỉ hiển thị một phần */}
                                        <View style={styles.infoRow}>
                                            <Ionicons name="call-outline" size={20} color="#555" />
                                            <Text style={styles.infoText}>
                                                {contract.phoneTrainees
                                                    ? hidePhone(contract.phoneTrainees)
                                                    : 'Chưa có'}
                                            </Text>
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


                                        {isApproved && (
                                            <View style={styles.platformFeeBox}>
                                                <Text style={styles.platformTitle}>Phân chia thanh toán</Text>

                                                <View style={styles.platformRow}>
                                                    <Text style={styles.platformLabel}>Platform Fee ({contract.percentFeePlatform}%)</Text>
                                                    <Text style={styles.platformValue}>
                                                        {formatVND(contract.summaryFeePlatform)}
                                                    </Text>
                                                </View>

                                                <View style={styles.platformRow}>
                                                    <Text style={styles.platformLabel}>Salary Staff</Text>
                                                    <Text style={styles.platformValue}>
                                                        {formatVND(contract.salaryStaff)}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}

                                        {waitingPayment && (
                                            <View style={styles.waitPaymentBox}>
                                                <Ionicons name="time-outline" size={18} color="#FF8A00" />
                                                <Text style={styles.waitPaymentText}>
                                                    Đợi học viên thanh toán
                                                </Text>
                                            </View>
                                        )}

                                        {contract.status === "PAID" ? (
                                            <View style={styles.paidBadge}>
                                                <Ionicons name="checkmark-circle" size={20} color="white" />
                                                <Text style={styles.paidText}>Đã thanh toán</Text>
                                            </View>
                                        ) : canNegotiate ? (
                                            <View style={styles.actionRow}>

                                                <TouchableOpacity style={styles.acceptBtn} onPress={() =>
                                                    Alert.alert(
                                                        "Confirm",
                                                        "Bạn có chắc muốn ĐỒNG Ý hợp đồng này?",
                                                        [
                                                            {
                                                                text: "Yes",
                                                                onPress: async () => {
                                                                    await negotiateContractStaff(
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
                                                    <Text style={styles.btnText}>Approve</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={styles.rejectBtn} onPress={() =>
                                                    Alert.alert(
                                                        "Confirm",
                                                        "Bạn có chắc muốn HỦY BỎ hợp đồng này?",
                                                        [
                                                            {
                                                                text: "Yes",
                                                                onPress: async () => {
                                                                    await negotiateContractStaff(
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
                                                    <Text style={styles.btnText}>Reject</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.negoBtn}
                                                    onPress={() => {
                                                        setSelectedContract(contract);
                                                        setNewFee(String(contract.expectedFeeMentor || ""));
                                                        setNegoVisible(true);
                                                    }}
                                                >
                                                    <Ionicons name="cash-outline" size={18} color="white" />
                                                    <Text style={styles.btnText}>Negotiate</Text>
                                                </TouchableOpacity>

                                            </View>


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



                                        <Text style={styles.dateText}>
                                            Tạo ngày: {formatDate(contract.createdAt)}
                                        </Text>
                                    </View>
                                );
                            })
                        )}
                    </ScrollView>
                </ScrollView>
                <Modal
                    visible={negoVisible}
                    transparent
                    animationType="fade"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalBox}>
                            <Text style={styles.modalTitle}>Negotiate Fee</Text>

                            <TextInput
                                value={newFee}
                                onChangeText={handleFeeChange}
                                keyboardType="numeric"
                                placeholder="Nhập số tiền"
                                style={styles.input}
                            />

                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <TouchableOpacity
                                    style={styles.cancelBtn}
                                    onPress={() => setNegoVisible(false)}
                                >
                                    <Text style={{ color: "white" }}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.confirmBtn}
                                    onPress={async () => {
                                        if (!selectedContract) return;
                                        const fee = Number(newFee.replace(/\./g, ""))

                                        if (fee <= 0) {
                                            Alert.alert("Invalid fee", "Fee must be greater than 0")
                                            return
                                        }

                                        await negotiateContractStaff(
                                            selectedContract.idUser,
                                            selectedContract.informationStaffResponse.idInformationStaff,
                                            "UNAPPROVE",
                                            fee
                                        )

                                        setNegoVisible(false)
                                        fetchContracts()
                                    }}
                                >
                                    <Text style={{ color: "white" }}>Send</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: 'red', fontSize: 16 },
    retryBtn: { backgroundColor: '#FF9500', padding: 12, borderRadius: 12, marginTop: 10 },
    retryText: { color: 'white', fontWeight: '600' },
    container: { flex: 1 },

    gradientBackground: {
        flex: 1,
    },

    dateText: { fontSize: 13, color: '#888', textAlign: 'right', marginTop: 16 },

    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 70,
        marginBottom: 25,
    },
    backButton: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 30
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginLeft: 20,
    },

    // Main Card
    mainCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 28,
        paddingVertical: 32,
        paddingHorizontal: 24,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 10,
    },


    // Pills
    pillsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 14,
    },
    pill: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 5,
    },
    pillHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    pillLabel: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    pillValue: {
        fontSize: 19,
        fontWeight: '700',
        color: '#1F2937',
    },

    // Chart
    chartSection: {
        marginBottom: 30,
        paddingHorizontal: 4,
    },

    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    chartTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937'
    },
    chartMonth: { fontSize: 15, color: '#64748B', marginLeft: 8 },
    chartSubtitle: {
        fontSize: 12,
        color: '#64748B'
    },

    chartContainer: {
        height: 280,
        backgroundColor: '#F8FAFC',
        borderRadius: 24,
        padding: 20,
        position: 'relative',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    dashedLines: {
        position: 'absolute',
        left: 30,
        right: 30,
        top: 30,
        bottom: 70,
        justifyContent: 'space-between',
    },

    dashedLine: {
        height: 1,
        backgroundColor: '#E2E8F0',
        width: '100%',
    },

    bars: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: '100%',
        paddingBottom: 50,
        paddingHorizontal: 10,
    },
    bar: {
        width: 14,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },

    barContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: 22,
    },

    highlightBubble: {
        position: 'absolute',
        top: 55,
        right: 45,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    highlightValue: { fontWeight: '700', color: '#1F2937', fontSize: 16 },
    highlightDot: {
        width: 9,
        height: 9,
        backgroundColor: '#f89335',
        borderRadius: 5,
        marginLeft: 8
    },

    monthText: {
        fontSize: 10,
        color: '#64748B',
        fontWeight: '500',
        width: 22,
        textAlign: 'center',
    },

    activeMonth: {
        color: '#FF8A00',
        fontWeight: '700',
    },

    mainTitle: {
        fontSize: 23,
        lineHeight: 34,
        fontWeight: '600',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 40,
    },
    highlight: {
        color: '#fd7a00',
        fontWeight: '700',
    },
    emptyState: { alignItems: 'center', paddingVertical: 80 },
    emptyText: { marginTop: 20, fontSize: 17, color: '#ffffff' },
    contractCard: {
        backgroundColor: '#fff',
        borderRadius: 28,
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
    statusContainer: { marginVertical: 16 },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 6,
    },
    statusLabel: { fontSize: 15, color: '#666', flex: 1 },
    statusValue: { fontSize: 16, fontWeight: '700' },

    actionRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 10
    },

    acceptBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#22C55E",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        gap: 5
    },
    rejectBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EF4444",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 4
    },
    negoBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FF8A00",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        gap: 5
    },

    btnText: {
        color: "white",
        fontWeight: "600"
    },

    platformFeeBox: {
        marginTop: 12,
        backgroundColor: "#f8fafc",
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: "#eee"
    },

    platformTitle: {
        fontSize: 15,
        fontWeight: "700",
        marginBottom: 8,
        color: "#1F2937"
    },

    platformRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 4
    },

    platformLabel: {
        fontSize: 14,
        color: "#555"
    },

    platformValue: {
        fontSize: 14,
        fontWeight: "700",
        color: "#FF8A00"
    },
    waitPaymentBox: {
        marginTop: 10,
        backgroundColor: "#FFF7ED",
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        borderWidth: 1,
        borderColor: "#FDBA74"
    },

    waitPaymentText: {
        color: "#FF8A00",
        fontWeight: "600",
        fontSize: 14
    },
    tooltip: {
        position: 'absolute',
        top: -48,
        backgroundColor: '#1F2937',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        zIndex: 10,
        width: 90
    },

    tooltipText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
    },

    monthLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 3,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center"
    },

    modalBox: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 10,
        marginBottom: 14
    },

    cancelBtn: {
        flex: 1,
        backgroundColor: "#6B7280",
        padding: 10,
        borderRadius: 10,
        alignItems: "center"
    },

    confirmBtn: {
        flex: 1,
        backgroundColor: "#FF8A00",
        padding: 10,
        borderRadius: 10,
        alignItems: "center"
    },
});

export default ContractTutor;