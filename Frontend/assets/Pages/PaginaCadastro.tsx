import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import Input from '../Components/input';
import Botao from '../Components/Botao';
import logo from './logo.png';
import { useTheme } from '../Contexts/ThemeContext';
import { useLanguage } from '../Contexts/LanguageContext';

const API_URL = 'https://backend-or-main-production-2a36.up.railway.app'

const coresClaro = {
  background: '#E0F7FA',
  card: '#FFFFFF',
  text: '#263238',
  textSecondary: '#78909C',
};

const coresEscuro = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#F5F5F5',
  textSecondary: '#AAAAAA',
};

const TEAL = '#00BCD4';

const getStyles = (colors: typeof coresClaro) => StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 28, paddingTop: 60, paddingBottom: 32 },
  logoBox: { width: 68, height: 68, borderRadius: 18, backgroundColor: colors.card, justifyContent: 'center', alignItems: 'center', shadowColor: TEAL, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  logoImg: { width: 52, height: 52, borderRadius: 12, resizeMode: 'contain' },
  bemVindo: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  card: { marginHorizontal: 20, backgroundColor: colors.card, borderRadius: 28, padding: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 24, elevation: 8 },
  cardTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 24 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginText: { fontSize: 14, color: colors.textSecondary },
  loginLink: { fontSize: 14, color: TEAL, fontWeight: '700' },
});

const PaginaCadastro = ({ navigation }: any) => {
  const { darkMode } = useTheme();
  const { t } = useLanguage();
  const colors = darkMode ? coresEscuro : coresClaro;
  const styles = getStyles(colors);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !confirmarSenha) { Alert.alert(t('common.atencao'), t('cadastro.preencherTodos')); return; }
    if (nome.length < 3) { Alert.alert(t('common.atencao'), t('cadastro.nomeMinimo')); return; }
    if (senha.length < 8) { Alert.alert(t('common.atencao'), t('cadastro.senhaMinima')); return; }
    if (senha !== confirmarSenha) { Alert.alert(t('common.atencao'), t('cadastro.senhasNaoConferem')); return; }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/user/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ nome: nome.trim(), email: email.trim(), senha, confirmarSenha }),
      });

      const data = await response.json();

      if (data.sucesso) {
        Alert.alert(t('common.sucesso'), t('cadastro.cadastroSucesso'), [
          { text: 'OK', onPress: () => { setNome(''); setEmail(''); setSenha(''); setConfirmarSenha(''); navigation.navigate('PaginaLogin'); } }
        ]);
      } else {
        Alert.alert(t('common.erro'), data.message || t('cadastro.erroCadastro'));
      }
    } catch (error: any) {
      Alert.alert(t('cadastro.erroConexaoTitulo'), t('cadastro.erroConexaoMsg'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Image source={logo} style={styles.logoImg} />
          </View>
          <View>
            <Text style={styles.bemVindo}>{t('cadastro.ola')}</Text>
            <Text style={styles.subtitle}>{t('cadastro.subtitulo')}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('cadastro.titulo')}</Text>

          <Input label={t('cadastro.nomeCompleto')} placeholder={t('cadastro.nomeCompletoPlaceholder')} value={nome} onChangeText={setNome} />
          <Input label={t('cadastro.email')} placeholder={t('cadastro.emailPlaceholder')} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <Input label={t('cadastro.senha')} placeholder={t('cadastro.senhaPlaceholder')} isPassword value={senha} onChangeText={setSenha} />
          <Input label={t('cadastro.confirmarSenha')} placeholder={t('cadastro.confirmarSenhaPlaceholder')} isPassword value={confirmarSenha} onChangeText={setConfirmarSenha} />

          <Botao title={t('cadastro.cadastrar')} loading={loading} onPress={handleCadastro} />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>{t('cadastro.jaTemConta')}</Text>
            <TouchableOpacity onPress={() => navigation?.navigate('PaginaLogin')}>
              <Text style={styles.loginLink}>{t('cadastro.entrar')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PaginaCadastro;
  