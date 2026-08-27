import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';

import logo from './logo.png';
import MenuLateral from '../Components/MenuLateral';
import { useAuth } from '../Contexts/AuthContext';
import { useTheme } from '../Contexts/ThemeContext';

const API_URL = 'https://backend-or-main-production-2a36.up.railway.app'

const PaginaConfiguracoes = ({ navigation }: any) => {
  const { user, token, logout, updateUser } = useAuth();
  const { darkMode, alternarTema } = useTheme();
  const colors = darkMode ? coresEscuro : coresClaro; // ← cores dinâmicas
  const styles = getStyles(colors);                   // ← estilos dinâmicos

  const [menuVisible, setMenuVisible] = useState(false);
  const [idioma, setIdioma] = useState<'pt' | 'en'>('pt');
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const [deletando, setDeletando] = useState(false);

  const [modalEdicaoVisible, setModalEdicaoVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loadingEdicao, setLoadingEdicao] = useState(false);

  useEffect(() => {
    if (user && modalEdicaoVisible) {
      setNome(user.nome || '');
      setEmail(user.email || '');
      setSenha('');
      setConfirmarSenha('');
    }
  }, [user, modalEdicaoVisible]);

  function handleLogout() {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({ index: 0, routes: [{ name: 'PaginaLogin' }] });
        },
      },
    ]);
  }

  function handleDeletarConta() {
    Alert.alert(
      '⚠️ Deletar Conta',
      'Tem certeza que deseja deletar sua conta?\n\nEssa ação é IRREVERSÍVEL e todos os seus dados serão perdidos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sim, deletar', style: 'destructive', onPress: confirmarDeletarConta },
      ]
    );
  }

  const confirmarDeletarConta = async () => {
    if (!user || !token) { Alert.alert('Erro', 'Usuário não autenticado'); return; }
    setDeletando(true);
    try {
      const response = await fetch(`${API_URL}/user/deletar-conta`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.sucesso) {
        await logout();
        Alert.alert('✅ Conta deletada', 'Sua conta foi removida com sucesso.');
        navigation.reset({ index: 0, routes: [{ name: 'PaginaLogin' }] });
      } else {
        Alert.alert('❌ Erro', data.message || 'Erro ao deletar conta');
      }
    } catch (error) {
      Alert.alert('❌ Erro', 'Não foi possível deletar sua conta. Tente novamente.');
    } finally {
      setDeletando(false);
    }
  };

  function handleAbrirEdicao() { setModalEdicaoVisible(true); }

  const handleSalvarEdicao = async () => {
    if (!nome || !email) { Alert.alert('Atenção', 'Nome e email são obrigatórios.'); return; }
    if (nome.length < 3) { Alert.alert('Atenção', 'Nome deve ter pelo menos 3 caracteres.'); return; }
    if (senha && senha.length < 8) { Alert.alert('Atenção', 'A nova senha deve ter pelo menos 8 caracteres.'); return; }
    if (senha && senha !== confirmarSenha) { Alert.alert('Atenção', 'As senhas não conferem.'); return; }
    setLoadingEdicao(true);
    try {
      const body: any = { nome: nome.trim(), email: email.trim() };
      if (senha) body.senha = senha;
      const response = await fetch(`${API_URL}/user/atualizar`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.sucesso) {
        await updateUser({ id: user!.id, nome: nome.trim(), email: email.trim() });
        Alert.alert('✅ Sucesso', 'Dados atualizados com sucesso!');
        setModalEdicaoVisible(false);
      } else {
        Alert.alert('❌ Erro', data.message || 'Erro ao atualizar dados');
      }
    } catch (error) {
      Alert.alert('❌ Erro', 'Não foi possível atualizar seus dados.');
    } finally {
      setLoadingEdicao(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

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

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>👤 Conta</Text>

          <TouchableOpacity style={styles.settingRow} onPress={handleAbrirEdicao} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}><Text style={styles.settingIcon}>✏️</Text></View>
              <Text style={styles.settingLabel}>Editar perfil</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}><Text style={styles.settingIcon}>🌙</Text></View>
              <Text style={styles.settingLabel}>Modo escuro</Text>
            </View>
            <Switch value={darkMode} onValueChange={alternarTema} />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingRow} onPress={handleLogout} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}><Text style={styles.settingIcon}>🚪</Text></View>
              <Text style={styles.settingLabel}>Sair da conta</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={[styles.settingRow, styles.dangerRow]} onPress={handleDeletarConta} disabled={deletando} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBox, styles.dangerIconBox]}><Text style={styles.settingIcon}>🗑️</Text></View>
              <Text style={[styles.settingLabel, styles.dangerText]}>{deletando ? 'Deletando...' : 'Deletar conta'}</Text>
            </View>
            {deletando ? <ActivityIndicator size="small" color="#E53935" /> : <Text style={styles.settingArrow}>›</Text>}
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      <Modal visible={modalEdicaoVisible} transparent animationType="slide" onRequestClose={() => setModalEdicaoVisible(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>✏️ Editar perfil</Text>

            <Text style={styles.inputLabel}>Nome completo</Text>
            <TextInput style={styles.input} placeholder="Seu nome completo" placeholderTextColor={colors.textSecondary} value={nome} onChangeText={setNome} />

            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput style={styles.input} placeholder="Seu e-mail" placeholderTextColor={colors.textSecondary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

            <View style={styles.modalDivider} />
            <Text style={styles.modalSubtitle}>🔐 Alterar senha (opcional)</Text>

            <Text style={styles.inputLabel}>Nova senha</Text>
            <TextInput style={styles.input} placeholder="Deixe em branco para manter" placeholderTextColor={colors.textSecondary} value={senha} onChangeText={setSenha} secureTextEntry />

            <Text style={styles.inputLabel}>Confirmar nova senha</Text>
            <TextInput style={styles.input} placeholder="Digite a nova senha novamente" placeholderTextColor={colors.textSecondary} value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setModalEdicaoVisible(false)} disabled={loadingEdicao}>
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={handleSalvarEdicao} disabled={loadingEdicao}>
                {loadingEdicao ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.modalBtnSaveText}>Salvar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <MenuLateral visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />
    </SafeAreaView>
  );
};

export default PaginaConfiguracoes;

// ─── Paletas ────────────────────────────────────────────
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
const DANGER = '#E53935';
const DANGER_BG_CLARO = '#FFEBEE';
const DANGER_BG_ESCURO = '#3B1A1A';

// ─── Estilos dinâmicos ──────────────────────────────────
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
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 16 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
  dangerRow: { paddingVertical: 8, backgroundColor: colors.background === '#121212' ? DANGER_BG_ESCURO : DANGER_BG_CLARO, borderRadius: 12, paddingHorizontal: 8 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  settingIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.iconBox, justifyContent: 'center', alignItems: 'center' },
  dangerIconBox: { backgroundColor: colors.background === '#121212' ? '#5C1A1A' : '#FFCDD2' },
  settingIcon: { fontSize: 18 },
  settingLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  dangerText: { color: DANGER },
  settingArrow: { fontSize: 22, color: colors.textSecondary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, paddingBottom: 40, maxHeight: '90%' },
  modalTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 20 },
  modalSubtitle: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: 12 },
  modalDivider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  input: { borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 16, fontSize: 14, color: colors.text, backgroundColor: colors.background, marginBottom: 14 },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalBtnCancel: { flex: 1, height: 50, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  modalBtnCancelText: { color: colors.textSecondary, fontSize: 15, fontWeight: '700' },
  modalBtnSave: { flex: 1, height: 50, borderRadius: 14, backgroundColor: TEAL, justifyContent: 'center', alignItems: 'center', shadowColor: TEAL, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 5 },
  modalBtnSaveText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});