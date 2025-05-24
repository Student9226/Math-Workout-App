import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const MathBlaster = () => {
  const navigation = useNavigation();
  const [asteroids, setAsteroids] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(2);
  const [userInput, setUserInput] = useState('');
  const [stars, setStars] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [showLaser, setShowLaser] = useState(false);
  const [laserTarget, setLaserTarget] = useState(null);
  const [usedXPositions, setUsedXPositions] = useState([]);

  useEffect(() => {
    const spawnStars = () => {
      const newStar = {
        id: Date.now(),
        x: Math.random() * width,
        y: new Animated.Value(-10),
      };

      setStars(prev => [...prev, newStar]);

      Animated.timing(newStar.y, {
        toValue: height + 10,
        duration: 5000 + Math.random() * 5000,
        useNativeDriver: true,
      }).start(() => {
        setStars(prev => prev.filter(star => star.id !== newStar.id));
      });
    };

    if (!gameOver) {
      spawnStars();
      const interval = setInterval(spawnStars, 500);
      return () => clearInterval(interval);
    }
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const operations = ['+', '-', '*', '/'];
      const operation = operations[Math.floor(Math.random() * 4)];
      let num1, num2, answer;

      if (operation === '*') {
        num1 = Math.floor(Math.random() * 10);
        num2 = Math.floor(Math.random() * 10);
        answer = num1 * num2;
      } else if (operation === '/') {
        num2 = Math.floor(Math.random() * 9) + 1;
        answer = Math.floor(Math.random() * 10);
        num1 = num2 * answer;
      } else if (operation === '-') {
        num2 = Math.floor(Math.random() * 10);
        num1 = Math.floor(Math.random() * (10 - num2 + 1)) + num2;
        answer = num1 - num2;
      } else {
        num1 = Math.floor(Math.random() * 10);
        num2 = Math.floor(Math.random() * 10);
        answer = num1 + num2;
      }

      let x;
      let attempts = 0;
      do {
        x = Math.random() * (width - 60);
        attempts++;
      } while (usedXPositions.some(pos => Math.abs(pos - x) < 70) && attempts < 10);

      const position = new Animated.Value(-50);
      const newAsteroid = {
        id: Date.now(),
        num1,
        num2,
        operation,
        answer,
        position,
        x,
        destroyed: false,
      };

      setAsteroids(prev => [...prev, newAsteroid]);
      setUsedXPositions(prev => [...prev, x]);

      Animated.timing(position, {
        toValue: height - 100,
        duration: 10000,
        useNativeDriver: true,
      }).start();
    }, 3000);

    return () => clearInterval(interval);
  }, [gameOver]);

  useEffect(() => {
    const checkAsteroidPosition = () => {
      setAsteroids(prev => {
        const updated = prev.map(asteroid => ({
          ...asteroid,
          reachedBottom: asteroid.position._value >= height - 100,
        }));

        const reachedBottomAsteroids = updated.filter(a => a.reachedBottom && !a.destroyed);
        if (reachedBottomAsteroids.length > 0) {
          setLives(prevLives => {
            if (prevLives <= 1) {
              setGameOver(true);
              return 0;
            }
            return prevLives - 1;
          });
          const asteroidXs = reachedBottomAsteroids.map(a => a.x);
          setUsedXPositions(prev => prev.filter(pos => !asteroidXs.includes(pos)));
          return updated.filter(a => !a.reachedBottom);
        }
        return updated;
      });
    };

    if (!gameOver) {
      const interval = setInterval(checkAsteroidPosition, 100);
      return () => clearInterval(interval);
    }
  }, [gameOver]);

  const handleNumberPress = (number) => {
    if (gameOver) return;
    const newInput = userInput + number;
    setUserInput(newInput);
    const expectedLength = String(asteroids[0]?.answer || 0).length || 1;
    if (newInput.length >= expectedLength) {
      handleSubmit(newInput);
    }
  };

  const handleClear = () => {
    setUserInput('');
  };

  const handleSubmit = (input) => {
    const userAnswer = parseInt(input, 10);
    const targetAsteroid = asteroids[0];
    if (targetAsteroid && userAnswer === targetAsteroid.answer) {
      setScore(score + 1);
      setShowLaser(true);
      setLaserTarget({ x: targetAsteroid.x + 30, y: targetAsteroid.position });
      setTimeout(() => {
        setShowLaser(false);
        setLaserTarget(null);
        setAsteroids(prev => {
          const updated = [...prev];
          if (updated[0]) updated[0].destroyed = true;
          return updated.slice(1);
        });
        setUsedXPositions(prev => prev.filter(pos => pos !== targetAsteroid.x));
        Animated.timing(targetAsteroid.position, {
          toValue: height,
          duration: 0,
          useNativeDriver: true,
        }).stop();
      }, 500);
      setUserInput('');
    } else {
      setUserInput('');
    }
  };

  return (
    <View style={styles.container}>
      {stars.map((star, index) => (
        <Animated.View
          key={index}
          style={[styles.star, { left: star.x, transform: [{ translateY: star.y }] }]}
        />
      ))}
      <Text style={styles.score}>Score: {score}</Text>
      <Text style={styles.lives}>Lives: {lives}</Text>
      {gameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOver}>Game Over! Score: {score}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {asteroids.map(asteroid => (
            <Animated.View
              key={asteroid.id}
              style={[styles.asteroid, { left: asteroid.x, transform: [{ translateY: asteroid.position }] }]}
            >
              <Text style={styles.asteroidText}>
                {asteroid.num1} {asteroid.operation} {asteroid.num2}
              </Text>
            </Animated.View>
          ))}
          {showLaser && laserTarget && (
            <View style={styles.laserContainer}>
              <View
                style={[
                  styles.laser,
                  {
                    height: height - 150 - laserTarget.y._value,
                    transform: [{ translateX: laserTarget.x - width / 2 }],
                  },
                ]}
              />
            </View>
          )}
          <View style={styles.buttonGrid}>
            <View style={styles.buttonRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.input}>{userInput || ' '}</Text>
              </View>
              {['0', '1', '2', '3', '4'].map(item => (
                <TouchableOpacity
                  key={item}
                  style={styles.numberButton}
                  onPress={() => handleNumberPress(item)}
                >
                  <Text style={styles.buttonText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.numberButton} onPress={handleClear}>
                <Text style={styles.buttonText}>C</Text>
              </TouchableOpacity>
              {['5', '6', '7', '8', '9'].map(item => (
                <TouchableOpacity
                  key={item}
                  style={styles.numberButton}
                  onPress={() => handleNumberPress(item)}
                >
                  <Text style={styles.buttonText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', position: 'relative' },
  star: { position: 'absolute', width: 2, height: 2, backgroundColor: '#fff', borderRadius: 1 },
  score: { position: 'absolute', top: 20, left: 20, fontSize: 24, color: '#fff', padding: 10 },
  lives: { position: 'absolute', top: 20, right: 20, fontSize: 24, color: '#fff', padding: 10 },
  asteroid: { position: 'absolute', width: 60, height: 60, backgroundColor: '#aaa', borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  asteroidText: { fontSize: 18, color: '#000', fontWeight: 'bold' },
  gameOverContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  gameOver: { fontSize: 36, color: '#fff', textAlign: 'center', marginBottom: 20 },
  backButton: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#007AFF', borderRadius: 10 },
  backButtonText: { color: '#fff', fontSize: 18 },
  laserContainer: { position: 'absolute', bottom: 150, left: width / 2, width: 2, alignItems: 'center' },
  laser: { width: 2, backgroundColor: 'red' },
  buttonGrid: { position: 'absolute', bottom: 20, width: width, alignItems: 'center' },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8, 
    width: Dimensions.get('window').width * 1 
  },
  inputContainer: { 
    width: width / 6, 
    height: width / 6, 
    backgroundColor: '#333', 
    borderRadius: 5, 
    justifyContent: 'center', 
    alignItems: 'center' ,
    marginHorizontal: 1  
  },
  input: { 
    fontSize: 24, 
    color: '#fff', 
    textAlign: 'center', 
    width: '100%', 
    height: '100%', 
    lineHeight: width / 6, 
    borderWidth: 1, 
    borderColor: '#fff', 
    borderRadius: 5 
  },
  numberButton: { 
    width: width / 6, 
    height: width / 6, 
    backgroundColor: '#333', 
    borderRadius: 5, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginHorizontal: 1
  },
  buttonText: { color: '#fff', fontSize: 24 },
});

export default MathBlaster;