import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextData {
  darkMode: boolean;
  alternarTema: () => void;
}

const ThemeContext = createContext<ThemeContextData | undefined>(undefined);
const STORAGE_KEY = '@medtime:darkMode';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((valor) => {
      if (valor !== null) setDarkMode(valor === 'true');
    });
  }, []);

  function alternarTema() {
    setDarkMode(prev => {
      const novo = !prev;
      AsyncStorage.setItem(STORAGE_KEY, String(novo));
      return novo;
    });
  }

  return (
    <ThemeContext.Provider value={{ darkMode, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme deve ser usado dentro do ThemeProvider');
  }

  return context;
}