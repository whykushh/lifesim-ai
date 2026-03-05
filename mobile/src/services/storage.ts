import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState } from '../types';

const STORAGE_KEY = '@lifesim_game_state';

export async function saveGameToStorage(
  state: Partial<GameState>
): Promise<void> {
  try {
    const serializable = {
      character: state.character ?? null,
      stats: state.stats,
      timeline: state.timeline ?? [],
      sessionId: state.sessionId ?? null,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch (err) {
    console.warn('Failed to save game state:', err);
  }
}

export async function loadGameFromStorage(): Promise<Partial<GameState> | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as Partial<GameState>;
  } catch (err) {
    console.warn('Failed to load game state:', err);
    return null;
  }
}

export async function clearGameStorage(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear game state:', err);
  }
}
