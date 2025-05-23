import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WallpaperContext } from './WallpaperContext';
import { DifficultyContext } from './DifficultyContext'; // Import DifficultyContext
import { saveGameResult } from './storage'; // Import saveGameResult
import MessageModal from './MessageModal'; // Import Modal component

const MathItOut = () => {
  const navigation = useNavigation();
  const [question, setQuestion] = useState({ num1: 0, num2: 0, operation: '+', answer: 0 });
  const [userInput, setUserInput] = useState('');
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); // State for modal message

  const { selectedWallpaper } = useContext(WallpaperContext);
  const { unlockedDifficulty, updateUnlockedDifficulty } = useContext(DifficultyContext); // Use DifficultyContext

  useEffect(() => {
    generateQuestion();
    setStartTime(Date.now());
  }, [unlockedDifficulty]); // Regenerate question when difficulty changes

  const generateQuestion = () => {
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * 4)];
    let num1, num2, answer;

    const generateNumbers = (difficulty) => {
      let num1, num2;
      if (difficulty === 'Easy') {
        num1 = Math.floor(Math.random() * 10);
        num2 = Math.floor(Math.random() * 10);
      } else if (difficulty === 'Medium') {
        num1 = parseFloat((Math.random() * 20).toFixed(1)); // Decimals and larger range
        num2 = parseFloat((Math.random() * 15).toFixed(1));
      } else { // Hard
        num1 = parseFloat((Math.random() * 50).toFixed(2)); // Larger range and more decimal places
        num2 = parseFloat((Math.random() * 30).toFixed(2));
      }
      return { num1, num2 };
    };

    const { num1: generatedNum1, num2: generatedNum2 } = generateNumbers(unlockedDifficulty);
    num1 = generatedNum1;
    num2 = generatedNum2;

    if (operation === '*') {
      answer = parseFloat((num1 * num2).toFixed(unlockedDifficulty === 'Hard' ? 2 : 1));
    } else if (operation === '/') {
      // Ensure division results in a reasonable number of decimal places for the difficulty
      if (unlockedDifficulty === 'Easy') {
         // Simple division for easy mode
         num2 = Math.floor(Math.random() * 9) + 1;
         answer = Math.floor(Math.random() * 10);
         num1 = num2 * answer;
      } else {
        let attempts = 0;
        do {
          const { num1: tempNum1, num2: tempNum2 } = generateNumbers(unlockedDifficulty);
          num1 = tempNum1;
          num2 = tempNum2;
          answer = num1 / num2;
          attempts++;
          if (attempts > 100) { // Prevent infinite loops
            console.warn("Could not generate suitable division problem, falling back to simpler one.");
             num2 = Math.floor(Math.random() * 9) + 1;
             answer = Math.floor(Math.random() * 10);
             num1 = num2 * answer;
             break;
          }
        } while (isNaN(answer) || !isFinite(answer) || (unlockedDifficulty === 'Medium' && answer % 1 !== 0 && answer.toFixed(1).split('.')[1].length > 1) || (unlockedDifficulty === 'Hard' && answer % 1 !== 0 && answer.toFixed(2).split('.')[1].length > 2));
        answer = parseFloat(answer.toFixed(unlockedDifficulty === 'Hard' ? 2 : 1));
      }
    } else if (operation === '-') {
       if (unlockedDifficulty === 'Easy') {
         num2 = Math.floor(Math.random() * 10);
         num1 = Math.floor(Math.random() * (10 - num2 + 1)) + num2;
       } else {
         const { num1: tempNum1, num2: tempNum2 } = generateNumbers(unlockedDifficulty);
         num1 = tempNum1;
         num2 = tempNum2;
       }
      answer = parseFloat((num1 - num2).toFixed(unlockedDifficulty === 'Hard' ? 2 : 1));
    } else { // +
       if (unlockedDifficulty === 'Easy') {
         num1 = Math.floor(Math.random() * 10);
         num2 = Math.floor(Math.random() * 10);
       } else {
          const { num1: tempNum1, num2: tempNum2 } = generateNumbers(unlockedDifficulty);
          num1 = tempNum1;
          num2 = tempNum2;
       }
      answer = parseFloat((num1 + num2).toFixed(unlockedDifficulty === 'Hard' ? 2 : 1));
    }

    setQuestion({ num1, num2, operation, answer });
    setUserInput('');
    setIsIncorrect(false);
  };

  const handleNumberPress = (number) => {
    const newInput = userInput + number;
    setUserInput(newInput);
    // Adjust expected length for decimals
    const expectedLength = String(question.answer).length;
    // For decimals, allow typing until a reasonable length after the decimal point
    if (String(question.answer).includes('.') && newInput.includes('.')) {
        // Allow more input after decimal point
         handleSubmit(newInput); // Submit immediately for decimal input to handle validation
    } else if (!String(question.answer).includes('.') && newInput.length === expectedLength) {
         handleSubmit(newInput);
    } else if (String(question.answer).includes('.') && !newInput.includes('.') && newInput.length === String(question.answer).split('.')[0].length){
         // If it's a decimal answer but user hasn't typed '.', submit the integer part
         handleSubmit(newInput);
    }
  };

  const handleClear = () => {
    setUserInput('');
    setIsIncorrect(false);
  };

  const handleSubmit = async (input) => {
    const userAnswer = parseFloat(input); // Parse as float to handle decimals
    const correctAnswer = question.answer;

    // Tolerance for floating point comparisons
    const tolerance = 0.001;
    const isCorrect = Math.abs(userAnswer - correctAnswer) < tolerance;


    if (isCorrect) {
      const newCorrectCount = correctCount + 1;
      setCorrectCount(newCorrectCount);
      if (newCorrectCount >= 20) {
        const endTime = Date.now();
        const timeTaken = (endTime - startTime) / 1000;
        const score = Math.round(timeTaken * (errorCount + 1));
        const gameResult = {
          gameType: 'Math It Out',
          timeTaken: timeTaken,
          errors: errorCount,
          correctAnswers: 20,
          score: score,
          timestamp: Date.now(),
        };
        saveGameResult(gameResult);

        // Check for difficulty unlock
        let message = `You completed Math It Out ${unlockedDifficulty} mode! Time: ${timeTaken.toFixed(2)}s, Errors: ${errorCount}. Score: ${score}`;
        let unlockedNewDifficulty = unlockedDifficulty;

        if (timeTaken <= 23 && errorCount === 0) {
            if (unlockedDifficulty === 'Easy') {
                message += '\n\nMedium difficulty unlocked!';
                await updateUnlockedDifficulty('Medium');
                unlockedNewDifficulty = 'Medium';
            } else if (unlockedDifficulty === 'Medium') {
                 message += '\n\nHard difficulty unlocked!';
                await updateUnlockedDifficulty('Hard');
                unlockedNewDifficulty = 'Hard';
            } else if (unlockedDifficulty === 'Hard') {
                 message += '\n\nYou are a Math Master!';
            }
        }


        setModalMessage(message);
        setModalVisible(true);


        setCorrectCount(0);
        setErrorCount(0);
        setStartTime(null);

        // Delay navigation until modal is closed
        // navigation.navigate('Results', { timeTaken, errors: errorCount, correctAnswers: 2Count, score });
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
       navigation.navigate('Results', { timeTaken: (Date.now() - startTime)/1000, errors: errorCount, correctAnswers: correctCount, score: Math.round(((Date.now() - startTime)/1000) * (errorCount + 1)) }); // Navigate after modal close
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
      <Text style={styles.counter}>Errors: {errorCount}</Text>
       <Text style={styles.counter}>Difficulty: {unlockedDifficulty}</Text> {/* Display current difficulty */}
      <View style={styles.buttonGrid}>
        <View style={styles.buttonRow}>
            {[1, 2, 3].map(num => (
              <TouchableOpacity key={num} style={styles.numberButton} onPress={() => handleNumberPress(num.toString())}>
                <Text style={styles.buttonText}>{num}</Text>
              </TouchableOpacity>
            ))}
             {/* Add decimal point button for Medium and Hard */}
            {(unlockedDifficulty === 'Medium' || unlockedDifficulty === 'Hard') && (
                <TouchableOpacity key="." style={styles.numberButton} onPress={() => handleNumberPress('.')}>
                    <Text style={styles.buttonText}>.</Text>
                </TouchableOpacity>
            )}
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
        <TouchableOpacity style={[styles.clearButton, { width: buttonSize * 3 + (unlockedDifficulty === 'Easy' ? 10 : 20) }]} onPress={handleClear}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>

      {/* Modal for messages */}
      <MessageModal
          visible={modalVisible}
          message={modalMessage}
          onClose={handleModalClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: '#f5f5f5', padding: Dimensions.get('window').width * 0.03 },
  question: { fontSize: Dimensions.get('window').width * 0.09, fontWeight: 'bold', marginBottom: 20 },
  incorrect: { color: 'red' },
  input: { fontSize: Dimensions.get('window').width * 0.07, borderWidth: 1, borderColor: '#ccc', padding: 10, width: Dimensions.get('window').width * 0.4, textAlign: 'center', marginBottom: 20, backgroundColor: '#fff', borderRadius: 5 },
  counter: { fontSize: Dimensions.get('window').width * 0.05, color: '#333', marginBottom: 10 }, // Adjusted margin
  buttonGrid: { alignItems: 'center' },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  numberButton: { width: Dimensions.get('window').width * 0.18, height: Dimensions.get('window').width * 0.18, backgroundColor: '#007AFF', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 },
  clearButton: { height: Dimensions.get('window').width * 0.18, backgroundColor: '#FF5733', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 5 },
  submitButton: { height: Dimensions.get('window').width * 0.18, backgroundColor: '#28A745', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 5 },
  backButton: { marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#007AFF', borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: Dimensions.get('window').width * 0.06 },
});

export default MathItOut;
