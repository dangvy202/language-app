import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import { useState } from 'react';
import { Stack, useRouter } from 'expo-router';

const RegisterTutor = () => {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [languages, setLanguages] = useState('');
    const [level, setLevel] = useState('');
    const [experience, setExperience] = useState('');
    const [bio, setBio] = useState('');

    const handleSubmit = () => {
        if (!fullName || !email || !phone || !languages) {
            Alert.alert('Thông báo', 'Vui lòng điền đầy đủ các trường bắt buộc!');
            return;
        }
        Alert.alert(
            'Đăng ký thành công',
            'Cảm ơn bạn! Chúng tôi sẽ liên hệ trong vòng 24-48h để xác nhận.'
        );
        // Reset form hoặc navigate về Profile
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
                {/* Header */}
                <LinearGradient
                    colors={['#FFB703', '#FB8500']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <Image
                        source={require('@/assets/images/accounts/logo.jpg')}
                        style={styles.mascot}
                    />
                    <Text style={styles.headerTitle}>Trở thành Gia sư</Text>
                    <Text style={styles.headerSubtitle}>
                        Chia sẻ kiến thức - Kiếm thu nhập - Lan tỏa niềm vui học ngôn ngữ!
                    </Text>
                </LinearGradient>

                <ScrollView
                    style={styles.formScroll}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.formContainer}>
                        {/* Full Name */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Họ và tên <Text style={styles.required}>*</Text></Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="person-outline" size={22} color="#FFA500" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    value={fullName}
                                    onChangeText={setFullName}
                                />
                            </View>
                        </View>

                        {/* Email */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={22} color="#FFA500" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="example@gmail.com"
                                    keyboardType="email-address"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        {/* Phone */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Số điện thoại <Text style={styles.required}>*</Text></Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="call-outline" size={22} color="#FFA500" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="0123 456 789"
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={setPhone}
                                />
                            </View>
                        </View>

                        {/* Languages */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Ngôn ngữ bạn dạy <Text style={styles.required}>*</Text></Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="globe-outline" size={22} color="#FFA500" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Tiếng Anh, Tiếng Pháp, Tiếng Tây Ban Nha..."
                                    value={languages}
                                    onChangeText={setLanguages}
                                />
                            </View>
                        </View>

                        {/* Level */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Trình độ của bạn</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="school-outline" size={22} color="#FFA500" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="C1, Native speaker, TESOL, CELTA..."
                                    value={level}
                                    onChangeText={setLevel}
                                />
                            </View>
                        </View>

                        {/* Experience */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Kinh nghiệm giảng dạy</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="time-outline" size={22} color="#FFA500" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Ví dụ: 3 năm dạy online, từng dạy cho học sinh cấp 3..."
                                    multiline
                                    numberOfLines={4}
                                    value={experience}
                                    onChangeText={setExperience}
                                />
                            </View>
                        </View>

                        {/* Bio */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Giới thiệu bản thân</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="information-circle-outline" size={22} color="#FFA500" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Viết gì đó vui vẻ để học viên tin tưởng bạn..."
                                    multiline
                                    numberOfLines={5}
                                    value={bio}
                                    onChangeText={setBio}
                                />
                            </View>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={styles.submitButton}
                            activeOpacity={0.85}
                            onPress={handleSubmit}
                        >
                            <LinearGradient
                                colors={['#FFB703', '#FB8500']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.submitGradient}
                            >
                                <Text style={styles.submitText}>Gửi đăng ký ngay</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <Text style={styles.note}>
                            Chúng tôi sẽ xem xét và liên hệ qua email/SĐT trong 24-48h. Cảm ơn bạn đã quan tâm!
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
        alignItems: 'flex-start',
        backgroundColor: '#FAFAFA',
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#EEE',
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    inputIcon: {
        marginTop: 14,
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#222',
        paddingVertical: 14,
    },
    textArea: {
        textAlignVertical: 'top',
        minHeight: 110,
        paddingTop: 12,
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
});

export default RegisterTutor;