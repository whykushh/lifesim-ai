import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LifeEvent } from '../types';

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
      {/* Top accent bar for latest card */}
      {isLatest && <View style={styles.glowBar} />}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.ageBadge}>
          <Text style={styles.ageText}>AGE {event.age}</Text>
        </View>

        {isLatest && (
          <Text style={styles.newBadge}>⭐ NEW</Text>
        )}

        <Text style={styles.yearText}>YEAR {event.year}</Text>
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
            return (
              <View
                key={key}
                style={[styles.statBadge, pos ? styles.statBadgePos : styles.statBadgeNeg]}
              >
                <Text style={[styles.statBadgeText, pos ? styles.statBadgeTextPos : styles.statBadgeTextNeg]}>
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
    backgroundColor: '#241540',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#3A2860',
    marginBottom: 10,
    padding: 14,
    overflow: 'hidden',
  },
  containerLatest: {
    borderColor: '#9B30FF',
    borderWidth: 3,
    backgroundColor: '#2A1550',
    elevation: 6,
    shadowColor: '#9B30FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
  },

  glowBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#9B30FF',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ageBadge: {
    backgroundColor: '#9B30FF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ageText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  newBadge: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  yearText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFD700',
  },

  decision: {
    fontSize: 14,
    fontWeight: '900',
    color: '#00F5D4',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  outcome: {
    fontSize: 13,
    color: '#C8B8E8',
    lineHeight: 22,
    marginBottom: 10,
  },

  randomBox: {
    backgroundColor: '#0D0820',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  randomLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FF9500',
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  randomText: {
    fontSize: 12,
    color: '#C8B8E8',
    fontStyle: 'italic',
    lineHeight: 18,
  },

  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  statBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  statBadgePos: {
    backgroundColor: 'rgba(61,255,110,0.15)',
    borderColor: 'rgba(61,255,110,0.4)',
  },
  statBadgeNeg: {
    backgroundColor: 'rgba(255,58,58,0.15)',
    borderColor: 'rgba(255,58,58,0.4)',
  },
  statBadgeText: {
    fontWeight: '800',
    fontSize: 12,
  },
  statBadgeTextPos: {
    color: '#3DFF6E',
  },
  statBadgeTextNeg: {
    color: '#FF3A3A',
  },
});
