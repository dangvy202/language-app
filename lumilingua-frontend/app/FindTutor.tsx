import Loading from "@/component/loading";
import { getCrmsEndpoint, getCrmsImgEndpoint } from "@/constants/configApi";
import { Tutor } from "@/interfaces/interfaces";
import { bookTutorApi, fetchTutor } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { GestureHandlerRootView, PinchGestureHandler, State } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const FindTutor = () => {
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [sortBy, setSortBy] = useState<"rating" | "price">("rating");
    const scale = useSharedValue(1);

    const [skills, setSkills] = useState<any[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
    const [bookingType, setBookingType] = useState<"accept" | "nego" | null>(null);

    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
    const [showCertificate, setShowCertificate] = useState(false);
    const [showBookingForm, setShowBookingForm] = useState(false);

    const [bookingForm, setBookingForm] = useState({
        email: "",
        phone: "",
        offerPrice: ""
    });

    const [filters, setFilters] = useState({
        onlineOnly: false,
        ieltsOnly: false,
        priceLow: false,
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

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

    // ==================== REFRESH TOKEN ====================
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
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.notification || "Refresh token thất bại");
        }
        return await response.json();
    };

    // ==================== FETCH TUTORS FROM CLOUDFLARE ====================
    const fetchTutors = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await fetchTutor();

            if (result.code === 200 && Array.isArray(result.data)) {
                const mappedTutors: Tutor[] = result.data.map((staff: any, index: number) => {
                    const skillIds = staff.skills
                        ? staff.skills.map((s: any) => s.idSkill).filter((id: number) => id !== 0)
                        : [];

                    return {
                        id: staff.idInformationStaff || index + 1,
                        name: staff.user.username,
                        avatar: getCrmsImgEndpoint("avatars/") + staff.user.avatar,
                        certificate: getCrmsImgEndpoint("uploads/") + staff.certificatePath,
                        specialty: staff.skills && staff.skills.length > 0
                            ? staff.skills.map((s: any) => s.name).join(" & ")
                            : "Chưa cập nhật chuyên môn",
                        rating: 4.7 + Math.random() * 0.3,        // tạm thời
                        reviews: 60 + Math.floor(Math.random() * 120),
                        students: 150 + Math.floor(Math.random() * 250),
                        pricePerHour: Math.floor(staff.expectedSalary || 200000),
                        bio: `Lương mong đợi: ${staff.expectedSalary?.toLocaleString() || 0}đ`,
                        isOnline: staff.status !== "INACTIVE",
                        skills: skillIds,
                    };
                });

                setTutors(mappedTutors);
            } else {
                throw new Error(result.notification || "Dữ liệu không hợp lệ");
            }
        } catch (err: any) {
            console.error("Fetch tutors error:", err);
            setError(err.message);
            Alert.alert("Lỗi", "Không thể tải danh sách gia sư.\n\n" + err.message);
            setTutors([]);
        } finally {
            setLoading(false);
        }
    };

    // ==================== FETCH SKILLS ====================
    const fetchSkills = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) return;

            const response = await fetch(getCrmsEndpoint("v1/skill"), {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error(`Lỗi server: ${response.status}`);

            const result = await response.json();

            if (result.code === 200 && Array.isArray(result.data)) {
                setSkills(result.data);
            }
        } catch (error) {
            console.error("Fetch skills error:", error);
            setSkills([]);
        }
    };

    // ==================== USE EFFECT ====================
    useEffect(() => {
        let isMounted = true;

        const initApp = async () => {
            if (!isMounted) return;

            const token = await AsyncStorage.getItem("token");
            const expiredStr = await AsyncStorage.getItem("expired");
            const expired = expiredStr ? parseInt(expiredStr, 10) : null;

            if (!(token && expired && Date.now() < expired)) {
                const refreshToken = await AsyncStorage.getItem("refreshToken");
                if (refreshToken) {
                    try {
                        const response = await refreshTokenApi(refreshToken);
                        await AsyncStorage.setItem("token", response.data.token || "");
                        await AsyncStorage.setItem(
                            "expired",
                            String(response.data.expired || Date.now() + 900000)
                        );
                    } catch (err) {
                        console.log("Refresh error:", err);
                        await AsyncStorage.multiRemove(["token", "refreshToken", "expired", "username", "email"]);
                        router.replace("/Login");
                        return;
                    }
                } else {
                    router.replace("/Login");
                    return;
                }
            }
            await Promise.all([fetchSkills(), fetchTutors()]);
        };

        initApp();

        return () => {
            isMounted = false;
        };
    }, [router]);

    // ==================== FILTER + SORT ====================
    const filteredTutors = useMemo(() => {
        let result = tutors.filter((t) => {
            const matchSearch =
                t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.specialty.toLowerCase().includes(searchQuery.toLowerCase());

            if (filters.onlineOnly && !t.isOnline) return false;
            if (filters.ieltsOnly && !t.specialty.toLowerCase().includes("ielts")) return false;

            if (selectedSkills.length > 0) {
                const hasMatchingSkill = t.skills.some((skillId) => selectedSkills.includes(skillId));
                if (!hasMatchingSkill) return false;
            }

            return matchSearch;
        });

        if (sortBy === "rating") {
            result.sort((a, b) => b.rating - a.rating);
        } else {
            result.sort((a, b) => a.pricePerHour - b.pricePerHour);
        }

        return result;
    }, [tutors, searchQuery, filters, sortBy, selectedSkills]);

    // ==================== HANDLERS ====================
    const toggleFilter = (key: keyof typeof filters) => {
        setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleSkill = (skillId: number) => {
        setSelectedSkills((prev) =>
            prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
        );
    };

    const resetFilters = () => {
        setFilters({ onlineOnly: false, ieltsOnly: false, priceLow: false });
        setSelectedSkills([]);
        setSortBy("rating");
        setShowFilter(false);
    };

    const applyFilters = () => {
        if (filters.priceLow) setSortBy("price");
        setShowFilter(false);
    };

    const bookTutor = async () => {
        try {

            if (!selectedTutor) return;

            let expectedFeeUser: number | null = null;

            if (bookingType === "nego") {
                if (!bookingForm.offerPrice) {
                    Alert.alert("Lỗi", "Bạn chưa nhập giá đề xuất");
                    return;
                }

                expectedFeeUser = Number(bookingForm.offerPrice);
            }

            const result = await bookTutorApi(
                selectedTutor.id,
                selectedTutor.pricePerHour,
                expectedFeeUser,
                bookingForm.email,
                bookingForm.phone
            );

            if (result.code === 201) {

                Alert.alert("Thành công", "Gửi yêu cầu thành công!");

                setShowBookingForm(false);
                setBookingType(null);

                setBookingForm({
                    email: "",
                    phone: "",
                    offerPrice: ""
                });

            } else {
                throw new Error(result.notification);
            }

        } catch (err: any) {
            Alert.alert("Lỗi", err.message);
        }
    };

    // ==================== RENDER TUTOR ====================
    const renderTutor = ({ item }: { item: Tutor }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.92}
            onPress={() => {
                setSelectedTutor(item);
                setShowCertificate(true);
            }}
        >
            <View style={styles.cardTop}>
                <View style={styles.avatarWrap}>
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    {item.isOnline && <View style={styles.onlineDot} />}
                </View>

                <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={17} color="#FFC107" />
                        <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
                        <Text style={styles.review}>({item.reviews})</Text>
                    </View>
                    <Text style={styles.specialty}>{item.specialty}</Text>
                </View>

                <View style={styles.priceWrap}>
                    <Text style={styles.price}>
                        {formatPrice(item.pricePerHour)}
                    </Text>
                </View>
            </View>

            <Text style={styles.bio} numberOfLines={2}>
                {item.bio}
            </Text>

            <View style={styles.bottomRow}>
                <View style={styles.studentBox}>
                    <Ionicons name="people-outline" size={16} color="#666" />
                    <Text style={styles.students}>{item.students}+ học viên</Text>
                </View>

                <LinearGradient
                    colors={["#FFB703", "#FB8500"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.btn}
                >
                    <TouchableOpacity
                        onPress={() => {
                            setBookingType(null);
                            setSelectedTutor(item);
                            setShowBookingForm(true);
                        }}
                    >
                        <Text style={styles.btnText}>Chọn học</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </TouchableOpacity>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* Header */}
                <LinearGradient colors={['#FFB703', '#FB8500']} style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Tìm Gia Sư Tiếng Anh</Text>
                </LinearGradient>

                {/* Search + Filter Button */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBox}>
                        <Ionicons name="search" size={20} color="#777" />
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#999"
                            placeholder="Tìm theo tên..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(true)}>
                        <Ionicons name="funnel" size={24} color="#FB8500" />
                    </TouchableOpacity>
                </View>

                {/* Active Filters */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.activeFilters}
                    contentContainerStyle={styles.activeFiltersContent}
                >
                    {filters.ieltsOnly && (
                        <View key="filter-ielts" style={styles.chip}>
                            <Text style={styles.chipText}>IELTS</Text>
                            <TouchableOpacity onPress={() => toggleFilter("ieltsOnly")}>
                                <Ionicons name="close" size={16} color="#FF8C00" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {selectedSkills
                        .map((skillId, index) => {
                            const skill = skills.find(
                                (s) => s.idSkill === skillId
                            );

                            if (!skill) return null;

                            return (
                                <View key={`skill-chip-${skillId}-${index}`} style={styles.chip}>
                                    <Text style={styles.chipText}>
                                        {skill.name || skill.skill_name}
                                    </Text>

                                    <TouchableOpacity onPress={() => toggleSkill(skillId)}>
                                        <Ionicons name="close" size={16} color="#FF8C00" />
                                    </TouchableOpacity>
                                </View>
                            );
                        })
                        .filter(Boolean)}
                </ScrollView>

                {/* Sort */}
                <View style={styles.sortRow}>
                    <Text style={styles.sortLabel}>Sắp xếp:</Text>
                    <TouchableOpacity
                        style={[styles.sortOption, sortBy === "rating" && styles.sortActive]}
                        onPress={() => setSortBy("rating")}
                    >
                        <Text style={[styles.sortText, sortBy === "rating" && styles.sortTextActive]}>Đánh giá cao</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sortOption, sortBy === "price" && styles.sortActive]}
                        onPress={() => setSortBy("price")}
                    >
                        <Text style={[styles.sortText, sortBy === "price" && styles.sortTextActive]}>Giá thấp nhất</Text>
                    </TouchableOpacity>
                </View>

                {/* Tutor List */}
                {loading ? (
                    <Loading />
                ) : error ? (
                    <View style={styles.loadingContainer}>
                        <Ionicons name="cloud-offline" size={60} color="#FF6B00" />
                        <Text style={{ marginTop: 12, color: "red", textAlign: "center" }}>{error}</Text>
                        <TouchableOpacity
                            style={styles.retryBtn}
                            onPress={fetchTutors}
                        >
                            <Text style={{ color: "white", fontWeight: "600" }}>Thử lại</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={filteredTutors}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderTutor}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.empty}>
                                <Ionicons name="search-outline" size={70} color="#ccc" />
                                <Text style={styles.emptyText}>Không tìm thấy gia sư phù hợp</Text>
                            </View>
                        }
                    />
                )}

                {/* Filter Modal */}
                <Modal visible={showFilter} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Bộ lọc</Text>

                            <ScrollView style={{ maxHeight: 300 }}>
                                {skills.length > 0 ? (
                                    skills.map((skill: any, index: number) => {
                                        const skillId = skill.idSkill;
                                        return (
                                            <TouchableOpacity
                                                key={`skill-${skillId}-${index}`}
                                                style={styles.filterRow}
                                                onPress={() => toggleSkill(skillId)}
                                            >
                                                <Text style={styles.filterLabel}>
                                                    {skill.name || skill.skill_name}
                                                </Text>
                                                <Ionicons
                                                    name={selectedSkills.includes(skillId) ? "checkbox" : "square-outline"}
                                                    size={24}
                                                    color="#FF8C00"
                                                />
                                            </TouchableOpacity>
                                        );
                                    })
                                ) : (
                                    <Text style={{ color: "#888", paddingVertical: 20, textAlign: "center" }}>
                                        Đang tải danh sách kỹ năng...
                                    </Text>
                                )}
                            </ScrollView>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
                                    <Text style={styles.resetText}>Đặt lại</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
                                    <Text style={styles.applyText}>Áp dụng</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal visible={showCertificate} transparent animationType="fade">
                    <View style={styles.certificateOverlay}>
                        <View style={styles.certificateBox}>
                            <TouchableOpacity
                                style={styles.closeBtn}
                                onPress={() => {
                                    setShowCertificate(false);
                                    scale.value = 1; // reset scale khi đóng
                                }}
                            >
                                <Ionicons name="close" size={28} color="#333" />
                            </TouchableOpacity>

                            <Text style={styles.certificateTitle}>
                                Chứng chỉ của {selectedTutor?.name}
                            </Text>

                            {selectedTutor?.certificate ? (
                                <PinchGestureHandler
                                    onGestureEvent={onPinchEvent}
                                    onHandlerStateChange={onPinchEnd}
                                >
                                    <Animated.Image
                                        source={{ uri: selectedTutor.certificate }}
                                        style={[styles.certificateImage, animatedStyle]}
                                        resizeMode="contain"
                                    />
                                </PinchGestureHandler>
                            ) : (
                                <Text style={{ color: "#777", marginTop: 20, textAlign: "center" }}>
                                    Gia sư chưa cập nhật chứng chỉ
                                </Text>
                            )}
                        </View>
                    </View>
                </Modal>
                <Modal visible={showBookingForm} transparent animationType="slide">
                    <View style={styles.modalOverlay}>

                        <View style={styles.bookingBox}>

                            <Text style={styles.bookingTitle}>
                                Đăng ký học với {selectedTutor?.name}
                            </Text>

                            <Text style={styles.bookingPrice}>
                                Giá gia sư: {formatPrice(selectedTutor?.pricePerHour || 0)}
                            </Text>

                            {/* STEP 1: CHỌN LOẠI BOOKING */}

                            {bookingType === null && (

                                <View style={{ marginBottom: 20 }}>

                                    <TouchableOpacity
                                        style={styles.acceptBtn}
                                        onPress={() => setBookingType("accept")}
                                    >
                                        <Text style={styles.acceptText}>
                                            Đồng ý giá gia sư
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.negoBtn}
                                        onPress={() => setBookingType("nego")}
                                    >
                                        <Text style={styles.negoText}>
                                            Thương lượng giá
                                        </Text>
                                    </TouchableOpacity>

                                </View>

                            )}

                            {/* STEP 2: ĐỒNG Ý GIÁ */}

                            {bookingType === "accept" && (

                                <>

                                    <TextInput
                                        style={styles.bookingInput}
                                        placeholder="Email của bạn"
                                        placeholderTextColor="#999"
                                        keyboardType="email-address"
                                        value={bookingForm.email}
                                        onChangeText={(text) =>
                                            setBookingForm({ ...bookingForm, email: text })
                                        }
                                    />

                                    <TextInput
                                        style={styles.bookingInput}
                                        placeholder="Số điện thoại"
                                        placeholderTextColor="#999"
                                        keyboardType="phone-pad"
                                        value={bookingForm.phone}
                                        onChangeText={(text) =>
                                            setBookingForm({ ...bookingForm, phone: text })
                                        }
                                    />

                                </>

                            )}

                            {/* STEP 3: THƯƠNG LƯỢNG */}

                            {bookingType === "nego" && (

                                <>

                                    <TextInput
                                        style={styles.bookingInput}
                                        placeholder="Giá bạn muốn đề xuất"
                                        placeholderTextColor="#999"
                                        keyboardType="numeric"
                                        value={bookingForm.offerPrice}
                                        onChangeText={(text) =>
                                            setBookingForm({ ...bookingForm, offerPrice: text })
                                        }
                                    />

                                    <TextInput
                                        style={styles.bookingInput}
                                        placeholder="Email của bạn"
                                        placeholderTextColor="#999"
                                        keyboardType="email-address"
                                        value={bookingForm.email}
                                        onChangeText={(text) =>
                                            setBookingForm({ ...bookingForm, email: text })
                                        }
                                    />

                                    <TextInput
                                        style={styles.bookingInput}
                                        placeholderTextColor="#999"
                                        placeholder="Số điện thoại"
                                        keyboardType="phone-pad"
                                        value={bookingForm.phone}
                                        onChangeText={(text) =>
                                            setBookingForm({ ...bookingForm, phone: text })
                                        }
                                    />

                                </>

                            )}

                            {/* BUTTON CONFIRM */}

                            {bookingType && (

                                <View style={styles.bookingButtons}>

                                    <TouchableOpacity
                                        style={styles.cancelBtn}
                                        onPress={() => {
                                            setShowBookingForm(false)
                                            setBookingType(null)
                                        }}
                                    >
                                        <Text style={{ color: "#666" }}>Huỷ</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.confirmBtn}
                                        onPress={bookTutor}
                                    >
                                        <Text style={{ color: "white", fontWeight: "700" }}>
                                            Gửi yêu cầu
                                        </Text>
                                    </TouchableOpacity>

                                </View>

                            )}

                        </View>

                    </View>
                </Modal>
            </View>
        </GestureHandlerRootView>
    );
};

export default FindTutor;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f9fa" },

    header: {
        paddingTop: 55,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    headerTitle: { fontSize: 24, fontWeight: "700", color: "white", marginLeft: 15 },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchBox: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 30,
        paddingHorizontal: 16,
        height: 50,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    input: { flex: 1, marginLeft: 10, fontSize: 16 },

    filterBtn: { marginLeft: 12, padding: 8 },

    activeFilters: {
        paddingHorizontal: 16,
        marginBottom: 8,
        maxHeight: 40
    },

    activeFiltersContent: {
        alignItems: "center"
    },

    chip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFEED9",
        paddingHorizontal: 14,
        height: 30,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 20,
        marginTop: 20,
    },
    chipText: { color: "#FF8C00", fontWeight: "600", marginRight: 6 },

    sortRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "#fff",
    },
    sortLabel: { fontSize: 14, color: "#666", marginRight: 12 },
    sortOption: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginRight: 8 },
    sortActive: { backgroundColor: "#FFF0E0" },
    sortText: { color: "#666" },
    sortTextActive: { color: "#FF8C00", fontWeight: "700" },

    listContent: { padding: 16 },

    card: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 18,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    cardTop: { flexDirection: "row", alignItems: "center" },
    avatarWrap: { position: "relative", marginRight: 14 },
    avatar: { width: 70, height: 70, borderRadius: 35 },
    onlineDot: {
        position: "absolute",
        bottom: 4,
        right: 4,
        width: 16,
        height: 16,
        backgroundColor: "#4CAF50",
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#fff",
    },
    info: { flex: 1 },
    name: { fontSize: 18, fontWeight: "700", color: "#222" },
    ratingRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
    rating: { marginLeft: 4, fontWeight: "700", fontSize: 16 },
    review: { marginLeft: 4, color: "#888", fontSize: 13 },
    specialty: { color: "#FF8C00", fontWeight: "600", marginTop: 2 },

    priceWrap: { alignItems: "flex-end" },
    price: { fontSize: 22, fontWeight: "bold", color: "#FF6B00" },
    hour: { fontSize: 13, color: "#999" },

    bio: { marginTop: 12, color: "#555", lineHeight: 20, fontSize: 14 },

    bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14 },
    studentBox: { flexDirection: "row", alignItems: "center" },
    students: { marginLeft: 6, color: "#666" },

    btn: { paddingHorizontal: 24, paddingVertical: 11, borderRadius: 30 },
    btnText: { color: "white", fontWeight: "700", fontSize: 15 },

    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
    modalContent: {
        backgroundColor: "white",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 20 },

    filterRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    filterLabel: { fontSize: 16, color: "#333" },

    modalButtons: { flexDirection: "row", marginTop: 30, gap: 12 },
    resetBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: "#f0f0f0",
        alignItems: "center",
    },
    resetText: { color: "#666", fontWeight: "600" },
    applyBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: "#FF8C00",
        alignItems: "center",
    },
    applyText: { color: "white", fontWeight: "700" },

    empty: { alignItems: "center", marginTop: 120 },
    emptyText: { marginTop: 16, fontSize: 16, color: "#888" },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#666",
    },
    retryBtn: {
        marginTop: 20,
        paddingHorizontal: 30,
        paddingVertical: 12,
        backgroundColor: "#FF8C00",
        borderRadius: 12,
    },
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

    closeBtn: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    bookingBox: {
        width: "90%",
        height:700,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 24,
        alignSelf: "center"
    },

    bookingTitle: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 10
    },

    bookingPrice: {
        textAlign: "center",
        color: "#FF6B00",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 20
    },

    bookingInput: {
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
        fontSize: 16
    },

    bookingButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    },

    cancelBtn: {
        flex: 1,
        backgroundColor: "#eee",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        marginRight: 8
    },

    confirmBtn: {
        flex: 1,
        backgroundColor: "#FF8C00",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        marginLeft: 8
    },
    acceptBtn: {
        backgroundColor: "#FF8C00",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 12
    },

    acceptText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16
    },

    negoBtn: {
        borderWidth: 2,
        borderColor: "#FF8C00",
        padding: 14,
        borderRadius: 12,
        alignItems: "center"
    },

    negoText: {
        color: "#FF8C00",
        fontWeight: "700",
        fontSize: 16
    },
});