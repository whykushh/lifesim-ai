import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stats } from '../types';
import { colors } from '../theme/colors';

interface Props {
  stats: Stats;
}

interface StatConfig {
  key: keyof Omit<Stats, 'age'>;
  emoji: string;
  color: string;
}

const STAT_CONFIG: StatConfig[] = [
  { key: 'money', emoji: '💰', color: colors.stats.money },
  { key: 'happiness', emoji: '😊', color: colors.stats.happiness },
  { key: 'health', emoji: '❤️', color: colors.stats.health },
  { key: 'careerLevel', emoji: '💼', color: colors.stats.careerLevel },
  { key: 'intelligence', emoji: '🧠', color: colors.stats.intelligence },
  { key: 'relationships', emoji: '👥', color: colors.stats.relationships },
];

export default function StatsOverview({ stats }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {STAT_CONFIG.map(({ key, emoji, color }) => {
        const val = stats[key];
        const clamped = Math.max(0, Math.min(100, val));
        return (
          <View key={key} style={styles.statItem}>
            <Text style={styles.emoji}>{emoji}</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { height: `${clamped}%`, backgroundColor: color },
                ]}
              />
            </View>
            <Text style={[styles.value, { color }]}>{val}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    maxHeight: 90,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 16,
    alignItems: 'center',
  },
  statItem: { alignItems: 'center', width: 44 },
  emoji: { fontSize: 16, marginBottom: 4 },
  barTrack: {
    width: 6,
    height: 36,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 3,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 4,
  },
  barFill: { width: '100%', borderRadius: 3 },
  value: { fontSize: 11, fontWeight: '700' },
});
