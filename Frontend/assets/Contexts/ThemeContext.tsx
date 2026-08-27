import React, { createContext, useContext, useState } from 'react';

interface ThemeContextData {
  darkMode: boolean;
  alternarTema: () => void;
}

const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);

  function alternarTema() {
    setDarkMode(prev => !prev);
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