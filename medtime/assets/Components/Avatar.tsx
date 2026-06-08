import React from 'react';
import { View, Image, Text, StyleSheet, ImageSourcePropType } from 'react-native';

interface AvatarProps {
  source?: ImageSourcePropType;
  initials?: string;
  size?: number;
}

const Avatar = ({ source, initials = '?', size = 80 }: AvatarProps) => {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {source ? (
        <Image source={source} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</Text>
      )}
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  initials: {
    color: '#fff',
    fontWeight: '700',
  },
});
