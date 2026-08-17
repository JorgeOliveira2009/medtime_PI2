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
import { useAuth } from '../Contexts/AuthContext';

const PaginaPerfil = ({ navigation }: any) => {
  const { user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#E0F7FA" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Image source={logo} style={styles.logoImg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Meu Perfil</Text>
            <Text style={styles.headerSub}>Suas informações pessoais</Text>
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
              <Text style={styles.nomeText}>
                {user?.nome || 'Carregando...'}
              </Text>
              <Text style={styles.emailText}>
                📧 {user?.email || 'Carregando...'}
              </Text>
            </View>
          </View>

          {/* ✅ Botão pra ir pras configurações */}
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => navigation.navigate('PaginaConfiguracoes')}
          >
            <Text style={styles.editProfileBtnText}>⚙️ Ir para Configurações</Text>
          </TouchableOpacity>
        </View>

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

export default PaginaPerfil;

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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  logoBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  logoImg: { width: 40, height: 40, resizeMode: 'contain', borderRadius: 10 },
  greeting: { fontSize: 18, fontWeight: '800', color: TEAL_DARK },
  headerSub: { fontSize: 12, color: GRAY, marginTop: 1 },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  menuIcon: { fontSize: 18, color: DARK },

  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 5,
  },

  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: BG,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: TEAL,
  },
  avatarIcon: { fontSize: 30 },
  nomeText: { fontSize: 18, fontWeight: '800', color: DARK },
  emailText: { fontSize: 14, color: GRAY, marginTop: 4 },

  editProfileBtn: {
    marginTop: 16,
    backgroundColor: TEAL,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  editProfileBtnText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '700',
  },
});