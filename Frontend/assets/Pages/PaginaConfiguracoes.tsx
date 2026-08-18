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

const API_URL = 'http://172.20.86.189:3000';

const PaginaConfiguracoes = ({ navigation }: any) => {
  const { user, token, logout, updateUser } = useAuth();

  // ─── Estados do menu ──────────────────────────────────
  const [menuVisible, setMenuVisible] = useState(false);
  const [idioma, setIdioma] = useState<'pt' | 'en'>('pt');
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const [deletando, setDeletando] = useState(false);

  // ─── Estados do modal de edição ─────────────────────
  const [modalEdicaoVisible, setModalEdicaoVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loadingEdicao, setLoadingEdicao] = useState(false);

  // Carrega os dados do usuário quando abre o modal
  useEffect(() => {
    if (user && modalEdicaoVisible) {
      setNome(user.nome || '');
      setEmail(user.email || '');
      setSenha('');
      setConfirmarSenha('');
    }
  }, [user, modalEdicaoVisible]);

  // ─── Sair ──────────────────────────────────────────────
  function handleLogout() {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'PaginaLogin' }],
          });
        },
      },
    ]);
  }

  // ─── Deletar conta ─────────────────────────────────────
  function handleDeletarConta() {
    Alert.alert(
      '⚠️ Deletar Conta',
      'Tem certeza que deseja deletar sua conta?\n\nEssa ação é IRREVERSÍVEL e todos os seus dados serão perdidos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, deletar',
          style: 'destructive',
          onPress: confirmarDeletarConta,
        },
      ]
    );
  }

  const confirmarDeletarConta = async () => {
    if (!user || !token) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    setDeletando(true);

    try {
      const response = await fetch(`${API_URL}/user/deletar-conta`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.sucesso) {
        await logout();
        Alert.alert('✅ Conta deletada', 'Sua conta foi removida com sucesso.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'PaginaLogin' }],
        });
      } else {
        Alert.alert('❌ Erro', data.message || 'Erro ao deletar conta');
      }
    } catch (error) {
      Alert.alert('❌ Erro', 'Não foi possível deletar sua conta. Tente novamente.');
    } finally {
      setDeletando(false);
    }
  };

  // ─── Editar perfil (MODAL) ────────────────────────────
  function handleAbrirEdicao() {
    setModalEdicaoVisible(true);
  }

  const handleSalvarEdicao = async () => {
    // Validações
    if (!nome || !email) {
      Alert.alert('Atenção', 'Nome e email são obrigatórios.');
      return;
    }

    if (nome.length < 3) {
      Alert.alert('Atenção', 'Nome deve ter pelo menos 3 caracteres.');
      return;
    }

    if (senha && senha.length < 8) {
      Alert.alert('Atenção', 'A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }

    if (senha && senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não conferem.');
      return;
    }

    setLoadingEdicao(true);

    try {
      const body: any = {
        nome: nome.trim(),
        email: email.trim(),
      };

      if (senha) {
        body.senha = senha;
      }

      const response = await fetch(`${API_URL}/user/atualizar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.sucesso) {
        // Atualiza o contexto
        await updateUser({
          id: user!.id,
          nome: nome.trim(),
          email: email.trim(),
        });

        Alert.alert('✅ Sucesso', 'Dados atualizados com sucesso!');
        setModalEdicaoVisible(false);
      } else {
        Alert.alert('❌ Erro', data.message || 'Erro ao atualizar dados');
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      Alert.alert('❌ Erro', 'Não foi possível atualizar seus dados.');
    } finally {
      setLoadingEdicao(false);
    }
  };

  // ─── Render ────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#E0F7FA" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ─── Header ─── */}
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

        {/* ─── Conta ─── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>👤 Conta</Text>

          {/* ✅ EDITAR PERFIL */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleAbrirEdicao}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}>
                <Text style={styles.settingIcon}>✏️</Text>
              </View>
              <Text style={styles.settingLabel}>Editar perfil</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Sair da conta */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}>
                <Text style={styles.settingIcon}>🚪</Text>
              </View>
              <Text style={styles.settingLabel}>Sair da conta</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Deletar conta */}
          <TouchableOpacity
            style={[styles.settingRow, styles.dangerRow]}
            onPress={handleDeletarConta}
            disabled={deletando}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBox, styles.dangerIconBox]}>
                <Text style={styles.settingIcon}>🗑️</Text>
              </View>
              <Text style={[styles.settingLabel, styles.dangerText]}>
                {deletando ? 'Deletando...' : 'Deletar conta'}
              </Text>
            </View>
            {deletando ? (
              <ActivityIndicator size="small" color="#E53935" />
            ) : (
              <Text style={styles.settingArrow}>›</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ─── MODAL DE EDIÇÃO ─── */}
      <Modal
        visible={modalEdicaoVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalEdicaoVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>✏️ Editar perfil</Text>

            <Text style={styles.inputLabel}>Nome completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome completo"
              placeholderTextColor="#B0BEC5"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu e-mail"
              placeholderTextColor="#B0BEC5"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.modalDivider} />

            <Text style={styles.modalSubtitle}>🔐 Alterar senha (opcional)</Text>

            <Text style={styles.inputLabel}>Nova senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Deixe em branco para manter"
              placeholderTextColor="#B0BEC5"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />

            <Text style={styles.inputLabel}>Confirmar nova senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a nova senha novamente"
              placeholderTextColor="#B0BEC5"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setModalEdicaoVisible(false)}
                disabled={loadingEdicao}
              >
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalBtnSave}
                onPress={handleSalvarEdicao}
                disabled={loadingEdicao}
              >
                {loadingEdicao ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.modalBtnSaveText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ─── Menu lateral ─── */}
      <MenuLateral
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

export default PaginaConfiguracoes;

// ─── Estilos ────────────────────────────────────────────
const TEAL = '#00BCD4';
const BG = '#E0F7FA';
const WHITE = '#FFFFFF';
const DARK = '#263238';
const GRAY = '#78909C';
const DANGER = '#E53935';
const DANGER_BG = '#FFEBEE';

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
  greeting: { fontSize: 18, fontWeight: '800', color: '#006064' },
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

  sectionTitle: { fontSize: 16, fontWeight: '800', color: DARK, marginBottom: 16 },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  dangerRow: {
    paddingVertical: 8,
    backgroundColor: DANGER_BG,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  settingIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerIconBox: {
    backgroundColor: '#FFCDD2',
  },
  settingIcon: { fontSize: 18 },
  settingLabel: { fontSize: 15, fontWeight: '600', color: DARK },
  dangerText: { color: DANGER },
  settingArrow: { fontSize: 22, color: '#B0BEC5' },

  divider: { height: 1, backgroundColor: '#F0F4F8', marginVertical: 8 },

  // ─── Modal ───
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: DARK,
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: GRAY,
    marginBottom: 12,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#F0F4F8',
    marginVertical: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: DARK,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    fontSize: 14,
    color: DARK,
    marginBottom: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalBtnCancel: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnCancelText: {
    color: GRAY,
    fontSize: 15,
    fontWeight: '700',
  },
  modalBtnSave: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: TEAL,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  modalBtnSaveText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '700',
  },
});