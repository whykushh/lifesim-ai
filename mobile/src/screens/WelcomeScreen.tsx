import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
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

  // Animated values for primary button press
  const primaryPressAnim = useRef(new Animated.Value(0)).current;
  // Animated values for continue button press
  const continuePressAnim = useRef(new Animated.Value(0)).current;

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

  const primaryTranslateY = primaryPressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 6],
  });
  const continueTranslateY = continuePressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 6],
  });

  const handlePrimaryPressIn = () => {
    Animated.timing(primaryPressAnim, {
      toValue: 1,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const handlePrimaryPressOut = () => {
    Animated.timing(primaryPressAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  const handleContinuePressIn = () => {
    Animated.timing(continuePressAnim, {
      toValue: 1,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const handleContinuePressOut = () => {
    Animated.timing(continuePressAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

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

        {/* Game Logo Panel */}
        <View style={styles.logoPanelOuter}>
          <View style={styles.logoPanelInner}>
            <Text style={styles.logoEmoji}>🧬</Text>
            <Text style={styles.title}>LIFESIM</Text>
            <Text style={styles.titleAccent}>AI</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Every choice shapes your destiny.{'\n'}Will you rise to greatness or fall?
        </Text>

        {/* Feature Badges Row */}
        <View style={styles.featureBadgeRow}>
          {[
            '🎭 32 DECISIONS',
            '📊 6 STATS',
            '⚡ INFINITE LIVES',
          ].map((label, i) => (
            <View key={i} style={styles.featureBadge}>
              <Text style={styles.featureBadgeText}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Primary CTA */}
        <Animated.View style={[styles.btnWrap, { transform: [{ scale: pulseAnim }] }]}>
          <Pressable
            onPressIn={handlePrimaryPressIn}
            onPressOut={handlePrimaryPressOut}
            onPress={() => navigation.navigate('CreateCharacter')}
          >
            {({ pressed }) => (
              <Animated.View
                style={[
                  styles.primaryBtn,
                  {
                    borderBottomWidth: pressed ? 2 : 8,
                    transform: [{ translateY: primaryTranslateY }],
                  },
                ]}
              >
                {/* Shine strip */}
                <View style={styles.primaryShineStrip} />
                <Text style={styles.primaryBtnText}>⚡  BEGIN YOUR LEGEND</Text>
              </Animated.View>
            )}
          </Pressable>
        </Animated.View>

        {sessionId ? (
          <Pressable
            onPressIn={handleContinuePressIn}
            onPressOut={handleContinuePressOut}
            onPress={() => navigation.navigate('Simulation')}
            style={{ width: '100%', marginTop: 14 }}
          >
            {({ pressed }) => (
              <Animated.View
                style={[
                  styles.continueBtn,
                  {
                    borderBottomWidth: pressed ? 2 : 6,
                    transform: [{ translateY: continueTranslateY }],
                  },
                ]}
              >
                {/* Shine strip */}
                <View style={styles.continueShineStrip} />
                <Text style={styles.continueBtnText}>▶  CONTINUE MY LIFE</Text>
              </Animated.View>
            )}
          </Pressable>
        ) : null}

        <Text style={styles.tagline}>Millions of lives. One is yours.</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0E2E', overflow: 'hidden' },

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

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  badge: {
    backgroundColor: colors.primary + '25',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6,
    borderWidth: 1, borderColor: colors.primary + '55', marginBottom: 24,
  },
  badgeText: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 2.5 },

  // Gold-bordered logo panel
  logoPanelOuter: {
    borderWidth: 3,
    borderColor: '#FFD700',
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    marginBottom: 26,
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingVertical: 22,
    width: '100%',
  },
  logoPanelInner: {
    alignItems: 'center',
  },

  logoEmoji: { fontSize: 68, marginBottom: 4 },

  title: {
    fontSize: 60,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 6,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
  },
  titleAccent: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 10,
    marginTop: -8,
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },

  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 22,
  },

  // Feature badge row
  featureBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 36,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  featureBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featureBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  btnWrap: { width: '100%' },

  // Primary green button
  primaryBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 8,
    borderBottomColor: '#1B5E20',
    overflow: 'hidden',
  },
  primaryShineStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  // Continue orange button
  continueBtn: {
    backgroundColor: '#FF9800',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 6,
    borderBottomColor: '#E65100',
    overflow: 'hidden',
  },
  continueShineStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  tagline: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 32,
    fontStyle: 'italic',
    letterSpacing: 0.8,
  },
});
