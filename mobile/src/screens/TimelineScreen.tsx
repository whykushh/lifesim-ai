import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useGameStore } from '../store/gameStore';
import TimelineCard from '../components/TimelineCard';

export default function TimelineScreen() {
  const { timeline, character } = useGameStore();
  const reversed = [...timeline].reverse();

  return (
    <SafeAreaView style={styles.container}>
      {timeline.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📜</Text>
          <Text style={styles.emptyText}>No events yet.</Text>
          <Text style={styles.emptySubtext}>
            Start making decisions to build your life story.
          </Text>
        </View>
      ) : (
        <FlatList
          data={reversed}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListHeaderComponent={() => (
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderTitle}>
                {character?.name ?? 'Your'}'s Life Story
              </Text>
              <Text style={styles.listHeaderSub}>
                {timeline.length} events · Age {timeline[0]?.age} to{' '}
                {timeline[timeline.length - 1]?.age}
              </Text>
            </View>
          )}
          renderItem={({ item, index }) => (
            <TimelineCard event={item} isLatest={index === 0} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  listHeader: { marginBottom: 16, alignItems: 'center' },
  listHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  listHeaderSub: { fontSize: 13, color: colors.textMuted },
});
