import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const API_URL = 'https://backend-or-main-production-2a36.up.railway.app';

export interface Remedio {
  id: number;
  nome: string;
  horario: string;
  tomado: boolean;
  observacoes?: string;
}

interface RemediosContextType {
  remedios: Remedio[];
  carregado: boolean;
  adicionarRemedio: (r: Remedio) => void;
  toggleRemedio: (id: number) => void;
  removerRemedio: (id: number) => void;
}

const RemediosContext = createContext<RemediosContextType | undefined>(undefined);

export function RemediosProvider({ children }: { children: React.ReactNode }) {
  const { user, token, carregado: authCarregado } = useAuth();
  const [remedios, setRemedios] = useState<Remedio[]>([]);
  const [carregado, setCarregado] = useState(false);

  // Carrega do banco quando o usuário loga
  useEffect(() => {
    if (!authCarregado) return;

    if (!user || !token) {
      setRemedios([]);
      setCarregado(true);
      return;
    }

    setCarregado(false);
    fetch(`${API_URL}/remedio`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(json => setRemedios(json.data ?? []))
      .catch(err => console.error('Erro ao carregar remédios:', err))
      .finally(() => setCarregado(true));
  }, [user, token, authCarregado]);

  // Chamada pelo PaginaPrincipal depois que o POST já retornou o remédio criado
  function adicionarRemedio(remedio: Remedio) {
    setRemedios(prev => [...prev, remedio]);
  }

  async function toggleRemedio(id: number) {
    const remedio = remedios.find(r => r.id === id);
    if (!remedio) return;

    // Otimista: atualiza a tela na hora
    setRemedios(prev =>
      prev.map(r => (r.id === id ? { ...r, tomado: !r.tomado } : r))
    );

    try {
      const res = await fetch(`${API_URL}/remedio/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tomado: !remedio.tomado }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Reverte se falhar
      setRemedios(prev =>
        prev.map(r => (r.id === id ? { ...r, tomado: remedio.tomado } : r))
      );
    }
  }

  async function removerRemedio(id: number) {
    // Otimista: remove da tela na hora
    setRemedios(prev => prev.filter(r => r.id !== id));

    try {
      const res = await fetch(`${API_URL}/remedio/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
    } catch {
      // Reverte se falhar
      const removido = remedios.find(r => r.id === id);
      if (removido) setRemedios(prev => [...prev, removido]);
    }
  }

  return (
    <RemediosContext.Provider
      value={{ remedios, carregado, adicionarRemedio, toggleRemedio, removerRemedio }}
    >
      {children}
    </RemediosContext.Provider>
  );
}

export function useRemedios() {
  const ctx = useContext(RemediosContext);
  if (!ctx) throw new Error('useRemedios deve ser usado dentro de um <RemediosProvider>');
  return ctx;
}