import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WallpaperContext } from './WallpaperContext';
import { DifficultyContext } from './DifficultyContext'; // Import DifficultyContext

const { width } = Dimensions.get('window');

const Menu = () => {
  const navigation = useNavigation();
  const { wallpaper, setWallpaper, selectedWallpaper, wallpapers } = useContext(WallpaperContext);
  const { unlockedDifficulty, updateUnlockedDifficulty } = useContext(DifficultyContext); // Use DifficultyContext

  const difficultyLevels = [
    { name: 'Easy', key: 'Easy' },
    { name: 'Medium', key: 'Medium' },
    { name: 'Hard', key: 'Hard' },
  ];

  const isDifficultyLocked = (difficultyKey) => {
    if (unlockedDifficulty === 'Easy') {
      return difficultyKey !== 'Easy';
    } else if (unlockedDifficulty === 'Medium') {
      return difficultyKey === 'Hard';
    }
    return false; // Hard is unlocked
  };

  return (
    <View style={[styles.container, selectedWallpaper]}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.settingSection}>
        <Text style={styles.label}>Wallpaper</Text>
        <View style={styles.optionGrid}>
          {wallpapers.map(wp => (
            <TouchableOpacity
              key={wp.name}
              style={[styles.optionButton, wallpaper === wp.name && styles.selectedOption]}
              onPress={() => setWallpaper(wp.name)}
            >
              <Text style={styles.optionText}>{wp.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.settingSection}>
        <Text style={styles.label}>Difficulty</Text>
        <View style={styles.optionGrid}>
          {difficultyLevels.map(level => (
            <TouchableOpacity
              key={level.key}
              style={[
                styles.optionButton,
                { backgroundColor: isDifficultyLocked(level.key) ? '#ccc' : '#007AFF' }, // Grey out locked difficulties
                unlockedDifficulty === level.key && styles.selectedOption,
              ]}
              onPress={() => {
                if (!isDifficultyLocked(level.key)) {
                  updateUnlockedDifficulty(level.key);
                }
              }}
              disabled={isDifficultyLocked(level.key)} // Disable locked buttons
            >
              <Text style={styles.optionText}>{level.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  settingSection: { marginBottom: 30, width: '100%', alignItems: 'center' },
  label: { fontSize: width * 0.05, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '100%' },
  optionButton: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5, margin: 5 },
  selectedOption: { backgroundColor: '#28A745' },
  optionText: { color: '#fff', fontSize: width * 0.04 },
  toggleButton: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#007AFF', borderRadius: 5 },
  toggleText: { color: '#fff', fontSize: width * 0.04 },
  backButton: { marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#007AFF', borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: width * 0.06 },
});

export default Menu;
