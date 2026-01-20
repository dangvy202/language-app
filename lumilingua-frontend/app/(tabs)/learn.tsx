import { Level, Skill } from '@/interfaces/interfaces';
import { fetchLevel } from '@/services/api';
import useFetch from '@/services/useFetch';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ActivityIndicator,
    TouchableOpacity,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function Learn() {
    const router = useRouter();

    const {
        data: rawData,
        loading: levelLoading,
        error: levelError,
    } = useFetch(() => fetchLevel({ query: "" }));

    const levels = rawData ?? [];

    const defaultSkills: Skill[] = [
        { key_skill: 'listening', label: 'Listening', icon: 'ear-outline' },
        { key_skill: 'reading', label: 'Reading', icon: 'book-outline' },
        { key_skill: 'speaking', label: 'Speaking', icon: 'mic-outline' },
        { key_skill: 'writing', label: 'Writing', icon: 'create-outline' },
    ];

    const levelsWithSkills: Level[] = levels.map(level => ({
        ...level,
        skills: defaultSkills,
    }));
    
    const currentLevel = 'A1';
    const earnedCoins = 450;
    const dailyCoinsGoal = 50;

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={['#FFB703', '#FB8500']} style={styles.headerGradient}>
                <View style={styles.headerTop}>
                    <View style={styles.streakBadge}>
                        <Ionicons name="cash-outline" size={20} color="#FFD700" />
                        <Text style={styles.streakText}>100 coins</Text>
                    </View>
                </View>

                <View style={styles.headerContent}>
                    <Text style={styles.courseTitle}>English Basic</Text>
                    <Text style={styles.courseSubtitle}>
                        Level {currentLevel} • Đã kiếm {earnedCoins.toLocaleString()} coins
                    </Text>
                    <Text style={styles.earnTip}>
                        Học hôm nay để kiếm thêm {dailyCoinsGoal} coins!
                    </Text>
                </View>
            </LinearGradient>

            {/* Container */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <Text style={styles.sectionTitle}>Level</Text>
                {levelLoading ? (
                    <ActivityIndicator size="large" color="#FFA500" style={{ marginTop: 40 }} />
                ) : levelError ? (
                    <Text style={{ textAlign: 'center', color: 'red', marginTop: 40 }}>
                        Có lỗi xảy ra khi tải levels: {levelError.message || 'Unknown error'}
                    </Text>
                ) : levels.length === 0 ? (
                    <Text style={{ textAlign: 'center', color: '#666', marginTop: 40 }}>
                        Chưa có level nào
                    </Text>
                ) : (
                    
                    levelsWithSkills.map((level) => {
                        const isUnlocked = 'A1' === currentLevel;
                        

                        return (
                            <TouchableOpacity
                                key={level.id_level}
                                style={[
                                    styles.levelCard,
                                    isUnlocked && styles.currentLevelCard,
                                ]}
                                activeOpacity={isUnlocked ? 0.8 : 1}
                                disabled={!isUnlocked}
                                onPress={() => {
                                    if (isUnlocked) {
                                        console.log(`Bắt đầu/tiếp tục học level ${level.id_level}`);
                                        // router.push(`/learn/${level.id}`); // ví dụ điều hướng
                                    } else {
                                        console.log(`Cần mở khóa level ${level.id_level}`);
                                    }
                                }}
                            >
                                <LinearGradient
                                    colors={
                                        isUnlocked
                                            ? ['#FFF3E0', '#FFE0B2']
                                            : ['#FAFAFA', '#EEEEEE']
                                    }
                                    style={styles.levelGradient}
                                >
                                    <View style={styles.levelHeader}>
                                        <Text style={styles.levelName}>{level.rank}</Text>

                                        <View style={styles.progressCircle}>
                                            <Text style={styles.progressText}>
                                                {/* {Math.round(level.overallProgress || 0)}% */}
                                                10%
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={styles.levelDesc}>{level.level_name}: {level.description}</Text>


                                    {/* 4 Skills */}
                                    <View style={[styles.skillsContainer, !isUnlocked && { opacity: 0.5 }]}>
                                        {level.skills?.map((skill) => (
                                            <View key={skill.key_skill} style={styles.skillItem}>
                                                <View style={styles.skillIconContainer}>
                                                    <Ionicons name={skill.icon} size={28} color="#FFA500" />
                                                </View>
                                                <Text style={styles.skillName}>{skill.label}</Text>
                                                <View style={styles.skillProgressBg}>
                                                    <View
                                                        style={[
                                                            styles.skillProgressFill,
                                                            { width: '10%' },
                                                        ]}
                                                    />
                                                </View>
                                                <Text style={styles.skillProgressText}>
                                                   10%
                                                </Text>
                                            </View>
                                        ))}
                                    </View>

                                    <TouchableOpacity
                                        style={[
                                            styles.startButton,
                                            !isUnlocked && styles.lockedButton,
                                        ]}
                                        disabled={!isUnlocked}
                                        onPress={() => {
                                            if (isUnlocked) {
                                                console.log(`Bắt đầu/tiếp tục học level ${level.id_level}`);
                                            } else {
                                                console.log(`Mở khóa level ${level.id_level} - cần coins hoặc điều kiện`);
                                            }
                                        }}
                                    >
                                        <Ionicons
                                            name={isUnlocked ? 'lock-open-outline' : 'lock-closed-outline'}
                                            size={20}
                                            color={isUnlocked ? '#fff' : '#666'}
                                            style={{ marginRight: 8 }}
                                        />
                                        <Text style={styles.startButtonText}>
                                            {isUnlocked
                                                ? (10 || 0) > 0
                                                    ? 'Tiếp tục học'
                                                    : 'Bắt đầu ngay'
                                                : 'Mở khóa level'}
                                        </Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </TouchableOpacity>
                        );
                    })
                )}
                <View style={{ height: 80 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    headerGradient: {
        paddingTop: Platform.OS === 'android' ? 50 : 60,
        paddingBottom: 35,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.35)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.4)',
    },
    streakText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 15,
    },
    headerContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    courseTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 0.5,
    },
    courseSubtitle: {
        fontSize: 17,
        color: '#fff',
        opacity: 0.95,
        marginTop: 8,
        fontWeight: '600',
    },
    earnTip: {
        fontSize: 15,
        color: '#FFD700',
        marginTop: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    content: { flex: 1 },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 20,
        marginBottom: 16,
        color: '#333',
    },

    levelCard: {
        marginHorizontal: 16,
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    currentLevelCard: {
        borderWidth: 2,
        borderColor: '#FFA500',
    },
    levelGradient: { padding: 20 },

    levelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    levelId: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFA500',
    },
    levelName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        flex: 1,
        marginLeft: 16,
    },
    progressCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFA500',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    levelDesc: {
        fontSize: 15,
        color: '#666',
        marginBottom: 20,
        lineHeight: 22,
    },

    skillsContainer: {
        marginBottom: 20,
    },
    skillItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    skillIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,165,0,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    skillName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        width: 90,
    },
    skillProgressBg: {
        flex: 1,
        height: 10,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        overflow: 'hidden',
        marginHorizontal: 12,
    },
    skillProgressFill: {
        height: '100%',
        backgroundColor: '#FFA500',
    },
    skillProgressText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFA500',
        minWidth: 40,
        textAlign: 'right',
    },

    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFA500',
        paddingVertical: 16,
        borderRadius: 30,
    },
    lockedButton: {
        backgroundColor: '#ccc',
    },
    startButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
});