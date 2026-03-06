import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LifeEvent } from '../types';
import { colors } from '../theme/colors';

interface Props {
  event: LifeEvent;
  isLatest?: boolean;
}

const STAT_EMOJIS: Record<string, string> = {
  money: '💰', happiness: '😊', health: '❤️',
  careerLevel: '💼', intelligence: '🧠', relationships: '👥',
};

export default function TimelineCard({ event, isLatest = false }: Props) {
  const statEntries = Object.entries(event.statChanges).filter(
    ([, val]) => val !== undefined && val !== 0
  ) as [string, number][];

  return (
    <View style={[styles.container, isLatest && styles.containerLatest]}>
      {/* Glow accent bar on latest */}
      {isLatest && <View style={styles.glowBar} />}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.ageBadge}>
          <Text style={styles.ageText}>AGE {event.age}</Text>
        </View>
        <View style={styles.headerRight}>
          {isLatest && (
            <View style={styles.latestBadge}>
              <Text style={styles.latestText}>● LATEST</Text>
            </View>
          )}
          <Text style={styles.yearText}>YEAR {event.year}</Text>
        </View>
      </View>

      {/* Decision */}
      <Text style={styles.decision}>▶ {event.decision}</Text>

      {/* Outcome */}
      <Text style={styles.outcome}>{event.outcome}</Text>

      {/* Random Event */}
      {event.randomEvent ? (
        <View style={styles.randomBox}>
          <Text style={styles.randomLabel}>⚡ RANDOM EVENT</Text>
          <Text style={styles.randomText}>{event.randomEvent}</Text>
        </View>
      ) : null}

      {/* Stat Changes */}
      {statEntries.length > 0 && (
        <View style={styles.statRow}>
          {statEntries.map(([key, val]) => {
            const pos = val > 0;
            const color = pos ? colors.success : colors.danger;
            return (
              <View key={key} style={[styles.statBadge, { backgroundColor: color + '22', borderColor: color + '44' }]}>
                <Text style={[styles.statBadgeText, { color }]}>
                  {STAT_EMOJIS[key] ?? '⭐'} {pos ? '+' : ''}{val}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 18, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
  },
  containerLatest: {
    borderColor: colors.primary, borderWidth: 2,
    backgroundColor: '#13103A',
    elevation: 8, shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10,
  },
  glowBar: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
    backgroundColor: colors.primary,
  },

  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 10,
  },
  ageBadge: {
    backgroundColor: colors.primary + '30', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 3,
    borderWidth: 1, borderColor: colors.primary + '50',
  },
  ageText: { fontSize: 11, fontWeight: '900', color: colors.primary, letterSpacing: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  latestBadge: {
    backgroundColor: colors.gold + '20', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 2,
    borderWidth: 1, borderColor: colors.gold + '50',
  },
  latestText: { fontSize: 9, fontWeight: '900', color: colors.gold, letterSpacing: 1 },
  yearText: { fontSize: 10, color: colors.textMuted, fontWeight: '700' },

  decision: {
    fontSize: 14, fontWeight: '900', color: colors.accent,
    marginBottom: 8, letterSpacing: 0.3,
    textShadowColor: colors.accent, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6,
  },
  outcome: {
    fontSize: 13, color: colors.textSecondary, lineHeight: 22, marginBottom: 10,
  },

  randomBox: {
    backgroundColor: colors.surfaceElevated, borderRadius: 10, padding: 10,
    marginBottom: 10, borderLeftWidth: 3, borderLeftColor: colors.warning,
  },
  randomLabel: {
    fontSize: 9, fontWeight: '900', color: colors.warning,
    letterSpacing: 1.5, marginBottom: 5,
  },
  randomText: { fontSize: 12, color: colors.textSecondary, fontStyle: 'italic', lineHeight: 18 },

  statRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  statBadge: {
    borderRadius: 10, paddingHorizontal: 9, paddingVertical: 4,
    borderWidth: 1,
  },
  statBadgeText: { fontSize: 12, fontWeight: '800' },
});
