import React, {
    useRef,
    useState,
    useEffect
} from "react";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput
} from "react-native";

import {
    Audio
} from "expo-av";

import {
    Ionicons
} from "@expo/vector-icons";


const MOCK_DATA = {

    title: "Listening Practice 01",

    instruction:
        "Listen carefully and answer all the questions.",


    audio:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",


    transcript:
        `
Hello everyone.
Today we are discussing how technology affects education.

Students can now access online courses from anywhere.

However, traditional classrooms are still important.
        `,


    questions: [

        {
            id: 1,

            question:
                "What is the main topic of the recording?",

            options: [
                "Technology and Education",
                "Sports",
                "Cooking",
                "Travel"
            ],

            answer:
                "Technology and Education",

            explain:
                "The speaker talks about the relationship between technology and education."
        },


        {
            id: 2,

            question:
                "Students can access ______ courses.",

            answer:
                "online",

            explain:
                "The speaker mentions online courses."
        },


        {
            id: 3,

            question:
                "What do some people still value?",

            options: [
                "Traditional classrooms",
                "Libraries",
                "Exams",
                "Homework"
            ],

            answer:
                "Traditional classrooms",

            explain:
                "Some people believe traditional classrooms remain important."
        }

    ]

};



export default function ListeningExamScreen() {
    const sound = useRef<Audio.Sound | null>(null);
    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [answers, setAnswers] = useState<any>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showTranscript, setShowTranscript] = useState(false);

    useEffect(() => {
        loadAudio();
        return () => {
            if (sound.current)
                sound.current.unloadAsync();
        }
    }, []);

    async function loadAudio() {
        const { sound: audio } = await Audio.Sound.createAsync(
            {
                uri: MOCK_DATA.audio
            },
            {
                shouldPlay: false
            },
            onPlaybackStatusUpdate
        );
        sound.current = audio;
    }

    function onPlaybackStatusUpdate(status: any) {
        if (!status.isLoaded)
            return;
        setDuration(
            status.durationMillis || 0
        );

        setPosition(
            status.positionMillis || 0
        );

        setPlaying(
            status.isPlaying
        );
    }

    async function togglePlay() {
        if (!sound.current)
            return;

        if (playing) {
            await sound.current.pauseAsync();
        }
        else {
            await sound.current.playAsync();
        }
    }

    async function seek(sec: number) {
        if (!sound.current)
            return;

        let newPos = position + sec * 1000;

        if (newPos < 0)
            newPos = 0;

        if (newPos > duration)
            newPos = duration;

        await sound.current.setPositionAsync(
            newPos
        );
    }

    function format(ms: number) {
        let sec = Math.floor(ms / 1000);
        let m = Math.floor(sec / 60);
        let s = sec % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    }

    function choose(
        id: number,
        value: string
    ) {

        if (submitted)
            return;

        setAnswers({
            ...answers,
            [id]: value
        });
    }

    function check(q: any) {

        return (
            answers[q.id]
                ?.trim()
                ?.toLowerCase()
            ===
            q.answer
                .toLowerCase()
        );
    }

    function submit() {
        let total = 0;
        MOCK_DATA.questions.forEach(q => {

            if (check(q))
                total++;

        });
        setScore(total);
        setSubmitted(true);
    }

    return (
        <View style={styles.container}>


            <ScrollView
                contentContainerStyle={styles.content}
            >



                <Text style={styles.title}>
                    {MOCK_DATA.title}
                </Text>



                {/* AUDIO PLAYER */}

                <View style={styles.audioCard}>


                    <Text style={styles.audioTitle}>
                        🎧 Audio Player
                    </Text>



                    <View style={styles.wave}>

                        {
                            Array.from({ length: 40 })
                                .map((_, i) => (

                                    <View
                                        key={i}
                                        style={{
                                            height:
                                                Math.random() * 35 + 10,
                                            width: 3,
                                            backgroundColor:
                                                i * 100 < position / duration * 4000
                                                    ?
                                                    "#FF6B00"
                                                    :
                                                    "#CBD5E1"
                                        }}
                                    />

                                ))
                        }

                    </View>




                    <View style={styles.slider}>


                        <View
                            style={{
                                width:
                                    `${duration ?
                                        position / duration * 100 : 0}%`,
                                height: 5,
                                backgroundColor: "#FF6B00"
                            }}
                        />


                    </View>




                    <View style={styles.playerRow}>


                        <Text>
                            {format(position)}
                            /
                            {format(duration)}
                        </Text>



                        <TouchableOpacity
                            onPress={() => seek(-5)}
                        >

                            <Ionicons
                                name="refresh"
                                size={28}
                            />

                        </TouchableOpacity>




                        <TouchableOpacity
                            style={styles.play}
                            onPress={togglePlay}
                        >

                            <Ionicons

                                name={
                                    playing ?
                                        "pause" :
                                        "play"
                                }

                                size={30}
                                color="white"
                            />


                        </TouchableOpacity>



                        <TouchableOpacity
                            onPress={() => seek(5)}
                        >

                            <Ionicons
                                name="refresh"
                                size={28}
                            />

                        </TouchableOpacity>



                        <TouchableOpacity
                            onPress={() => {

                                let next =
                                    speed === 1 ?
                                        1.5 :
                                        1;

                                setSpeed(next);


                                sound.current?.setRateAsync(
                                    next,
                                    true
                                );


                            }}
                            style={styles.speed}
                        >


                            <Text>
                                ⚡ Speed {speed}x
                            </Text>


                        </TouchableOpacity>


                    </View>


                </View>





                <TouchableOpacity
                    style={styles.transcriptBtn}
                    onPress={() =>
                        setShowTranscript(!showTranscript)
                    }
                >

                    <Text>
                        📄 Transcript
                    </Text>

                </TouchableOpacity>



                {
                    showTranscript &&

                    <View style={styles.transcript}>

                        <Text>
                            {MOCK_DATA.transcript}
                        </Text>

                    </View>

                }





                {
                    MOCK_DATA.questions.map(q => (


                        <View
                            key={q.id}
                            style={styles.questionCard}
                        >



                            <Text style={styles.question}>
                                {q.id}. {q.question}
                            </Text>



                            {
                                q.options ?

                                    q.options.map(op => (

                                        <TouchableOpacity
                                            key={op}
                                            onPress={() =>
                                                choose(q.id, op)
                                            }

                                            style={[
                                                styles.option,

                                                answers[q.id] === op &&
                                                styles.selected,

                                                submitted &&
                                                op === q.answer &&
                                                styles.correct,


                                                submitted &&
                                                answers[q.id] === op &&
                                                op !== q.answer &&
                                                styles.wrong

                                            ]}

                                        >

                                            <Text>
                                                {op}
                                            </Text>


                                        </TouchableOpacity>


                                    ))

                                    :

                                    <TextInput

                                        placeholder="Your answer..."

                                        style={styles.input}

                                        value={
                                            answers[q.id] || ""
                                        }

                                        onChangeText={(t) =>
                                            choose(q.id, t)
                                        }

                                    />

                            }




                            {
                                submitted &&

                                <View style={styles.explain}>

                                    <Text>

                                        {
                                            check(q)
                                                ?
                                                "✅ Correct"
                                                :
                                                `❌ Answer: ${q.answer}`
                                        }

                                    </Text>


                                    <Text>
                                        {q.explain}
                                    </Text>


                                </View>


                            }



                        </View>


                    ))

                }



            </ScrollView>




            <View style={styles.footer}>


                <TouchableOpacity
                    style={styles.submit}
                    onPress={submit}
                >

                    <Text style={styles.btnText}>
                        {
                            submitted ?
                                `Score ${score}/${MOCK_DATA.questions.length}`
                                :
                                "Submit"
                        }
                    </Text>


                </TouchableOpacity>



            </View>


        </View>


    )

}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F8FAFC"
    },

    content: {
        padding: 16,
        paddingBottom: 100
    },

    title: {
        fontSize: 26,
        fontWeight: "800",
        marginBottom: 20
    },


    audioCard: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 24,
        marginBottom: 15
    },


    audioTitle: {
        fontSize: 18,
        fontWeight: "700"
    },


    wave: {
        height: 80,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginVertical: 20
    },


    slider: {
        height: 5,
        backgroundColor: "#E5E7EB"
    },


    playerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20
    },


    play: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#FF6B00",
        alignItems: "center",
        justifyContent: "center"
    },


    speed: {
        padding: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ddd"
    },


    transcriptBtn: {
        padding: 15,
        backgroundColor: "#FFF7ED",
        borderRadius: 15
    },


    transcript: {
        marginTop: 10,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 15
    },


    questionCard: {
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 20,
        marginTop: 15
    },


    question: {
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 15
    },


    option: {
        padding: 15,
        backgroundColor: "#F1F5F9",
        borderRadius: 14,
        marginBottom: 10
    },


    selected: {
        borderWidth: 2,
        borderColor: "#FF6B00"
    },


    correct: {
        backgroundColor: "#DCFCE7"
    },


    wrong: {
        backgroundColor: "#FEE2E2"
    },


    input: {
        borderWidth: 1,
        borderColor: "#CBD5E1",
        padding: 15,
        borderRadius: 12
    },


    explain: {
        marginTop: 10,
        backgroundColor: "#FFF7ED",
        padding: 12,
        borderRadius: 12
    },


    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: "#fff"
    },


    submit: {
        backgroundColor: "#FF6B00",
        padding: 18,
        borderRadius: 18,
        alignItems: "center"
    },


    btnText: {
        color: "#fff",
        fontWeight: "800"
    }


});