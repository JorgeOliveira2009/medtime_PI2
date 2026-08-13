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
  TextInput,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import logo from '../Pages/logo.png';
import MenuLateral from '../Components/MenuLateral';
import { useRemedios } from '../Contexts/RemediosContext';

const PaginaPerfil = ({ navigation }: any) => {
  const { remedios } = useRemedios();
  const [menuVisible, setMenuVisible] = useState(false);
  const [editando, setEditando] = useState(false);

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [anotacoes, setAnotacoes] = useState('');

  // Temporários para edição
  const [nomeTemp, setNomeTemp] = useState('');
  const [telefoneTemp, setTelefoneTemp] = useState('');
  const [anotacoesTemp, setAnotacoesTemp] = useState('');

  function abrirEdicao() {
    setNomeTemp(nome);
    setTelefoneTemp(telefone);
    setAnotacoesTemp(anotacoes);
    setEditando(true);
  }

  function salvarEdicao() {
    setNome(nomeTemp.trim());
    setTelefone(telefoneTemp.trim());
    setAnotacoes(anotacoesTemp.trim());
    setEditando(false);
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
            <Text style={styles.greeting}>Meu Perfil</Text>
            <Text style={styles.headerSub}>Suas informações pessoais</Text>
          </View>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuVisible(true)}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* ── Card de perfil ── */}
        <View style={styles.card}>
          {/* Avatar */}
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nomeText}>
                {nome || 'Seu nome aqui'}
              </Text>
              <Text style={styles.telefoneText}>
                {telefone ? `📞 ${telefone}` : 'Telefone não informado'}
              </Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={abrirEdicao}>
              <Text style={styles.editBtnText}>✏️ Editar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Anotações ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📝 Anotações</Text>
          {anotacoes ? (
            <Text style={styles.anotacoesText}>{anotacoes}</Text>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhuma anotação ainda</Text>
              <Text style={styles.emptySubtext}>Toque em Editar para adicionar</Text>
            </View>
          )}
        </View>

        {/* ── Remédios tomados do dia ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>💊 Remédios tomados hoje</Text>
          {remedios.filter(r => r.tomado).length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhum remédio registrado</Text>
              <Text style={styles.emptySubtext}>Os remédios marcados aparecerão aqui</Text>
            </View>
          ) : (
            remedios.filter(r => r.tomado).map(r => (
              <View key={r.id} style={styles.tomadoRow}>
                <Text style={styles.tomadoHorario}>{r.horario}</Text>
                <Text style={styles.tomadoNome}>{r.nome}</Text>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Modal de edição ── */}
      <Modal
        visible={editando}
        transparent
        animationType="slide"
        onRequestClose={() => setEditando(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar perfil</Text>

            <Text style={styles.inputLabel}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome completo"
              placeholderTextColor="#B0BEC5"
              value={nomeTemp}
              onChangeText={setNomeTemp}
            />

            <Text style={styles.inputLabel}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#B0BEC5"
              value={telefoneTemp}
              onChangeText={setTelefoneTemp}
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Anotações</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Alergias, observações médicas..."
              placeholderTextColor="#B0BEC5"
              value={anotacoesTemp}
              onChangeText={setAnotacoesTemp}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setEditando(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnSave}
                onPress={salvarEdicao}
              >
                <Text style={styles.modalBtnSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Menu lateral ── */}
      <MenuLateral
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

export default PaginaPerfil;

/* ─── Estilos ─── */
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

  /* Perfil */
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: BG, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: TEAL,
  },
  avatarIcon: { fontSize: 30 },
  nomeText: { fontSize: 16, fontWeight: '800', color: DARK },
  telefoneText: { fontSize: 13, color: GRAY, marginTop: 3 },
  editBtn: {
    backgroundColor: BG, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: TEAL,
  },
  editBtnText: { fontSize: 12, fontWeight: '700', color: TEAL },

  /* Seções */
  sectionTitle: { fontSize: 16, fontWeight: '800', color: DARK, marginBottom: 12 },
  anotacoesText: { fontSize: 14, color: DARK, lineHeight: 22 },

  emptyState: { alignItems: 'center', paddingVertical: 20 },
  emptyText: { fontSize: 14, fontWeight: '700', color: DARK, marginBottom: 4 },
  emptySubtext: { fontSize: 12, color: GRAY },

   tomadoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F4F8',
  },
  tomadoHorario: { fontSize: 12, fontWeight: '700', color: TEAL, minWidth: 44 },
  tomadoNome: { fontSize: 14, color: DARK, fontWeight: '600' },

  /* Modal */
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: WHITE, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 28, paddingBottom: 40,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: DARK, marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: DARK, marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 12,
    paddingVertical: 13, paddingHorizontal: 16,
    fontSize: 14, color: DARK, marginBottom: 14,
  },
  inputMultiline: { height: 100, marginBottom: 4 },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalBtnCancel: {
    flex: 1, height: 50, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E0E0E0',
    justifyContent: 'center', alignItems: 'center',
  },
  modalBtnCancelText: { color: GRAY, fontSize: 15, fontWeight: '700' },
  modalBtnSave: {
    flex: 1, height: 50, borderRadius: 14, backgroundColor: TEAL,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: TEAL, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 5,
  },
  modalBtnSaveText: { color: WHITE, fontSize: 15, fontWeight: '700' },
});
