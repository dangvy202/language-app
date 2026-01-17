import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Clipboard,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const WALLET_ADDRESS = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

// Tab 1: Tiền học được nhận
const AttendanceTab = () => {
  const [hoursLearned, setHoursLearned] = useState(45); // giờ học
  const [daysStreak, setDaysStreak] = useState(12);     // ngày liên tục
  const attendanceEarned = hoursLearned * 20000 + daysStreak * 50000; // ví dụ: 20k/giờ + 50k/ngày streak

  const hoursGoal = 100; // mục tiêu 100 giờ
  const daysGoal = 30;   // mục tiêu 30 ngày

  return (
    <ScrollView style={styles.tabContainer}>
      <Text style={styles.tabTitle}>Tiền học được nhận</Text>

      {/* Tổng tiền nhận */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Tổng tiền chuyên cần</Text>
        <Text style={styles.balanceAmount}>{attendanceEarned.toLocaleString('vi-VN')} VNĐ</Text>
      </View>

      {/* Progress circles */}
      <View style={styles.progressRow}>
        {/* Giờ học */}
        <View style={styles.progressCircleContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>{Math.round((hoursLearned / hoursGoal) * 100)}%</Text>
          </View>
          <Text style={styles.progressLabel}>{hoursLearned} / {hoursGoal} giờ học</Text>
        </View>

        {/* Ngày streak */}
        <View style={styles.progressCircleContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>{Math.round((daysStreak / daysGoal) * 100)}%</Text>
          </View>
          <Text style={styles.progressLabel}>{daysStreak} / {daysGoal} ngày streak</Text>
        </View>
      </View>

      <Text style={styles.infoText}>
        Mỗi giờ học hoàn thành: +20.000 VNĐ{"\n"}
        Mỗi ngày streak: +50.000 VNĐ{"\n"}
        Tiếp tục học đều để nhận thêm thưởng!
      </Text>
    </ScrollView>
  );
};

// Tab 2: Tiền nạp
const DepositTab = () => {
  const [depositBalance, setDepositBalance] = useState(3500000);
  const [recentDeposits, setRecentDeposits] = useState([
    { date: '15/01/2025', amount: 1000000, method: 'Chuyển khoản ngân hàng' },
    { date: '10/01/2025', amount: 2000000, method: 'Momo' },
  ]);

  return (
    <ScrollView style={styles.tabContainer}>
      <Text style={styles.tabTitle}>Tiền nạp</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Số dư tiền nạp</Text>
        <Text style={styles.balanceAmount}>{depositBalance.toLocaleString('vi-VN')} VNĐ</Text>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>Nạp thêm ngay</Text>
      </TouchableOpacity>

      <Text style={styles.sectionSubTitle}>Lịch sử nạp gần đây</Text>
      {recentDeposits.map((item, index) => (
        <View key={index} style={styles.transactionItem}>
          <View style={styles.transactionIcon}>
            <Ionicons name="arrow-down-circle" size={28} color="#4CAF50" />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionDate}>{item.date}</Text>
            <Text style={styles.transactionMethod}>{item.method}</Text>
          </View>
          <Text style={[styles.transactionAmount, { color: '#4CAF50' }]}>
            +{item.amount.toLocaleString('vi-VN')} VNĐ
          </Text>
        </View>
      ))}

      <Text style={styles.infoText}>
        Tiền nạp dùng để mua khóa học, đặt lịch gia sư, hoặc chuyển khoản.
      </Text>
    </ScrollView>
  );
};

// Tab 3: Lịch sử ví
const HistoryTab = () => {
  const history = [
    { type: 'attendance', desc: 'Hoàn thành 5 giờ học', date: '16/01/2025', amount: 100000 },
    { type: 'deposit', desc: 'Nạp qua Momo', date: '15/01/2025', amount: 1000000 },
    { type: 'attendance', desc: 'Streak 7 ngày', date: '14/01/2025', amount: 350000 },
    // thêm item khác
  ];

  return (
    <ScrollView style={styles.tabContainer}>
      <Text style={styles.tabTitle}>Lịch sử ví</Text>

      {history.map((item, index) => (
        <View key={index} style={styles.historyItem}>
          <View style={styles.historyIconWrapper}>
            {item.type === 'attendance' ? (
              <Ionicons name="gift" size={24} color="#FFA500" />
            ) : (
              <Ionicons name="card" size={24} color="#FF6347" />
            )}
          </View>
          <View style={styles.historyInfo}>
            <Text style={styles.historyDesc}>{item.desc}</Text>
            <Text style={styles.historyDate}>{item.date}</Text>
          </View>
          <Text
            style={[
              styles.historyAmount,
              { color: item.type === 'attendance' ? '#4CAF50' : '#FF6347' },
            ]}
          >
            {item.type === 'attendance' ? '+' : '-'}{item.amount.toLocaleString('vi-VN')} VNĐ
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

// Tab 4: Chuyển tiền
const TransferTab = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = () => {
    if (!recipient || !amount) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    Alert.alert('Thành công', `Đã chuyển ${amount} VNĐ đến ${recipient}`);
  };

  return (
    <ScrollView style={styles.tabContainer}>
      <Text style={styles.tabTitle}>Chuyển tiền</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ví người nhận</Text>
        <TextInput
          style={styles.input}
          value={recipient}
          onChangeText={setRecipient}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Số tiền (VNĐ)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ví dụ: 500000"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={handleTransfer}>
        <Text style={styles.actionButtonText}>Chuyển ngay</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Tab 5: Yêu cầu rút tiền
const WithdrawTab = () => {
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');

  const handleWithdraw = () => {
    if (!bank || !accountNumber || !amount) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }
    Alert.alert('Yêu cầu rút tiền', 'Yêu cầu đã gửi! Chúng tôi sẽ xử lý trong 3-5 ngày làm việc.');
  };

  return (
    <ScrollView style={styles.tabContainer}>
      <Text style={styles.tabTitle}>Yêu cầu rút tiền</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ngân hàng</Text>
        <TextInput
          style={styles.input}
          placeholder="Ví dụ: Vietcombank, Techcombank..."
          value={bank}
          onChangeText={setBank}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Số tài khoản</Text>
        <TextInput
          style={styles.input}
          placeholder="0123456789"
          keyboardType="numeric"
          value={accountNumber}
          onChangeText={setAccountNumber}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Số tiền rút (VNĐ)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ví dụ: 1000000"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={handleWithdraw}>
        <Text style={styles.actionButtonText}>Gửi yêu cầu rút</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        Chỉ rút từ tiền nạp. Phí rút 1% (tối thiểu 10.000 VNĐ).
      </Text>
    </ScrollView>
  );
};

// Tab routes
const renderScene = SceneMap({
  attendance: AttendanceTab,
  deposit: DepositTab,
  history: HistoryTab,
  transfer: TransferTab,
  withdraw: WithdrawTab,
});

const Wallet = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'attendance', title: 'Tiền học' },
    { key: 'deposit', title: 'Tiền nạp' },
    { key: 'history', title: 'Lịch sử' },
    { key: 'transfer', title: 'Chuyển tiền' },
    { key: 'withdraw', title: 'Rút tiền' },
  ]);
  const copyWalletAddress = async () => {
    await Clipboard.setString(WALLET_ADDRESS);
    Alert.alert('Thành công', 'Đã copy địa chỉ ví vào bộ nhớ tạm!');
  };

  return (
    <View style={styles.container}>
      {/* Header tổng quan */}
      <LinearGradient
        colors={['#FFB703', '#FB8500']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Ví Ten account</Text>
        <View style={styles.walletAddressContainer}>
          <Text style={styles.walletAddress} numberOfLines={1} ellipsizeMode="middle">
            {WALLET_ADDRESS}
          </Text>
          <TouchableOpacity onPress={copyWalletAddress} style={styles.copyButton}>
            <Ionicons name="copy-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={props => (
          <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{ backgroundColor: '#FFA500', height: 4 }}
            style={{ backgroundColor: '#fff' }}
            activeColor="#FFA500"
            inactiveColor="#666"
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  copyButton: {
    padding: 8,
    marginLeft: 8,
  },
  walletAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 8,
    maxWidth: '90%',
  },
  walletAddress: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'monospace', // font monospace để UUID dễ đọc
    flex: 1,
  },
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  tabContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    margin: 20,
  },
  balanceCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 24,
    paddingHorizontal: 20,
  },
  progressCircleContainer: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  progressLabel: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: '#FFA500',
    borderRadius: 30,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 24,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 16,
    color: '#333',
  },
  transactionDate: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionSubTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  historyInfo: {
    flex: 1,
  },
  historyDesc: {
    fontSize: 16,
    color: '#333',
  },
  historyDate: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  note: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  transactionMethod: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 4,
  },
});

export default Wallet;