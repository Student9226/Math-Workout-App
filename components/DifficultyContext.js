import React, { createContext, useState, useEffect } from 'react';
import { getUnlockedDifficulty, saveUnlockedDifficulty } from './storage';

export const DifficultyContext = createContext();

export const DifficultyProvider = ({ children }) => {
  const [unlockedDifficulty, setUnlockedDifficulty] = useState('Easy');

  useEffect(() => {
    const loadUnlockedDifficulty = async () => {
      const storedDifficulty = await getUnlockedDifficulty();
      if (storedDifficulty) {
        setUnlockedDifficulty(storedDifficulty);
      }
    };
    loadUnlockedDifficulty();
  }, []);

  const updateUnlockedDifficulty = async (newDifficulty) => {
    setUnlockedDifficulty(newDifficulty);
    await saveUnlockedDifficulty(newDifficulty);
  };

  return (
    <DifficultyContext.Provider value={{ unlockedDifficulty, updateUnlockedDifficulty }}>
      {children}
    </DifficultyContext.Provider>
  );
};
