import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const API_URL = 'https://backend-or-main-production-2a36.up.railway.app';

/* ─── Tipos ─── */
export interface Remedio {
  id: number;
  nome: string;
  horario: string;
  tomado: boolean;
  observacoes?: string;
  notificationId?: string;
  data: string;
}

interface RemediosContextType {
  remedios: Remedio[];
  carregado: boolean;

  adicionarRemedio: (r: Remedio) => void;
  toggleRemedio: (id: number) => void;
  removerRemedio: (id: number) => void;
}

const RemediosContext = createContext<RemediosContextType | undefined>(
  undefined
);

/*
 * Garante que o campo "data" sempre fique no formato YYYY-MM-DD,
 * mesmo que o backend devolva com hora/timezone junto
 * (ex: "2026-09-08T00:00:00.000Z" -> "2026-09-08").
 *
 * Isso é essencial porque o filtro de "remédios do dia" na
 * PaginaPrincipal compara essa string exatamente com a data
 * selecionada no calendário (r.data === dataSelecionada).
 * Se os formatos não baterem, o remédio existe no array mas
 * nunca aparece na lista — parecendo que "sumiu".
 */
function normalizarData(data: unknown): string {
  return String(data ?? '').slice(0, 10);
}

/*
 * FALLBACK TEMPORÁRIO — remover quando o backend passar a
 * salvar/devolver o campo "data" corretamente.
 *
 * Hoje o backend não persiste o campo "data" (o dia escolhido
 * no calendário) — o GET /remedio só devolve "createdAt" e
 * "updatedAt". Sem isso, todo remédio ficava com data vazia
 * e nunca aparecia em nenhum dia do calendário.
 *
 * Enquanto o back não adiciona a coluna "data", usamos a data
 * de criação (createdAt) como aproximação, só para o remédio
 * não sumir da tela. Isso NÃO é o comportamento final —
 * um remédio marcado para uma data futura no calendário vai
 * continuar aparecendo na data de hoje até o backend ser corrigido.
 */
function normalizarRemedio(r: any): Remedio {
  const dataBackend = normalizarData(r.data);
  const dataFallback = normalizarData(r.createdAt);

  return {
    ...r,
    data: dataBackend || dataFallback,
  };
}

/* ─── Provider ─── */
export function RemediosProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, carregado: authCarregado } = useAuth();

  const [remedios, setRemedios] = useState<Remedio[]>([]);
  const [carregado, setCarregado] = useState(false);

  /*
   * Carrega os remédios diretamente do banco
   * quando o usuário estiver autenticado.
   */
  useEffect(() => {
    if (!authCarregado) return;

    if (!user || !token) {
      setRemedios([]);
      setCarregado(true);
      return;
    }

    setCarregado(false);

    fetch(`${API_URL}/remedio`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async res => {
        const json = await res.json();

        if (!res.ok) {
          throw new Error(
            json.message || 'Erro ao carregar remédios'
          );
        }

        return json;
      })
      .then(json => {
        // DEBUG: descomente a linha abaixo se precisar
        // conferir o formato exato que o backend está devolvendo.
        // console.log('REMEDIOS DO BACKEND:', JSON.stringify(json.data, null, 2));

        const lista = (json.data ?? []).map(normalizarRemedio);
        setRemedios(lista);
      })
      .catch(err => {
        console.error('Erro ao carregar remédios:', err);
      })
      .finally(() => {
        setCarregado(true);
      });
  }, [user, token, authCarregado]);

  /*
   * Adiciona na lista o remédio que já foi salvo
   * no banco pela PaginaPrincipal.
   *
   * O ID usado aqui é o ID REAL vindo do banco.
   * Também normalizamos a data aqui por segurança,
   * caso essa função venha a ser chamada de outro lugar
   * sem passar pela mesma sobrescrita manual da tela.
   */
  function adicionarRemedio(remedio: Remedio) {
    setRemedios(prev => [...prev, normalizarRemedio(remedio)]);
  }

  /*
   * Marca/desmarca o remédio como tomado
   * e também atualiza o banco.
   */
  async function toggleRemedio(id: number) {
    const remedio = remedios.find(r => r.id === id);

    if (!remedio || !token) return;

    const novoEstado = !remedio.tomado;

    // Atualização otimista da tela
    setRemedios(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, tomado: novoEstado }
          : r
      )
    );

    try {
      const res = await fetch(
        `${API_URL}/remedio/${id}/tomado`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Erro ao atualizar remédio');
      }
    } catch (error) {
      console.error('Erro ao marcar remédio:', error);

      // Reverte a alteração se o banco falhar
      setRemedios(prev =>
        prev.map(r =>
          r.id === id
            ? { ...r, tomado: remedio.tomado }
            : r
        )
      );
    }
  }

  /*
   * Remove o remédio da tela e do banco.
   */
  async function removerRemedio(id: number) {
    const removido = remedios.find(r => r.id === id);

    if (!removido || !token) return;

    // Remove da tela imediatamente
    setRemedios(prev =>
      prev.filter(r => r.id !== id)
    );

    try {
      const res = await fetch(
        `${API_URL}/remedio/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Erro ao deletar remédio');
      }
    } catch (error) {
      console.error('Erro ao remover remédio:', error);

      // Recoloca na lista se o banco falhar
      setRemedios(prev => [...prev, removido]);
    }
  }

  return (
    <RemediosContext.Provider
      value={{
        remedios,
        carregado,
        adicionarRemedio,
        toggleRemedio,
        removerRemedio,
      }}
    >
      {children}
    </RemediosContext.Provider>
  );
}

/* ─── Hook de acesso ─── */
export function useRemedios() {
  const ctx = useContext(RemediosContext);

  if (!ctx) {
    throw new Error(
      'useRemedios deve ser usado dentro de um <RemediosProvider>'
    );
  }

  return ctx;
}
