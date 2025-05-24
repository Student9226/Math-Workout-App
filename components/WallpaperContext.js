import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const WallpaperContext = createContext();

export const WallpaperProvider = ({ children }) => {
  const [wallpaper, setWallpaper] = useState('Default');

  const wallpapers = [
    { name: 'Default', style: { backgroundColor: '#FFFFFF' } }, // Changed to white
    { name: 'Aliceblue', style: { backgroundColor: '#F0F8FF' } },
    { name: 'Orange', style: { backgroundColor: '#ff8c00' } },
    { name: 'Light green', style: { backgroundColor: '#90EE90' } },
    { name: 'Purple', style: { backgroundColor: '#8B8FF6' } },
    { name: 'Ocean', style: { backgroundColor: '#0284C7' } },
  ];

  // Load wallpaper from AsyncStorage on mount
  useEffect(() => {
    const loadWallpaper = async () => {
      try {
        const savedWallpaper = await AsyncStorage.getItem('selectedWallpaper');
        if (savedWallpaper && wallpapers.some(wp => wp.name === savedWallpaper)) {
          setWallpaper(savedWallpaper);
        }
      } catch (error) {
        console.error('Error loading wallpaper from AsyncStorage:', error);
      }
    };
    loadWallpaper();
  }, []);

  // Save wallpaper to AsyncStorage when changed
  const handleSetWallpaper = async (wpName) => {
    setWallpaper(wpName);
    try {
      await AsyncStorage.setItem('selectedWallpaper', wpName);
    } catch (error) {
      console.error('Error saving wallpaper to AsyncStorage:', error);
    }
  };

  const selectedWallpaper = wallpapers.find(wp => wp.name === wallpaper)?.style || { backgroundColor: '#FFFFFF' };

  return (
    <WallpaperContext.Provider value={{ wallpaper, setWallpaper: handleSetWallpaper, selectedWallpaper, wallpapers }}>
      {children}
    </WallpaperContext.Provider>
  );
};