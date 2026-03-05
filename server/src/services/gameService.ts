import { Stats } from '../models/types';

const STAT_MIN = 0;
const STAT_MAX = 100;

export function clampStat(value: number): number {
  return Math.max(STAT_MIN, Math.min(STAT_MAX, Math.round(value)));
}

export function applyStatChanges(
  currentStats: Stats,
  changes: Partial<Omit<Stats, 'age'>>
): Stats {
  return {
    age: currentStats.age + 1,
    money: clampStat(currentStats.money + (changes.money ?? 0)),
    happiness: clampStat(currentStats.happiness + (changes.happiness ?? 0)),
    health: clampStat(currentStats.health + (changes.health ?? 0)),
    careerLevel: clampStat(currentStats.careerLevel + (changes.careerLevel ?? 0)),
    intelligence: clampStat(currentStats.intelligence + (changes.intelligence ?? 0)),
    relationships: clampStat(currentStats.relationships + (changes.relationships ?? 0)),
  };
}

export function getInitialStats(): Stats {
  return {
    age: 18,
    money: 30,
    happiness: 60,
    health: 80,
    careerLevel: 5,
    intelligence: 50,
    relationships: 40,
  };
}
