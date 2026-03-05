import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { colors } from '../theme/colors';
import WelcomeScreen from '../screens/WelcomeScreen';
import CreateCharacterScreen from '../screens/CreateCharacterScreen';
import SimulationScreen from '../screens/SimulationScreen';
import TimelineScreen from '../screens/TimelineScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: 'bold' },
          cardStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateCharacter"
          component={CreateCharacterScreen}
          options={{ title: 'Create Character' }}
        />
        <Stack.Screen
          name="Simulation"
          component={SimulationScreen}
          options={{ title: 'Your Life', headerLeft: () => null }}
        />
        <Stack.Screen
          name="Timeline"
          component={TimelineScreen}
          options={{ title: 'Life Timeline' }}
        />
        <Stack.Screen
          name="Stats"
          component={StatsScreen}
          options={{ title: 'Life Stats' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
