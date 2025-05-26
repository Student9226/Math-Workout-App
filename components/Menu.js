import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WallpaperContext } from './WallpaperContext';
import { DifficultyContext } from './DifficultyContext';

const { width } = Dimensions.get('window');

const Menu = () => {
  const navigation = useNavigation();
  const { wallpaper, setWallpaper, selectedWallpaper, wallpapers } = useContext(WallpaperContext);
  const { unlockedDifficulty, selectedDifficulty, setSelectedDifficulty } = useContext(DifficultyContext);

  const difficultyLevels = [
    { name: 'Easy', key: 'Easy' },
    { name: 'Medium', key: 'Medium' },
    { name: 'Hard', key: 'Hard' },
  ];

  const isDifficultyLocked = (difficultyKey) => {
    const difficultyLevelsOrder = ['Easy', 'Medium', 'Hard'];
    const difficultyIndex = difficultyLevelsOrder.indexOf(difficultyKey);
    const highestUnlockedIndex = difficultyLevelsOrder.indexOf(unlockedDifficulty);
    return difficultyIndex > highestUnlockedIndex;
  };



  const getButtonBackgroundColor = (wpName) => {
    switch (wpName) {
      case 'Default': return '#FFFFFF'; 
      case 'Aliceblue': return '#F0F8FF';
      case 'Orange': return '#ff8c00';
      case 'Light green': return '#90EE90';
      case 'Pink': return '#FB8FF6';
      case 'Skyblue': return '#02F4F7';
      default: return '#f5f5f5';
    }
  };

  // Define button text colors
  const getButtonTextColor = (wpName) => {
    return ['Default', 'Aliceblue', 'Light green', 'Skyblue'].includes(wpName) ? '#000000' : '#FFFFFF';
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
              style={[
                styles.optionButton,
                { backgroundColor: getButtonBackgroundColor(wp.name) },
                wallpaper === wp.name && styles.selectedOption
              ]}
              onPress={() => setWallpaper(wp.name)}
            >
              <Text style={[styles.optionText, { color: getButtonTextColor(wp.name) }]}>
                {wp.name}
              </Text>
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
                {
                  backgroundColor: isDifficultyLocked(level.key) ? '#ccc' : '#007AFF',
                },
                selectedDifficulty === level.key && styles.selectedOption, // Fixed to use selectedDifficulty
              ]}
              onPress={() => {
                if (!isDifficultyLocked(level.key)) {
                  setSelectedDifficulty(level.key);
                }
              }}
              disabled={isDifficultyLocked(level.key)}
            >
              <Text style={[styles.optionText, { color: 'white' }]}>{level.name}</Text>
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
  selectedOption: { borderWidth: 2, borderColor: '#28A745' },
  optionText: { fontSize: width * 0.04 },
  toggleButton: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#007AFF', borderRadius: 5 },
  toggleText: { color: '#fff', fontSize: width * 0.04 },
  backButton: { marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#007AFF', borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: width * 0.06 },
});

export default Menu;