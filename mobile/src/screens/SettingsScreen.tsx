import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenNavigationProp } from '../navigation/types';
import { colors } from '../theme/colors';
import { useGameStore } from '../store/gameStore';
import { clearGameStorage } from '../services/storage';

interface Props {
  navigation: ScreenNavigationProp<'Settings'>;
}

export default function SettingsScreen({ navigation }: Props) {
  const { resetGame } = useGameStore();

  const handleNewGame = () => {
    Alert.alert(
      'Start New Life',
      'This will erase your current save. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Over',
          style: 'destructive',
          onPress: async () => {
            await clearGameStorage();
            resetGame();
            navigation.navigate('Welcome');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Navigate</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('Timeline')}
          >
            <Text style={styles.rowText}>📜 Life Timeline</Text>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('Stats')}
          >
            <Text style={styles.rowText}>📊 View Stats</Text>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('Simulation')}
          >
            <Text style={styles.rowText}>🎮 Return to Simulation</Text>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity
            style={[styles.row, styles.dangerRow]}
            onPress={handleNewGame}
          >
            <Text style={[styles.rowText, styles.dangerText]}>
              🗑️ Start New Life
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.about}>
          <Text style={styles.aboutText}>LifeSim AI v1.0.0</Text>
          <Text style={styles.aboutSubtext}>Powered by Claude AI</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    paddingLeft: 4,
  },
  row: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowText: { fontSize: 16, color: colors.text },
  rowArrow: { fontSize: 20, color: colors.textMuted },
  dangerRow: { borderColor: colors.danger + '40' },
  dangerText: { color: colors.danger },
  about: { alignItems: 'center', marginTop: 32 },
  aboutText: { fontSize: 14, color: colors.textMuted },
  aboutSubtext: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
});
