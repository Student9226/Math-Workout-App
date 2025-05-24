import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WallpaperContext } from './WallpaperContext';

const ResultsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { timeTaken, errors, correctAnswers, score, gameType } = route.params;
  const { selectedWallpaper } = useContext(WallpaperContext);

  const isMemoryManiac = gameType?.includes('Memory Maniac');

  return (
    <View style={[styles.container, selectedWallpaper]}>
      <Text style={styles.title}>Results</Text>
      <Text style={styles.resultText}>Time Taken: {Number(timeTaken).toFixed(2)} seconds</Text>
      <Text style={styles.resultText}>Errors: {errors}</Text>
      {!isMemoryManiac && <Text style={styles.resultText}>Correct Answers: {correctAnswers}</Text>}
      <Text style={styles.resultText}>Score: {Number(score).toFixed(2)}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: Dimensions.get('window').width * 0.08, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  resultText: { fontSize: Dimensions.get('window').width * 0.05, marginBottom: 10, color: '#333' },
  button: { marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#007AFF', borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: Dimensions.get('window').width * 0.06 },
});

export default ResultsScreen;