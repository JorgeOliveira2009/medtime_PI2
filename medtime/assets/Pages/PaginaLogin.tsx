
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
import logo from '../Pages/logo.png';

const PaginaLogin = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  const API_URL = 'http://172.20.86.193:3000';

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
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();
      

      if (data.sucesso) {
        Alert.alert('✅ Sucesso', 'Login realizado com sucesso!');
        navigation.navigate('PaginaPrincipal');
      } else {
        Alert.alert('❌ Erro', data.message || 'Email ou senha incorretos');
      }
    } catch (error: any) {
      Alert.alert(
        '❌ Erro de Conexão',
        'Não foi possível conectar ao servidor.\n\n' +
        'Verifique:\n' +
        '1️⃣ O backend está rodando? (npm run dev)\n' +
        '2️⃣ O IP está correto? 172.20.86.193:3000\n' +
        '3️⃣ Dispositivo e computador estão na mesma rede Wi-Fi?\n' +
        '4️⃣ Firewall está bloqueando a porta 3000?'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = () => {
    navigation.navigate('PaginaPrincipal');
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Image source={logo} style={styles.logoImg} />
          </View>
          <View>
            <Text style={styles.bemVindo}>Bem-vindo!!</Text>
            <Text style={styles.subtitle}>Seu lembrete de medicamentos</Text>
          </View>
        </View>

        {/* Card Login */}
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

          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <Botao title="Acessar" loading={loading} onPress={handleLogin} />

          {/* Botão DEV */}
          {__DEV__ && (
            <TouchableOpacity style={styles.devButton} onPress={handleDevLogin}>
              <Text style={styles.devText}>Entrar como DEV ⚡</Text>
            </TouchableOpacity>
          )}

          {/* Cadastro */}
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

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#E0F7FA',
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },
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
  forgotButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginTop: -6,
  },
  forgotText: {
    fontSize: 13,
    color: '#00BCD4',
    fontWeight: '500',
  },
  devButton: {
    marginTop: 12,
    backgroundColor: '#263238',
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  devText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
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