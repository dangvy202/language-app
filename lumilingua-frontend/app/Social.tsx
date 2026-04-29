import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type WordItem = {
  word: string;
  meaning: string;
  example: string;
};

const sampleWords: WordItem[] = [
  { word: "APPLE", meaning: "Quả táo", example: "I eat an apple every day." },
  { word: "BANANA", meaning: "Quả chuối", example: "She likes banana smoothies." },
  { word: "ELEPHANT", meaning: "Con voi", example: "The elephant is very big." },
  { word: "COMPUTER", meaning: "Máy tính", example: "My computer is very fast." },
];

export default function WordScrambleGame() {
  const [currentWordItem, setCurrentWordItem] = useState<WordItem>(sampleWords[0]);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Xáo trộn chữ cái
  const scrambleWord = (word: string) => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters;
  };

  useEffect(() => {
    const letters = scrambleWord(currentWordItem.word);
    setScrambledLetters(letters);
    setUserAnswer([]);
    setHintsUsed(0);
  }, [currentWordItem]);

  const selectLetter = (letter: string, index: number) => {
    if (userAnswer.length >= currentWordItem.word.length) return;
    
    setUserAnswer([...userAnswer, letter]);
    // Xóa chữ cái đã chọn khỏi scrambled
    const newScrambled = [...scrambledLetters];
    newScrambled.splice(index, 1);
    setScrambledLetters(newScrambled);
  };

  const removeLastLetter = () => {
    if (userAnswer.length === 0) return;
    
    const lastLetter = userAnswer[userAnswer.length - 1];
    setUserAnswer(userAnswer.slice(0, -1));
    setScrambledLetters([...scrambledLetters, lastLetter]);
  };

  const checkAnswer = () => {
    const answer = userAnswer.join('');
    if (answer === currentWordItem.word) {
      Alert.alert("🎉 Chính xác!", 
        `${currentWordItem.word} - ${currentWordItem.meaning}\n\n${currentWordItem.example}`);
      setScore(score + 10 + (3 - hintsUsed) * 5); // thưởng thêm nếu ít dùng hint
      nextWord();
    } else {
      Alert.alert("❌ Sai rồi", "Hãy thử lại nhé!");
    }
  };

  const nextWord = () => {
    const randomIndex = Math.floor(Math.random() * sampleWords.length);
    setCurrentWordItem(sampleWords[randomIndex]);
  };

  const useHint = () => {
    if (hintsUsed >= 3) return;
    setHintsUsed(hintsUsed + 1);
    Alert.alert("💡 Gợi ý", `Từ này có ${currentWordItem.word.length} chữ cái`);
  };

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <Text className="text-2xl font-bold text-center mb-8">Ghép Chữ Thành Từ</Text>

      {/* Điểm số */}
      <Text className="text-right text-lg font-semibold text-orange-600 mb-6">
        Điểm: {score}
      </Text>

      {/* Từ đã ghép */}
      <View className="bg-white rounded-2xl p-6 mb-8 min-h-[80px] flex-row flex-wrap justify-center gap-2 border-2 border-dashed border-orange-200">
        {userAnswer.map((letter, idx) => (
          <Text key={idx} className="text-4xl font-bold text-[#2E2A47] bg-orange-100 px-4 py-2 rounded-xl">
            {letter}
          </Text>
        ))}
        {userAnswer.length === 0 && (
          <Text className="text-gray-400 text-lg italic">Ghép chữ vào đây...</Text>
        )}
      </View>

      {/* Chữ cái xáo trộn */}
      <Text className="text-sm text-gray-500 mb-3">Chọn chữ cái:</Text>
      <View className="flex-row flex-wrap justify-center gap-3 mb-10">
        {scrambledLetters.map((letter, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => selectLetter(letter, index)}
            className="w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-sm active:bg-orange-100"
          >
            <Text className="text-3xl font-bold text-[#FF9500]">{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Nút chức năng */}
      <View className="flex-row gap-4">
        <TouchableOpacity 
          onPress={removeLastLetter}
          className="flex-1 bg-gray-200 py-4 rounded-2xl items-center"
        >
          <Ionicons name="arrow-undo" size={24} color="#666" />
          <Text className="text-gray-600 mt-1">Xóa</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={useHint}
          disabled={hintsUsed >= 3}
          className="flex-1 bg-yellow-100 py-4 rounded-2xl items-center"
        >
          <Ionicons name="bulb" size={24} color="#EAB308" />
          <Text className="text-yellow-700 mt-1">Gợi ý ({3 - hintsUsed})</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={checkAnswer}
          disabled={userAnswer.length !== currentWordItem.word.length}
          className={`flex-1 py-4 rounded-2xl items-center ${userAnswer.length === currentWordItem.word.length ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <Text className={`font-bold text-lg ${userAnswer.length === currentWordItem.word.length ? 'text-white' : 'text-gray-500'}`}>
            Kiểm tra
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}