import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { WallpaperContext } from './WallpaperContext';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const { selectedWallpaper } = useContext(WallpaperContext);
  const buttons = [
    { title: 'Addition & Subtraction', screen: 'AdditionSubtraction' },
    { title: 'Multiplication & Division', screen: 'MultiplicationDivision' },
    { title: "Let's Math it Out!", screen: 'MathItOut' },
    { title: 'Memory Maniac', screen: 'MemoryManiacDifficulty' },
    { title: 'Online Challenge (Soon!)', screen: 'OnlineChallenge' },
    { title: 'Math Blaster Game', screen: 'MathBlaster' },
  ];

  return (
    <View style={[styles.container, selectedWallpaper]}>
      <Text style={styles.title}>Math Workout</Text>
      <View style={styles.grid}>
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => {
              if (['AdditionSubtraction', 'MultiplicationDivision', 'MathItOut', 'MemoryManiacDifficulty', 'MathBlaster'].includes(button.screen)) {
                navigation.navigate(button.screen);
              } else {
                console.log(`${button.title} clicked - Coming Soon!`);
              }
            }}
          >
            <Text style={styles.buttonText}>{button.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.graphButton}
        onPress={() => navigation.navigate('Graph')}
      >
        <Text style={styles.graphButtonText}>View Progress Graph</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
        <Text style={{ marginTop: 20, color: 'blue', fontSize: Dimensions.get('window').width * 0.03 }}>Tap here to access the menu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: width * 0.08, fontWeight: 'bold', marginBottom: height * 0.05, color: '#333' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', width: width * 0.9, paddingHorizontal: 10 },
  button: { width: width * 0.38, paddingVertical: height * 0.025, backgroundColor: '#007AFF', borderRadius: 10, margin: width * 0.015, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: width * 0.045, textAlign: 'center' },
  graphButton: { marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#28A745', borderRadius: 10 },
  graphButtonText: { color: '#fff', fontSize: width * 0.045, fontWeight: 'bold' },
});

export default Home;