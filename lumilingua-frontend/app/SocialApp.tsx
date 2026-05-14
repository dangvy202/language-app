import Notfound from '@/component/404';
import Loading from '@/component/loading';
import {
    getCrmsEndpoint,
    getCrmsImgEndpoint
} from '@/constants/configApi';
import { PostMention, PostResponse } from '@/interfaces/interfaces';
import { fetchInformation } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SocialScreen() {
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [content, setContent] = useState("");
    const [mentions, setMentions] = useState<PostMention[]>([]);
    const [posting, setPosting] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [expandedPosts, setExpandedPosts] = useState<number[]>([]);
    const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
    const [postComments, setPostComments] = useState<{
        [key: number]: PostResponse[];
    }>({});
    const [openCreatePost, setOpenCreatePost] = useState(false);
    const [mentionQuery, setMentionQuery] = useState("");
    const [suggestUsers, setSuggestUsers] = useState<any[]>([]);

    const fetchCommentsByPost = async (
        postId: number,
        page = 0,
        size = 3
    ) => {

        try {

            const token = await getValidToken();

            if (!token) return;

            const endpoint = getCrmsEndpoint(
                `v1/post/${postId}/comment?page=${page}&size=${size}`
            );

            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            setPostComments(prev => {

                const newComments = data.data || [];

                if (page === 0) {
                    return {
                        ...prev,
                        [postId]: newComments,
                    };
                }

                const oldComments = prev[postId] || [];
                const merged = [...oldComments];
                newComments.forEach((newItem: PostResponse) => {

                    const exists = merged.some(
                        item => item.idPost === newItem.idPost
                    );

                    if (!exists) {
                        merged.push(newItem);
                    }
                });

                return {
                    ...prev,
                    [postId]: merged,
                };
            });

        } catch (err) {

            console.log("FETCH COMMENT ERROR:", err);
        }
    };

    const reactPost = async (idPost: number) => {
        try {

            const token = await getValidToken();

            if (!token) return;

            const endpoint = getCrmsEndpoint("v1/react");

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    idPost,
                    idUser: currentUser?.idUser,
                }),
            });

            const data = await response.json();
            setPosts(prev =>
                prev.map(post => {

                    if (post.idPost !== idPost) {
                        return post;
                    }

                    const reacted = post.reacted;

                    return {
                        ...post,
                        reacted: !reacted,
                        totalReact: reacted
                            ? (post.totalReact || 1) - 1
                            : (post.totalReact || 0) + 1,
                    };
                })
            );

        } catch (err) {

            console.log("REACT ERROR:", err);
        }
    };

    const searchUsers = async (keyword: string) => {
        try {
            setMentionQuery(keyword);

            if (!keyword.trim()) {
                setSuggestUsers([]);
                return;
            }

            const token = await getValidToken();

            if (!token) return;

            const endpoint = getCrmsEndpoint(
                `v1/user/search?name=${keyword}`
            );

            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            setSuggestUsers(data.data || []);

        } catch (err) {

            console.log("SEARCH USER ERROR:", err);
        }
    };

    const handleShowMoreComments = async (
        postId: number,
        total: number
    ) => {

        const current =
            postComments[postId]?.length || 0;

        if (current >= total) {

            setPostComments(prev => ({
                ...prev,
                [postId]: prev[postId].slice(0, 3),
            }));

            return;
        }

        await fetchCommentsByPost(
            postId,
            Math.floor(current / 3),
            3
        );
    };

    /*
     * REFRESH TOKEN
     */
    const refreshTokenApi = async (refreshToken: string) => {

        const endpoint = getCrmsEndpoint("v1/user/refresh");

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                refreshToken
            }),
        });

        if (!response.ok) {
            throw new Error(
                "Refresh token failed"
            );
        }

        return await response.json();
    };

    /*
     * GET VALID TOKEN
     */
    const getValidToken = async () => {
        let token = await AsyncStorage.getItem("token");
        const expiredStr = await AsyncStorage.getItem("expired");
        const expired = expiredStr ? parseInt(expiredStr, 10) : null;

        /*
         * TOKEN EXPIRED
         */
        if (!(token && expired && Date.now() < expired)) {
            const refreshToken = await AsyncStorage.getItem("refreshToken");
            if (!refreshToken) {
                router.replace("/Login");
                return null;
            }
            try {
                const res = await refreshTokenApi(refreshToken);
                token = res.data.token;
                await AsyncStorage.setItem("token", token || "");
                await AsyncStorage.setItem("expired", String(res.data.expired || Date.now() + 900000));

            } catch (err) {
                await AsyncStorage.multiRemove(["token", "refreshToken", "expired"]);
                router.replace("/Login");
                return null;
            }
        }
        return token;
    };


    /*
     * CREATE POSTS
     */
    const addMention = (user: any) => {

        const exists = mentions.some(
            item => item.idUser === user.idUser
        );

        if (exists) return;

        setMentions(prev => [
            ...prev,
            {
                idUser: user.idUser,
                username: user.username,
            }
        ]);

        setMentionQuery("");
        setSuggestUsers([]);
    };

    const createPost = async () => {
        if (!content.trim()) return;

        try {
            setPosting(true);

            const token = await getValidToken();
            if (!token) return;

            const endpoint = getCrmsEndpoint("v1/post");

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    idUser: Number(await AsyncStorage.getItem("idUser")),
                    content,
                    postMentionRequests: mentions.map(item => ({
                        idUser: item.idUser
                    }))
                }),
            });

            const data = await response.json();
            const newPost = {
                ...data.data,
                username: currentUser?.username,
                avatar: currentUser?.avatar
                    ? currentUser.avatar.replace(
                        getCrmsImgEndpoint("avatars/"),
                        ""
                    )
                    : null,
                totalComment: 0,
                totalReact: 0,
                reacted: false,
                mentions: mentions,
            };

            setPosts(prev => [newPost, ...prev]);

            setContent("");
            setMentions([]);

        } catch (err) {
            console.log("CREATE POST ERROR:", err);
        } finally {
            setPosting(false);
        }
    };

    const createComment = async (idPost: number) => {
        try {

            const text = commentInputs[idPost];

            if (!text?.trim()) return;

            const token = await getValidToken();

            if (!token) return;

            const endpoint = getCrmsEndpoint("v1/post");

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    idUser: currentUser?.idUser,
                    content: text,
                    parentPostId: idPost,
                }),
            });

            const data = await response.json();

            const newComment = {
                ...data.data,
                username: currentUser?.username,
                avatar: currentUser?.avatar
                    ? currentUser.avatar.replace(
                        getCrmsImgEndpoint("avatars/"),
                        ""
                    )
                    : null,
            };

            // update comment list
            setPostComments(prev => ({
                ...prev,
                [idPost]: [
                    ...(prev[idPost] || []),
                    newComment,
                ],
            }));

            // update total comment
            setPosts(prev =>
                prev.map(post => {

                    if (post.idPost === idPost) {
                        return {
                            ...post,
                            totalComment:
                                (post.totalComment || 0) + 1,
                        };
                    }

                    return post;
                })
            );

            setCommentInputs(prev => ({
                ...prev,
                [idPost]: "",
            }));

        } catch (err) {
            console.log("CREATE COMMENT ERROR:", err);
        }
    };

    /*
     * FETCH POSTS
     */
    const fetchPosts = async () => {

        try {

            setLoading(true);

            const token = await getValidToken();

            if (!token) return;
            const idUser = await AsyncStorage.getItem("idUser");
            const endpoint = getCrmsEndpoint(`v1/post?page=0&size=10&currentUserId=${idUser}`);

            const response = await fetch(
                endpoint,
                {
                    method: "GET",
                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`,
                    },
                }
            );

            const text =
                await response.text();

            if (!text) {
                throw new Error(
                    "Empty response body"
                );
            }

            const data = JSON.parse(text);

            setPosts(data.data || []);
            console.log("CHECK POST RESPONSE: ", data.data)

        } catch (err) {

            console.log(
                "FETCH POST ERROR:",
                err
            );

        } finally {

            setLoading(false);

            setRefreshing(false);
        }
    };

    useEffect(() => {
        const loadUser = async () => {
            try {
                const email = await AsyncStorage.getItem("email");
                const idUser = await AsyncStorage.getItem("idUser");
                const username = await AsyncStorage.getItem("username");

                if (!email) return;

                const dataInformation = await fetchInformation({ query: email });

                setCurrentUser({
                    idUser: idUser ? Number(idUser) : null,
                    username: username || "",
                    avatar: dataInformation?.avatar
                        ? getCrmsImgEndpoint("avatars/") + dataInformation?.avatar
                        : null,
                });

            } catch (err) {
                console.log("loadUser error:", err);
            }
        };
        loadUser();
        fetchPosts();
    }, []);

    const onRefresh = useCallback(() => {

        setRefreshing(true);

        fetchPosts();

    }, []);

    /*
     * FORMAT TIME
     */
    const formatTime = (date: string) => {

        return new Date(date)
            .toLocaleString("vi-VN");
    };

    const toggleComments = async (postId: number) => {

        const isExpanded = expandedPosts.includes(postId);

        if (isExpanded) {

            setExpandedPosts(prev =>
                prev.filter(id => id !== postId)
            );

            return;
        }

        setExpandedPosts(prev => [
            ...prev,
            postId
        ]);

        // luôn reload page đầu khi mở lại
        await fetchCommentsByPost(postId, 0, 3);
    };

    /*
     * RENDER COMMENT
     */
    const renderComment = (
        comment: PostResponse
    ) => {

        return (
            <View
                key={comment.idPost}
                style={styles.commentCard}
            >

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >

                    <Image
                        source={{
                            uri: comment.avatar
                                ? getCrmsImgEndpoint(
                                    `avatars/${comment.avatar}`
                                )
                                : 'https://i.pravatar.cc/150?img=1'
                        }}
                        style={styles.commentAvatar}
                    />

                    <View
                        style={{
                            flex: 1
                        }}
                    >

                        <Text
                            style={styles.commentUsername}
                        >
                            {comment.username}
                        </Text>

                        <Text
                            style={styles.commentTime}
                        >
                            {formatTime(comment.createdAt)}
                        </Text>

                    </View>

                </View>

                <Text
                    style={styles.commentContent}
                >
                    {comment.content}
                </Text>

            </View>
        );
    };

    /*
     * RENDER POST
     */
    const renderPost = ({ item }: any) => {

        return (
            <View style={styles.postCard}>

                {/* HEADER */}

                <View style={styles.postHeader}>

                    <View style={styles.userRow}>

                        <Image
                            source={{
                                uri:
                                    item.avatar
                                        ? getCrmsImgEndpoint(
                                            `avatars/${item.avatar}`
                                        )
                                        : 'https://i.pravatar.cc/150?img=1'
                            }}
                            style={styles.avatar}
                        />

                        <View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >

                                <Text style={styles.userName}>
                                    {item.username || "Unknown"}
                                </Text>

                            </View>

                            <Text style={styles.time}>
                                {formatTime(item.createdAt)}
                            </Text>

                        </View>

                    </View>

                    <TouchableOpacity>

                        <Ionicons
                            name="ellipsis-horizontal"
                            size={22}
                            color="#666"
                        />

                    </TouchableOpacity>

                </View>

                {/* CONTENT */}

                <Text style={styles.content}>
                    {item.content}
                </Text>

                {/* TAGS */}

                {
                    item.mentions &&
                    item.mentions.length > 0 && (

                        <View style={styles.tagContainer}>

                            {
                                item.mentions.map(
                                    (
                                        tag: any,
                                        index: number
                                    ) => (

                                        <TouchableOpacity
                                            key={index}
                                            style={styles.tag}
                                        >

                                            <Text
                                                style={styles.tagText}
                                            >
                                                @{tag.username}
                                            </Text>

                                        </TouchableOpacity>
                                    )
                                )
                            }

                        </View>
                    )
                }

                {/* COMMENTS */}

                {/* COMMENT TOGGLE */}

                <TouchableOpacity
                    onPress={() => toggleComments(item.idPost)}
                    style={styles.showCommentBtn}
                >
                    <Text style={styles.showCommentText}>
                        {
                            expandedPosts.includes(item.idPost)
                                ? "Hide all comments"
                                : `View comments (${item.totalComment || 0})`
                        }
                    </Text>
                </TouchableOpacity>

                {/* COMMENT SECTION */}

                {
                    expandedPosts.includes(item.idPost) && (

                        <View style={{ marginTop: 16 }}>

                            {/* LIST COMMENT */}

                            {
                                postComments[item.idPost] &&
                                    postComments[item.idPost].length > 0 ? (

                                    <>
                                        {
                                            postComments[item.idPost]
                                                .map(renderComment)
                                        }

                                        {
                                            item.totalComment > 3 && (

                                                <TouchableOpacity
                                                    onPress={() =>
                                                        handleShowMoreComments(
                                                            item.idPost,
                                                            item.totalComment
                                                        )
                                                    }
                                                >

                                                    <Text style={styles.actionText}>
                                                        {
                                                            (postComments[item.idPost]?.length || 0)
                                                                >= item.totalComment

                                                                ? "Hide comments"

                                                                : "View more comments"
                                                        }
                                                    </Text>

                                                </TouchableOpacity>
                                            )
                                        }
                                    </>

                                ) : (
                                    <Text>No comments yet</Text>
                                )
                            }
                            {/* INPUT COMMENT */}

                            <View style={styles.commentInputRow}>

                                <TextInput
                                    placeholder="Write a comment..."
                                    value={commentInputs[item.idPost] || ""}
                                    onChangeText={(text) =>
                                        setCommentInputs(prev => ({
                                            ...prev,
                                            [item.idPost]: text,
                                        }))
                                    }
                                    style={styles.commentInput}
                                    placeholderTextColor="#999"
                                />

                                <TouchableOpacity
                                    style={styles.sendBtn}
                                    onPress={() => createComment(item.idPost)}
                                >
                                    <Ionicons
                                        name="send"
                                        size={20}
                                        color="#fff"
                                    />
                                </TouchableOpacity>

                            </View>

                        </View>
                    )
                }

                {/* ACTION */}

                <View style={styles.actionRow}>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => reactPost(item.idPost)}
                    >

                        <Ionicons
                            name={
                                item.reacted
                                    ? "heart"
                                    : "heart-outline"
                            }
                            size={22}
                            color="#ff5a5f"
                        />

                        <Text style={styles.actionText}>
                            {item.totalReact || 0}
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => toggleComments(item.idPost)}
                        style={styles.actionButton}
                    >

                        <Ionicons
                            name="chatbubble-outline"
                            size={22}
                            color="#666"
                        />

                        <Text style={styles.actionText}>
                            {item.totalComment || 0}
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                    >

                        <Ionicons
                            name="share-social-outline"
                            size={22}
                            color="#666"
                        />

                        <Text style={styles.actionText}>
                            Share
                        </Text>

                    </TouchableOpacity>

                </View>

            </View>
        );
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <View style={styles.container}>

            <FlatList
                data={posts}

                keyExtractor={(item, index) =>
                    (item.idPost ?? index).toString()
                }

                renderItem={renderPost}

                showsVerticalScrollIndicator={false}

                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#FB8500']}
                    />
                }

                ListEmptyComponent={
                    <Notfound />
                }

                ListHeaderComponent={

                    <LinearGradient
                        colors={[
                            '#FFB703',
                            '#FB8500'
                        ]}
                        style={styles.header}
                    >

                        <View style={styles.topBar}>

                            <View style={styles.leftHeader}>

                                <TouchableOpacity>

                                    <Ionicons
                                        name="menu"
                                        size={30}
                                        color="#fff"
                                    />

                                </TouchableOpacity>

                                <Text style={styles.headerTitle}>
                                    Community
                                </Text>

                            </View>

                            <TouchableOpacity>

                                <Ionicons
                                    name="notifications-outline"
                                    size={28}
                                    color="#fff"
                                />

                            </TouchableOpacity>

                        </View>
                        {/* CREATE POST FORM */}
                        <View style={styles.createBox}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setOpenCreatePost(true)}
                            >

                                {/* USER ROW */}
                                <View style={styles.userInputRow}>

                                    <Image
                                        source={
                                            currentUser?.avatar
                                                ? { uri: currentUser.avatar }
                                                : require('@/assets/images/accounts/logo.jpg')
                                        }
                                        style={styles.inputAvatar}
                                    />

                                    <Text style={styles.placeholderText}>
                                        What’s on your mind, {currentUser?.username || "user"}?
                                    </Text>

                                </View>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                }

                contentContainerStyle={{
                    paddingBottom: 120,
                }}
            />
            <Modal
                visible={openCreatePost}
                animationType="slide"
                transparent
            >

                <KeyboardAvoidingView
                    behavior={
                        Platform.OS === "ios"
                            ? "padding"
                            : undefined
                    }
                    style={styles.modalContainer}
                >

                    <View style={styles.modalContent}>

                        {/* HEADER */}
                        <View style={styles.modalHeader}>

                            <TouchableOpacity
                                onPress={() =>
                                    setOpenCreatePost(false)
                                }
                            >

                                <Ionicons
                                    name="close"
                                    size={28}
                                    color="#222"
                                />

                            </TouchableOpacity>

                            <Text style={styles.modalTitle}>
                                Create Post
                            </Text>

                            <TouchableOpacity
                                disabled={posting}
                                onPress={async () => {

                                    await createPost();

                                    setOpenCreatePost(false);
                                }}
                                style={styles.postBtn}
                            >

                                <Text style={styles.postNowText}>
                                    {
                                        posting
                                            ? "Posting..."
                                            : "Post"
                                    }
                                </Text>

                            </TouchableOpacity>

                        </View>

                        {/* USER */}
                        <View style={styles.userInputRow}>

                            <Image
                                source={
                                    currentUser?.avatar
                                        ? { uri: currentUser.avatar }
                                        : require('@/assets/images/accounts/logo.jpg')
                                }
                                style={styles.inputAvatar}
                            />

                            <Text style={styles.userName}>
                                {currentUser?.username}
                            </Text>

                        </View>

                        {/* CONTENT */}
                        <TextInput
                            value={content}
                            onChangeText={setContent}
                            placeholder="What's on your mind?"
                            placeholderTextColor="#999"
                            multiline
                            autoFocus
                            style={styles.modalInput}
                        />

                        {/* TAG */}
                        <View style={styles.tagInputRow}>

                            <TextInput
                                value={mentionQuery}
                                onChangeText={searchUsers}
                                placeholder="Tag username..."
                                placeholderTextColor="#999"
                                style={styles.tagInput}
                            />
                            {
                                suggestUsers.length > 0 && (
                                    <View style={styles.suggestBox}>

                                        {
                                            suggestUsers.map((user, index) => (

                                                <TouchableOpacity
                                                    key={index}
                                                    style={styles.suggestItem}
                                                    onPress={() => addMention(user)}
                                                >

                                                    <Image
                                                        source={{
                                                            uri: user.avatar
                                                                ? getCrmsImgEndpoint(
                                                                    `avatars/${user.avatar}`
                                                                )
                                                                : 'https://i.pravatar.cc/150?img=1'
                                                        }}
                                                        style={styles.suggestAvatar}
                                                    />

                                                    <View>
                                                        <Text style={styles.suggestName}>
                                                            {user.username}
                                                        </Text>

                                                        <Text style={styles.suggestEmail}>
                                                            {user.email}
                                                        </Text>
                                                    </View>

                                                </TouchableOpacity>
                                            ))
                                        }

                                    </View>
                                )
                            }
                        </View>

                        {/* TAG PREVIEW */}
                        {
                            mentions.length > 0 && (

                                <View style={styles.tagPreview}>

                                    {
                                        mentions.map((tag, index) => (

                                            <TouchableOpacity
                                                key={index}
                                                style={styles.tag}
                                                onPress={() =>
                                                    setMentions(prev =>
                                                        prev.filter(
                                                            item => item.idUser !== tag.idUser
                                                        )
                                                    )
                                                }
                                            >

                                                <Text style={styles.tagText}>
                                                    @{tag.username} ✕
                                                </Text>

                                            </TouchableOpacity>
                                        ))
                                    }

                                </View>
                            )
                        }

                    </View>

                </KeyboardAvoidingView>

            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },

    header: {
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 20,
        marginBottom: 20
    },

    postCard: {
        backgroundColor: '#fff',

        padding: 18,

        marginBottom: 10,

        shadowColor: '#000',

        shadowOffset: {
            width: 0,
            height: 4,
        },

        shadowOpacity: 0.06,

        shadowRadius: 10,

        elevation: 3,
    },

    postHeader: {
        flexDirection: 'row',

        justifyContent: 'space-between',

        alignItems: 'center',
    },

    userRow: {
        flexDirection: 'row',

        alignItems: 'center',
    },

    avatar: {
        width: 55,

        height: 55,

        borderRadius: 30,

        marginRight: 12,
    },

    userName: {
        fontSize: 17,

        fontWeight: '800',

        color: '#222',
    },

    time: {
        color: '#999',

        marginTop: 2,
    },

    content: {
        marginTop: 16,

        fontSize: 16,

        color: '#333',

        lineHeight: 25,
    },

    tagContainer: {
        flexDirection: 'row',

        marginTop: 14,

        flexWrap: 'wrap',
    },

    tag: {
        backgroundColor: '#FFF3E0',

        paddingHorizontal: 12,

        paddingVertical: 7,

        borderRadius: 20,

        marginRight: 10,

        marginBottom: 10,
    },

    tagText: {
        color: '#FB8500',

        fontWeight: '700',
    },

    actionRow: {
        flexDirection: 'row',

        justifyContent: 'space-around',

        marginTop: 18,

        borderTopWidth: 1,

        borderTopColor: '#eee',

        paddingTop: 14,
    },

    actionButton: {
        flexDirection: 'row',

        alignItems: 'center',
    },

    actionText: {
        marginLeft: 7,

        fontWeight: '600',

        color: '#444',
    },

    topBar: {
        flexDirection: 'row',

        justifyContent: 'space-between',

        alignItems: 'center',
    },

    leftHeader: {
        flexDirection: 'row',

        alignItems: 'center',
    },

    headerTitle: {
        color: '#fff',

        fontSize: 28,

        fontWeight: '800',

        marginLeft: 14,
    },

    commentCard: {
        backgroundColor: "#f7f7f7",

        borderRadius: 16,

        padding: 12,

        marginBottom: 10,
    },

    commentAvatar: {
        width: 42,

        height: 42,

        borderRadius: 21,

        marginRight: 10,
    },

    commentUsername: {
        fontWeight: "700",

        color: "#222",
    },

    commentTime: {
        color: "#999",

        fontSize: 12,

        marginTop: 2,
    },

    commentContent: {
        marginTop: 10,

        color: "#333",

        lineHeight: 22,
    },
    createBox: {
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 14,
        marginTop: 10,
        marginBottom: 10,
        elevation: 3,
    },

    tagInputRow: {
        flexDirection: "row",
        marginTop: 10,
    },

    tagInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
    },

    tagPreview: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
    },

    postBtn: {
        backgroundColor: "#FB8500",
        padding: 12,
        borderRadius: 12,
        alignItems: "center",
        textAlign: "right"
    },
    userInputRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    inputAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },

    placeholderText: {
        color: "#666",
        fontSize: 14,
    },
    showCommentBtn: {
        marginTop: 14,
    },

    showCommentText: {
        color: "#FB8500",
        fontWeight: "700",
    },

    commentInputRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 14,
    },

    commentInput: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 14,
        color: "#222",
    },

    sendBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#FB8500",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
    },

    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 50,
        minHeight: "105%",
    },

    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#222",
    },
    postNowText: {
        color: "#ffffff",
        fontWeight: "800",
        fontSize: 16,
    },
    modalInput: {
        minHeight: 180,
        fontSize: 18,
        color: "#222",
        marginTop: 20,
        textAlignVertical: "top",
    },
    suggestBox: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#eee",
        overflow: "hidden",
    },

    suggestItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
    },

    suggestAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        marginRight: 10,
    },

    suggestName: {
        fontWeight: "700",
        color: "#222",
    },

    suggestEmail: {
        color: "#888",
        marginTop: 2,
        fontSize: 12,
    },
});