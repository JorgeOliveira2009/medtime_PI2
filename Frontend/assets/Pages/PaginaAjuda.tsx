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
} from 'react-native';

import logo from './logo.png';
import MenuLateral from '../Components/MenuLateral';
import { useTheme } from '../Contexts/ThemeContext';

interface FAQ {
  id: number;
  pergunta: string;
  resposta: string;
}

const FAQS: FAQ[] = [
  {
    id: 1,
    pergunta: 'Qual o objetivo do MedTime?',
    resposta:
      'O app "MedTime" serve para lembrar o usuário de tomar suas medicações no devido tempo. Uma medicação fora de hora pode ser prejudicial à saúde.',
  },
  {
    id: 2,
    pergunta: 'Como adicionar um remédio?',
    resposta:
      'Na tela principal, toque no botão "+ Adicionar remédio". Preencha o nome do remédio e o horário, depois toque em Salvar. Ele aparecerá na sua lista do dia.',
  },
  {
    id: 3,
    pergunta: 'Como confirmar que tomei o remédio?',
    resposta:
      'Toque no círculo ✓ ao lado do remédio na lista. Ele ficará verde e o nome será riscado, indicando que a medicação foi tomada com sucesso.',
  },
  {
    id: 4,
    pergunta: 'Como editar ou remover um remédio?',
    resposta:
      'Toque no botão ✕ vermelho ao lado do remédio para removê-lo da lista. Em breve, a edição completa estará disponível.',
  },
  {
    id: 5,
    pergunta: 'As notificações funcionam automaticamente?',
    resposta:
      'A funcionalidade de notificações automáticas está em desenvolvimento. Em breve você receberá alertas no horário exato dos seus remédios.',
  },
];

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
  progressCard: { marginHorizontal: 20, marginBottom: 16, backgroundColor: TEAL, borderRadius: 24, padding: 20, shadowColor: TEAL, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  welcomeTitle: { color: '#FFF', fontSize: 16, fontWeight: '800', marginBottom: 8 },
  welcomeText: { color: 'rgba(255,255,255,0.88)', fontSize: 13, lineHeight: 20 },
  card: { marginHorizontal: 20, marginBottom: 16, backgroundColor: colors.card, borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 16, elevation: 5 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 16 },
  faqRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, gap: 10 },
  faqLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  faqNumBox: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.iconBox, justifyContent: 'center', alignItems: 'center' },
  faqNumBoxAtivo: { backgroundColor: TEAL },
  faqNum: { fontSize: 13, fontWeight: '800', color: TEAL },
  faqNumAtivo: { color: '#FFF' },
  faqPergunta: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
  faqPerguntaAtiva: { color: TEAL },
  faqArrow: { fontSize: 11, color: colors.textSecondary },
  faqResposta: { backgroundColor: colors.iconBox, borderRadius: 14, padding: 14, marginBottom: 10 },
  faqRespostaText: { fontSize: 13, color: colors.text, lineHeight: 21 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
  contatoText: { fontSize: 13, color: colors.textSecondary, marginBottom: 12 },
  emailBox: { backgroundColor: colors.iconBox, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1.5, borderColor: TEAL },
  emailText: { fontSize: 14, fontWeight: '700', color: TEAL },
});

const PaginaAjuda = ({ navigation }: any) => {
  const { darkMode } = useTheme();
  const colors = darkMode ? coresEscuro : coresClaro;
  const styles = getStyles(colors);

  const [menuVisible, setMenuVisible] = useState(false);
  const [aberto, setAberto] = useState<number | null>(1);

  function toggleFaq(id: number) {
    setAberto(prev => (prev === id ? null : id));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Image source={logo} style={styles.logoImg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Ajuda</Text>
            <Text style={styles.headerSub}>Tire suas dúvidas sobre o app</Text>
          </View>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuVisible(true)}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.welcomeTitle}>❓ Como podemos ajudar?</Text>
          <Text style={styles.welcomeText}>
            Abaixo você encontra as perguntas mais frequentes sobre o MedTime. Toque em uma pergunta para ver a resposta.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Perguntas frequentes</Text>

          {FAQS.map((faq, i) => (
            <View key={faq.id}>
              <TouchableOpacity style={styles.faqRow} onPress={() => toggleFaq(faq.id)} activeOpacity={0.7}>
                <View style={styles.faqLeft}>
                  <View style={[styles.faqNumBox, aberto === faq.id && styles.faqNumBoxAtivo]}>
                    <Text style={[styles.faqNum, aberto === faq.id && styles.faqNumAtivo]}>{faq.id}</Text>
                  </View>
                  <Text style={[styles.faqPergunta, aberto === faq.id && styles.faqPerguntaAtiva]}>{faq.pergunta}</Text>
                </View>
                <Text style={styles.faqArrow}>{aberto === faq.id ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {aberto === faq.id && (
                <View style={styles.faqResposta}>
                  <Text style={styles.faqRespostaText}>{faq.resposta}</Text>
                </View>
              )}

              {i < FAQS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📬 Ainda com dúvidas?</Text>
          <Text style={styles.contatoText}>Entre em contato com nossa equipe pelo e-mail:</Text>
          <View style={styles.emailBox}>
            <Text style={styles.emailText}>suporte@medtime.app</Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      <MenuLateral visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />
    </SafeAreaView>
  );
};

export default PaginaAjuda;