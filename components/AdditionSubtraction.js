import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WallpaperContext } from './WallpaperContext';
import { Platform } from 'react-native';
import { saveGameResult } from './storage'; // Import the saveGameResult function

const AdditionSubtraction = () => {
  const navigation = useNavigation();
  const [question, setQuestion] = useState({ num1: 0, num2: 0, operation: '+', answer: 0 });
  const [userInput, setUserInput] = useState('');
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0); // State to track errors
  const [startTime, setStartTime] = useState(null); // State to track start time
  const { selectedWallpaper } = useContext(WallpaperContext);

  useEffect(() => {
    generateQuestion();
    setStartTime(Date.now()); // Set start time when the component mounts
  }, []);

  const generateQuestion = () => {
    const num2 = Math.floor(Math.random() * 10);
    const operation = Math.random() > 0.5 ? '+' : '-';
    const num1 = operation === '+'
      ? Math.floor(Math.random() * 10)
      : Math.floor(Math.random() * (10 - num2 + 1)) + num2;
    const answer = operation === '+' ? num1 + num2 : num1 - num2;
    setQuestion({ num1, num2, operation, answer });
    setUserInput('');
    setIsIncorrect(false);
  };

  const handleNumberPress = (number) => {
    const newInput = userInput + number;
    setUserInput(newInput);
    const expectedLength = question.answer < 10 ? 1 : 2;
    if (newInput.length === expectedLength) {
      handleSubmit(newInput);
    }
  };

  const handleClear = () => {
    setUserInput('');
    setIsIncorrect(false);
  };

  const handleSubmit = (input) => {
    const userAnswer = parseInt(input, 10);
    if (userAnswer === question.answer) {
      const newCorrectCount = correctCount + 1;
      setCorrectCount(newCorrectCount);
      if (newCorrectCount >= 20) {
        const endTime = Date.now();
        const timeTaken = (endTime - startTime) / 1000; // Time taken in seconds
        const score = Math.round(timeTaken * (errorCount + 1)); // Calculate score
        const gameResult = { // Create an object to store the result
          gameType: 'Addition/Subtraction', // Identify the game type
          timeTaken: timeTaken,
          errors: errorCount,
          correctAnswers: 20,
          score: score,
          timestamp: Date.now(), // Add a timestamp
        };
        saveGameResult(gameResult); // Save the result to local storage

        setCorrectCount(0); // Reset counter
        setErrorCount(0); // Reset error count
        setStartTime(null); // Reset start time

        navigation.navigate('Results', { timeTaken, errors: errorCount, correctAnswers: 20, score }); // Pass score to ResultsScreen
      } else {
        setTimeout(generateQuestion, 0);
      }
    } else {
      setErrorCount(errorCount + 1); // Increment error count
      setIsIncorrect(true);
      setTimeout(() => setIsIncorrect(false), 1000);
      setUserInput('');
    }
  };

  const { width } = Dimensions.get('window');
  const buttonSize = width * 0.18;

  return (
    <View style={[styles.container, selectedWallpaper]}>
      <Text style={[styles.question, isIncorrect && styles.incorrect]}>
        {question.num1} {question.operation} {question.num2}
      </Text>
      <Text style={styles.input}>{userInput || ' '}</Text>
      <Text style={styles.counter}>Correct: {correctCount}/20</Text>
      <View style={styles.buttonGrid}>
        {/* Row 1: 1, 2, 3 */}
        <View style={styles.buttonRow}>
          {['1', '2', '3'].map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.numberButton}
              onPress={() => handleNumberPress(num)}
            >
              <Text style={styles.buttonText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Row 2: 4, 5, 6 */}
        <View style={styles.buttonRow}>
          {['4', '5', '6'].map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.numberButton}
              onPress={() => handleNumberPress(num)}
            >
              <Text style={styles.buttonText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Row 3: 7, 8, 9 */}
        <View style={styles.buttonRow}>
          {['7', '8', '9'].map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.numberButton}
              onPress={() => handleNumberPress(num)}
            >
              <Text style={styles.buttonText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Row 4: Empty, 0, Empty */}
        <View style={styles.buttonRow}>
          <View style={{ width: buttonSize, height: buttonSize }} />
          <TouchableOpacity
            style={styles.numberButton}
            onPress={() => handleNumberPress('0')}
          >
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>
          <View style={{ width: buttonSize, height: buttonSize }} />
        </View>
        {/* Row 5: Clear */}
        <TouchableOpacity
          style={[styles.clearButton, { width: buttonSize * 3 + 20 }]}
          onPress={handleClear}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: Dimensions.get('window').width * 0.03,
    paddingBottom: 70,
  },
  question: {
    fontSize: Dimensions.get('window').width * 0.09,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  incorrect: {
    color: 'red',
  },
  input: {
    fontSize: Dimensions.get('window').width * 0.07,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: Dimensions.get('window').width * 0.4,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  counter: {
    fontSize: Dimensions.get('window').width * 0.05,
    color: '#333',
    marginBottom: 20,
  },
  buttonGrid: {
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  numberButton: {
    width: Dimensions.get('window').width * 0.18,
    height: Dimensions.get('window').width * 0.18,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  clearButton: {
    height: Dimensions.get('window').width * 0.18,
    backgroundColor: '#FF5733',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    marginBottom: Platform.OS === 'ios' || Platform.OS === 'android' ? 20 : 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: Dimensions.get('window').width * 0.06,
  },
});

export default AdditionSubtraction;
