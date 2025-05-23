import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ResultsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { timeTaken, errors, correctAnswers } = route.params; // Get data from navigation params

  // Calculate the score
  const score = Math.round(timeTaken * (errors + 1)); // Score calculation: time * (errors + 1)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Results</Text>

      <View style={styles.resultItem}>
        <Text style={styles.label}>Time Taken:</Text>
        <Text style={styles.value}>{timeTaken.toFixed(2)} seconds</Text> {/* Display time with 2 decimal places */}
      </View>

      <View style={styles.resultItem}>
        <Text style={styles.label}>Errors:</Text>
        <Text style={styles.value}>{errors}</Text>
      </View>

      <View style={styles.resultItem}>
        <Text style={styles.label}>Correct Answers:</Text>
        <Text style={styles.value}>{correctAnswers}</Text>
      </View>

      <View style={styles.resultItem}>
        <Text style={styles.label}>Score:</Text>
        <Text style={styles.value}>{score}</Text>
      </View>

      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Go to Home Screen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: Dimensions.get('window').width * 0.08,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  label: {
    fontSize: Dimensions.get('window').width * 0.05,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: Dimensions.get('window').width * 0.05,
    color: '#007AFF',
  },
  homeButton: {
    marginTop: 40,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: Dimensions.get('window').width * 0.05,
    fontWeight: 'bold',
  },
});

export default ResultsScreen;
