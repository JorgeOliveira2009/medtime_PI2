import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* ─── Tipos ─── */
export interface Remedio {
  id: number;
  nome: string;
  horario: string;
  tomado: boolean;
}

interface RemediosContextType {
  remedios: Remedio[];
  carregado: boolean;
  adicionarRemedio: (r: Omit<Remedio, 'id' | 'tomado'>) => void;
  toggleRemedio: (id: number) => void;
  removerRemedio: (id: number) => void;
}

const RemediosContext = createContext<RemediosContextType | undefined>(undefined);
const STORAGE_KEY = '@medtime:remedios';

/* ─── Provider ─── */
export function RemediosProvider({ children }: { children: React.ReactNode }) {
  const [remedios, setRemedios] = useState<Remedio[]>([]);
  const [carregado, setCarregado] = useState(false);

  // Carrega do disco assim que o app abre
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(json => {
        if (json) setRemedios(JSON.parse(json));
      })
      .catch(err => console.error('Erro ao carregar remédios:', err))
      .finally(() => setCarregado(true));
  }, []);

  // Salva no disco sempre que a lista mudar (depois do carregamento inicial)
  useEffect(() => {
    if (!carregado) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remedios)).catch(err =>
      console.error('Erro ao salvar remédios:', err)
    );
  }, [remedios, carregado]);

  function adicionarRemedio(dados: Omit<Remedio, 'id' | 'tomado'>) {
    setRemedios(prev => [
      ...prev,
      { ...dados, id: Date.now(), tomado: false },
    ]);
  }

  function toggleRemedio(id: number) {
    setRemedios(prev =>
      prev.map(r => (r.id === id ? { ...r, tomado: !r.tomado } : r))
    );
  }

  function removerRemedio(id: number) {
    setRemedios(prev => prev.filter(r => r.id !== id));
  }

  return (
    <RemediosContext.Provider
      value={{ remedios, carregado, adicionarRemedio, toggleRemedio, removerRemedio }}
    >
      {children}
    </RemediosContext.Provider>
  );
}

/* ─── Hook de acesso ─── */
export function useRemedios() {
  const ctx = useContext(RemediosContext);
  if (!ctx) {
    throw new Error('useRemedios deve ser usado dentro de um <RemediosProvider>');
  }
  return ctx;
}
