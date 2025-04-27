import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { WallpaperProvider } from './components/WallpaperContext';
import Home from './components/Home';
import AdditionSubtraction from './components/AdditionSubtraction';
import MultiplicationDivision from './components/MultiplicationDivision';
import MathItOut from './components/MathItOut';
import MemoryManiac from './components/MemoryManiac';
import MathBlaster from './components/MathBlaster';
import Menu from './components/Menu';
const Stack = createStackNavigator();

const App = () => {
  return (
    <WallpaperProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AdditionSubtraction" component={AdditionSubtraction} />
        <Stack.Screen name="MultiplicationDivision" component={MultiplicationDivision} />
        <Stack.Screen name="MathItOut" component={MathItOut} />
        <Stack.Screen name="MemoryManiac" component={MemoryManiac} />
        <Stack.Screen name="MathBlaster" component={MathBlaster} />
        <Stack.Screen name="Menu" component={Menu} />
      </Stack.Navigator>
    </NavigationContainer>
    </WallpaperProvider>
  );
};

export default App;