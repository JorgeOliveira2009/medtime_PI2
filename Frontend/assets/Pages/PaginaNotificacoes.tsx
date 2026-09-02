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

import logo from './logo.png';
import MenuLateral from '../Components/MenuLateral';
import { useTheme } from '../Contexts/ThemeContext';
import { useLanguage } from '../Contexts/LanguageContext';

interface Notificacao {
  id: number;
  mensagem: string;
  horario: string;
  lida: boolean;
}

const coresClaro = {
  background: '#E0F7FA',
  card: '#FFFFFF',
  text: '#263238',
  textSecondary: '#78909C',
  border: '#F0F4F8',
  iconBox: '#E0F7FA',
};

const coresEscuro = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#F5F5F5',
  textSecondary: '#AAAAAA',
  border: '#2C2C2C',
  iconBox: '#2A2A2A',
};

const TEAL = '#00BCD4';
const ERROR = '#E53935';

const getStyles = (colors: typeof coresClaro) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 },
  logoBox: { width: 52, height: 52, borderRadius: 14, backgroundColor: colors.card, justifyContent: 'center', alignItems: 'center', shadowColor: TEAL, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 },
  logoImg: { width: 40, height: 40, resizeMode: 'contain', borderRadius: 10 },
  greeting: { fontSize: 18, fontWeight: '800', color: colors.text },
  headerSub: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  menuBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.card, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  menuIcon: { fontSize: 18, color: colors.text },
  card: { marginHorizontal: 20, marginBottom: 16, backgroundColor: colors.card, borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 16, elevation: 5 },
  progressCard: { marginHorizontal: 20, marginBottom: 16, backgroundColor: TEAL, borderRadius: 24, padding: 20, shadowColor: TEAL, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  progressTitle: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  progressBadge: { backgroundColor: '#FFF', color: TEAL, fontSize: 16, fontWeight: '800', paddingHorizontal: 12, paddingVertical: 2, borderRadius: 20, overflow: 'hidden' },
  progressAction: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 12 },
  notifRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  notifRowLida: { opacity: 0.6 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: TEAL, marginTop: 2 },
  dotLido: { backgroundColor: '#CFD8DC' },
  notifContent: { flex: 1 },
  notifMensagem: { fontSize: 14, fontWeight: '600', color: colors.text, lineHeight: 20 },
  notifMensagemLida: { fontWeight: '400', color: colors.textSecondary },
  notifFooter: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  horarioBadge: { backgroundColor: colors.iconBox, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  horarioBadgeLido: { backgroundColor: colors.border },
  horarioText: { fontSize: 11, fontWeight: '700', color: TEAL },
  horarioTextLido: { color: colors.textSecondary },
  tapHint: { fontSize: 11, color: colors.textSecondary, fontStyle: 'italic' },
  removeBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center' },
  removeBtnText: { color: ERROR, fontSize: 12, fontWeight: '800' },
  emptyState: { alignItems: 'center', paddingVertical: 28 },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyText: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 },
  emptySubtext: { fontSize: 13, color: colors.textSecondary },
});

const PaginaNotificacoes = ({ navigation }: any) => {
  const { darkMode } = useTheme();
  const { t } = useLanguage();
  const colors = darkMode ? coresEscuro : coresClaro;
  const styles = getStyles(colors);

  const [menuVisible, setMenuVisible] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  function marcarLida(id: number) {
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
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
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Image source={logo} style={styles.logoImg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{t('notificacoes.titulo')}</Text>
            <Text style={styles.headerSub}>
              {naoLidas > 0
                ? `${naoLidas} ${naoLidas > 1 ? t('notificacoes.naoLidasPlural') : t('notificacoes.naoLidaSingular')}`
                : t('notificacoes.tudoEmDia')}
            </Text>
          </View>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuVisible(true)}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>

        {naoLidas > 0 && (
          <View style={styles.progressCard}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>{t('notificacoes.lembretesPendentes')}</Text>
              <Text style={styles.progressBadge}>{naoLidas}</Text>
            </View>
            <TouchableOpacity onPress={marcarTodasLidas}>
              <Text style={styles.progressAction}>{t('notificacoes.marcarTodasLidas')}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('notificacoes.hoje')}</Text>

          {notificacoes.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔕</Text>
              <Text style={styles.emptyText}>{t('notificacoes.semNotificacoes')}</Text>
              <Text style={styles.emptySubtext}>{t('notificacoes.emDia')}</Text>
            </View>
          )}

          {notificacoes.map(n => (
            <TouchableOpacity key={n.id} style={[styles.notifRow, n.lida && styles.notifRowLida]} onPress={() => marcarLida(n.id)} activeOpacity={0.7}>
              <View style={[styles.dot, n.lida && styles.dotLido]} />
              <View style={styles.notifContent}>
                <Text style={[styles.notifMensagem, n.lida && styles.notifMensagemLida]}>{n.mensagem}</Text>
                <View style={styles.notifFooter}>
                  <View style={[styles.horarioBadge, n.lida && styles.horarioBadgeLido]}>
                    <Text style={[styles.horarioText, n.lida && styles.horarioTextLido]}>⏰ {n.horario}</Text>
                  </View>
                  {!n.lida && <Text style={styles.tapHint}>{t('notificacoes.tocarMarcar')}</Text>}
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

      <MenuLateral visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />
    </SafeAreaView>
  );
};

export default PaginaNotificacoes;
