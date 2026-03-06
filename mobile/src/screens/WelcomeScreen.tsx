import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenNavigationProp } from '../navigation/types';
import { colors } from '../theme/colors';
import { useGameStore } from '../store/gameStore';
import { loadGameFromStorage } from '../services/storage';

const { width } = Dimensions.get('window');

interface Props {
  navigation: ScreenNavigationProp<'Welcome'>;
}

export default function WelcomeScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;
  const { sessionId, loadGame } = useGameStore();

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }).start();

    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.06, duration: 850, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 850, useNativeDriver: true }),
    ])).start();

    Animated.loop(Animated.sequence([
      Animated.timing(float1, { toValue: 1, duration: 4500, useNativeDriver: true }),
      Animated.timing(float1, { toValue: 0, duration: 4500, useNativeDriver: true }),
    ])).start();

    Animated.loop(Animated.sequence([
      Animated.timing(float2, { toValue: 1, duration: 3200, useNativeDriver: true }),
      Animated.timing(float2, { toValue: 0, duration: 3200, useNativeDriver: true }),
    ])).start();

    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 1600, useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0.4, duration: 1600, useNativeDriver: true }),
    ])).start();

    loadGameFromStorage().then((saved) => { if (saved) loadGame(saved); });
  }, []);

  const f1Y = float1.interpolate({ inputRange: [0, 1], outputRange: [0, -30] });
  const f2Y = float2.interpolate({ inputRange: [0, 1], outputRange: [0, -22] });

  return (
    <SafeAreaView style={styles.container}>
      {/* Background glow orbs */}
      <Animated.View style={[styles.orb1, { transform: [{ translateY: f1Y }], opacity: glowAnim }]} />
      <Animated.View style={[styles.orb2, { transform: [{ translateY: f2Y }], opacity: glowAnim }]} />
      <Animated.View style={[styles.orb3, { opacity: glowAnim }]} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

        {/* Genre Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>★ LIFE SIMULATION RPG ★</Text>
        </View>

        {/* Logo */}
        <Text style={styles.logoEmoji}>🧬</Text>
        <Text style={styles.title}>LIFESIM</Text>
        <Text style={styles.titleAccent}>AI</Text>

        <Text style={styles.subtitle}>
          Every choice shapes your destiny.{'\n'}Will you rise to greatness or fall?
        </Text>

        {/* Stat Icons */}
        <View style={styles.statRow}>
          {[
            { e: '💰', c: colors.stats.money },
            { e: '❤️', c: colors.stats.health },
            { e: '🧠', c: colors.stats.intelligence },
            { e: '💼', c: colors.stats.careerLevel },
          ].map(({ e, c }, i) => (
            <View key={i} style={[styles.statBubble, { borderColor: c + '60' }]}>
              <Text style={styles.statBubbleEmoji}>{e}</Text>
            </View>
          ))}
        </View>

        {/* Primary CTA */}
        <Animated.View style={[styles.btnWrap, { transform: [{ scale: pulseAnim }] }]}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('CreateCharacter')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>⚡  BEGIN YOUR LEGEND</Text>
          </TouchableOpacity>
        </Animated.View>

        {sessionId ? (
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Simulation')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryBtnText}>▶  CONTINUE MY LIFE</Text>
          </TouchableOpacity>
        ) : null}

        <Text style={styles.tagline}>Millions of lives. One is yours.</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },

  orb1: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: colors.primary, top: -80, left: -100, opacity: 0.18,
  },
  orb2: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: '#2563EB', bottom: 60, right: -70, opacity: 0.14,
  },
  orb3: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    backgroundColor: colors.gold, bottom: 200, left: -40, opacity: 0.07,
  },

  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },

  badge: {
    backgroundColor: colors.primary + '25',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6,
    borderWidth: 1, borderColor: colors.primary + '55', marginBottom: 28,
  },
  badgeText: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 2.5 },

  logoEmoji: { fontSize: 68, marginBottom: 4 },

  title: {
    fontSize: 58, fontWeight: '900', color: colors.text, letterSpacing: 8,
    textShadowColor: colors.primary, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 24,
  },
  titleAccent: {
    fontSize: 34, fontWeight: '900', color: colors.gold, letterSpacing: 10,
    marginTop: -10, marginBottom: 22,
    textShadowColor: colors.gold, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 16,
  },

  subtitle: {
    fontSize: 15, color: colors.textSecondary, textAlign: 'center',
    lineHeight: 24, marginBottom: 30,
  },

  statRow: { flexDirection: 'row', gap: 14, marginBottom: 40 },
  statBubble: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
  },
  statBubbleEmoji: { fontSize: 24 },

  btnWrap: { width: '100%' },
  primaryBtn: {
    backgroundColor: colors.gold, borderRadius: 18, padding: 20,
    alignItems: 'center', width: '100%',
    elevation: 14,
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.7, shadowRadius: 14,
  },
  primaryBtnText: { color: '#000000', fontSize: 18, fontWeight: '900', letterSpacing: 1.5 },

  secondaryBtn: {
    marginTop: 14, backgroundColor: 'transparent',
    borderRadius: 16, padding: 17, alignItems: 'center', width: '100%',
    borderWidth: 2, borderColor: colors.primary,
  },
  secondaryBtnText: {
    color: colors.primary, fontSize: 15, fontWeight: '900', letterSpacing: 1.5,
    textShadowColor: colors.primary, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8,
  },

  tagline: { fontSize: 12, color: colors.textMuted, marginTop: 32, fontStyle: 'italic', letterSpacing: 0.8 },
});
