import React, { createContext, useState, useEffect } from 'react';
import { getUnlockedDifficulty, saveUnlockedDifficulty } from './storage';

export const DifficultyContext = createContext();

export const DifficultyProvider = ({ children }) => {
  const [unlockedDifficulty, setUnlockedDifficulty] = useState('Easy');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Easy');

  useEffect(() => {
    const loadUnlockedDifficulty = async () => {
      const storedDifficulty = await getUnlockedDifficulty();
      if (storedDifficulty) {
        setUnlockedDifficulty(storedDifficulty);
        setSelectedDifficulty(storedDifficulty); // Initialize selectedDifficulty to highest unlocked
      }
    };
    loadUnlockedDifficulty();
  }, []);

  const updateUnlockedDifficulty = async (newDifficulty) => {
    const difficultyLevelsOrder = ['Easy', 'Medium', 'Hard'];
    const currentIndex = difficultyLevelsOrder.indexOf(unlockedDifficulty);
    const newIndex = difficultyLevelsOrder.indexOf(newDifficulty);
    if (newIndex > currentIndex) {
      setUnlockedDifficulty(newDifficulty);
      await saveUnlockedDifficulty(newDifficulty);
    }
  };

  return (
    <DifficultyContext.Provider
      value={{
        unlockedDifficulty,
        updateUnlockedDifficulty,
        selectedDifficulty,
        setSelectedDifficulty,
      }}
    >
      {children}
    </DifficultyContext.Provider>
  );
};