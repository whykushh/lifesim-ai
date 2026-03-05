import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LifeEvent } from '../types';
import { colors } from '../theme/colors';

interface Props {
  event: LifeEvent;
  isLatest?: boolean;
}

const STAT_LABELS: Record<string, string> = {
  money: 'money',
  happiness: 'happiness',
  health: 'health',
  careerLevel: 'career',
  intelligence: 'intelligence',
  relationships: 'relationships',
};

export default function TimelineCard({ event, isLatest = false }: Props) {
  const statEntries = Object.entries(event.statChanges).filter(
    ([, val]) => val !== undefined && val !== 0
  ) as [string, number][];

  return (
    <View style={[styles.container, isLatest && styles.containerLatest]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.age}>Age {event.age}</Text>
        <View style={styles.headerRight}>
          {isLatest && (
            <View style={styles.latestBadge}>
              <Text style={styles.latestBadgeText}>Latest</Text>
            </View>
          )}
          <Text style={styles.yearText}>Year {event.year}</Text>
        </View>
      </View>

      {/* Decision */}
      <Text style={styles.decision}>→ {event.decision}</Text>

      {/* Outcome */}
      <Text style={styles.outcome}>{event.outcome}</Text>

      {/* Random Event */}
      {event.randomEvent ? (
        <View style={styles.randomEventBox}>
          <Text style={styles.randomEventLabel}>Random Event</Text>
          <Text style={styles.randomEvent}>⚡ {event.randomEvent}</Text>
        </View>
      ) : null}

      {/* Stat Changes */}
      {statEntries.length > 0 && (
        <View style={styles.statChanges}>
          {statEntries.map(([key, val]) => {
            const isPositive = val > 0;
            return (
              <View
                key={key}
                style={[
                  styles.statChange,
                  isPositive ? styles.statChangePos : styles.statChangeNeg,
                ]}
              >
                <Text
                  style={[
                    styles.statChangeText,
                    { color: isPositive ? colors.success : colors.danger },
                  ]}
                >
                  {isPositive ? '+' : ''}
                  {val} {STAT_LABELS[key] ?? key}
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
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerLatest: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: '#14102A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  age: { fontSize: 13, fontWeight: '900', color: colors.primary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  yearText: { fontSize: 11, color: colors.textMuted },
  latestBadge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  latestBadgeText: { fontSize: 10, color: '#FFFFFF', fontWeight: '800', letterSpacing: 0.5 },
  decision: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.accent,
    marginBottom: 6,
  },
  outcome: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 10,
  },
  randomEventBox: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  randomEventLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.warning,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  randomEvent: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  statChanges: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  statChange: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statChangePos: { backgroundColor: colors.success + '25' },
  statChangeNeg: { backgroundColor: colors.danger + '25' },
  statChangeText: { fontSize: 11, fontWeight: '700' },
});
