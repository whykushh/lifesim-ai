import React, { useState, useRef } from 'react';
import {
  View, Text, Pressable, ScrollView, StyleSheet, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenNavigationProp } from '../navigation/types';
import { colors } from '../theme/colors';
import { useGameStore } from '../store/gameStore';
import { generateDecisionChoices, DecisionOption } from '../services/simulationEngine';
import TimelineCard from '../components/TimelineCard';
import LoadingOverlay from '../components/LoadingOverlay';

const { width } = Dimensions.get('window');
const CARD_W = (width - 36) / 2;

interface Props { navigation: ScreenNavigationProp<'Simulation'>; }

const STAT_CONFIG = [
  { key: 'money' as const,        emoji: '💰', color: colors.stats.money,        label: 'WEALTH'  },
  { key: 'happiness' as const,    emoji: '😊', color: colors.stats.happiness,    label: 'JOY'     },
  { key: 'health' as const,       emoji: '❤️', color: colors.stats.health,       label: 'HEALTH'  },
  { key: 'careerLevel' as const,  emoji: '💼', color: colors.stats.careerLevel,  label: 'CAREER'  },
  { key: 'intelligence' as const, emoji: '🧠', color: colors.stats.intelligence, label: 'IQ'      },
  { key: 'relationships' as const,emoji: '👥', color: colors.stats.relationships,label: 'SOCIAL'  },
];

export default function SimulationScreen({ navigation }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const { stats, timeline, character, isLoading, makeDecision } = useGameStore();
  const [decisions, setDecisions] = useState<DecisionOption[]>(() => generateDecisionChoices(stats));

  const handleDecision = async (option: DecisionOption) => {
    if (isLoading) return;
    setDecisions([]);
    await makeDecision(option.decision);
    const newStats = useGameStore.getState().stats;
    setDecisions(generateDecisionChoices(newStats, option.decision));
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
  };

  if (!character) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noCharEmoji}>🎮</Text>
        <Text style={styles.noCharText}>No character found</Text>
        <Pressable style={styles.noCharBtn} onPress={() => navigation.navigate('CreateCharacter')}>
          <Text style={styles.noCharBtnText}>⚡ CREATE CHARACTER</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {isLoading ? <LoadingOverlay /> : null}

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.charName}>{character.name.toUpperCase()}</Text>
          <View style={styles.agePill}>
            <Text style={styles.agePillText}>AGE {stats.age}</Text>
            <View style={styles.ageSep} />
            <Text style={styles.agePillText}>YEAR {timeline.length}</Text>
          </View>
        </View>
        <View style={styles.headerBtns}>
          {[{ icon:'📊', s:'Stats' }, { icon:'📜', s:'Timeline' }, { icon:'⚙️', s:'Settings' }].map(({ icon, s }) => (
            <Pressable key={s} onPress={() => navigation.navigate(s as any)} style={styles.headerBtn}>
              <Text style={styles.headerBtnIcon}>{icon}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── STATS HUD ── */}
      <View style={styles.statsHud}>
        {STAT_CONFIG.map(({ key, emoji, color, label }) => {
          const val = Math.max(0, Math.min(100, stats[key]));
          return (
            <View key={key} style={styles.statRow}>
              <Text style={styles.statEmoji}>{emoji}</Text>
              <Text style={styles.statLabel}>{label}</Text>
              <View style={styles.statTrack}>
                <View style={[styles.statFill, { width: `${val}%` as any, backgroundColor: color, shadowColor: color }]} />
                <View style={styles.statShine} />
              </View>
              <Text style={[styles.statVal, { color }]}>{stats[key]}</Text>
            </View>
          );
        })}
      </View>

      {/* ── STORY DIVIDER ── */}
      <View style={styles.dividerRow}>
        <View style={styles.divLine} />
        <Text style={styles.divText}>YOUR STORY</Text>
        <View style={styles.divLine} />
      </View>

      {/* ── TIMELINE ── */}
      <ScrollView
        ref={scrollRef}
        style={styles.timeline}
        contentContainerStyle={{ padding: 10, paddingBottom: 4 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {timeline.map((event, index) => (
          <TimelineCard key={event.id} event={event} isLatest={index === timeline.length - 1} />
        ))}
      </ScrollView>

      {/* ── DECISION ZONE ── */}
      <View style={styles.decisionZone}>
        <Text style={styles.decisionLabel}>⚡ CHOOSE YOUR PATH</Text>
        <View style={styles.cardGrid}>
          {decisions.length > 0
            ? decisions.map((opt, i) => (
                <Pressable
                  key={i}
                  style={({ pressed }) => [
                    styles.card,
                    {
                      backgroundColor: opt.color,
                      borderBottomWidth: pressed ? 2 : 7,
                      borderBottomColor: opt.darkColor,
                      transform: [{ translateY: pressed ? 5 : 0 }],
                      elevation: pressed ? 2 : 8,
                    },
                  ]}
                  onPress={() => handleDecision(opt)}
                  disabled={isLoading}
                >
                  <View style={styles.cardShine} />
                  <Text style={styles.cardEmoji}>{opt.emoji}</Text>
                  <Text style={styles.cardTitle}>{opt.title}</Text>
                  <Text style={styles.cardDesc}>{opt.desc}</Text>
                </Pressable>
              ))
            : [0,1,2,3].map(i => <View key={i} style={[styles.card, styles.cardSkeleton]} />)}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  centered: {
    flex: 1, backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  noCharEmoji: { fontSize: 60, marginBottom: 14 },
  noCharText: { color: colors.textSecondary, fontSize: 16, marginBottom: 20 },
  noCharBtn: {
    backgroundColor: colors.gold, borderRadius: 14, padding: 16, paddingHorizontal: 28,
    elevation: 8, shadowColor: colors.gold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 8,
  },
  noCharBtnText: { color: '#000', fontWeight: '900', fontSize: 15, letterSpacing: 1 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  charName: {
    fontSize: 19, fontWeight: '900', color: colors.text, letterSpacing: 1.5,
    textShadowColor: colors.primary, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10,
  },
  agePill: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  agePillText: { color: colors.gold, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  ageSep: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.gold },
  headerBtns: { flexDirection: 'row' },
  headerBtn: { padding: 9 },
  headerBtnIcon: { fontSize: 20 },

  // Stats
  statsHud: {
    flexDirection: 'column', gap: 5,
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: '#0D0820',
    borderBottomWidth: 3, borderBottomColor: '#3A2860',
  },
  statRow: {
    flexDirection: 'row', alignItems: 'center', height: 28,
  },
  statEmoji: { fontSize: 20, width: 24, textAlign: 'center' },
  statLabel: {
    width: 60, color: '#FFFFFF', fontWeight: '900',
    fontSize: 10, letterSpacing: 1, marginLeft: 4,
  },
  statTrack: {
    flex: 1, height: 18,
    backgroundColor: '#0D0820',
    borderRadius: 9, overflow: 'hidden',
    borderWidth: 2, borderColor: '#1E1040',
    marginHorizontal: 6,
    position: 'relative',
  },
  statFill: {
    position: 'absolute', top: 0, left: 0, bottom: 0,
    borderRadius: 9,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 6,
  },
  statShine: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
    backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: 9,
  },
  statVal: {
    width: 30, fontWeight: '900', fontSize: 12, textAlign: 'right',
  },

  // Divider
  dividerRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 5, gap: 8,
  },
  divLine: { flex: 1, height: 1, backgroundColor: colors.border },
  divText: { color: colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 2 },

  // Timeline
  timeline: { flex: 1 },

  // Decisions
  decisionZone: {
    paddingHorizontal: 10, paddingTop: 8, paddingBottom: 12,
    backgroundColor: colors.panel, borderTopWidth: 3, borderTopColor: colors.border,
  },
  decisionLabel: {
    color: colors.gold, fontSize: 13, fontWeight: '900', letterSpacing: 2,
    textAlign: 'center', marginBottom: 10,
    textShadowColor: colors.gold, textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 8,
  },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    width: CARD_W, borderRadius: 20, padding: 14,
    alignItems: 'center', justifyContent: 'center', minHeight: 120,
    overflow: 'hidden',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)',
  },
  cardShine: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '42%',
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  cardSkeleton: { backgroundColor: colors.surfaceElevated, opacity: 0.25, borderWidth: 0 },
  cardEmoji: { fontSize: 42, marginBottom: 6 },
  cardTitle: {
    color: '#FFFFFF', fontWeight: '900', fontSize: 14, textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 3,
  },
  cardDesc: {
    color: 'rgba(255,255,255,0.80)', fontSize: 11, textAlign: 'center', marginTop: 3,
    textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2,
  },
});
