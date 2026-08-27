import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { Alert } from 'react-native';

const API_URL = 'https://backend-or-main-production-2a36.up.railway.app';

export interface Remedio {
  id: number;
  nome: string;
  horario: string;
  tomado: boolean;
}

interface RemediosContextType {
  remedios: Remedio[];
  carregado: boolean;
  adicionarRemedio: (r: Omit<Remedio, 'id' | 'tomado'>) => Promise<void>;
  toggleRemedio: (id: number) => Promise<void>;
  removerRemedio: (id: number) => Promise<void>;
}

const RemediosContext = createContext<RemediosContextType | undefined>(undefined);

export function RemediosProvider({ children }: { children: React.ReactNode }) {
  const { user, token, carregado: authCarregado } = useAuth();
  const [remedios, setRemedios] = useState<Remedio[]>([]);
  const [carregado, setCarregado] = useState(false);

  const storageKey = user ? `@medtime:remedios:${user.id}` : null;

  // Carregar remédios do backend ao iniciar
  useEffect(() => {
    if (!authCarregado || !token) {
      setCarregado(true);
      return;
    }
    carregarRemediosDoBackend();
  }, [authCarregado, token]);

  async function carregarRemediosDoBackend() {
    try {
      console.log('📥 Carregando remédios do backend...');
      
      const response = await fetch(`${API_URL}/remedio`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.sucesso && data.data) {
        setRemedios(data.data);
        if (storageKey) {
          await AsyncStorage.setItem(storageKey, JSON.stringify(data.data));
        }
      } else {
        console.error('Erro ao carregar:', data.message);
        await carregarDoCache();
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      await carregarDoCache();
    } finally {
      setCarregado(true);
    }
  }

  async function carregarDoCache() {
    try {
      const cached = await AsyncStorage.getItem(storageKey);
      if (cached) {
        setRemedios(JSON.parse(cached));
      }
    } catch (error) {
      console.error('Erro ao carregar cache:', error);
    }
  }

  // Salvar no cache quando mudar
  useEffect(() => {
    if (carregado && storageKey) {
      AsyncStorage.setItem(storageKey, JSON.stringify(remedios)).catch(err =>
        console.error('Erro ao salvar cache:', err)
      );
    }
  }, [remedios, carregado, storageKey]);

  // ADICIONAR REMÉDIO (CORRIGIDO)
  async function adicionarRemedio(dados: Omit<Remedio, 'id' | 'tomado'>) {
    try {
      if (!token) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      const response = await fetch(`${API_URL}/remedio`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: dados.nome,
          horario: dados.horario,
          tomado: false,
        }),
      });

      const data = await response.json();
      
      if (data.sucesso && data.data) {
        setRemedios(prev => [...prev, data.data]);
        Alert.alert('Sucesso', 'Remédio adicionado!');
      } else {
        Alert.alert('Erro', data.message || 'Erro ao criar remédio');
      }
    } catch (error) {
      console.error('Erro ao criar:', error);
      Alert.alert('Erro', 'Não foi possível criar o remédio');
    }
  }

  // TOGGLE REMÉDIO (CORRIGIDO)
  async function toggleRemedio(id: number) {
    try {
      // Atualiza localmente primeiro
      const remedio = remedios.find(r => r.id === id);
      if (!remedio) return;

      const novoEstado = !remedio.tomado;
      setRemedios(prev => prev.map(r => 
        r.id === id ? { ...r, tomado: novoEstado } : r
      ));

      // Envia para o backend
      const response = await fetch(`${API_URL}/remedio/${id}/tomado`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!data.sucesso) {
        // Rollback em caso de erro
        setRemedios(prev => prev.map(r =>
          r.id === id ? { ...r, tomado: !novoEstado } : r
        ));
        Alert.alert('Erro', data.message || 'Erro ao atualizar');
      }
    } catch (error) {
      console.error('Erro ao toggle:', error);
    }
  }

  // REMOVER REMÉDIO (CORRIGIDO)
  async function removerRemedio(id: number) {
    if (!token) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    const remediosBackup = [...remedios];

    try {
      // Remove otimisticamente
      setRemedios(prev => prev.filter(r => r.id !== id));

      const response = await fetch(`${API_URL}/remedio/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Rollback
        setRemedios(remediosBackup);
        throw new Error(data.message || 'Erro ao deletar');
      }

      Alert.alert('Sucesso', 'Remédio deletado!');

    } catch (error) {
      setRemedios(remediosBackup);
      console.error('Erro ao deletar:', error);
      Alert.alert('Erro', error.message || 'Não foi possível deletar');
    }
  }

  return (
    <RemediosContext.Provider value={{ 
      remedios, 
      carregado, 
      adicionarRemedio, 
      toggleRemedio, 
      removerRemedio 
    }}>
      {children}
    </RemediosContext.Provider>
  );
}

export function useRemedios() {
  const ctx = useContext(RemediosContext);
  if (!ctx) throw new Error('useRemedios deve ser usado dentro de um <RemediosProvider>');
  return ctx;
}