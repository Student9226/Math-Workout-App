import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WallpaperContext } from './WallpaperContext';

const MultiplicationDivision = () => {
  const navigation = useNavigation();
  const [question, setQuestion] = useState({ num1: 0, num2: 0, operation: '*', answer: 0 });
  const [userInput, setUserInput] = useState('');
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0); 
  const { selectedWallpaper } = useContext(WallpaperContext);
  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const operation = Math.random() > 0.5 ? '*' : '/';
    let num1, num2, answer;

    if (operation === '*') {
      num1 = Math.floor(Math.random() * 10);
      num2 = Math.floor(Math.random() * 10);
      answer = num1 * num2;
    } else {
      num2 = Math.floor(Math.random() * 9) + 1; // 1-9 (avoid division by 0)
      answer = Math.floor(Math.random() * 10); // Answer between 0-9
      num1 = num2 * answer; // num1 = num2 * answer to ensure whole number division
    }

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
        setCorrectCount(0); // Reset counter
        navigation.navigate('Home'); // Return to home screen
      } else {
        setTimeout(generateQuestion, 0);
      }
    } else {
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
      <Text style={styles.counter}>Correct: {correctCount}/20</Text> {/* Display counter */}
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
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
  },
  buttonText: {
    color: '#fff',
    fontSize: Dimensions.get('window').width * 0.06,
  },
});

export default MultiplicationDivision;