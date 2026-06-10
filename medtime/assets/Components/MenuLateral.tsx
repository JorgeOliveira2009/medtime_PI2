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

interface MenuLateralProps {
  visible: boolean;
  onClose: () => void;
  navigation: any;
}

const ITENS = [
  { icon: '🏠', label: 'Início',         rota: 'PaginaPrincipal' },
  { icon: '💊', label: 'Remédios',       rota: 'PaginaPrincipal' },
  { icon: '👤', label: 'Perfil',         rota: 'PaginaPerfil' },
  { icon: '🔔', label: 'Notificações',   rota: 'PaginaNotificacoes' },
  { icon: '❓', label: 'Ajuda',          rota: null },
  { icon: '⚙️', label: 'Configurações',  rota: null },
];

const MenuLateral = ({ visible, onClose, navigation }: MenuLateralProps) => {
  function navegar(rota: string | null) {
    onClose();
    if (rota) navigation?.navigate(rota);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Toque fora fecha */}
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

        {/* Drawer */}
        <SafeAreaView style={styles.drawer}>
          {/* Header do menu */}
          <View style={styles.drawerHeader}>
            <View style={styles.logoBox}>
              <Image source={logo} style={styles.logoImg} />
            </View>
            <View>
              <Text style={styles.appName}>MedTime</Text>
              <Text style={styles.appSub}>Seus remédios em dia</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Itens do menu */}
          <View style={styles.itemList}>
            {ITENS.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.menuItem}
                onPress={() => navegar(item.rota)}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconBox}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Sair */}
          <TouchableOpacity
            style={styles.sairBtn}
            onPress={() => { onClose(); navigation?.navigate('PaginaLogin'); }}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, styles.sairIconBox]}>
              <Text style={styles.menuIcon}>🚪</Text>
            </View>
            <Text style={styles.sairLabel}>Sair</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default MenuLateral;

/* ─── Estilos ─── */
const TEAL = '#00BCD4';
const TEAL_DARK = '#006064';
const BG = '#E0F7FA';
const WHITE = '#FFFFFF';
const DARK = '#263238';
const GRAY = '#78909C';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  drawer: {
    width: 270,
    backgroundColor: WHITE,
    paddingTop: StatusBar.currentHeight ?? 0,
  },

  /* Header */
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  logoBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImg: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  appName: {
    fontSize: 16,
    fontWeight: '800',
    color: TEAL_DARK,
  },
  appSub: {
    fontSize: 11,
    color: GRAY,
    marginTop: 1,
  },
  closeBtn: {
    marginLeft: 'auto',
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 13,
    color: DARK,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#F0F4F8',
    marginHorizontal: 20,
    marginVertical: 8,
  },

  /* Itens */
  itemList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 2,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 18,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: DARK,
  },
  menuArrow: {
    fontSize: 18,
    color: '#B0BEC5',
  },

  /* Sair */
  sairBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 12,
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  sairIconBox: {
    backgroundColor: '#FFEBEE',
  },
  sairLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E53935',
  },
});
