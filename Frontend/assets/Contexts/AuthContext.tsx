import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  carregado: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = '@medtime:user';
const TOKEN_KEY = '@medtime:token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [userData, tokenData] = await Promise.all([
          AsyncStorage.getItem(USER_KEY),
          AsyncStorage.getItem(TOKEN_KEY),
        ]);

        if (userData && tokenData) {
          setUser(JSON.parse(userData));
          setToken(tokenData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setCarregado(true);
      }
    };

    carregarDados();
  }, []);

  const login = async (userData: User, tokenData: string) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(USER_KEY, JSON.stringify(userData)),
        AsyncStorage.setItem(TOKEN_KEY, tokenData),
      ]);
      setUser(userData);
      setToken(tokenData);
    } catch (error) {
      console.error('Erro ao salvar login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(USER_KEY),
        AsyncStorage.removeItem(TOKEN_KEY),
      ]);
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const updateUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, carregado, login, logout, updateUser }}>
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