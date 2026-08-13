import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  usuarioAtual: string | null;
  carregado: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = '@medtime:usuarioAtual';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuarioAtual, setUsuarioAtual] = useState<string | null>(null);
  const [carregado, setCarregado] = useState(false);

  // Ao abrir o app, lembra quem estava logado da última vez
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(email => setUsuarioAtual(email))
      .catch(err => console.error('Erro ao carregar usuário atual:', err))
      .finally(() => setCarregado(true));
  }, []);

  function login(email: string) {
    const emailNormalizado = email.trim().toLowerCase();
    setUsuarioAtual(emailNormalizado);
    AsyncStorage.setItem(STORAGE_KEY, emailNormalizado).catch(err =>
      console.error('Erro ao salvar usuário atual:', err)
    );
  }

  function logout() {
    setUsuarioAtual(null);
    AsyncStorage.removeItem(STORAGE_KEY).catch(err =>
      console.error('Erro ao remover usuário atual:', err)
    );
  }

  return (
    <AuthContext.Provider value={{ usuarioAtual, carregado, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de um <AuthProvider>');
  }
  return ctx;
}
