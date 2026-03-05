import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenNavigationProp } from '../navigation/types';
import { colors } from '../theme/colors';
import { useGameStore } from '../store/gameStore';
import { loadGameFromStorage } from '../services/storage';

interface Props {
  navigation: ScreenNavigationProp<'Welcome'>;
}

export default function WelcomeScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { sessionId, loadGame } = useGameStore();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    loadGameFromStorage().then((saved) => {
      if (saved) loadGame(saved);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.emoji}>🧬</Text>
        <Text style={styles.title}>LifeSim AI</Text>
        <Text style={styles.subtitle}>
          Your decisions. Your destiny.{'\n'}Powered by artificial intelligence.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('CreateCharacter')}
          >
            <Text style={styles.primaryButtonText}>New Life</Text>
          </TouchableOpacity>

          {sessionId ? (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Simulation')}
            >
              <Text style={styles.secondaryButtonText}>Continue Life</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <Text style={styles.tagline}>Every choice shapes your future</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emoji: { fontSize: 72, marginBottom: 16 },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  buttonContainer: { width: '100%', marginTop: 48 },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  primaryButtonText: { color: colors.text, fontSize: 18, fontWeight: '700' },
  secondaryButton: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: { color: colors.text, fontSize: 18, fontWeight: '600' },
  tagline: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 48,
    fontStyle: 'italic',
  },
});
