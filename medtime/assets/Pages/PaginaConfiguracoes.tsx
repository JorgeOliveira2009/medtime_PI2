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
  Switch,
  Alert,
} from 'react-native';

import logo from '../Pages/logo.png';
import MenuLateral from '../Components/MenuLateral';

const PaginaConfiguracoes = ({ navigation }: any) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [idioma, setIdioma] = useState<'pt' | 'en'>('pt');
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);

  function handleTrocarusuario() {
    Alert.alert('Trocar usuário', 'Deseja sair e trocar de conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => navigation?.navigate('PaginaLogin') },
    ]);
  }

  function handleTrocarSenha() {
    Alert.alert('Troca de senha', 'Funcionalidade em breve!');
  }

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
            <Text style={styles.greeting}>Configurações</Text>
            <Text style={styles.headerSub}>Personalize seu app</Text>
          </View>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuVisible(true)}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* ── Idioma ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🌐 Idioma</Text>
          <View style={styles.idiomaRow}>
            <TouchableOpacity
              style={[styles.idiomaBtn, idioma === 'pt' && styles.idiomaBtnAtivo]}
              onPress={() => setIdioma('pt')}
            >
              <Text style={[styles.idiomaBtnText, idioma === 'pt' && styles.idiomaBtnTextAtivo]}>
                🇧🇷  Português
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.idiomaBtn, idioma === 'en' && styles.idiomaBtnAtivo]}
              onPress={() => setIdioma('en')}
            >
              <Text style={[styles.idiomaBtnText, idioma === 'en' && styles.idiomaBtnTextAtivo]}>
                🇺🇸  Inglês
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Aparência e notificações ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🎨 Preferências</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}>
                <Text style={styles.settingIcon}>🌙</Text>
              </View>
              <Text style={styles.settingLabel}>Tema escuro</Text>
            </View>
            <Switch
              value={temaEscuro}
              onValueChange={setTemaEscuro}
              trackColor={{ false: '#CFD8DC', true: TEAL }}
              thumbColor={WHITE}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}>
                <Text style={styles.settingIcon}>🔔</Text>
              </View>
              <Text style={styles.settingLabel}>Notificações</Text>
            </View>
            <Switch
              value={notificacoesAtivas}
              onValueChange={setNotificacoesAtivas}
              trackColor={{ false: '#CFD8DC', true: TEAL }}
              thumbColor={WHITE}
            />
          </View>
        </View>

        {/* ── Conta ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>👤 Conta</Text>

          <TouchableOpacity style={styles.settingRow} onPress={handleTrocarusuario} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}>
                <Text style={styles.settingIcon}>🔄</Text>
              </View>
              <Text style={styles.settingLabel}>Trocar usuário</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingRow} onPress={handleTrocarSenha} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}>
                <Text style={styles.settingIcon}>🔒</Text>
              </View>
              <Text style={styles.settingLabel}>Trocar senha</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ── Sair ── */}
        <TouchableOpacity
          style={styles.sairBtn}
          onPress={handleTrocarusuario}
          activeOpacity={0.8}
        >
          <Text style={styles.sairBtnText}>🚪  Sair da conta</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>

      <MenuLateral
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

export default PaginaConfiguracoes;

const TEAL = '#00BCD4';
const TEAL_DARK = '#006064';
const BG = '#E0F7FA';
const WHITE = '#FFFFFF';
const DARK = '#263238';
const GRAY = '#78909C';

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

  sectionTitle: { fontSize: 16, fontWeight: '800', color: DARK, marginBottom: 16 },

  /* Idioma */
  idiomaRow: { flexDirection: 'row', gap: 12 },
  idiomaBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  idiomaBtnAtivo: {
    backgroundColor: TEAL, borderColor: TEAL,
    shadowColor: TEAL, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  idiomaBtnText: { fontSize: 14, fontWeight: '700', color: GRAY },
  idiomaBtnTextAtivo: { color: WHITE },

  /* Configurações de toggle */
  settingRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: 6,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  settingIconBox: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: BG, justifyContent: 'center', alignItems: 'center',
  },
  settingIcon: { fontSize: 18 },
  settingLabel: { fontSize: 15, fontWeight: '600', color: DARK },
  settingArrow: { fontSize: 22, color: '#B0BEC5' },

  divider: { height: 1, backgroundColor: '#F0F4F8', marginVertical: 8 },

  /* Botão sair */
  sairBtn: {
    marginHorizontal: 20, height: 52, borderRadius: 16,
    backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#FFCDD2',
  },
  sairBtnText: { fontSize: 15, fontWeight: '700', color: '#E53935' },
});