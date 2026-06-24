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

const PaginaCadastro = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  // URL do backend
  const API_URL = 'http://172.20.86.232:3000';

  const handleCadastro = async () => {
    // Validações
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (senha.length < 8) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    setLoading(true);

    try {
      console.log('📤 Tentando cadastrar...');
      console.log('🌐 URL:', `${API_URL}/user/cadastro`);
      console.log('📧 Email:', email);

      const response = await fetch(`${API_URL}/user/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          senha: senha 
        }),
      });

      console.log('📥 Status:', response.status);

      const data = await response.json();
      console.log('📦 Resposta:', data);

      if (data.sucesso) {
        Alert.alert(
          '✅ Sucesso', 
          'Cadastro realizado com sucesso!\n\nAgora faça login com suas credenciais.',
          [
            {
              text: 'OK',
              onPress: () => {
                setEmail('');
                setSenha('');
                navigation.navigate('PaginaLogin');
              }
            }
          ]
        );
      } else {
        Alert.alert('❌ Erro', data.message || 'Erro ao cadastrar');
      }
    } catch (error: any) {
      console.error('❌ Erro detalhado:', error);

      let mensagem = 'Não foi possível conectar ao servidor.\n\n';
      mensagem += 'Verifique:\n';
      mensagem += '1️⃣ O backend está rodando? (npm run dev)\n';
      mensagem += '2️⃣ O IP está correto? 172.20.86.232:3000\n';
      mensagem += '3️⃣ Dispositivo e computador estão na mesma rede Wi-Fi?\n';
      mensagem += '4️⃣ Firewall está bloqueando a porta 3000?';

      Alert.alert('❌ Erro de Conexão', mensagem);
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Image source={logo} style={styles.logoImg} />
          </View>
          <View>
            <Text style={styles.bemVindo}>Olá!</Text>
            <Text style={styles.subtitle}>Crie sua conta no MedTime</Text>
          </View>
        </View>

        {/* Card de Cadastro */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cadastro</Text>

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
            placeholder="Coloque sua senha aqui (mínimo 8 caracteres)"
            isPassword
            value={senha}
            onChangeText={setSenha}
          />

          <Botao 
            title="Cadastrar" 
            loading={loading} 
            onPress={handleCadastro} 
          />

          {/* Botão DEV - Pula cadastro */}
          {__DEV__ && (
            <TouchableOpacity
              style={styles.devButton}
              onPress={() => {
                Alert.alert(
                  '⚡ Modo DEV',
                  'Pular cadastro e ir para o login?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { 
                      text: 'Sim', 
                      onPress: () => navigation.navigate('PaginaLogin')
                    }
                  ]
                );
              }}
            >
              <Text style={styles.devText}>
                Pular cadastro (DEV) ⚡
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation?.navigate('PaginaLogin')}>
              <Text style={styles.loginLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PaginaCadastro;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#E0F7FA',
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  // Header
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

  // Card
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

  // DEV Button
  devButton: {
    marginTop: 12,
    backgroundColor: '#FF6B6B',
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

  // Login link
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#78909C',
  },
  loginLink: {
    fontSize: 14,
    color: '#00BCD4',
    fontWeight: '700',
  },
});