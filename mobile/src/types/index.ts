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

export interface GameState {
  character: Character | null;
  stats: Stats;
  timeline: LifeEvent[];
  isLoading: boolean;
  sessionId: string | null;
  error: string | null;
}

export interface StartLifeResponse {
  sessionId: string;
  stats: Stats;
  welcomeEvent: LifeEvent;
}

export interface DecisionResponse {
  event: LifeEvent;
  newStats: Stats;
}
