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
  Modal,
  TextInput,
  Platform,           
  KeyboardAvoidingView,
} from 'react-native';

import logo from '../Pages/logo.png';
import MenuLateral from '../Components/MenuLateral';

/* ─── Tipos ─── */
interface Remedio {
  id: number;
  nome: string;
  horario: string;
  tomado: boolean;
}

const MESES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];
const DIAS_SEMANA = ['D','S','T','Q','Q','S','S'];

function getDiasNoMes(ano: number, mes: number) {
  return new Date(ano, mes + 1, 0).getDate();
}
function getPrimeiroDia(ano: number, mes: number) {
  return new Date(ano, mes, 1).getDay();
}

/* ─── Componente principal ─── */
const PaginaPrincipal = ({ navigation }: any) => {
  const hoje = new Date();
  const [mesSel, setMesSel] = useState(hoje.getMonth());
  const [anoSel, setAnoSel] = useState(hoje.getFullYear());
  const [diaSel, setDiaSel] = useState(hoje.getDate());
  const [remedios, setRemedios] = useState<Remedio[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoHorario, setNovoHorario] = useState('');
  const [erroNome, setErroNome] = useState('');
  const [erroHorario, setErroHorario] = useState('');

  const tomados = remedios.filter(r => r.tomado).length;
  const total = remedios.length;

  function toggleRemedio(id: number) {
    setRemedios(prev =>
      prev.map(r => (r.id === id ? { ...r, tomado: !r.tomado } : r))
    );
  }

  function removerRemedio(id: number) {
    setRemedios(prev => prev.filter(r => r.id !== id));
  }

  function mudarMes(delta: number) {
    let novoMes = mesSel + delta;
    let novoAno = anoSel;
    if (novoMes > 11) { novoMes = 0; novoAno++; }
    if (novoMes < 0)  { novoMes = 11; novoAno--; }
    setMesSel(novoMes);
    setAnoSel(novoAno);
  }

  function abrirModal() {
    setNovoNome('');
    setNovoHorario('');
    setErroNome('');
    setErroHorario('');
    setModalVisible(true);
  }

  function salvarRemedio() {
    let valido = true;

    if (!novoNome.trim()) {
      setErroNome('Informe o nome do remédio');
      valido = false;
    } else {
      setErroNome('');
    }

    const horarioValido = /^\d{2}:\d{2}$/.test(novoHorario.trim());
    const partes = novoHorario.split(':');
    const hora = parseInt(partes[0], 10);
    const minuto = parseInt(partes[1] ?? '', 10);
    const horaValida = hora >= 0 && hora <= 23;
    const minutoValido = minuto >= 0 && minuto <= 59;

    if (!novoHorario.trim()) {
      setErroHorario('Informe o horário');
      valido = false;
    } else if (!horarioValido || !horaValida || !minutoValido) {
      setErroHorario('Horário inválido (00:00 até 23:59)');
      valido = false;
    } else {
      setErroHorario('');
    }

    if (!valido) return;

    setRemedios(prev => [
      ...prev,
      {
        id: Date.now(),
        nome: novoNome.trim(),
        horario: novoHorario.trim(),
        tomado: false,
      },
    ]);

    setModalVisible(false);
  }

  const celulas: (number | null)[] = [
    ...Array(getPrimeiroDia(anoSel, mesSel)).fill(null),
    ...Array.from({ length: getDiasNoMes(anoSel, mesSel) }, (_, i) => i + 1),
  ];

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
            <Text style={styles.greeting}>Bom dia! 👋</Text>
            <Text style={styles.headerSub}>Veja seus remédios de hoje</Text>
          </View>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuVisible(true)}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* ── Progresso do dia ── */}
        <View style={styles.progressCard}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Progresso de hoje</Text>
            <Text style={styles.progressCount}>
              <Text style={styles.progressDone}>{tomados}</Text>/{total}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: total > 0 ? `${(tomados / total) * 100}%` as any : '0%' },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {total === 0
              ? 'Nenhum remédio adicionado'
              : tomados === total
              ? '✅ Todos tomados!'
              : `${total - tomados} restante${total - tomados > 1 ? 's' : ''}`}
          </Text>
        </View>

        {/* ── Calendário ── */}
        <View style={styles.card}>
          <View style={styles.calHeader}>
            <TouchableOpacity onPress={() => mudarMes(-1)} style={styles.calArrow}>
              <Text style={styles.calArrowText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.calTitle}>{MESES[mesSel]} {anoSel}</Text>
            <TouchableOpacity onPress={() => mudarMes(1)} style={styles.calArrow}>
              <Text style={styles.calArrowText}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.calWeekRow}>
            {DIAS_SEMANA.map((d, i) => (
              <Text key={i} style={styles.calWeekDay}>{d}</Text>
            ))}
          </View>

          <View style={styles.calGrid}>
            {celulas.map((dia, i) => {
              const isHoje = dia === hoje.getDate() && mesSel === hoje.getMonth() && anoSel === hoje.getFullYear();
              const isSel = dia === diaSel && mesSel === hoje.getMonth() && anoSel === hoje.getFullYear();
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.calCell,
                    isSel && styles.calCellSelected,
                    isHoje && !isSel && styles.calCellToday,
                  ]}
                  onPress={() => dia && setDiaSel(dia)}
                  disabled={!dia}
                >
                  <Text style={[
                    styles.calDayText,
                    isSel && styles.calDayTextSelected,
                    isHoje && !isSel && styles.calDayTextToday,
                    !dia && { opacity: 0 },
                  ]}>
                    {dia ?? ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Lista de remédios ── */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Remédios — {String(diaSel).padStart(2,'0')}/{String(mesSel+1).padStart(2,'0')}
            </Text>
          </View>

          {remedios.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💊</Text>
              <Text style={styles.emptyText}>Nenhum remédio cadastrado</Text>
              <Text style={styles.emptySubtext}>Toque no botão abaixo para adicionar</Text>
            </View>
          )}

          {remedios.map(r => (
            <View key={r.id} style={styles.remedioRow}>
              <View style={[styles.horarioBadge, r.tomado && styles.horarioBadgeDone]}>
                <Text style={[styles.horarioText, r.tomado && styles.horarioTextDone]}>
                  {r.horario}
                </Text>
              </View>

              <Text style={[styles.remedioNome, r.tomado && styles.remedioNomeDone]} numberOfLines={1}>
                {r.nome}
              </Text>

              <View style={styles.remedioActions}>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => removerRemedio(r.id)}
                >
                  <Text style={styles.deleteBtnText}>✕</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.checkBtn, r.tomado && styles.checkBtnDone]}
                  onPress={() => toggleRemedio(r.id)}
                >
                  <Text style={styles.checkIcon}>{r.tomado ? '✓' : ''}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addBtn} onPress={abrirModal}>
            <Text style={styles.addBtnText}>+ Adicionar remédio</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Modal adicionar remédio ── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Novo remédio</Text>

            <Text style={styles.inputLabel}>Nome do remédio</Text>
            <TextInput
              style={[styles.input, erroNome ? styles.inputError : null]}
              placeholder="Ex: Paracetamol 500mg"
              placeholderTextColor="#B0BEC5"
              value={novoNome}
              onChangeText={t => { setNovoNome(t); setErroNome(''); }}
            />
            {erroNome ? <Text style={styles.erroText}>{erroNome}</Text> : null}

            <Text style={styles.inputLabel}>Horário</Text>
            <TextInput
              style={[styles.input, erroHorario ? styles.inputError : null]}
              placeholder="Ex: 0830"
              placeholderTextColor="#B0BEC5"
              value={novoHorario}
              onChangeText={t => {
                const apenasNumeros = t.replace(/\D/g, '').slice(0, 4);
                if (apenasNumeros.length <= 2) {
                  setNovoHorario(apenasNumeros);
                } else {
                  const hh = apenasNumeros.slice(0, 2);
                  const mm = apenasNumeros.slice(2, 4);
                  setNovoHorario(`${hh}:${mm}`);
                }
                setErroHorario('');
              }}
              keyboardType="numeric"
              maxLength={5}
            />
            {erroHorario ? <Text style={styles.erroText}>{erroHorario}</Text> : null}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnSave}
                onPress={salvarRemedio}
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

export default PaginaPrincipal;

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

  progressCard: {
    marginHorizontal: 20, marginBottom: 16, backgroundColor: TEAL,
    borderRadius: 24, padding: 20,
    shadowColor: TEAL, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  progressTitle: { color: WHITE, fontSize: 14, fontWeight: '600' },
  progressCount: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600' },
  progressDone: { color: WHITE, fontSize: 20, fontWeight: '800' },
  progressBarBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, marginBottom: 8 },
  progressBarFill: { height: 8, backgroundColor: WHITE, borderRadius: 4 },
  progressLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '500' },

  calHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  calArrow: { width: 32, height: 32, borderRadius: 10, backgroundColor: BG, justifyContent: 'center', alignItems: 'center' },
  calArrowText: { fontSize: 20, color: TEAL_DARK, fontWeight: '700', lineHeight: 24 },
  calTitle: { fontSize: 15, fontWeight: '700', color: DARK },
  calWeekRow: { flexDirection: 'row', marginBottom: 6 },
  calWeekDay: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '700', color: GRAY },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calCell: { width: `${100 / 7}%` as any, aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  calCellSelected: { backgroundColor: TEAL },
  calCellToday: { backgroundColor: '#E0F7FA', borderWidth: 1.5, borderColor: TEAL },
  calDayText: { fontSize: 13, color: DARK, fontWeight: '500' },
  calDayTextSelected: { color: WHITE, fontWeight: '800' },
  calDayTextToday: { color: TEAL, fontWeight: '800' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: DARK },

  emptyState: { alignItems: 'center', paddingVertical: 28 },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyText: { fontSize: 15, fontWeight: '700', color: DARK, marginBottom: 4 },
  emptySubtext: { fontSize: 13, color: GRAY },

  remedioRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F4F8', gap: 10,
  },
  horarioBadge: { backgroundColor: '#E0F7FA', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, minWidth: 52, alignItems: 'center' },
  horarioBadgeDone: { backgroundColor: '#E8F5E9' },
  horarioText: { fontSize: 11, fontWeight: '700', color: TEAL },
  horarioTextDone: { color: '#43A047' },
  remedioNome: { flex: 1, fontSize: 13, fontWeight: '600', color: DARK },
  remedioNomeDone: { color: GRAY, textDecorationLine: 'line-through' },
  remedioActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deleteBtn: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center',
  },
  deleteBtnText: { color: ERROR, fontSize: 12, fontWeight: '800' },
  checkBtn: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#CFD8DC', justifyContent: 'center', alignItems: 'center' },
  checkBtnDone: { backgroundColor: '#43A047', borderColor: '#43A047' },
  checkIcon: { color: WHITE, fontSize: 14, fontWeight: '800' },

  addBtn: {
    marginTop: 14, height: 48, borderRadius: 14,
    borderWidth: 1.5, borderColor: TEAL, borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center',
  },
  addBtnText: { color: TEAL, fontSize: 14, fontWeight: '700' },

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
    fontSize: 14, color: DARK, marginBottom: 4,
  },
  inputError: { borderColor: ERROR },
  erroText: { color: ERROR, fontSize: 12, marginBottom: 10, marginLeft: 4 },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalBtnCancel: {
    flex: 1, height: 50, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E0E0E0',
    justifyContent: 'center', alignItems: 'center',
  },
  modalBtnCancelText: { color: GRAY, fontSize: 15, fontWeight: '700' },
  modalBtnSave: {
    flex: 1, height: 50, borderRadius: 14,
    backgroundColor: TEAL, justifyContent: 'center', alignItems: 'center',
    shadowColor: TEAL, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 5,
  },
  modalBtnSaveText: { color: WHITE, fontSize: 15, fontWeight: '700' },
});