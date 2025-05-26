import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WallpaperContext } from './WallpaperContext';
import { saveGameResult } from './storage';
import MessageModal from './MessageModal';
import { DifficultyContext } from './DifficultyContext';

const MathItOut = () => {
  const navigation = useNavigation();
  const [question, setQuestion] = useState({ num1: 0, num2: 0, operation: '+', answer: 0 });
  const [userInput, setUserInput] = useState('');
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const { selectedWallpaper } = useContext(WallpaperContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const { selectedDifficulty, updateUnlockedDifficulty, unlockedDifficulty } = useContext(DifficultyContext);
  const [gameResults, setGameResults] = useState(null);

  useEffect(() => {
    generateQuestion();
    setStartTime(Date.now());
  }, []);

  const getQuestionParams = () => {
    switch (selectedDifficulty) {
      case 'Easy':
        return { maxNum: 10, maxAnswer: 20 };
      case 'Medium':
        return { maxNum: 20, maxAnswer: 50 };
      case 'Hard':
        return { maxNum: 50, maxAnswer: 100 };
      default:
        return { maxNum: 10, maxAnswer: 20 };
    }
  };

  const generateQuestion = () => {
    const { maxNum, maxAnswer } = getQuestionParams();
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * 4)];
    let num1, num2, answer;

    if (operation === '*') {
      num1 = Math.floor(Math.random() * maxNum);
      num2 = Math.floor(Math.random() * maxNum);
      answer = num1 * num2;
      if (answer > maxAnswer) {
        num2 = Math.floor(maxAnswer / num1) || 1;
        answer = num1 * num2;
      }
    } else if (operation === '/') {
      num2 = Math.floor(Math.random() * (maxNum - 1)) + 1;
      answer = Math.floor(Math.random() * maxNum);
      num1 = num2 * answer;
      if (num1 > maxAnswer) {
        answer = Math.floor(maxAnswer / num2) || 1;
        num1 = num2 * answer;
      }
    } else if (operation === '-') {
      num2 = Math.floor(Math.random() * maxNum);
      num1 = Math.floor(Math.random() * (maxNum - num2 + 1)) + num2;
      answer = num1 - num2;
    } else {
      num1 = Math.floor(Math.random() * maxNum);
      num2 = Math.floor(Math.random() * maxNum);
      answer = num1 + num2;
      if (answer > maxAnswer) {
        num2 = maxAnswer - num1;
        answer = num1 + num2;
      }
    }
    setQuestion({ num1, num2, operation, answer });
    setUserInput('');
    setIsIncorrect(false);
  };

  const handleNumberPress = (number) => {
    const newInput = userInput + number;
    setUserInput(newInput);
    const expectedLength = String(question.answer).length;
    if (newInput.length === expectedLength) handleSubmit(newInput);
  };

  const handleClear = () => {
    setUserInput('');
    setIsIncorrect(false);
  };

  const handleSubmit = async (input) => {
    const userAnswer = parseInt(input, 10);
    if (userAnswer === question.answer) {
      const newCorrectCount = correctCount + 1;
      setCorrectCount(newCorrectCount);
      if (newCorrectCount >= 20) {
        const endTime = Date.now();
        const timeTaken = (endTime - startTime) / 1000;
        const score = Math.round(timeTaken * (errorCount + 1));
        const gameResult = {
          gameType: `Math It Out (${selectedDifficulty})`,
          timeTaken,
          errors: errorCount,
          correctAnswers: 20,
          score,
          timestamp: Date.now(),
        };
        await saveGameResult(gameResult);

        setCorrectCount(0);
        setErrorCount(0);
        setStartTime(null);

        const difficultyLevelsOrder = ['Easy', 'Medium', 'Hard'];
        const currentIndex = difficultyLevelsOrder.indexOf(selectedDifficulty);
        const nextDifficulty = difficultyLevelsOrder[currentIndex + 1];
        const highestUnlockedIndex = difficultyLevelsOrder.indexOf(unlockedDifficulty);

        if (nextDifficulty && currentIndex >= highestUnlockedIndex) {
          setModalMessage(`You unlocked ${nextDifficulty} difficulty!`);
          await updateUnlockedDifficulty(nextDifficulty);
        } else {
          setModalMessage('Congratulations!');
        }
        setGameResults({ timeTaken, errors: errorCount, correctAnswers: 20, score });
        setModalVisible(true);
      } else {
        setTimeout(generateQuestion, 0);
      }
    } else {
      setErrorCount(errorCount + 1);
      setIsIncorrect(true);
      setTimeout(() => setIsIncorrect(false), 1000);
      setUserInput('');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (gameResults) {
      navigation.navigate('Results', gameResults);
      setGameResults(null);
      setCorrectCount(0);
      setErrorCount(0);
      setStartTime(Date.now());
    }
  };

  const { width } = Dimensions.get('window');
  const buttonSize = width * 0.18;

  return (
    <View style={[styles.container, selectedWallpaper]}>
      <Text style={[styles.question, isIncorrect && styles.incorrect]}>
        {question.num1} {question.operation === '*' ? 'x' : question.operation} {question.num2}
      </Text>
      <Text style={styles.input}>{userInput || ' '}</Text>
      <Text style={styles.counter}>Correct: {correctCount}/20</Text>
      <View style={styles.buttonGrid}>
        <View style={styles.buttonRow}>
          {[1, 2, 3].map(num => (
            <TouchableOpacity key={num} style={styles.numberButton} onPress={() => handleNumberPress(num.toString())}>
              <Text style={styles.buttonText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.buttonRow}>
          {[4, 5, 6].map(num => (
            <TouchableOpacity key={num} style={styles.numberButton} onPress={() => handleNumberPress(num.toString())}>
              <Text style={styles.buttonText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.buttonRow}>
          {[7, 8, 9].map(num => (
            <TouchableOpacity key={num} style={styles.numberButton} onPress={() => handleNumberPress(num.toString())}>
              <Text style={styles.buttonText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.buttonRow}>
          <View style={{ width: buttonSize, height: buttonSize }} />
          <TouchableOpacity style={styles.numberButton} onPress={() => handleNumberPress('0')}>
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>
          <View style={{ width: buttonSize, height: buttonSize }} />
        </View>
        <TouchableOpacity style={[styles.clearButton, { width: buttonSize * 3 + 20 }]} onPress={handleClear}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
      <MessageModal visible={modalVisible} message={modalMessage} onClose={handleModalClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: '#f5f5f5', padding: Dimensions.get('window').width * 0.03 },
  question: { fontSize: Dimensions.get('window').width * 0.09, fontWeight: 'bold', marginBottom: 20 },
  incorrect: { color: 'red' },
  input: { fontSize: Dimensions.get('window').width * 0.07, borderWidth: 1, borderColor: '#ccc', padding: 10, width: Dimensions.get('window').width * 0.4, textAlign: 'center', marginBottom: 20, backgroundColor: '#fff', borderRadius: 5 },
  counter: { fontSize: Dimensions.get('window').width * 0.05, color: '#333', marginBottom: 20 },
  buttonGrid: { alignItems: 'center' },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  numberButton: { width: Dimensions.get('window').width * 0.18, height: Dimensions.get('window').width * 0.18, backgroundColor: '#007AFF', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 },
  clearButton: { height: Dimensions.get('window').width * 0.18, backgroundColor: '#FF5733', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 5 },
  submitButton: { height: Dimensions.get('window').width * 0.18, backgroundColor: '#28A745', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 5 },
  backButton: { marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#007AFF', borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: Dimensions.get('window').width * 0.06 },
});

export default MathItOut;