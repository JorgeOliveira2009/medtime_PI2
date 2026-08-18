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
import { useAuth } from '../Contexts/AuthContext';

const API_URL = 'http://172.20.86.189:3000'

const PaginaLogin = ({ navigation }: any) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha email e senha');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), senha }),
      });

      const data = await response.json();

      if (data.sucesso) {
        // ✅ Salva o usuário COMPLETO e o TOKEN
        await login(data.user, data.token);
        
        Alert.alert('✅ Sucesso', `Bem-vindo(a), ${data.user.nome}!`);
        navigation.navigate('PaginaPrincipal');
      } else {
        Alert.alert('❌ Erro', data.message || 'Email ou senha incorretos');
      }
    } catch (error: any) {
      Alert.alert(
        '❌ Erro de Conexão',
        'Não foi possível conectar ao servidor.\n\n' +
        'Verifique sua conexão com a internet.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Image source={logo} style={styles.logoImg} />
          </View>
          <View>
            <Text style={styles.bemVindo}>Bem-vindo!!</Text>
            <Text style={styles.subtitle}>Seu lembrete de medicamentos</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Login</Text>

          <Input
            label="E-mail"
            placeholder="Coloque seu e-mail aqui"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            label="Senha"
            placeholder="Coloque sua senha aqui"
            isPassword
            value={senha}
            onChangeText={setSenha}
          />

          <Botao title="Acessar" loading={loading} onPress={handleLogin} />

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('PaginaCadastro')}>
              <Text style={styles.registerLink}>Cadastrar-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PaginaLogin;

// Styles (mantém os mesmos do seu arquivo original)
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#E0F7FA' },
  scroll: { flexGrow: 1, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 32,
  },
  logoBox: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoImg: {
    width: 52,
    height: 52,
    borderRadius: 12,
    resizeMode: 'contain',
  },
  bemVindo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#006064',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#00838F',
    marginTop: 2,
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#263238',
    marginBottom: 24,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
    color: '#78909C',
  },
  registerLink: {
    fontSize: 14,
    color: '#00BCD4',
    fontWeight: '700',
  },
});