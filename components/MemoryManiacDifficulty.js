import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WallpaperContext } from './WallpaperContext';

const { width } = Dimensions.get('window');

const MemoryManiacDifficulty = () => {
  const navigation = useNavigation();
  const { selectedWallpaper } = useContext(WallpaperContext);
  const [completions, setCompletions] = useState({ Low: 0, Moderate: 0, Hard: 0 });

  const difficultyLevels = [
    { name: 'Low', key: 'Low', requiredCompletions: 0 },
    { name: 'Moderate', key: 'Moderate', requiredCompletions: 3, previous: 'Low' },
    { name: 'Hard', key: 'Hard', requiredCompletions: 5, previous: 'Moderate' },
  ];

  useEffect(() => {
    const loadCompletions = async () => {
      try {
        const savedCompletions = await AsyncStorage.getItem('memoryManiacCompletions');
        if (savedCompletions) {
          const parsedCompletions = JSON.parse(savedCompletions);
          setCompletions(prev => ({ ...prev, ...parsedCompletions }));
        }
      } catch (error) {
        console.error('Error loading completions:', error);
      }
    };
    loadCompletions();
  }, []);

  const isDifficultyLocked = (level) => {
    if (level.key === 'Low') return false;
    const previousCompletions = completions[level.previous] || 0;
    return previousCompletions < level.requiredCompletions;
  };

  const handleDifficultySelect = (difficulty) => {
    navigation.navigate('MemoryManiac', { difficulty });
  };

  return (
    <View style={[styles.container, selectedWallpaper]}>
      <Text style={styles.title}>Memory Maniac Difficulty</Text>
      <View style={styles.optionGrid}>
        {difficultyLevels.map(level => (
          <TouchableOpacity
            key={level.key}
            style={[styles.optionButton, isDifficultyLocked(level) && styles.lockedButton]}
            onPress={() => handleDifficultySelect(level.key)}
            disabled={isDifficultyLocked(level)}
          >
            <Text style={styles.optionText}>
              {level.name}
              {isDifficultyLocked(level) && ` (Locked: ${level.previous} ${completions[level.previous] || 0}/${level.requiredCompletions})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: width * 0.08, fontWeight: 'bold', marginBottom: 30, color: '#333' },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '100%' },
  optionButton: { paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#007AFF', borderRadius: 5, margin: 5 },
  lockedButton: { backgroundColor: '#ccc' },
  optionText: { color: '#fff', fontSize: width * 0.04 },
  backButton: { marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#007AFF', borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: width * 0.06 },
});

export default MemoryManiacDifficulty;