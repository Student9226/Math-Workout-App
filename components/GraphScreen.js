import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { getGameResults } from './storage';
import { useNavigation } from '@react-navigation/native';
import { WallpaperContext } from './WallpaperContext'; // Import WallpaperContext

const GraphScreen = () => {
  const navigation = useNavigation();
  const { selectedWallpaper } = useContext(WallpaperContext); // Access selectedWallpaper
  const [allGameResults, setAllGameResults] = useState([]);
  const [filteredGameResults, setFilteredGameResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGameType, setSelectedGameType] = useState('Addition/Subtraction');

  const screenHeight = Dimensions.get('window').height;
  const graphHeight = screenHeight * 0.5;
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const loadResults = async () => {
      const results = await getGameResults();
      setAllGameResults(results);
      setLoading(false);
    };
    loadResults();
  }, []);

  useEffect(() => {
    setFilteredGameResults(allGameResults.filter(result => result.gameType === selectedGameType));
  }, [selectedGameType, allGameResults]);

  const chartData = filteredGameResults.map((result, index) => ({
    value: result.score,
    label: `${index + 1}`,
  }));

  const gameTypes = ['Addition/Subtraction', 'Multiplication/Division', 'Math It Out'];

  if (loading) {
    return (
      <View style={[styles.container, selectedWallpaper]}>
        <Text>Loading results...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, selectedWallpaper]}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Your Progress ({selectedGameType})</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.filterContainer}>
          {gameTypes.map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.filterButton, selectedGameType === type && styles.selectedFilter]}
              onPress={() => setSelectedGameType(type)}
            >
              <Text style={styles.filterButtonText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredGameResults.length < 2 ? (
          <Text style={styles.noDataText}>Play at least 2 games of {selectedGameType} to see your progress graph!</Text>
        ) : (
          <LineChart
              data={chartData}
              width={screenWidth - 40}
              height={graphHeight}
              hideDataPoints={false}
              gradientDirection="vertical"
              backgroundColor="#f5f5" // Light gray background for graph
              color="#007AFF" // Blue line color for contrast
              thickness={5} // Thicker lines
              showVerticalLines
              showHorizontalLines
              xAxisLabelStyle={{
                fontWeight: 'bold', // Bold text
              }}
              yAxisTextStyle={{
                fontWeight: 'bold', // Bold text
              }}
            />
        )}
      </ScrollView>

      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Go to Home Screen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: Dimensions.get('window').width * 0.08,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 2,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#ccc',
    borderRadius: 5,
    margin: 5,
  },
  selectedFilter: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: Dimensions.get('window').width * 0.04,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    fontSize: Dimensions.get('window').width * 0.05,
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 20,
  },
  homeButton: {
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

export default GraphScreen;