import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenNavigationProp } from '../navigation/types';
import { colors } from '../theme/colors';
import { useGameStore } from '../store/gameStore';

interface Props {
  navigation: ScreenNavigationProp<'CreateCharacter'>;
}

const INTEREST_OPTIONS = [
  '💻 Technology',
  '🎨 Art',
  '🏋️ Fitness',
  '📚 Education',
  '🎵 Music',
  '🌍 Travel',
  '💼 Business',
  '🔬 Science',
  '🍳 Cooking',
  '🎮 Gaming',
  '✍️ Writing',
  '🌱 Nature',
];

export default function CreateCharacterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { startNewLife, isLoading } = useGameStore();

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 3
        ? [...prev, interest]
        : prev
    );
  };

  const handleStart = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter your character name');
      return;
    }
    if (!country.trim()) {
      Alert.alert('Country required', 'Please enter your starting country');
      return;
    }
    if (selectedInterests.length === 0) {
      Alert.alert('Interests required', 'Please select at least one interest');
      return;
    }

    // Strip emoji prefix from interest labels
    const cleanInterests = selectedInterests.map((i) =>
      i.replace(/^[^\s]+\s/, '')
    );

    const success = await startNewLife({
      name: name.trim(),
      country: country.trim(),
      interests: cleanInterests,
    });

    if (success) {
      navigation.navigate('Simulation');
    } else {
      Alert.alert(
        'Connection Error',
        'Failed to start simulation. Make sure the server is running at the configured API URL.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create Your Character</Text>
        <Text style={styles.subtitle}>
          You start at age 18. Make your choices wisely.
        </Text>

        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter character name..."
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Starting Country</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. United States, Japan, Brazil..."
          placeholderTextColor={colors.textMuted}
          value={country}
          onChangeText={setCountry}
          autoCapitalize="words"
        />

        <Text style={styles.label}>
          Interests (pick up to 3){' '}
          <Text style={styles.labelCount}>{selectedInterests.length}/3</Text>
        </Text>
        <View style={styles.interestGrid}>
          {INTEREST_OPTIONS.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            const isDisabled =
              selectedInterests.length === 3 && !isSelected;
            return (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.interestChip,
                  isSelected && styles.interestChipSelected,
                  isDisabled && styles.interestChipDisabled,
                ]}
                onPress={() => toggleInterest(interest)}
                disabled={isDisabled}
              >
                <Text
                  style={[
                    styles.interestText,
                    isSelected && styles.interestTextSelected,
                  ]}
                >
                  {interest}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.startButton, isLoading && styles.startButtonDisabled]}
          onPress={handleStart}
          disabled={isLoading}
        >
          <Text style={styles.startButtonText}>
            {isLoading ? 'Starting your life...' : '🚀 Begin Life Simulation'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 24 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  labelCount: { color: colors.primary, fontWeight: '700' },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  interestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 32,
  },
  interestChip: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  interestChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  interestChipDisabled: { opacity: 0.4 },
  interestText: { color: colors.textSecondary, fontSize: 14 },
  interestTextSelected: { color: colors.text, fontWeight: '600' },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  startButtonDisabled: { opacity: 0.6 },
  startButtonText: { color: colors.text, fontSize: 17, fontWeight: '700' },
});
