import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import Loading from "@/component/loading";

type TranslationResult = {
    original: string;
    translated: string;
};

export default function DictionaryScreen() {
    const [word, setWord] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TranslationResult | null>(null);
    const [error, setError] = useState("");

    const translateWord = async () => {
        if (!word.trim()) return;

        try {
            setLoading(true);
            setError("");

            // Detect Vietnamese text
            const isVietnamese =
                /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(
                    word
                );

            const fromLang = isVietnamese ? "vi" : "en";
            const toLang = isVietnamese ? "en" : "vi";

            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${word}&langpair=${fromLang}|${toLang}`
            );

            const data = await response.json();

            const bestMatch =
            data.responseData?.translatedText ||
            data.matches?.[1]?.translation ||
            "";
            setResult({
                original: word,
                translated: bestMatch,
            });
        } catch (err) {
            setError("Failed to translate word");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Dictionary",
                    headerTintColor: "black",
                    headerTitleStyle: {
                        fontWeight: "bold",
                        fontSize: 20,
                    },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons
                                name="arrow-back"
                                size={28}
                                color="black"
                                style={{ marginLeft: 10 }}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />

            <SafeAreaView style={styles.container}>

                {/* Search Box */}
                <View style={styles.searchContainer}>
                    <Ionicons
                        name="search-outline"
                        size={22}
                        color="#888"
                    />

                    <TextInput
                        placeholder="Search word..."
                        value={word}
                        onChangeText={(text) => {
                            setWord(text);
                            setResult(null);
                        }}
                        style={styles.input}
                        placeholderTextColor="#999"
                        onSubmitEditing={translateWord}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={translateWord}
                    >
                        <Ionicons
                            name="arrow-forward-outline"
                            size={22}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>

                {/* Loading */}
                {loading && (
                    <Loading />
                )}

                {/* Error */}
                {!!error && (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>
                            {error}
                        </Text>
                    </View>
                )}

                {/* Result */}
                {result && !loading && (
                    <View style={styles.resultCard}>
                        <View style={styles.wordRow}>

                            <Text style={styles.word}>
                                {result.original}
                            </Text>
                        </View>

                        <Text style={styles.label}>
                            Translation
                        </Text>

                        <Text style={styles.translation}>
                            {result.translated}
                        </Text>
                    </View>
                )}

                {/* Empty State */}
                {!result && !loading && (
                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name="reader-outline"
                            size={90}
                            color="#D1D5DB"
                        />

                        <Text style={styles.emptyTitle}>
                            Search Any Word
                        </Text>

                        <Text style={styles.emptySubtitle}>
                            Auto detect English ↔ Vietnamese
                        </Text>
                    </View>
                )}
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FB",
        paddingHorizontal: 20,
        paddingTop: 10,
    },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 18,
        paddingHorizontal: 15,
        height: 65,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowRadius: 8,
        elevation: 4,
        marginTop: 20,
    },

    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: "#111827",
    },

    button: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: "#FFA500",
        justifyContent: "center",
        alignItems: "center",
    },

    centerContainer: {
        marginTop: 40,
        alignItems: "center",
    },

    resultCard: {
        backgroundColor: "white",
        borderRadius: 24,
        padding: 24,
        marginTop: 30,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowRadius: 10,
        elevation: 5,
    },

    wordRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },

    word: {
        fontSize: 30,
        fontWeight: "700",
        color: "#111827",
        marginLeft: 10,
    },

    label: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 10,
    },

    translation: {
        fontSize: 24,
        fontWeight: "600",
        color: "#FFA500",
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 100,
    },

    emptyTitle: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: "700",
        color: "#111827",
    },

    emptySubtitle: {
        marginTop: 10,
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center",
        paddingHorizontal: 30,
    },

    errorBox: {
        marginTop: 20,
        backgroundColor: "#FEE2E2",
        padding: 15,
        borderRadius: 12,
    },

    errorText: {
        color: "#DC2626",
        fontWeight: "600",
    },
});