import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenNavigationProp } from '../navigation/types';
import { colors } from '../theme/colors';
import { useGameStore } from '../store/gameStore';
import { generateDecisionChoices, DecisionOption } from '../services/simulationEngine';
import TimelineCard from '../components/TimelineCard';
import LoadingOverlay from '../components/LoadingOverlay';

interface Props {
  navigation: ScreenNavigationProp<'Simulation'>;
}

const STAT_CONFIG = [
  { key: 'money' as const, emoji: '💰', color: colors.stats.money, label: 'Wealth' },
  { key: 'happiness' as const, emoji: '😊', color: colors.stats.happiness, label: 'Joy' },
  { key: 'health' as const, emoji: '❤️', color: colors.stats.health, label: 'Health' },
  { key: 'careerLevel' as const, emoji: '💼', color: colors.stats.careerLevel, label: 'Career' },
  { key: 'intelligence' as const, emoji: '🧠', color: colors.stats.intelligence, label: 'IQ' },
  { key: 'relationships' as const, emoji: '👥', color: colors.stats.relationships, label: 'Social' },
];

export default function SimulationScreen({ navigation }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const { stats, timeline, character, isLoading, makeDecision } = useGameStore();
  const [decisions, setDecisions] = useState<DecisionOption[]>(() =>
    generateDecisionChoices(stats)
  );

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
        <Text style={styles.noCharText}>No character found. Start a new life!</Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('CreateCharacter')}>
          <Text style={styles.btnText}>Create Character</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {isLoading ? <LoadingOverlay /> : null}

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.charName}>{character.name}</Text>
          <Text style={styles.ageText}>Age {stats.age}  ·  Year {timeline.length}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Stats')} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>📊</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Timeline')} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>📜</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {STAT_CONFIG.map(({ key, emoji, color, label }) => {
          const val = stats[key];
          return (
            <View key={key} style={styles.statItem}>
              <View style={styles.statRow}>
                <Text style={styles.statEmoji}>{emoji}</Text>
                <Text style={[styles.statValue, { color }]}>{val}</Text>
              </View>
              <View style={styles.statBarTrack}>
                <View style={[styles.statBarFill, { width: `${val}%` as any, backgroundColor: color }]} />
              </View>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          );
        })}
      </View>

      {/* Timeline */}
      <ScrollView
        ref={scrollRef}
        style={styles.timeline}
        contentContainerStyle={{ padding: 12, paddingBottom: 4 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {timeline.map((event, index) => (
          <TimelineCard key={event.id} event={event} isLatest={index === timeline.length - 1} />
        ))}
      </ScrollView>

      {/* Decision Cards */}
      <View style={styles.decisionArea}>
        <Text style={styles.decisionTitle}>⚡ CHOOSE YOUR PATH</Text>
        <View style={styles.cardGrid}>
          {decisions.length > 0
            ? decisions.map((option, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.card, { backgroundColor: option.color }]}
                  onPress={() => handleDecision(option)}
                  disabled={isLoading}
                  activeOpacity={0.75}
                >
                  <Text style={styles.cardEmoji}>{option.emoji}</Text>
                  <Text style={styles.cardTitle}>{option.title}</Text>
                  <Text style={styles.cardDesc}>{option.desc}</Text>
                </TouchableOpacity>
              ))
            : [0, 1, 2, 3].map(i => (
                <View key={i} style={[styles.card, styles.cardPlaceholder]} />
              ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.background, padding: 24,
  },
  noCharText: { color: colors.textSecondary, fontSize: 16, textAlign: 'center', marginBottom: 16 },
  btn: { backgroundColor: colors.primary, borderRadius: 12, padding: 16, paddingHorizontal: 32 },
  btnText: { color: colors.text, fontWeight: '700', fontSize: 16 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  charName: { fontSize: 20, fontWeight: '900', color: colors.text },
  ageText: { fontSize: 12, color: colors.accent, marginTop: 2, fontWeight: '700' },
  headerActions: { flexDirection: 'row', gap: 2 },
  headerBtn: { padding: 8 },
  headerBtnText: { fontSize: 22 },

  // Stats
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 12, paddingVertical: 8, gap: 8,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  statItem: { width: '30%', alignItems: 'center' },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 3 },
  statEmoji: { fontSize: 13 },
  statValue: { fontSize: 14, fontWeight: '900' },
  statBarTrack: {
    width: '100%', height: 5, backgroundColor: colors.surfaceElevated,
    borderRadius: 3, overflow: 'hidden', marginBottom: 2,
  },
  statBarFill: { height: '100%', borderRadius: 3 },
  statLabel: { fontSize: 9, color: colors.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

  // Timeline
  timeline: { flex: 1 },

  // Decisions
  decisionArea: {
    borderTopWidth: 1, borderTopColor: colors.border,
    paddingTop: 8, paddingHorizontal: 10, paddingBottom: 10,
    backgroundColor: colors.background,
  },
  decisionTitle: {
    color: colors.textMuted, fontSize: 10, fontWeight: '800',
    letterSpacing: 2, textAlign: 'center', marginBottom: 8,
  },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: {
    width: '48%', borderRadius: 18, padding: 14,
    alignItems: 'center', justifyContent: 'center', minHeight: 110,
  },
  cardPlaceholder: { backgroundColor: colors.surfaceElevated, opacity: 0.3 },
  cardEmoji: { fontSize: 34, marginBottom: 5 },
  cardTitle: { color: '#FFFFFF', fontWeight: '900', fontSize: 14, textAlign: 'center' },
  cardDesc: { color: 'rgba(255,255,255,0.72)', fontSize: 11, textAlign: 'center', marginTop: 3 },
});
