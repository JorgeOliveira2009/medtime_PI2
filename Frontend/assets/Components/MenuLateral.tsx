import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import logo from '../Pages/logo.png';
import { useTheme } from '../Contexts/ThemeContext';
import { useLanguage } from '../Contexts/LanguageContext';

interface MenuLateralProps {
  visible: boolean;
  onClose: () => void;
  navigation: any;
}

const ITENS = [
  { icon: '🏠', labelKey: 'menu.inicio',         rota: 'PaginaPrincipal' },
  { icon: '💊', labelKey: 'menu.remedios',       rota: 'PaginaPrincipal' },
  { icon: '👤', labelKey: 'menu.perfil',         rota: 'PaginaPerfil' },
  { icon: '🔔', labelKey: 'menu.notificacoes',   rota: 'PaginaNotificacoes' },
  { icon: '❓', labelKey: 'menu.ajuda',          rota: 'PaginaAjuda' },
  { icon: '⚙️', labelKey: 'menu.configuracoes',  rota: 'PaginaConfiguracoes' },
];

const coresClaro = {
  drawer: '#FFFFFF',
  text: '#263238',
  textSecondary: '#78909C',
  iconBox: '#E0F7FA',
  border: '#F0F4F8',
};

const coresEscuro = {
  drawer: '#1E1E1E',
  text: '#F5F5F5',
  textSecondary: '#AAAAAA',
  iconBox: '#2A2A2A',
  border: '#2C2C2C',
};

const getStyles = (colors: typeof coresClaro) => StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  drawer: { width: 270, backgroundColor: colors.drawer, paddingTop: StatusBar.currentHeight ?? 0 },
  drawerHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },
  logoBox: { width: 46, height: 46, borderRadius: 12, backgroundColor: colors.iconBox, justifyContent: 'center', alignItems: 'center' },
  logoImg: { width: 36, height: 36, resizeMode: 'contain', borderRadius: 8 },
  appName: { fontSize: 16, fontWeight: '800', color: colors.text },
  appSub: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  closeBtn: { marginLeft: 'auto', width: 32, height: 32, borderRadius: 10, backgroundColor: colors.iconBox, justifyContent: 'center', alignItems: 'center' },
  closeBtnText: { fontSize: 13, color: colors.text, fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 20, marginVertical: 8 },
  itemList: { paddingHorizontal: 12, paddingVertical: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 14, marginBottom: 2 },
  menuIconBox: { width: 38, height: 38, borderRadius: 10, backgroundColor: colors.iconBox, justifyContent: 'center', alignItems: 'center' },
  menuIcon: { fontSize: 18 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  menuArrow: { fontSize: 18, color: colors.textSecondary },
  sairBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 12, marginTop: 8, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 14 },
  sairIconBox: { backgroundColor: '#FFEBEE' },
  sairLabel: { fontSize: 15, fontWeight: '700', color: '#E53935' },
});

const MenuLateral = ({ visible, onClose, navigation }: MenuLateralProps) => {
  const { darkMode } = useTheme();
  const { t } = useLanguage();
  const colors = darkMode ? coresEscuro : coresClaro;
  const styles = getStyles(colors);

  function navegar(rota: string | null) {
    onClose();
    if (rota) navigation?.navigate(rota);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

        <SafeAreaView style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <View style={styles.logoBox}>
              <Image source={logo} style={styles.logoImg} />
            </View>
            <View>
              <Text style={styles.appName}>MedTime</Text>
              <Text style={styles.appSub}>{t('menu.appSub')}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.itemList}>
            {ITENS.map((item, i) => (
              <TouchableOpacity key={i} style={styles.menuItem} onPress={() => navegar(item.rota)} activeOpacity={0.7}>
                <View style={styles.menuIconBox}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.menuLabel}>{t(item.labelKey)}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.sairBtn} onPress={() => { onClose(); navigation?.navigate('PaginaLogin'); }} activeOpacity={0.7}>
            <View style={[styles.menuIconBox, styles.sairIconBox]}>
              <Text style={styles.menuIcon}>🚪</Text>
            </View>
            <Text style={styles.sairLabel}>{t('menu.sair')}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default MenuLateral;
