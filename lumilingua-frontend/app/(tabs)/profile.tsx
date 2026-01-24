import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";

const Profile = () => {
    const router = useRouter();
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const loadUserName = async () => {
            const name = await AsyncStorage.getItem("username");
            setUserName(name);
        };

        loadUserName();
    }, []);
    return (
        <View style={styles.container}>
            {/* Header Gradient */}
            <LinearGradient
                colors={['#FFA500', '#FF8C00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <TouchableOpacity style={styles.avatarContainer}>
                    <Image
                        source={require('@/assets/images/accounts/logo.jpg')}
                        style={styles.avatar}
                    />
                    <View style={styles.editBadge}>
                        <Ionicons name="pencil" size={16} color="white" />
                    </View>
                </TouchableOpacity>

                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.userLevel}>Level 12 • 4,850 XP</Text>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Ionicons name="flame" size={28} color="white" />
                        <Text style={styles.statValue}>7</Text>
                        <Text style={styles.statLabel}>Streak</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="trophy" size={28} color="white" />
                        <Text style={styles.statValue}>15</Text>
                        <Text style={styles.statLabel}>Badges</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="globe" size={28} color="white" />
                        <Text style={styles.statValue}>3</Text>
                        <Text style={styles.statLabel}>Ngôn ngữ</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Body */}
            <ScrollView style={styles.body}>
                {/* Current Languages */}
                <Text style={styles.sectionTitle}>Languages Learned</Text>
                <View style={styles.languagesRow}>
                    <View style={styles.languageCard}>
                        <Text style={styles.flag}>🇬🇧</Text>
                        <Text style={styles.languageName}>Tiếng Anh</Text>
                        <Text style={styles.languageLevel}>Intermediate</Text>
                    </View>
                    <View style={styles.languageCard}>
                        <Text style={styles.flag}>🇫🇷</Text>
                        <Text style={styles.languageName}>Tiếng Pháp</Text>
                        <Text style={styles.languageLevel}>Beginner</Text>
                    </View>
                </View>

                {/* Achievements / Badges */}
                <Text style={styles.sectionTitle}>Achieves</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesScroll}>
                    {['Beginner', '7 ngày streak', '100 bài học', 'Master Vocab'].map((badge) => (
                        <View key={badge} style={styles.badgeItem}>
                            <Ionicons name="star" size={40} color="#FFA500" />
                            <Text style={styles.badgeText}>{badge}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Navigate Staff */}
                <TouchableOpacity
                    style={styles.becomeTutorButton}
                    activeOpacity={0.8}
                    onPress={() => router.push('/RegisterAccount')}
                >
                    <LinearGradient
                        colors={['#FFB703', '#FB8500']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.becomeTutorGradient}
                    >
                        <Ionicons name="school" size={32} color="white" />
                        <View style={styles.becomeTutorTextContainer}>
                            <Text style={styles.becomeTutorTitle}>Trở thành Gia sư</Text>
                            <Text style={styles.becomeTutorDesc}>
                                Dạy ngôn ngữ, kiếm tiền và lan tỏa niềm vui học tập!
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={28} color="white" />
                    </LinearGradient>
                </TouchableOpacity>

                {/* Settings List */}
                <Text style={styles.sectionTitle}>Settings</Text>
                <View style={styles.settingsList}>
                    <TouchableOpacity style={styles.settingItem}>
                        <Ionicons name="person-outline" size={24} color="#FFA500" />
                        <Text style={styles.settingText}>Edit information</Text>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                        <Ionicons name="settings-outline" size={24} color="#FFA500" />
                        <Text style={styles.settingText}>Setting application</Text>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                        <Ionicons name="help-circle-outline" size={24} color="#FFA500" />
                        <Text style={styles.settingText}>Support & FAQ</Text>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.settingItem, { borderBottomWidth: 0 }]}>
                        <Ionicons name="log-out-outline" size={24} color="#FF6347" />
                        <Text style={[styles.settingText, { color: '#FF6347' }]}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        paddingTop: 40,
        paddingBottom: 30,
        alignItems: 'center',
    },
    avatarContainer: { position: 'relative' },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    editBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: '#FFA500',
        borderRadius: 20,
        padding: 6,
        borderWidth: 2,
        borderColor: 'white',
    },
    userName: { fontSize: 26, fontWeight: 'bold', color: 'white', marginTop: 16 },
    userLevel: { fontSize: 16, color: 'white', opacity: 0.9, marginTop: 4 },
    statsRow: {
        flexDirection: 'row',
        marginTop: 24,
        width: '100%',
        justifyContent: 'space-around',
    },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 24, fontWeight: 'bold', color: 'white', marginTop: 4 },
    statLabel: { fontSize: 14, color: 'white', opacity: 0.8 },
    body: { flex: 1, paddingHorizontal: 16 },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginTop: 24,
        marginBottom: 12,
    },
    languagesRow: { flexDirection: 'row', justifyContent: 'space-between' },
    languageCard: {
        backgroundColor: '#FFF8E1',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        width: '48%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    flag: { fontSize: 40 },
    languageName: { fontSize: 18, fontWeight: 'bold', marginTop: 8 },
    languageLevel: { fontSize: 14, color: '#666', marginTop: 4 },
    badgesScroll: { paddingVertical: 8 },
    badgeItem: {
        backgroundColor: '#FFF3E0',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        marginRight: 12,
        width: 120,
    },
    badgeText: { fontSize: 14, color: '#FFA500', marginTop: 8, textAlign: 'center' },
    becomeTutorButton: {
        marginVertical: 10,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    becomeTutorGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
    },
    becomeTutorTextContainer: {
        flex: 1,
        marginHorizontal: 16,
    },
    becomeTutorTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    becomeTutorDesc: {
        fontSize: 14,
        color: 'white',
        opacity: 0.9,
        marginTop: 4,
    },
    settingsList: {
        backgroundColor: '#f8f8f8',
        borderRadius: 16,
        marginTop: 12,
        marginBottom: 82,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    settingText: { flex: 1, fontSize: 16, marginLeft: 16, color: '#333' },
});

export default Profile