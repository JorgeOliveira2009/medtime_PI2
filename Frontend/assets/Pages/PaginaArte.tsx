import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function PaginaArte({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrada principal
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulso contínuo no círculo decorativo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7DD9F0" />

      {/* Círculos decorativos de fundo */}
      <Animated.View
        style={[styles.bgCircleLarge, { transform: [{ scale: pulseAnim }] }]}
      />
      <View style={styles.bgCircleSmallTop} />
      <View style={styles.bgCircleSmallBottom} />

      {/* Conteúdo central */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* Anel decorativo ao redor do logo */}
        <View style={styles.logoRing}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('../Pages/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Nome do app */}
        <Text style={styles.appName}>MedTime</Text>
        <View style={styles.underline} />

        {/* Tagline */}
        <Text style={styles.tagline}>Seus remédios. No horário certo.</Text>
      </Animated.View>

      {/* Cartões informativos */}
      <Animated.View
        style={[
          styles.cardsRow,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <MedInfoCard icon="💊" label="Medicamentos" value="Organize" />
        <MedInfoCard icon="🔔" label="Lembretes" value="No horário" />
        <MedInfoCard icon="📋" label="Histórico" value="Completo" />
      </Animated.View>

      {/* Botão de entrada */}
      <Animated.View style={{ opacity: fadeAnim, width: "100%" }}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={() => navigation?.navigate("PaginaLogin")}
        >
          <Text style={styles.buttonText}>Começar agora</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation?.navigate("PaginaCadastro")}
        >
          <Text style={styles.linkText}>Criar uma conta</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

/* ─── Mini componente interno ─── */
function MedInfoCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

/* ─── Estilos ─── */
const TEAL = "#4BBFCF";
const BLUE_LIGHT = "#7DD9F0";
const WHITE = "#FFFFFF";
const DARK = "#1A3A4A";
const ACCENT = "#F07070";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLUE_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 40,
    overflow: "hidden",
  },

  /* Decorativos de fundo */
  bgCircleLarge: {
    position: "absolute",
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: width * 0.425,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
    top: height * 0.05,
    alignSelf: "center",
  },
  bgCircleSmallTop: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.18)",
    top: -30,
    right: -20,
  },
  bgCircleSmallBottom: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.15)",
    bottom: 60,
    left: -10,
  },

  /* Logo */
  content: {
    alignItems: "center",
    marginBottom: 36,
  },
  logoRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  logoWrapper: {
    width: 1,
    height: 1,
    borderRadius: 24,
    backgroundColor: TEAL,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  logoImage: {
    width: 72,
    height: 72,
  },

  appName: {
    fontSize: 36,
    fontWeight: "800",
    color: DARK,
    letterSpacing: 0.5,
  },
  underline: {
    width: 90,
    height: 3,
    backgroundColor: DARK,
    borderRadius: 2,
    marginTop: 6,
    marginBottom: 14,
  },
  tagline: {
    fontSize: 15,
    color: DARK,
    opacity: 0.65,
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  /* Cards informativos */
  cardsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 40,
  },
  card: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 12,
    fontWeight: "700",
    color: TEAL,
  },
  cardLabel: {
    fontSize: 11,
    color: DARK,
    opacity: 0.55,
    marginTop: 2,
  },

  /* Botões */
  button: {
    backgroundColor: DARK,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 14,
    shadowColor: DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  linkButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  linkText: {
    color: DARK,
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.7,
    textDecorationLine: "underline",
  },
});
