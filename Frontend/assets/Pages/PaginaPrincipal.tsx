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
  Alert,
} from 'react-native';

import logo from './logo.png';
import MenuLateral from '../Components/MenuLateral';
import { useRemedios } from '../Contexts/RemediosContext';
import { useAuth } from '../Contexts/AuthContext';
import { useLanguage } from '../Contexts/LanguageContext';
import { useTheme } from '../Contexts/ThemeContext';

const API_URL = 'https://backend-or-main-production-2a36.up.railway.app';

function getDiasNoMes(ano: number, mes: number) {
  return new Date(ano, mes + 1, 0).getDate();
}
function getPrimeiroDia(ano: number, mes: number) {
  return new Date(ano, mes, 1).getDay();
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
  progressTitle: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  progressCount: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600' },
  progressDone: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  progressBarBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, marginBottom: 8 },
  progressBarFill: { height: 8, backgroundColor: '#FFF', borderRadius: 4 },
  progressLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '500' },
  calHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  calArrow: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.iconBox, justifyContent: 'center', alignItems: 'center' },
  calArrowText: { fontSize: 20, color: colors.text, fontWeight: '700', lineHeight: 24 },
  calTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  calWeekRow: { flexDirection: 'row', marginBottom: 6 },
  calWeekDay: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '700', color: colors.textSecondary },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calCell: { width: `${100 / 7}%` as any, aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  calCellSelected: { backgroundColor: TEAL },
  calCellToday: { backgroundColor: colors.iconBox, borderWidth: 1.5, borderColor: TEAL },
  calDayText: { fontSize: 13, color: colors.text, fontWeight: '500' },
  calDayTextSelected: { color: '#FFF', fontWeight: '800' },
  calDayTextToday: { color: TEAL, fontWeight: '800' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  emptyState: { alignItems: 'center', paddingVertical: 28 },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyText: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 },
  emptySubtext: { fontSize: 13, color: colors.textSecondary },
  remedioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 10 },
  horarioBadge: { backgroundColor: colors.iconBox, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, minWidth: 52, alignItems: 'center' },
  horarioBadgeDone: { backgroundColor: '#E8F5E9' },
  horarioText: { fontSize: 11, fontWeight: '700', color: TEAL },
  horarioTextDone: { color: '#43A047' },
  remedioNome: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.text },
  remedioNomeDone: { color: colors.textSecondary, textDecorationLine: 'line-through' },
  remedioActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deleteBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center' },
  deleteBtnText: { color: ERROR, fontSize: 12, fontWeight: '800' },
  checkBtn: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#CFD8DC', justifyContent: 'center', alignItems: 'center' },
  checkBtnDone: { backgroundColor: '#43A047', borderColor: '#43A047' },
  checkIcon: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  addBtn: { marginTop: 14, height: 48, borderRadius: 14, borderWidth: 1.5, borderColor: TEAL, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  addBtnText: { color: TEAL, fontSize: 14, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  input: { borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 16, fontSize: 14, color: colors.text, backgroundColor: colors.background, marginBottom: 4 },
  inputError: { borderColor: ERROR },
  erroText: { color: ERROR, fontSize: 12, marginBottom: 10, marginLeft: 4 },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalBtnCancel: { flex: 1, height: 50, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  modalBtnCancelText: { color: colors.textSecondary, fontSize: 15, fontWeight: '700' },
  modalBtnSave: { flex: 1, height: 50, borderRadius: 14, backgroundColor: TEAL, justifyContent: 'center', alignItems: 'center', shadowColor: TEAL, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 5 },
  modalBtnSaveText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});

const PaginaPrincipal = ({ navigation }: any) => {
  const hoje = new Date();
  const { t } = useLanguage();
  const { darkMode } = useTheme();
  const colors = darkMode ? coresEscuro : coresClaro;
  const styles = getStyles(colors);

  const MESES: string[] = t('common.meses');
  const DIAS_SEMANA: string[] = t('common.diasSemana');

  const [mesSel, setMesSel] = useState(hoje.getMonth());
  const [anoSel, setAnoSel] = useState(hoje.getFullYear());
  const [diaSel, setDiaSel] = useState(hoje.getDate());
  const { remedios, adicionarRemedio, toggleRemedio, removerRemedio } = useRemedios();
  const { token } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoHorario, setNovoHorario] = useState('');
  const [novaObs, setNovaObs] = useState('');
  const [erroNome, setErroNome] = useState('');
  const [erroHorario, setErroHorario] = useState('');
  const [salvando, setSalvando] = useState(false);

  const tomados = remedios.filter(r => r.tomado).length;
  const total = remedios.length;

  function mudarMes(delta: number) {
    let novoMes = mesSel + delta;
    let novoAno = anoSel;
    if (novoMes > 11) { novoMes = 0; novoAno++; }
    if (novoMes < 0) { novoMes = 11; novoAno--; }
    setMesSel(novoMes);
    setAnoSel(novoAno);
  }

  function abrirModal() {
    setNovoNome(''); setNovoHorario(''); setNovaObs('');
    setErroNome(''); setErroHorario('');
    setModalVisible(true);
  }

  async function salvarRemedio() {
    let valido = true;
    if (!novoNome.trim()) { setErroNome(t('principal.informeNome')); valido = false; } else { setErroNome(''); }
    const horarioValido = /^\d{2}:\d{2}$/.test(novoHorario.trim());
    const partes = novoHorario.split(':');
    const hora = parseInt(partes[0], 10);
    const minuto = parseInt(partes[1] ?? '', 10);
    if (!novoHorario.trim()) { setErroHorario(t('principal.informeHorario')); valido = false; }
    else if (!horarioValido || hora > 23 || minuto > 59) { setErroHorario(t('principal.horarioInvalido')); valido = false; }
    else { setErroHorario(''); }
    if (!valido) return;

    setSalvando(true);
    try {
      const response = await fetch(`${API_URL}/remedio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ nome: novoNome.trim(), horario: novoHorario.trim(), ...(novaObs.trim() && { observacoes: novaObs.trim() }) }),
      });
      const json = await response.json();
      if (!response.ok) { Alert.alert(t('common.erro'), json.message ?? 'Erro ao salvar remédio'); return; }
      adicionarRemedio(json.data);
      setModalVisible(false);
    } catch (e) {
      Alert.alert(t('common.erro'), 'Não foi possível conectar ao servidor');
    } finally {
      setSalvando(false);
    }
  }

  const celulas: (number | null)[] = [
    ...Array(getPrimeiroDia(anoSel, mesSel)).fill(null),
    ...Array.from({ length: getDiasNoMes(anoSel, mesSel) }, (_, i) => i + 1),
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Image source={logo} style={styles.logoImg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{t('principal.bomDia')}</Text>
            <Text style={styles.headerSub}>{t('principal.veja')}</Text>
          </View>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuVisible(true)}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>{t('principal.progressoHoje')}</Text>
            <Text style={styles.progressCount}><Text style={styles.progressDone}>{tomados}</Text>/{total}</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: total > 0 ? `${(tomados / total) * 100}%` as any : '0%' }]} />
          </View>
          <Text style={styles.progressLabel}>
            {total === 0 ? t('principal.nenhumAdicionado') : tomados === total ? t('principal.todosTomados') : `${total - tomados} ${total - tomados > 1 ? t('principal.restantes') : t('principal.restante')}`}
          </Text>
        </View>

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
            {DIAS_SEMANA.map((d, i) => <Text key={i} style={styles.calWeekDay}>{d}</Text>)}
          </View>

          <View style={styles.calGrid}>
            {celulas.map((dia, i) => {
              const isHoje = dia === hoje.getDate() && mesSel === hoje.getMonth() && anoSel === hoje.getFullYear();
              const isSel = dia === diaSel && mesSel === hoje.getMonth() && anoSel === hoje.getFullYear();
              return (
                <TouchableOpacity key={i} style={[styles.calCell, isSel && styles.calCellSelected, isHoje && !isSel && styles.calCellToday]} onPress={() => dia && setDiaSel(dia)} disabled={!dia}>
                  <Text style={[styles.calDayText, isSel && styles.calDayTextSelected, isHoje && !isSel && styles.calDayTextToday, !dia && { opacity: 0 }]}>{dia ?? ''}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('principal.remedios')} — {String(diaSel).padStart(2, '0')}/{String(mesSel + 1).padStart(2, '0')}</Text>
          </View>

          {remedios.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💊</Text>
              <Text style={styles.emptyText}>{t('principal.nenhumCadastrado')}</Text>
              <Text style={styles.emptySubtext}>{t('principal.toqueAdicionar')}</Text>
            </View>
          )}

          {remedios.map(r => (
            <View key={r.id} style={styles.remedioRow}>
              <View style={[styles.horarioBadge, r.tomado && styles.horarioBadgeDone]}>
                <Text style={[styles.horarioText, r.tomado && styles.horarioTextDone]}>{r.horario}</Text>
              </View>
              <Text style={[styles.remedioNome, r.tomado && styles.remedioNomeDone]} numberOfLines={1}>{r.nome}</Text>
              <View style={styles.remedioActions}>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => removerRemedio(r.id)}>
                  <Text style={styles.deleteBtnText}>✕</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.checkBtn, r.tomado && styles.checkBtnDone]} onPress={() => toggleRemedio(r.id)}>
                  <Text style={styles.checkIcon}>{r.tomado ? '✓' : ''}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addBtn} onPress={abrirModal}>
            <Text style={styles.addBtnText}>{t('principal.adicionarRemedio')}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('principal.novoRemedio')}</Text>

            <Text style={styles.inputLabel}>{t('principal.nomeRemedio')}</Text>
            <TextInput style={[styles.input, erroNome ? styles.inputError : null]} placeholder={t('principal.nomeRemedioPlaceholder')} placeholderTextColor={colors.textSecondary} value={novoNome} onChangeText={t => { setNovoNome(t); setErroNome(''); }} />
            {erroNome ? <Text style={styles.erroText}>{erroNome}</Text> : null}

            <Text style={styles.inputLabel}>{t('principal.horario')}</Text>
            <TextInput
              style={[styles.input, erroHorario ? styles.inputError : null]}
              placeholder={t('principal.horarioPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={novoHorario}
              onChangeText={txt => {
                const apenasNumeros = txt.replace(/\D/g, '').slice(0, 4);
                if (apenasNumeros.length <= 2) { setNovoHorario(apenasNumeros); }
                else { setNovoHorario(`${apenasNumeros.slice(0, 2)}:${apenasNumeros.slice(2, 4)}`); }
                setErroHorario('');
              }}
              keyboardType="numeric"
              maxLength={5}
            />
            {erroHorario ? <Text style={styles.erroText}>{erroHorario}</Text> : null}

            <TextInput style={styles.input} placeholder="Ex: Tomar com água" placeholderTextColor={colors.textSecondary} value={novaObs} onChangeText={setNovaObs} />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setModalVisible(false)} disabled={salvando}>
                <Text style={styles.modalBtnCancelText}>{t('common.cancelar')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={salvarRemedio} disabled={salvando}>
                <Text style={styles.modalBtnSaveText}>{salvando ? '...' : t('common.salvar')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <MenuLateral visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />
    </SafeAreaView>
  );
};

export default PaginaPrincipal;