import Loading from '@/component/loading';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { registerTutor } from '@/services/api';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterTutor = () => {
    const router = useRouter();

    const [loadingLogin, setLoadingLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [hourOfDay, setHourOfDay] = useState('');
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [scoreSpeaking, setScoreSpeaking] = useState('0');
    const [scoreReading, setScoreReading] = useState('0');
    const [scoreListening, setScoreListening] = useState('0');
    const [scoreWriting, setScoreWriting] = useState('0');
    const [certificateFile, setCertificateFile] = useState<any>(null);
    const [expectedSalary, setExpectedSalary] = useState('');
    const [experiences, setExperiences] = useState<
        { companyName: string; fromDate: string; toDate: string }[]
    >([]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newCompany, setNewCompany] = useState('');
    const [newFromDate, setNewFromDate] = useState(new Date());
    const [newToDate, setNewToDate] = useState(new Date());
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);

    const [loading, setLoading] = useState(false);

    const daysOfWeek = [
        { id: 1, label: 'Thứ 2' },
        { id: 2, label: 'Thứ 3' },
        { id: 3, label: 'Thứ 4' },
        { id: 4, label: 'Thứ 5' },
        { id: 5, label: 'Thứ 6' },
        { id: 6, label: 'Thứ 7' },
        { id: 7, label: 'CN' },
    ];

    const refreshTokenApi = async (refreshToken: string) => {
        const endpoint = "https://compare-auditor-suse-mediterranean.trycloudflare.com/api/v1/user/refresh";

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

    const formatVND = (value: string) => {
        if (!value) return '';
        return Number(value).toLocaleString('vi-VN');
    };

    const unformatVND = (value: string) => {
        return value.replace(/\D/g, '');
    };

    const toggleDay = (dayId: number) => {
        setSelectedDays((prev) =>
            prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
        );
    };

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const pickCertificate = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: '*/*',
        });

        if (!result.canceled) {
            setCertificateFile(result.assets[0]);
        }
    };

    const addExperience = () => {
        console.log('ADD EXPERIENCE CLICKED');

        if (!newCompany.trim() || !newFromDate || !newToDate) {
            Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin kinh nghiệm!');
            return;
        }

        if (newFromDate > newToDate) {
            Alert.alert('Thông báo', 'Ngày bắt đầu phải trước ngày kết thúc!');
            return;
        }

        const newExp = {
            companyName: newCompany.trim(),
            fromDate: formatDate(newFromDate),
            toDate: formatDate(newToDate),
        };

        console.log('Kinh nghiệm mới sẽ thêm:', newExp);

        setExperiences((prev) => {
            const updated = [...prev, newExp];
            console.log('State experiences sau update:', updated);
            return updated;
        });

        setNewCompany('');
        setNewFromDate(new Date());
        setNewToDate(new Date());
        setShowAddForm(false);
    };

    const removeExperience = (index: number) => {
        setExperiences((prev) => prev.filter((_, i) => i !== index));
    };

    const handleScoreChange = (text: string, setter: (val: string) => void) => {
        const number = text.replace(/[^0-9]/g, '');

        if (!number) {
            setter('');
            return;
        }

        const value = parseInt(number, 10);

        if (value >= 1 && value <= 10) {
            setter(value.toString());
        } else if (value > 10) {
            setter('10');
        }
    };

    const handleSubmit = async () => {
        if (experiences.length === 0) {
            Alert.alert('Thông báo', 'Vui lòng thêm ít nhất 1 kinh nghiệm!');
            return;
        }

        if (!certificateFile) {
            Alert.alert('Thông báo', 'Vui lòng chọn file chứng chỉ!');
            return;
        }

        setLoading(true);

        try {
            const result = await registerTutor({
                email,
                hourOfDay,
                selectedDays,
                scoreSpeaking,
                scoreReading,
                scoreListening,
                scoreWriting,
                certificateFile,
                expectedSalary,
                experiences,
            });

            if (result?.conflict === true) {
                Alert.alert(
                    "Thông báo",
                    result.notification || "Bạn đã đăng ký gia sư rồi",
                    [
                        {
                            text: "Xem đăng ký",
                            // onPress: () => router.push("/TutorRegister")
                        },
                        {
                            text: "Đóng",
                            style: "cancel"
                        }
                    ]
                );
                return;
            }

            Alert.alert(
                "Đăng ký thành công",
                "Cảm ơn bạn! Chúng tôi sẽ liên hệ trong 24-48h."
            );

            router.back();

        } catch (err: any) {
            Alert.alert(
                "Lỗi",
                err.message || "Đăng ký thất bại. Vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Trở Thành Gia Sư',
                    headerTintColor: 'black',
                    headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={28} color="black" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <LinearGradient
                    colors={['#FFB703', '#FB8500']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <Image source={require('@/assets/images/accounts/logo.jpg')} style={styles.mascot} />
                    <Text style={styles.headerTitle}>Trở thành Gia sư</Text>
                    <Text style={styles.headerSubtitle}>
                        Chia sẻ kiến thức - Kiếm thu nhập - Lan tỏa niềm vui học ngôn ngữ!
                    </Text>
                </LinearGradient>

                <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <View style={styles.formContainer}>
                        {/* Email */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={22} color="#FFA500" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email đăng nhập"
                                    placeholderTextColor="#999"
                                    keyboardType="email-address"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Giờ dạy */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Giờ dạy trong ngày (0-23) <Text style={styles.required}>*</Text></Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="time-outline" size={22} color="#FFA500" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ví dụ: 18 (6h tối)"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                    value={hourOfDay}
                                    onChangeText={(text) => setHourOfDay(text.replace(/[^0-9]/g, ''))}
                                    maxLength={2}
                                />
                            </View>
                        </View>

                        {/* Ngày dạy */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Ngày dạy trong tuần <Text style={styles.required}>*</Text></Text>
                            <View style={styles.daysContainer}>
                                {daysOfWeek.map((day) => (
                                    <TouchableOpacity
                                        key={day.id}
                                        style={[styles.dayChip, selectedDays.includes(day.id) && styles.dayChipSelected]}
                                        onPress={() => toggleDay(day.id)}
                                    >
                                        <Text style={[styles.dayText, selectedDays.includes(day.id) && styles.dayTextSelected]}>
                                            {day.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Điểm kỹ năng */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Điểm kỹ năng (0-10) <Text style={styles.required}>*</Text></Text>
                            <View style={styles.skillsRow}>
                                <View style={styles.skillInput}>
                                    <Text>Speaking</Text>
                                    <TextInput
                                        style={styles.skillNumber}
                                        keyboardType="numeric"
                                        value={scoreSpeaking}
                                        maxLength={2}
                                        onFocus={() => scoreSpeaking === '0' && setScoreSpeaking('')}
                                        onChangeText={(text) => handleScoreChange(text, setScoreSpeaking)}
                                    />
                                </View>
                                <View style={styles.skillInput}>
                                    <Text>Reading</Text>
                                    <TextInput
                                        style={styles.skillNumber}
                                        keyboardType="numeric"
                                        value={scoreReading}
                                        maxLength={2}
                                        onFocus={() => scoreReading === '0' && setScoreReading('')}
                                        onChangeText={(text) => handleScoreChange(text, setScoreReading)}
                                    />
                                </View>
                            </View>
                            <View style={styles.skillsRow}>
                                <View style={styles.skillInput}>
                                    <Text>Listening</Text>
                                    <TextInput
                                        style={styles.skillNumber}
                                        keyboardType="numeric"
                                        value={scoreListening}
                                        maxLength={2}
                                        onFocus={() => scoreListening === '0' && setScoreListening('')}
                                        onChangeText={(text) => handleScoreChange(text, setScoreListening)}
                                    />
                                </View>
                                <View style={styles.skillInput}>
                                    <Text>Writing</Text>
                                    <TextInput
                                        style={styles.skillNumber}
                                        keyboardType="numeric"
                                        value={scoreWriting}
                                        maxLength={2}
                                        onFocus={() => scoreWriting === '0' && setScoreWriting('')}
                                        onChangeText={(text) => handleScoreChange(text, setScoreWriting)}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Chứng chỉ */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Link chứng chỉ (nếu có)</Text>
                            <TouchableOpacity
                                style={styles.filePicker}
                                onPress={pickCertificate}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name="document-attach-outline"
                                    size={22}
                                    color="#FFA500"
                                    style={styles.inputIcon}
                                />

                                <Text
                                    style={[
                                        styles.fileText,
                                        !certificateFile && styles.filePlaceholder
                                    ]}
                                    numberOfLines={1}
                                >
                                    {certificateFile ? certificateFile.name : "Chọn file chứng chỉ"}
                                </Text>

                                {certificateFile && (
                                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Lương mong muốn */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mức lương mong muốn (VND) <Text style={styles.required}>*</Text></Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="cash-outline" size={22} color="#FFA500" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={formatVND(expectedSalary)}
                                    onChangeText={(text) => {
                                        const raw = unformatVND(text);
                                        setExpectedSalary(raw);
                                    }}
                                />
                            </View>
                        </View>

                        {/* Kinh nghiệm */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Kinh nghiệm làm việc</Text>

                            {/* List kinh nghiệm */}
                            {experiences.map((exp, index) => (
                                <View key={index} style={styles.experienceItem}>
                                    <Text style={styles.experienceText}>
                                        {exp.companyName} ({exp.fromDate} → {exp.toDate})
                                    </Text>
                                    <TouchableOpacity onPress={() => removeExperience(index)}>
                                        <Ionicons name="trash-outline" size={24} color="#FF6347" />
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {/* Button toggle form thêm mới */}
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => setShowAddForm(!showAddForm)}
                            >
                                <Text style={styles.addButtonText}>
                                    {showAddForm ? '- Ẩn form thêm' : '+ Thêm kinh nghiệm'}
                                </Text>
                            </TouchableOpacity>

                            {/* Form thêm kinh nghiệm - chỉ hiện khi showAddForm = true */}
                            {showAddForm && (
                                <View style={styles.addExperience}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Tên công ty"
                                        value={newCompany}
                                        onChangeText={setNewCompany}
                                    />

                                    {/* Từ ngày */}
                                    <TouchableOpacity style={styles.dateInput} onPress={() => setShowFromPicker(true)}>
                                        <Ionicons name="calendar-outline" size={22} color="#FFA500" style={styles.inputIcon} />
                                        <Text style={styles.dateText}>Từ ngày: {formatDate(newFromDate)}</Text>
                                    </TouchableOpacity>
                                    {showFromPicker && (
                                        <DateTimePicker
                                            value={newFromDate}
                                            mode="date"
                                            display="default"
                                            onChange={(event, selectedDate) => {
                                                setShowFromPicker(Platform.OS === 'ios');
                                                if (selectedDate) setNewFromDate(selectedDate);
                                            }}
                                        />
                                    )}

                                    {/* Đến ngày */}
                                    <TouchableOpacity style={styles.dateInput} onPress={() => setShowToPicker(true)}>
                                        <Ionicons name="calendar-outline" size={22} color="#FFA500" style={styles.inputIcon} />
                                        <Text style={styles.dateText}>Đến ngày: {formatDate(newToDate)}</Text>
                                    </TouchableOpacity>
                                    {showToPicker && (
                                        <DateTimePicker
                                            value={newToDate}
                                            mode="date"
                                            display="default"
                                            onChange={(event, selectedDate) => {
                                                setShowToPicker(Platform.OS === 'ios');
                                                if (selectedDate) setNewToDate(selectedDate);
                                            }}
                                        />
                                    )}

                                    <TouchableOpacity style={styles.addButton} onPress={addExperience}>
                                        <Text style={styles.addButtonText}>Thêm kinh nghiệm này</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        {/* Submit */}
                        <TouchableOpacity
                            style={styles.submitButton}
                            activeOpacity={0.85}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={['#FFB703', '#FB8500']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.submitGradient}
                            >
                                {loading ? <Text style={styles.submitText}>Đang gửi...</Text> : <Text style={styles.submitText}>Gửi đăng ký ngay</Text>}
                            </LinearGradient>
                        </TouchableOpacity>

                        <Text style={styles.note}>
                            Chúng tôi sẽ xem xét và liên hệ qua email trong 24-48h. Cảm ơn bạn!
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        paddingTop: 60,
        paddingBottom: 40,
        alignItems: 'center',
    },
    mascot: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 4,
        borderColor: 'white',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'white',
        opacity: 0.95,
        textAlign: 'center',
        paddingHorizontal: 30,
    },
    formScroll: { flex: 1 },
    formContainer: {
        padding: 24,
        paddingBottom: 100,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    required: {
        color: '#FF6347',
        fontWeight: 'bold',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#EEE',
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#222',
        paddingVertical: 14,
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    dayChip: {
        backgroundColor: '#F0F0F0',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    dayChipSelected: {
        backgroundColor: '#FFA500',
    },
    dayText: {
        fontSize: 14,
        color: '#333',
    },
    dayTextSelected: {
        color: 'white',
        fontWeight: 'bold',
    },
    skillsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    skillInput: {
        flex: 1,
        marginRight: 12,
        alignItems: 'center',
    },
    skillNumber: {
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEE',
        width: 60,
        textAlign: 'center',
        paddingVertical: 10,
        marginTop: 4,
        fontSize: 16,
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#EEE',
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginTop: 8,
    },
    dateText: {
        fontSize: 16,
        color: '#222',
    },
    experienceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    experienceText: {
        flex: 1,
        fontSize: 14,
    },
    addExperience: { marginTop: 12, },
    addButton: {
        backgroundColor: '#FFA500',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    submitButton: {
        marginTop: 32,
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#FFA500',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
    },
    submitGradient: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    submitText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    note: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 60,
        lineHeight: 20,
    },
    filePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#EEE',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },

    fileText: {
        flex: 1,
        fontSize: 16,
        color: '#222',
    },

    filePlaceholder: {
        color: '#999',
    },
});

export default RegisterTutor;