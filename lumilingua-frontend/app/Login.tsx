import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView, Platform, ScrollView,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const loginApi = async (email: string, password: string) => {
    const endpoint = "http://localhost:8888/api/v1/user/login";

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.notification);
    }

    return await response.json();
};

const refreshTokenApi = async (refreshToken: string) => {
    const endpoint = "http://localhost:8888/api/v1/user/refresh";

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

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = await AsyncStorage.getItem('token');
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            const expiredStr = await AsyncStorage.getItem('expired');
            const userName = await AsyncStorage.getItem('username');
            const email = await AsyncStorage.getItem('email');

            const expired = expiredStr ? parseInt(expiredStr, 10) : null;

            if (email && accessToken && userName && expired && Date.now() < expired) {
                router.replace('/');
                return;
            }

            if (refreshToken) {
                try {
                    setLoading(true);
                    const response = await refreshTokenApi(refreshToken);

                    await AsyncStorage.setItem('token', response.data.token || '');
                    await AsyncStorage.setItem('expired', response.data.expired || '');

                    router.replace('/');
                } catch (err: any) {
                    console.log('Refresh token error:', err);
                    await AsyncStorage.multiRemove(['token', 'refreshToken', 'expired', 'username', 'email']);
                } finally {
                    setLoading(false);
                }
            }
        };

        checkAuth();
    }, []);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setErrorMsg('Please enter your information');
            return;
        }

        setErrorMsg(null);
        setLoading(true);

        try {
            const response = await loginApi(email.trim(), password.trim());

            await AsyncStorage.setItem('token', response.data.token || '');
            await AsyncStorage.setItem('refreshToken', response.data.refreshToken || '');
            await AsyncStorage.setItem('expired', response.data.expired || '');
            await AsyncStorage.setItem('username', response.data.information.username);
            await AsyncStorage.setItem('email', response.data.information.email);

            router.replace('/');
        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        // router.push('/forgot-password');
    };

    const handleRegister = () => {
        router.push('/RegisterAccount');
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
                        <View className="items-center mt-16 mb-12">
                            <View className="w-32 h-32 bg-orange-100 rounded-full items-center justify-center mb-6 shadow-md">
                                <Ionicons name="school-outline" size={64} color="#FFA500" />
                            </View>
                            <Text className="text-3xl font-bold text-[#2E2A47]">Lumilingua</Text>
                            <Text className="text-lg text-gray-500 mt-2">Learn smart, learn to earn</Text>
                        </View>

                        {/* Error message */}
                        {errorMsg && (
                            <View className="bg-red-100 p-4 rounded-xl mb-6">
                                <Text className="text-red-600 text-center font-medium">{errorMsg}</Text>
                            </View>
                        )}

                        {/* Form */}
                        <View className="space-y-6">
                            {/* email/Email */}
                            <View className="space-y-2">
                                <Text className="text-base font-medium text-[#2E2A47] mt-3">Email</Text>
                                <View className="flex-row items-center bg-orange-50 rounded-xl px-4 py-4 border border-orange-200">
                                    <Ionicons name="mail-outline" size={24} color="#FFA500" />
                                    <TextInput
                                        className="flex-1 ml-3 text-base text-[#2E2A47]"
                                        placeholder="Input email"
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
                                        placeholder="Input password"
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

                            {/* Forgot Password */}
                            <TouchableOpacity onPress={handleForgotPassword}>
                                <Text className="text-right text-[#FFA500] font-medium mt-3 mb-3">Forgot password?</Text>
                            </TouchableOpacity>

                            {/* Login Button */}
                            <TouchableOpacity
                                onPress={handleLogin}
                                disabled={loading}
                                className={`bg-[#FFA500] py-5 rounded-2xl items-center shadow-lg ${loading ? 'opacity-70' : ''}`}
                            >
                                {loading ? (
                                    <View className="flex-row items-center">
                                        <ActivityIndicator size="small" color="white" />
                                        <Text className="text-white text-lg font-bold ml-3">Wait for login...</Text>
                                    </View>
                                ) : (
                                    <Text className="text-white text-lg font-bold">Login</Text>
                                )}
                            </TouchableOpacity>

                            {/* Register link */}
                            <View className="flex-row justify-center mt-6">
                                <Text className="text-gray-600">No account yet? </Text>
                                <TouchableOpacity onPress={handleRegister}>
                                    <Text className="text-[#FFA500] font-medium">Register now</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Social login (placeholder) */}
                            <View className="mt-10">
                                <Text className="text-center text-gray-500 mb-4">Other sign-in options</Text>
                                <View className="flex-row justify-center space-x-8">
                                    <TouchableOpacity className="w-14 h-14 bg-gray-100 rounded-full items-center justify-center">
                                        <Ionicons name="logo-google" size={28} color="#DB4437" />
                                    </TouchableOpacity>
                                    <TouchableOpacity className="w-14 h-14 bg-gray-100 rounded-full items-center justify-center">
                                        <Ionicons name="logo-facebook" size={28} color="#1877F2" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>

    );
}