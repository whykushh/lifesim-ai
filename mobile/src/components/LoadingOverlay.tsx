import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';

const LOADING_MESSAGES = [
  'Simulating your future...',
  'Consulting the AI oracle...',
  'Calculating life outcomes...',
  'Writing your story...',
  'Predicting consequences...',
  'Weaving your destiny...',
];

export default function LoadingOverlay() {
  const opacity = useRef(new Animated.Value(0)).current;
  const message =
    LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <View style={styles.card}>
        <Text style={styles.spinner}>⏳</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 220,
  },
  spinner: { fontSize: 36, marginBottom: 12 },
  message: {
    color: colors.text,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
});
