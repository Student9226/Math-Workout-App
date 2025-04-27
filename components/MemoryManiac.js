import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProgressBar } from 'react-native-paper';
import { WallpaperContext } from './WallpaperContext';

const MemoryManiac = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [operationText, setOperationText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);
  const [progress, setProgress] = useState(1);
  const { selectedWallpaper } = useContext(WallpaperContext);

  useEffect(() => {
    if (step === 0) {
      const startValue = Math.floor(Math.random() * 10) + 1; 
      setCurrentValue(startValue);
      setOperationText(`Start with ${startValue}`);
      setStep(1);
    } else if (step <= 20) {
      let ticks = 0;
      const timer = setInterval(() => {
        ticks++;
        setProgress(1 - (ticks / 25));
        if (ticks >= 25) {
          clearInterval(timer);
          if (step < 20) {
            const operations = ['add', 'subtract', 'multiply', 'divide'];
            const operation = operations[Math.floor(Math.random() * 4)];
            let num, newValue;

            if (operation === 'add') {
              num = Math.floor(Math.random() * 10) + 1; // 1-10
              newValue = currentValue + num;
              // Cap the result to avoid overly large numbers
              if (newValue > 100) {
                num = 100 - currentValue; // Adjust num to cap at 100
                newValue = 100;
              }
              setOperationText(`Add ${num}`);
            } else if (operation === 'subtract') {
              // Ensure subtraction doesn't result in a negative number
              num = Math.floor(Math.random() * currentValue) + 1; // 1 to currentValue
              newValue = currentValue - num;
              setOperationText(`Subtract ${num}`);
            } else if (operation === 'multiply') {
              num = Math.floor(Math.random() * 10) + 1; // 1-10
              newValue = currentValue * num;
              // Cap the result to avoid overly large numbers
              if (newValue > 100) {
                num = Math.floor(100 / currentValue); // Adjust num to cap at 100
                newValue = currentValue * num;
              }
              setOperationText(`Multiply by ${num}`);
            } else {
              // Division: Ensure currentValue is divisible by num
              const possibleDivisors = [];
              for (let i = 1; i <= currentValue; i++) {
                if (currentValue % i === 0) possibleDivisors.push(i);
              }
              num = possibleDivisors[Math.floor(Math.random() * possibleDivisors.length)] || 1; // Fallback to 1
              newValue = currentValue / num; // Guaranteed to be a whole number
              setOperationText(`Divide by ${num}`);
            }

            setCurrentValue(newValue);
            setStep(step + 1);
            setProgress(1);
          } else {
            setOperationText('');
            setProgress(0);
            setTimeout(() => setShowInput(true), 0);
          }
        }
      }, 100);
      return () => clearInterval(timer);
    }
  }, [step, currentValue]);

  const handleNumberPress = (number) => {
    setUserInput(userInput + number);
  };

  const handleClear = () => {
    setUserInput('');
    setShowIncorrect(false);
  };

  const handleSubmit = () => {
    const userAnswer = parseInt(userInput, 10);
    if (userAnswer === currentValue) {
      navigation.navigate('Home');
    } else {
      setShowIncorrect(true);
      setIncorrectCount(incorrectCount + 1);
      setUserInput('');
      if (incorrectCount + 1 >= 3) {
        setOperationText(`Correct Answer: ${currentValue}`);
        setShowInput(false);
      }
    }
  };

  const { width } = Dimensions.get('window');
  const buttonSize = width * 0.18;

  return (
    <View style={[styles.container, selectedWallpaper]}>
      <Text style={styles.operation}>{operationText}</Text>
      {step > 0 && step <= 20 && progress > 0 && <ProgressBar progress={progress} color="#007AFF" style={styles.progress} />}
      {showInput ? (
        <>
          <Text style={styles.input}>{userInput || ' '}</Text>
          {showIncorrect && <Text style={styles.incorrect}>Incorrect</Text>}
          <View style={styles.buttonGrid}>
            <View style={styles.buttonRow}>{['1', '2', '3'].map(num => (
              <TouchableOpacity key={num} style={styles.numberButton} onPress={() => handleNumberPress(num)}>
                <Text style={styles.buttonText}>{num}</Text>
              </TouchableOpacity>
            ))}</View>
            <View style={styles.buttonRow}>{['4', '5', '6'].map(num => (
              <TouchableOpacity key={num} style={styles.numberButton} onPress={() => handleNumberPress(num)}>
                <Text style={styles.buttonText}>{num}</Text>
              </TouchableOpacity>
            ))}</View>
            <View style={styles.buttonRow}>{['7', '8', '9'].map(num => (
              <TouchableOpacity key={num} style={styles.numberButton} onPress={() => handleNumberPress(num)}>
                <Text style={styles.buttonText}>{num}</Text>
              </TouchableOpacity>
            ))}</View>
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