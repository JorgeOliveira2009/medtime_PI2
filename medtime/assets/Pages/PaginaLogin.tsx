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
} from 'react-native';
import Input from '../Components/input';
import Botao from '../Components/Botao';

import logo from '../Pages/logo.png';

const PaginaLogin = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
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
            <Text style={styles.bemVindo}>Bem-vindo!!</Text>
            <Text style={styles.subtitle}>Seu lembrete de medicamentos</Text>
          </View>
        </View>

        {/* Card de Login */}
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

          {/* Login social */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <Text style={styles.socialIcon}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Text style={styles.socialIcon}>f</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Text style={styles.socialIcon}>in</Text>
            </TouchableOpacity>
          </View>

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

  // Social
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  socialBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    fontSize: 15,
    fontWeight: '700',
    color: '#455A64',
  },

  // Cadastro
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
