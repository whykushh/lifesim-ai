import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useGameStore } from '../store/gameStore';
import StatBar from '../components/StatBar';
import { Stats } from '../types';

export default function StatsScreen() {
  const { stats, character } = useGameStore();

  const statConfig: Array<{
    key: keyof Omit<Stats, 'age'>;
    label: string;
    color: string;
  }> = [
    { key: 'money', label: '💰 Money', color: colors.stats.money },
    { key: 'happiness', label: '😊 Happiness', color: colors.stats.happiness },
    { key: 'health', label: '❤️ Health', color: colors.stats.health },
    { key: 'careerLevel', label: '💼 Career', color: colors.stats.careerLevel },
    { key: 'intelligence', label: '🧠 Intelligence', color: colors.stats.intelligence },
    { key: 'relationships', label: '👥 Relationships', color: colors.stats.relationships },
  ];

  const overallScore = Math.round(
    (stats.money +
      stats.happiness +
      stats.health +
      stats.careerLevel +
      stats.intelligence +
      stats.relationships) /
      6
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Character Card */}
        <View style={styles.characterCard}>
          <Text style={styles.charEmoji}>👤</Text>
          <View style={styles.charInfo}>
            <Text style={styles.charName}>{character?.name ?? 'Unknown'}</Text>
            <Text style={styles.charMeta}>
              {character?.country} · Age {stats.age}
            </Text>
            {character?.interests ? (
              <Text style={styles.charInterests}>
                {character.interests.join(' · ')}
              </Text>
            ) : null}
          </View>
          <View style={styles.scoreBox}>
            <Text style={[styles.scoreNumber, { color: getScoreColor(overallScore) }]}>
              {overallScore}
            </Text>
            <Text style={styles.scoreLabel}>Score</Text>
          </View>
        </View>

        {/* Stats Bars */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Life Stats</Text>
          {statConfig.map((stat) => (
            <StatBar
              key={stat.key}
              label={stat.label}
              value={stats[stat.key]}
              color={stat.color}
            />
          ))}
        </View>

        {/* Assessment */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Life Assessment</Text>
          <Text style={styles.assessmentText}>{getAssessment(overallScore)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getScoreColor(score: number): string {
  if (score >= 70) return colors.success;
  if (score >= 40) return colors.warning;
  return colors.danger;
}

function getAssessment(score: number): string {
  if (score >= 80) return "🌟 Exceptional life! You're thriving in almost every aspect.";
  if (score >= 60) return '✨ Good life! Keep making smart decisions.';
  if (score >= 40) return "⚖️ Average life. There's room to grow.";
  if (score >= 20) return '⚠️ Challenging life. Consider focusing on key areas.';
  return '🆘 Life is tough right now. Take care of the basics first.';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32 },
  characterCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  charEmoji: { fontSize: 44, marginRight: 14 },
  charInfo: { flex: 1 },
  charName: { fontSize: 20, fontWeight: '800', color: colors.text },
  charMeta: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  charInterests: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  scoreBox: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  scoreNumber: { fontSize: 26, fontWeight: '900' },
  scoreLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  assessmentText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
