import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-gifted-charts'; // Updated import
import { getGameResults } from './storage'; // Import the utility function
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const GraphScreen = () => {
  const navigation = useNavigation(); // Initialize useNavigation
  const [allGameResults, setAllGameResults] = useState([]);
  const [filteredGameResults, setFilteredGameResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGameType, setSelectedGameType] = useState('Addition/Subtraction'); // State for selected game type, default to one game type

  const screenHeight = Dimensions.get('window').height;
  const graphHeight = screenHeight * 0.5; // Allocate 50% of screen height for the graph
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

  // Prepare data for the graph in react-native-gifted-charts format
  const chartData = filteredGameResults.map((result, index) => ({
    value: result.score,
    label: `${index + 1}`,
  }));

  const gameTypes = ['Addition/Subtraction', 'Multiplication/Division', 'Math It Out'];

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading results...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Your Progress ({selectedGameType})</Text>
      </View>

      {/* Scrollable Content */}
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
            width={screenWidth - 40} // AdACjust width with padding
            height={graphHeight} // Use dynamic height
            hideDataPoints={false}
            gradientDirection="vertical"
            gradientColor="rgba(255, 255, 255, 0.5)" // You can adjust this
            areaChart={true} // To have the shaded area below the line
            showVerticalLines
            showHorizontalLines
            xAxisColor="#ccc"
            yAxisColor="#ccc"
            color="#007AFF" // Line color
            thickness={3}
          />
        )}
      </ScrollView>

      {/* Fixed Footer */}
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
    backgroundColor: '#f5f5f5',
    paddingTop: 20, // Add padding to the top for the header
    paddingBottom: 20, // Add padding to the bottom for the footer
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
    marginHorizontal: 2
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
  chartStyle: { // This style might need adjustments or might not be directly applicable to gifted-charts props
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
    paddingBottom: 20
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

