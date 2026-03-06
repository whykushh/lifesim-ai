import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  Pressable,
  Platform,
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
  const [nameFocused, setNameFocused] = useState(false);
  const [countryFocused, setCountryFocused] = useState(false);
  const { startNewLife, isLoading } = useGameStore();

  // Fade-in animation on mount
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(32)).current;

  // Button scale animation
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

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

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const interestCount = selectedInterests.length;
  const allSelected = interestCount === 3;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.headerContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.crownRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.crownIcon}>⚜️</Text>
            <View style={styles.dividerLine} />
          </View>
          <Text style={styles.title}>FORGE YOUR DESTINY</Text>
          <Text style={styles.subtitle}>
            Build your character. Shape your world.
          </Text>
          <View style={styles.titleUnderline} />
        </Animated.View>

        {/* Name Input */}
        <Animated.View
          style={[
            styles.fieldContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.fieldLabel}>YOUR NAME</Text>
          <View
            style={[
              styles.inputWrapper,
              nameFocused && styles.inputWrapperFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Enter your legend name..."
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
            />
          </View>
        </Animated.View>

        {/* Country Input */}
        <Animated.View
          style={[
            styles.fieldContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.fieldLabel}>YOUR HOMELAND</Text>
          <View
            style={[
              styles.inputWrapper,
              countryFocused && styles.inputWrapperFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="e.g. United States, Japan, Brazil..."
              placeholderTextColor={colors.textMuted}
              value={country}
              onChangeText={setCountry}
              autoCapitalize="words"
              onFocus={() => setCountryFocused(true)}
              onBlur={() => setCountryFocused(false)}
            />
          </View>
        </Animated.View>

        {/* Interests */}
        <Animated.View
          style={[
            styles.fieldContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.interestLabelRow}>
            <Text style={styles.fieldLabel}>CHOOSE YOUR PATHS</Text>
            <View
              style={[
                styles.countBadge,
                allSelected && styles.countBadgeComplete,
              ]}
            >
              <Text
                style={[
                  styles.countBadgeText,
                  allSelected && styles.countBadgeTextComplete,
                ]}
              >
                {interestCount}/3
              </Text>
            </View>
          </View>
          <View style={styles.interestGrid}>
            {INTEREST_OPTIONS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              const isDisabled = allSelected && !isSelected;
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
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.interestText,
                      isSelected && styles.interestTextSelected,
                      isDisabled && styles.interestTextDisabled,
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Separator */}
        <Animated.View
          style={[styles.separator, { opacity: fadeAnim }]}
        >
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>READY TO BEGIN?</Text>
          <View style={styles.separatorLine} />
        </Animated.View>

        {/* Start Button */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Pressable
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
            onPress={handleStart}
            disabled={isLoading}
          >
            <Animated.View
              style={[
                styles.startButton,
                isLoading && styles.startButtonDisabled,
                { transform: [{ scale: buttonScale }] },
              ]}
            >
              <View style={styles.startButtonInner}>
                <Text style={styles.startButtonText}>
                  {isLoading ? '⏳  FORGING YOUR FATE...' : '⚡  BEGIN YOUR LEGEND'}
                </Text>
                {!isLoading && (
                  <Text style={styles.startButtonSubtext}>
                    Your story starts now
                  </Text>
                )}
              </View>
            </Animated.View>
          </Pressable>
        </Animated.View>

        {/* Bottom tagline */}
        <Animated.View style={[styles.footerTagline, { opacity: fadeAnim }]}>
          <Text style={styles.footerTaglineText}>
            Every legend begins with a single choice.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
  },

  // Header
  headerContainer: {
    alignItems: 'center',
    marginBottom: 36,
    paddingTop: 12,
  },
  crownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  crownIcon: {
    fontSize: 22,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 3,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        textShadowColor: colors.primary,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 18,
        fontFamily: 'System',
      },
      android: {
        textShadowColor: colors.primary,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 18,
        fontFamily: 'sans-serif-black',
      },
    }),
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 10,
    letterSpacing: 0.6,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  titleUnderline: {
    marginTop: 16,
    width: 60,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 2,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  // Fields
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 2.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  inputWrapperFocused: {
    borderColor: colors.accent,
    ...Platform.select({
      ios: {
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },

  // Interests
  interestLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  countBadge: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  countBadgeComplete: {
    borderColor: colors.gold,
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
  },
  countBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  countBadgeTextComplete: {
    color: colors.gold,
  },
  interestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  interestChip: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 24,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  interestChipSelected: {
    backgroundColor: 'rgba(155, 48, 255, 0.18)',
    borderColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  interestChipDisabled: {
    opacity: 0.3,
  },
  interestText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  interestTextSelected: {
    color: colors.text,
    fontWeight: '700',
  },
  interestTextDisabled: {
    color: colors.textMuted,
  },

  // Separator
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
    gap: 12,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  separatorText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 2.5,
  },

  // Start Button
  startButton: {
    borderRadius: 18,
    backgroundColor: colors.gold,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.gold,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.55,
        shadowRadius: 16,
      },
      android: {
        elevation: 14,
      },
    }),
  },
  startButtonDisabled: {
    opacity: 0.55,
  },
  startButtonInner: {
    paddingVertical: 22,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: colors.background,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 1.5,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'sans-serif-black',
      },
    }),
  },
  startButtonSubtext: {
    color: 'rgba(8, 8, 20, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 4,
  },

  // Footer
  footerTagline: {
    alignItems: 'center',
    marginTop: 28,
  },
  footerTaglineText: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
});
