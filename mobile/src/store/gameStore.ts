import { create } from 'zustand';
import { Character, Stats, LifeEvent, GameState } from '../types';
import { runSimulation, generateWelcomeMessage } from '../services/simulationEngine';
import { saveGameToStorage } from '../services/storage';

interface GameActions {
  startNewLife: (characterData: Omit<Character, 'id'>) => Promise<boolean>;
  makeDecision: (decision: string) => Promise<void>;
  loadGame: (state: Partial<GameState>) => void;
  resetGame: () => void;
}

const DEFAULT_STATS: Stats = {
  age: 18,
  money: 30,
  happiness: 60,
  health: 80,
  careerLevel: 5,
  intelligence: 50,
  relationships: 40,
};

const INITIAL_STATE: GameState = {
  character: null,
  stats: DEFAULT_STATS,
  timeline: [],
  isLoading: false,
  sessionId: null,
  error: null,
};

function clampStat(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function applyStatChanges(
  current: Stats,
  changes: Partial<Omit<Stats, 'age'>>
): Stats {
  return {
    age: current.age + 1,
    money: clampStat(current.money + (changes.money ?? 0)),
    happiness: clampStat(current.happiness + (changes.happiness ?? 0)),
    health: clampStat(current.health + (changes.health ?? 0)),
    careerLevel: clampStat(current.careerLevel + (changes.careerLevel ?? 0)),
    intelligence: clampStat(current.intelligence + (changes.intelligence ?? 0)),
    relationships: clampStat(current.relationships + (changes.relationships ?? 0)),
  };
}

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...INITIAL_STATE,

  startNewLife: async (characterData) => {
    set({ isLoading: true, error: null });

    // Brief delay so the loading screen renders
    await new Promise((r) => setTimeout(r, 600));

    try {
      const sessionId = makeId();
      const character: Character = { ...characterData, id: sessionId };
      const stats = { ...DEFAULT_STATS };
      const welcomeMessage = generateWelcomeMessage(character);

      const welcomeEvent: LifeEvent = {
        id: makeId(),
        year: 1,
        age: 18,
        decision: 'Life begins',
        outcome: welcomeMessage,
        statChanges: {},
        timestamp: Date.now(),
      };

      const newState: Partial<GameState> = {
        character,
        stats,
        timeline: [welcomeEvent],
        sessionId,
        isLoading: false,
        error: null,
      };

      set(newState);
      await saveGameToStorage({ ...get(), ...newState });
      return true;
    } catch (err) {
      set({ isLoading: false, error: 'Failed to start simulation' });
      return false;
    }
  },

  makeDecision: async (decision) => {
    const { character, stats, isLoading, timeline } = get();
    if (!character || isLoading) return;

    set({ isLoading: true, error: null });

    // Simulate processing delay for better UX
    await new Promise((r) => setTimeout(r, 700));

    try {
      const result = runSimulation(stats, decision, character);
      const newStats = applyStatChanges(stats, result.statChanges);

      const event: LifeEvent = {
        id: makeId(),
        year: timeline.length + 1,
        age: newStats.age,
        decision,
        outcome: result.outcome,
        randomEvent: result.randomEvent,
        statChanges: result.statChanges,
        timestamp: Date.now(),
      };

      const newTimeline = [...get().timeline, event];
      const newState: Partial<GameState> = {
        stats: newStats,
        timeline: newTimeline,
        isLoading: false,
        error: null,
      };

      set(newState);
      await saveGameToStorage({ ...get(), ...newState });
    } catch (err) {
      set({ isLoading: false, error: 'Failed to process decision' });
    }
  },

  loadGame: (savedState) => {
    set(savedState as Partial<GameState & GameActions>);
  },

  resetGame: () => {
    set({ ...INITIAL_STATE });
  },
}));
