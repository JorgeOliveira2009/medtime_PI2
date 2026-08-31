import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, Idioma } from './translations';

interface LanguageContextData {
  idioma: Idioma;
  setIdioma: (idioma: Idioma) => void;
  alternarIdioma: () => void;
  t: (chave: string) => any;
}

const LanguageContext = createContext<LanguageContextData | undefined>(undefined);
const STORAGE_KEY = '@medtime:idioma';

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [idioma, setIdiomaState] = useState<Idioma>('pt');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(valor => {
      if (valor === 'pt' || valor === 'en') setIdiomaState(valor);
    });
  }, []);

  function setIdioma(novoIdioma: Idioma) {
    setIdiomaState(novoIdioma);
    AsyncStorage.setItem(STORAGE_KEY, novoIdioma);
  }

  function alternarIdioma() {
    setIdioma(idioma === 'pt' ? 'en' : 'pt');
  }

  // Busca uma chave tipo "principal.bomDia" dentro do dicionário do idioma atual
  function t(chave: string): any {
    const partes = chave.split('.');
    let valor: any = translations[idioma];
    for (const parte of partes) {
      valor = valor?.[parte];
    }
    return valor ?? chave;
  }

  return (
    <LanguageContext.Provider value={{ idioma, setIdioma, alternarIdioma, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage deve ser usado dentro do LanguageProvider');
  }
  return context;
}
