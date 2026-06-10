import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';

interface BotaoProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'outline';
}

const Botao = ({ title, loading = false, variant = 'primary', ...rest }: BotaoProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, variant === 'outline' && styles.outline, rest.disabled && styles.disabled]}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#00BCD4' : '#fff'} />
      ) : (
        <Text style={[styles.text, variant === 'outline' && styles.outlineText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Botao;

const styles = StyleSheet.create({
  button: {
    height: 52,
  borderRadius: 14,
  backgroundColor: '#00BCD4', 
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#00BCD4',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.35,
  shadowRadius: 10,
  elevation: 6,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#00BCD4',
    shadowOpacity: 0,
    elevation: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  outlineText: {
    color: '#00BCD4',
  },
});