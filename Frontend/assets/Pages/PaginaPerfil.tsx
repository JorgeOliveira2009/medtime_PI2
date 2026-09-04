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
import { useAuth } from '../Contexts/AuthContext';
import { useLanguage } from '../Contexts/LanguageContext';
import { useTheme } from '../Contexts/ThemeContext';
import { useRemedios } from '../Contexts/RemediosContext';

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
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.iconBox, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: TEAL },
  avatarIcon: { fontSize: 30 },
  nomeText: { fontSize: 18, fontWeight: '800', color: colors.text },
  emailText: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  editProfileBtn: { marginTop: 16, backgroundColor: TEAL, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  editProfileBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 12 },
  emptyState: { alignItems: 'center', paddingVertical: 20 },
  emptyText: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 4 },
  emptySubtext: { fontSize: 12, color: colors.textSecondary },
  tomadoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  tomadoHorario: { fontSize: 12, fontWeight: '700', color: TEAL, minWidth: 44 },
  tomadoNome: { fontSize: 14, color: colors.text, fontWeight: '600' },
});

const PaginaPerfil = ({ navigation }: any) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { darkMode } = useTheme();
  const { remedios } = useRemedios();
  const colors = darkMode ? coresEscuro : coresClaro;
  const styles = getStyles(colors);

  const [menuVisible, setMenuVisible] = useState(false);
  const tomadosHoje = remedios.filter(r => r.tomado);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Image source={logo} style={styles.logoImg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{t('perfil.titulo')}</Text>
            <Text style={styles.headerSub}>{t('perfil.subtitulo')}</Text>
          </View>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuVisible(true)}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nomeText}>{user?.nome || t('perfil.carregando')}</Text>
              <Text style={styles.emailText}>📧 {user?.email || t('perfil.carregando')}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editProfileBtn} onPress={() => navigation.navigate('PaginaConfiguracoes')}>
            <Text style={styles.editProfileBtnText}>{t('perfil.irConfiguracoes')}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Remédios tomados hoje ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('perfil.remediosHoje')}</Text>

          {tomadosHoje.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{t('perfil.nenhumRegistrado')}</Text>
              <Text style={styles.emptySubtext}>{t('perfil.apareceraoAqui')}</Text>
            </View>
          ) : (
            tomadosHoje.map(r => (
              <View key={r.id} style={styles.tomadoRow}>
                <Text style={styles.tomadoHorario}>{r.horario}</Text>
                <Text style={styles.tomadoNome}>{r.nome}</Text>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      <MenuLateral visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />
    </SafeAreaView>
  );
};

export default PaginaPerfil;
