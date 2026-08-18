import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface MedCardProps {
  icon: string;
  title: string;
  subtitle?: string;
  accent?: string;
  onPress?: () => void;
}

/**
 * MedCard — cartão reutilizável para o app MedTime.
 * Usado em listas de medicamentos, lembretes e histórico.
 */
export default function MedCard({
  icon,
  title,
  subtitle,
  accent = "#4BBFCF",
  onPress,
}: MedCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {/* Barra lateral colorida */}
      <View style={[styles.accentBar, { backgroundColor: accent }]} />

      {/* Ícone */}
      <View style={[styles.iconWrapper, { backgroundColor: accent + "22" }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Textos */}
      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {/* Seta */}
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    paddingVertical: 14,
    paddingRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  accentBar: {
    width: 4,
    height: "100%",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    marginRight: 14,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  icon: {
    fontSize: 22,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A3A4A",
  },
  subtitle: {
    fontSize: 12,
    color: "#1A3A4A",
    opacity: 0.55,
    marginTop: 3,
  },
  arrow: {
    fontSize: 22,
    color: "#4BBFCF",
    fontWeight: "300",
    marginLeft: 8,
  },
});
