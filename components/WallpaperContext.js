import React, { createContext, useState } from 'react';

export const WallpaperContext = createContext();

export const WallpaperProvider = ({ children }) => {
  const [wallpaper, setWallpaper] = useState('default');

  const wallpapers = [
    { name: 'Default', style: { backgroundColor: '#f5f5f5' } },
    { name: 'Aliceblue', style: { backgroundColor: '#F0F8FF' } },
    { name: 'Red', style: { backgroundColor: '#FF5733' } },
    { name: 'Light green', style: { backgroundColor: '#90EE90' } },
    { name: 'Purple', style: { backgroundColor: '#8B8FF6' } },
    { name: 'Ocean', style: { backgroundColor: '#0284C7' } },
  ];

  const selectedWallpaper = wallpapers.find(wp => wp.name === wallpaper)?.style || { backgroundColor: '#f5f5f5' };

  return (
    <WallpaperContext.Provider value={{ wallpaper, setWallpaper, selectedWallpaper, wallpapers }}>
      {children}
    </WallpaperContext.Provider>
  );
};