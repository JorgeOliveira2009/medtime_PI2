import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';

import logo from '../Pages/logo.png';
import MenuLateral from '../Components/MenuLateral';

interface Notificacao {
  id: number;
  mensagem: string;
  horario: string;
  lida: boolean;
}

const PaginaNotificacoes = ({ navigation }: any) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  function marcarLida(id: number) {
    setNotificacoes(prev =>
      prev.map(n => n.id === id ? { ...n, lida: true } : n)
    );
  }

  function remover(id: number) {
    setNotificacoes(prev => prev.filter(n => n.id !== id));
  }

  function marcarTodasLidas() {
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
  }

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#E0F7FA" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Image source={logo} style={styles.logoImg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Notificações</Text>
            <Text style={styles.headerSub}>
              {naoLidas > 0 ? `${naoLidas} não lida${naoLidas > 1 ? 's' : ''}` : 'Tudo em dia ✅'}
            </Text>
          </View>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuVisible(true)}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* ── Card de badge + ação ── */}
        {naoLidas > 0 && (
          <View style={styles.progressCard}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>🔔 Lembretes pendentes</Text>
              <Text style={styles.progressBadge}>{naoLidas}</Text>
            </View>
            <TouchableOpacity onPress={marcarTodasLidas}>
              <Text style={styles.progressAction}>Marcar todas como lidas →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Lista de notificações ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Hoje</Text>

          {notificacoes.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔕</Text>
              <Text style={styles.emptyText}>Sem notificações</Text>
              <Text style={styles.emptySubtext}>Você está em dia com seus remédios!</Text>
            </View>
          )}

          {notificacoes.map(n => (
            <TouchableOpacity
              key={n.id}
              style={[styles.notifRow, n.lida && styles.notifRowLida]}
              onPress={() => marcarLida(n.id)}
              activeOpacity={0.7}
            >
              {/* Indicador não lida */}
              <View style={[styles.dot, n.lida && styles.dotLido]} />

              <View style={styles.notifContent}>
                <Text style={[styles.notifMensagem, n.lida && styles.notifMensagemLida]}>
                  {n.mensagem}
                </Text>
                <View style={styles.notifFooter}>
                  <View style={[styles.horarioBadge, n.lida && styles.horarioBadgeLido]}>
                    <Text style={[styles.horarioText, n.lida && styles.horarioTextLido]}>
                      ⏰ {n.horario}
                    </Text>
                  </View>
                  {!n.lida && (
                    <Text style={styles.tapHint}>Toque para marcar como lida</Text>
                  )}
                </View>
              </View>

              <TouchableOpacity style={styles.removeBtn} onPress={() => remover(n.id)}>
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Menu lateral ── */}
      <MenuLateral
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

export default PaginaNotificacoes;

/* ─── Estilos ─── */
const TEAL = '#00BCD4';
const TEAL_DARK = '#006064';
const BG = '#E0F7FA';
const WHITE = '#FFFFFF';
const DARK = '#263238';
const GRAY = '#78909C';
const ERROR = '#E53935';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  scroll: { paddingBottom: 24 },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16,
  },
  logoBox: {
    width: 52, height: 52, borderRadius: 14, backgroundColor: WHITE,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: TEAL, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2, shadowRadius: 6, elevation: 4,
  },
  logoImg: { width: 40, height: 40, resizeMode: 'contain', borderRadius: 10 },
  greeting: { fontSize: 18, fontWeight: '800', color: TEAL_DARK },
  headerSub: { fontSize: 12, color: GRAY, marginTop: 1 },
  menuBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: WHITE,
    justifyContent: 'center', alignItems: 'center', elevation: 2,
  },
  menuIcon: { fontSize: 18, color: DARK },

  card: {
    marginHorizontal: 20, marginBottom: 16, backgroundColor: WHITE,
    borderRadius: 24, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07, shadowRadius: 16, elevation: 5,
  },

  /* Card de progresso/badge */
  progressCard: {
    marginHorizontal: 20, marginBottom: 16, backgroundColor: TEAL,
    borderRadius: 24, padding: 20,
    shadowColor: TEAL, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  progressInfo: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  progressTitle: { color: WHITE, fontSize: 14, fontWeight: '700' },
  progressBadge: {
    backgroundColor: WHITE, color: TEAL,
    fontSize: 16, fontWeight: '800',
    paddingHorizontal: 12, paddingVertical: 2,
    borderRadius: 20, overflow: 'hidden',
  },
  progressAction: {
    color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600',
  },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: DARK, marginBottom: 12 },

  /* Notificações */
  notifRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0F4F8',
  },
  notifRowLida: { opacity: 0.6 },
  dot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: TEAL, marginTop: 2,
  },
  dotLido: { backgroundColor: '#CFD8DC' },
  notifContent: { flex: 1 },
  notifMensagem: {
    fontSize: 14, fontWeight: '600', color: DARK, lineHeight: 20,
  },
  notifMensagemLida: { fontWeight: '400', color: GRAY },
  notifFooter: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6,
  },
  horarioBadge: {
    backgroundColor: BG, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  horarioBadgeLido: { backgroundColor: '#F5F5F5' },
  horarioText: { fontSize: 11, fontWeight: '700', color: TEAL },
  horarioTextLido: { color: GRAY },
  tapHint: { fontSize: 11, color: GRAY, fontStyle: 'italic' },
  removeBtn: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center',
  },
  removeBtnText: { color: ERROR, fontSize: 12, fontWeight: '800' },

  /* Empty */
  emptyState: { alignItems: 'center', paddingVertical: 28 },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyText: { fontSize: 15, fontWeight: '700', color: DARK, marginBottom: 4 },
  emptySubtext: { fontSize: 13, color: GRAY },
});
