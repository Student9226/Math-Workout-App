import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@math_game_results';
const UNLOCKED_DIFFICULTY_KEY = 'unlockedDifficulty';

// Save game result
export const saveGameResult = async (result) => {
  try {
    const existingResults = await getGameResults();
    const updatedResults = [...existingResults, result];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
  } catch (error) {
    console.error('Error saving game result:', error);
  }
};

// Get all game results
export const getGameResults = async () => {
  try {
    const results = await AsyncStorage.getItem(STORAGE_KEY);
    return results ? JSON.parse(results) : [];
  } catch (error) {
    console.error('Error getting game results:', error);
    return [];
  }
};

// Clear all game results (for testing or reset)
export const clearGameResults = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing game results:', error);
  }
};

export const saveUnlockedDifficulty = async (difficulty) => {
  try {
    await AsyncStorage.setItem(UNLOCKED_DIFFICULTY_KEY, difficulty);
  } catch (e) {
    console.error('Error saving unlocked difficulty:', e);
  }
};

export const getUnlockedDifficulty = async () => {
  try {
    const difficulty = await AsyncStorage.getItem(UNLOCKED_DIFFICULTY_KEY);
    return difficulty;
  } catch (e) {
    console.error('Error getting unlocked difficulty:', e);
    return null;
  }
};