import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProgressBar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WallpaperContext } from './WallpaperContext';
import { saveGameResult } from './storage';

const MemoryManiac = ({ route }) => {
  const navigation = useNavigation();
  const [step, setStep] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [operationText, setOperationText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);
  const [progress, setProgress] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const { selectedWallpaper } = useContext(WallpaperContext);
  const difficulty = route?.params?.difficulty || 'Low'; // Default to Low

  const getDifficultySettings = () => {
    switch (difficulty) {
      case 'Low': return { time: 300, maxNum: 5, maxResult: 15 }; // 5s, 1-5, max 15
      case 'Moderate': return { time: 250, maxNum: 7, maxResult: 20 }; // 4s, 1-7, max 20
      case 'Hard': return { time: 200, maxNum: 10, maxResult: 25 }; // 3s, 1-10, max 25
      default: return { time: 300, maxNum: 10, maxResult: 15 };
    }
  };

  const { time: timerTicks, maxNum, maxResult } = getDifficultySettings();

useEffect(() => {
  if (step === 0) {
    const startValue = Math.floor(Math.random() * maxNum) + 1;
    setCurrentValue(startValue);
    setOperationText(`Start with ${startValue}`);
    setStep(1);
    setStartTime(Date.now());
    setProgress(1);
  } else if (step <= 10) {
    let ticks = 0;
    const timer = setInterval(() => {
      ticks++;
      const newProgress = 1 - (ticks / timerTicks);
      setProgress(newProgress > 0 ? newProgress : 0);
      if (ticks >= timerTicks) {
        clearInterval(timer);
        if (step < 10) {
          const operations = ['add', 'subtract', 'multiply', 'divide'];
          const operation = operations[Math.floor(Math.random() * 4)];
          let num, newValue;

          if (operation === 'add') {
            num = Math.floor(Math.random() * maxNum) + 1;
            newValue = currentValue + num;
            if (newValue > maxResult) {
              num = maxResult - currentValue;
              newValue = maxResult;
            }
            setOperationText(`Add ${num}`);
          } else if (operation === 'subtract') {
            num = Math.floor(Math.random() * Math.min(currentValue, maxNum)) + 1;
            newValue = currentValue - num;
            if (newValue < 0) {
              num = currentValue;
              newValue = 0;
            }
            setOperationText(`Subtract ${num}`);
          } else if (operation === 'multiply') {
            num = Math.floor(Math.random() * Math.min(maxNum, 4)) + 1;
            newValue = currentValue * num;
            if (newValue > maxResult) {
              num = Math.floor(maxResult / currentValue);
              newValue = currentValue * num;
            }
            setOperationText(`Multiply by ${num}`);
          } else {
            const possibleDivisors = [];
            for (let i = 1; i <= currentValue && i <= maxNum; i++) {
              if (currentValue % i === 0) possibleDivisors.push(i);
            }
            num = possibleDivisors[Math.floor(Math.random() * possibleDivisors.length)] || 1;
            newValue = currentValue / num;
            setOperationText(`Divide by ${num}`);
          }

          setCurrentValue(newValue);
          setStep(step + 1);
          setProgress(1);
        } else {
          setOperationText('');
          setProgress(0);
          setShowInput(true);
        }
      }
    }, 10);
    return () => clearInterval(timer);
  }
}, [step, currentValue, timerTicks, maxNum, maxResult]);

  const handleNumberPress = (number) => {
    setUserInput(userInput + number);
  };

  const handleClear = () => {
    setUserInput('');
    setShowIncorrect(false);
  };

  const handleSubmit = async () => {
    const userAnswer = parseInt(userInput, 10);
    if (userAnswer === currentValue) {
      const endTime = Date.now();
      const timeTaken = Number((endTime - startTime) / 1000).toFixed(2);
      const score = Math.round(timeTaken * (incorrectCount + 1));
      const gameResult = {
        gameType: `Memory Maniac (${difficulty})`,
        timeTaken,
        errors: incorrectCount,
        correctAnswers: 1,
        score,
        timestamp: Date.now(),
      };
      saveGameResult(gameResult);
  
      try {
        const savedCompletions = await AsyncStorage.getItem('memoryManiacCompletions');
        const completions = savedCompletions ? JSON.parse(savedCompletions) : { Low: 0, Moderate: 0, Hard: 0 };
        completions[difficulty] = (completions[difficulty] || 0) + 1;
        await AsyncStorage.setItem('memoryManiacCompletions', JSON.stringify(completions));
      } catch (error) {
        console.error('Error saving completions:', error);
      }
  
      navigation.navigate('Results', { timeTaken, errors: incorrectCount, correctAnswers: 1, score, gameType: `Memory Maniac (${difficulty})` });
    } else {
      setShowIncorrect(true);
      setIncorrectCount(incorrectCount + 1);
      setUserInput('');
      if (incorrectCount + 1 >= 3) {
        setOperationText(`Correct Answer: ${currentValue}`);
        setShowInput(false);
        setTimeout(() => navigation.navigate('Home'), 2000);
      }
    }
  };

  const { width } = Dimensions.get('window');
  const buttonSize = width * 0.18;

  return (
    <View style={[styles.container, selectedWallpaper]}>
      <Text style={styles.operation}>{operationText} {currentValue}</Text>
      {step > 0 && step <= 10 && <ProgressBar progress={progress} color="#007AFF" style={styles.progress} />}      {showInput ? (
        <>
          <Text style={styles.input}>{userInput || ' '}</Text>
          {showIncorrect && <Text style={styles.incorrect}>Incorrect</Text>}
          <View style={styles.buttonGrid}>
            <View style={styles.buttonRow}>
              {['1', '2', '3'].map(num => (
                <TouchableOpacity key={num} style={styles.numberButton} onPress={() => handleNumberPress(num)}>
                  <Text style={styles.buttonText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.buttonRow}>
              {['4', '5', '6'].map(num => (
                <TouchableOpacity key={num} style={styles.numberButton} onPress={() => handleNumberPress(num)}>
                  <Text style={styles.buttonText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.buttonRow}>
              {['7', '8', '9'].map(num => (
                <TouchableOpacity key={num} style={styles.numberButton} onPress={() => handleNumberPress(num)}>
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
            <TouchableOpacity style={[styles.submitButton, { width: buttonSize * 3 + 20 }]} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: '#f5f5f5', padding: Dimensions.get('window').width * 0.03 },
  operation: { fontSize: Dimensions.get('window').width * 0.09, fontWeight: 'bold', marginBottom: 20 },
  progress: { width: Dimensions.get('window').width * 0.8, height: 10, marginBottom: 20 },
  input: { fontSize: Dimensions.get('window').width * 0.07, borderWidth: 1, borderColor: '#ccc', padding: 10, width: Dimensions.get('window').width * 0.4, textAlign: 'center', marginBottom: 20, backgroundColor: '#fff', borderRadius: 5 },
  incorrect: { fontSize: Dimensions.get('window').width * 0.05, color: 'red', marginBottom: 20 },
  buttonGrid: { alignItems: 'center' },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  numberButton: { width: Dimensions.get('window').width * 0.18, height: Dimensions.get('window').width * 0.18, backgroundColor: '#007AFF', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 },
  clearButton: { height: Dimensions.get('window').width * 0.18, backgroundColor: '#FF5733', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 5 },
  submitButton: { height: Dimensions.get('window').width * 0.18, backgroundColor: '#28A745', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 5 },
  backButton: { marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#007AFF', borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: Dimensions.get('window').width * 0.06 },
});

export default MemoryManiac;