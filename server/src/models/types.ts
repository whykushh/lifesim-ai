export interface Character {
  id: string;
  name: string;
  country: string;
  interests: string[];
}

export interface Stats {
  age: number;
  money: number;
  happiness: number;
  health: number;
  careerLevel: number;
  intelligence: number;
  relationships: number;
}

export interface LifeEvent {
  id: string;
  year: number;
  age: number;
  decision: string;
  outcome: string;
  randomEvent?: string;
  statChanges: Partial<Omit<Stats, 'age'>>;
  timestamp: number;
}

export interface Session {
  sessionId: string;
  character: Character;
  stats: Stats;
  timeline: LifeEvent[];
  createdAt: number;
  updatedAt: number;
}

export interface AISimulationResult {
  outcome: string;
  randomEvent?: string;
  statChanges: Partial<Omit<Stats, 'age'>>;
}
