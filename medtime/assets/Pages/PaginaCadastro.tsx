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
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = () => {
    if (!email || !senha || !confirmarSenha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation?.navigate('PaginaLogin');
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

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
            placeholder="Coloque sua senha aqui"
            isPassword
            value={senha}
            onChangeText={setSenha}
          />

          <Input
            label="Confirme sua senha"
            placeholder="Confirme sua senha aqui"
            isPassword
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />

          <Botao title="Cadastrar" loading={loading} onPress={handleCadastro} />

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
