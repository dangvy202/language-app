import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Giả lập data từ BE (sau này thay bằng state từ API hoặc context)
const mockUser = {
  username: 'dangvy202',
  email: 'dangvy@example.com',
  phone: '0909123456',
  gender: 'MALE',         // GenderEnum.MALE
  role: 'STUDENT',        // RoleEnum.STUDENT
  status: 'ACTIVE',       // StatusEnum.ACTIVE
  avatar: 'https://example.com/avatar.jpg', // hoặc để null
  lastLogin: new Date('2026-03-14T19:30:00'),
  walletId: 'WAL123456',
  idCategoryLevel: 3,     // ví dụ level 3 = B1
  // các field khác không dùng
};

const getGenderLabel = (gender?: string) => {
  if (!gender) return 'Chưa cập nhật';
  switch (gender.toUpperCase()) {
    case 'MALE': return 'Nam';
    case 'FEMALE': return 'Nữ';
    case 'OTHER': return 'Khác';
    default: return 'Chưa cập nhật';
  }
};

const getRoleLabel = (role?: string) => {
  if (!role) return '—';
  switch (role.toUpperCase()) {
    case 'STUDENT': return 'Học viên';
    case 'TEACHER': return 'Giáo viên';
    case 'ADMIN': return 'Quản trị viên';
    default: return role;
  }
};

const formatDate = (date?: Date) => {
  if (!date) return 'Chưa đăng nhập';
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const InformationScreen = () => {
  const user = mockUser; // sau này thay bằng useSelector hoặc props

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar + Username */}
        <View style={styles.header}>
          <Image
            source={
              user.avatar
                ? { uri: user.avatar }
                : require('@/assets/images/accounts/logo.jpg') // ảnh mặc định
            }
            style={styles.avatar}
          />
          <Text style={styles.username}>{user.username || 'Người dùng'}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* Info Cards */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Họ tên / Nickname</Text>
            <Text style={styles.value}>{user.username}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Số điện thoại</Text>
            <Text style={styles.value}>
              {user.phone || 'Chưa cập nhật'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Giới tính</Text>
            <Text style={styles.value}>{getGenderLabel(user.gender)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Vai trò</Text>
            <Text style={styles.value}>{getRoleLabel(user.role)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Trình độ hiện tại</Text>
            <Text style={styles.value}>
              {user.idCategoryLevel ? `Cấp ${user.idCategoryLevel}` : 'Chưa xác định'}
            </Text>
          </View>

          {user.walletId && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Ví Lumilingua</Text>
              <Text style={styles.value}>{user.walletId}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Trạng thái</Text>
            <View style={[
              styles.statusBadge,
              user.status === 'ACTIVE' ? styles.active : styles.inactive
            ]}>
              <Text style={styles.statusText}>
                {user.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Đăng nhập gần nhất</Text>
            <Text style={styles.value}>{formatDate(user.lastLogin)}</Text>
          </View>
        </View>

        {/* Nút chỉnh sửa (tùy chọn) */}
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4f8ef7',
    marginBottom: 12,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1.2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  active: {
    backgroundColor: '#d4f4e2',
  },
  inactive: {
    backgroundColor: '#ffebee',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  editButton: {
    backgroundColor: '#4f8ef7',
    margin: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default InformationScreen;