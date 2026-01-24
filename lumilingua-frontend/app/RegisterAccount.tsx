import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Image, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView,
    Alert, ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hàm gọi API register (tùy chỉnh endpoint Java)
const registerApi = async (userData: {
    username: string;
    email: string;
    password: string;
    phone: string;
    gender: string
}) => {
    const endpoint = "http://127.0.0.1:8888/api/v1/user/register";

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.notification);
    }

    return await response.json();
};

export default function Register() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('MALE');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const validateForm = () => {
        if (!username.trim()) return 'Vui lòng nhập tên đăng nhập!';
        if (!email.trim()) return 'Vui lòng nhập email!';
        if (!/\S+@\S+\.\S+/.test(email)) return 'Email không hợp lệ!';
        if (!password.trim()) return 'Vui lòng nhập mật khẩu!';
        if (password.length < 6) return 'Mật khẩu phải ít nhất 6 ký tự!';
        if (!phone.trim()) return 'Vui lòng nhập số điện thoại!';
        if (!/^\d{10}$/.test(phone)) return 'Số điện thoại phải là 10 số!';
        return null;
    };

    const handleRegister = async () => {
        const validationError = validateForm();
        if (validationError) {
            setErrorMsg(validationError);
            return;
        }

        setErrorMsg(null);
        setLoading(true);

        try {
            const userData = { username, email, password, phone, gender };
            const response = await registerApi(userData);

            Alert.alert('Success', 'Register success! Redirect Login...');
            router.replace('/Login');
        } catch (err: any) {
            console.log("Register error:", err);
            setErrorMsg(err.notification || 'Đăng ký thất bại. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        router.push('/Login');
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: '',
                    headerTintColor: 'black',
                    headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={28} color="black" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <SafeAreaView className="flex-1 bg-white">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ flexGrow: 1 }}
                        className="px-6"
                    >
                        {/* Header */}
                        <View className="items-center mt-10 mb-10">
                            <View className="w-70 h-70 bg-orange-100 rounded-full items-center justify-center mb-6 shadow-md">
                                <Image
                                    source={require('@/assets/images/logoRegister.jpg')}
                                    style={styles.logo}
                                />
                            </View>
                            <Text className="text-3xl font-bold text-[#2E2A47]">Register Lumilingua</Text>
                            <Text className="text-lg text-gray-500 mt-2">Register an account for learn</Text>
                        </View>

                        {/* Error message */}
                        {errorMsg && (
                            <View className="bg-red-100 p-4 rounded-xl mb-6">
                                <Text className="text-red-600 text-center font-medium">{errorMsg}</Text>
                            </View>
                        )}

                        {/* Form đăng ký */}
                        <View className="space-y-6">
                            {/* Username */}
                            <View className="space-y-2">
                                <Text className="text-base font-medium text-[#2E2A47] mt-3">User name</Text>
                                <View className="flex-row items-center bg-orange-50 rounded-xl px-4 py-4 border border-orange-200">
                                    <Ionicons name="person-outline" size={24} color="#FFA500" />
                                    <TextInput
                                        className="flex-1 ml-3 text-base text-[#2E2A47]"
                                        placeholder="Fill user name"
                                        placeholderTextColor="#999"
                                        value={username}
                                        onChangeText={setUsername}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            {/* Email */}
                            <View className="space-y-2">
                                <Text className="text-base font-medium text-[#2E2A47] mt-3">Email</Text>
                                <View className="flex-row items-center bg-orange-50 rounded-xl px-4 py-4 border border-orange-200">
                                    <Ionicons name="mail-outline" size={24} color="#FFA500" />
                                    <TextInput
                                        className="flex-1 ml-3 text-base text-[#2E2A47]"
                                        placeholder="Fill email"
                                        placeholderTextColor="#999"
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                </View>
                            </View>

                            {/* Password */}
                            <View className="space-y-2">
                                <Text className="text-base font-medium text-[#2E2A47] mt-3">Password</Text>
                                <View className="flex-row items-center bg-orange-50 rounded-xl px-4 py-4 border border-orange-200">
                                    <Ionicons name="lock-closed-outline" size={24} color="#FFA500" />
                                    <TextInput
                                        className="flex-1 ml-3 text-base text-[#2E2A47]"
                                        placeholder="Fill password (more than 6 characters)"
                                        placeholderTextColor="#999"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Ionicons
                                            name={showPassword ? "eye-outline" : "eye-off-outline"}
                                            size={24}
                                            color="#FFA500"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Phone */}
                            <View className="space-y-2">
                                <Text className="text-base font-medium text-[#2E2A47] mt-3">Phone number</Text>
                                <View className="flex-row items-center bg-orange-50 rounded-xl px-4 py-4 border border-orange-200">
                                    <Ionicons name="call-outline" size={24} color="#FFA500" />
                                    <TextInput
                                        className="flex-1 ml-3 text-base text-[#2E2A47]"
                                        placeholder="Fill phone-number (10 degits)"
                                        placeholderTextColor="#999"
                                        value={phone}
                                        onChangeText={setPhone}
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                    />
                                </View>
                            </View>

                            {/* Gender */}
                            <View className="space-y-2">
                                <Text className="text-base font-medium text-[#2E2A47] mt-3">Sex</Text>
                                <View className="bg-orange-50 rounded-xl px-4 py-4 border border-orange-200">
                                    <Picker
                                        selectedValue={gender}
                                        onValueChange={(itemValue) => setGender(itemValue)}
                                        itemStyle={{
                                            color: '#000000',
                                            fontSize: 16,
                                            height: 50
                                        }}
                                    >
                                        <Picker.Item label="Male" value="MALE" />
                                        <Picker.Item label="Female" value="FEMALE" />
                                        <Picker.Item label="Other" value="OTHER" />
                                    </Picker>
                                </View>
                            </View>

                            {/* Register Button */}
                            <TouchableOpacity
                                onPress={handleRegister}
                                disabled={loading}
                                className={`bg-[#FFA500] mt-5 py-5 rounded-2xl items-center shadow-lg ${loading ? 'opacity-70' : ''}`}
                            >
                                {loading ? (
                                    <View className="flex-row items-center">
                                        <ActivityIndicator size="small" color="white" />
                                        <Text className="text-white text-lg font-bold ml-3">Wait for register...</Text>
                                    </View>
                                ) : (
                                    <Text className="text-white text-lg font-bold">Register Account</Text>
                                )}
                            </TouchableOpacity>

                            {/* Login link */}
                            <View className="flex-row justify-center mt-6">
                                <Text className="text-gray-600">Have an account? </Text>
                                <TouchableOpacity onPress={handleLogin}>
                                    <Text className="text-[#FFA500] font-medium">Login Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>

    );
}

const styles = StyleSheet.create({
    logo: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: '#FB8500',
    }
})