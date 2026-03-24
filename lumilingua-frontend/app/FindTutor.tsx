import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

interface Tutor {
  id: number;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  reviews: number;
  students: number;
  pricePerHour: number;
  bio: string;
  isOnline: boolean;
}

const tutors: Tutor[] = [
  {
    id: 1,
    name: "Cô Lan Hương",
    avatar: "https://i.pravatar.cc/150?img=32",
    specialty: "IELTS & Speaking",
    rating: 4.9,
    reviews: 124,
    students: 342,
    pricePerHour: 250000,
    bio: "IELTS 8.5 • 8 năm kinh nghiệm • Giúp bạn tự tin nói tiếng Anh",
    isOnline: true,
  },
  {
    id: 2,
    name: "Thầy Minh Quân",
    avatar: "https://i.pravatar.cc/150?img=45",
    specialty: "TOEIC & Grammar",
    rating: 5.0,
    reviews: 98,
    students: 215,
    pricePerHour: 220000,
    bio: "TOEIC 950+ • Dạy dễ hiểu • Phương pháp logic",
    isOnline: false,
  },
  {
    id: 3,
    name: "Cô Ngọc Anh",
    avatar: "https://i.pravatar.cc/150?img=28",
    specialty: "Business English",
    rating: 4.8,
    reviews: 67,
    students: 189,
    pricePerHour: 280000,
    bio: "Chuyên tiếng Anh văn phòng • 7 năm làm việc tại công ty nước ngoài",
    isOnline: true,
  },
];

const FindTutor = () => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "price">("rating");

  const [filters, setFilters] = useState({
    onlineOnly: false,
    ieltsOnly: false,
    priceLow: false,
  });

  // ==================== FILTER + SORT ====================
  const filteredTutors = useMemo(() => {
    let result = tutors.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.specialty.toLowerCase().includes(searchQuery.toLowerCase());

      if (filters.onlineOnly && !t.isOnline) return false;
      if (filters.ieltsOnly && !t.specialty.toLowerCase().includes("ielts")) return false;

      return matchSearch;
    });

    // Sort
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort((a, b) => a.pricePerHour - b.pricePerHour);
    }

    return result;
  }, [searchQuery, filters, sortBy]);

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetFilters = () => {
    setFilters({ onlineOnly: false, ieltsOnly: false, priceLow: false });
    setSortBy("rating");
  };

  const renderTutor = ({ item }: { item: Tutor }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.92}
      onPress={() => router.push(`/tutor-detail/${item.id}`)}
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
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.review}>({item.reviews})</Text>
          </View>

          <Text style={styles.specialty}>{item.specialty}</Text>
        </View>

        <View style={styles.priceWrap}>
          <Text style={styles.price}>{Math.floor(item.pricePerHour / 1000)}k</Text>
          <Text style={styles.hour}>/giờ</Text>
        </View>
      </View>

      <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>

      <View style={styles.bottomRow}>
        <View style={styles.studentBox}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.students}>{item.students}+ học viên</Text>
        </View>

        <LinearGradient
          colors={["#FF8C00", "#FF6B00"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.btn}
        >
          <TouchableOpacity onPress={() => router.push(`/tutor-detail/${item.id}`)}>
            <Text style={styles.btnText}>Chọn học</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#FF8C00", "#FF6B00"]} style={styles.header}>
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
            placeholder="Tìm theo tên hoặc chuyên môn..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(true)}>
          <Ionicons name="options-outline" size={24} color="#FF8C00" />
        </TouchableOpacity>
      </View>

      {/* Active Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activeFilters}>
        {filters.onlineOnly && (
          <View style={styles.chip}>
            <Text style={styles.chipText}>Online</Text>
            <TouchableOpacity onPress={() => toggleFilter("onlineOnly")}>
              <Ionicons name="close" size={16} color="#FF8C00" />
            </TouchableOpacity>
          </View>
        )}
        {filters.ieltsOnly && (
          <View style={styles.chip}>
            <Text style={styles.chipText}>IELTS</Text>
            <TouchableOpacity onPress={() => toggleFilter("ieltsOnly")}>
              <Ionicons name="close" size={16} color="#FF8C00" />
            </TouchableOpacity>
          </View>
        )}
        {filters.priceLow && (
          <View style={styles.chip}>
            <Text style={styles.chipText}>Giá thấp</Text>
            <TouchableOpacity onPress={() => toggleFilter("priceLow")}>
              <Ionicons name="close" size={16} color="#FF8C00" />
            </TouchableOpacity>
          </View>
        )}
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

      {/* List */}
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

      {/* Filter Modal */}
      <Modal visible={showFilter} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bộ lọc</Text>

            <TouchableOpacity style={styles.filterRow} onPress={() => toggleFilter("onlineOnly")}>
              <Text style={styles.filterLabel}>Chỉ hiển thị gia sư Online</Text>
              <Ionicons name={filters.onlineOnly ? "checkbox" : "square-outline"} size={24} color="#FF8C00" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterRow} onPress={() => toggleFilter("ieltsOnly")}>
              <Text style={styles.filterLabel}>Chuyên IELTS</Text>
              <Ionicons name={filters.ieltsOnly ? "checkbox" : "square-outline"} size={24} color="#FF8C00" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterRow} onPress={() => toggleFilter("priceLow")}>
              <Text style={styles.filterLabel}>Giá thấp nhất trước</Text>
              <Ionicons name={filters.priceLow ? "checkbox" : "square-outline"} size={24} color="#FF8C00" />
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
                <Text style={styles.resetText}>Đặt lại</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={() => setShowFilter(false)}>
                <Text style={styles.applyText}>Áp dụng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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

  activeFilters: { paddingHorizontal: 16, marginBottom: 8 },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEED9",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
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

  // Modal
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
});