// AI service replaced with local deterministic simulation engine.
// No external API calls or API keys required.

import { Character, Stats, LifeEvent, AISimulationResult } from '../models/types';
import { runSimulation, generateWelcomeMessage } from './simulationEngine';

export async function simulateDecision(
  character: Character,
  stats: Stats,
  decision: string,
  _timeline: LifeEvent[]
): Promise<AISimulationResult> {
  return runSimulation(stats, decision, character);
}

export async function generateWelcomeEvent(character: Character): Promise<string> {
  return generateWelcomeMessage(character);
}
