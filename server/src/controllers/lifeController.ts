import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Session, Character, LifeEvent } from '../models/types';
import { simulateDecision, generateWelcomeEvent } from '../services/aiService';
import { applyStatChanges, getInitialStats } from '../services/gameService';

// In-memory session store (replace with a database for production)
const sessions = new Map<string, Session>();

export async function startLife(req: Request, res: Response): Promise<void> {
  try {
    const { character: charData } = req.body as {
      character: Omit<Character, 'id'>;
    };

    if (!charData?.name || !charData?.country || !charData?.interests?.length) {
      res.status(400).json({ error: 'Character name, country, and interests are required' });
      return;
    }

    const character: Character = {
      id: uuidv4(),
      name: charData.name,
      country: charData.country,
      interests: charData.interests,
    };

    const stats = getInitialStats();
    const sessionId = uuidv4();
    const welcomeMessage = await generateWelcomeEvent(character);

    const welcomeEvent: LifeEvent = {
      id: uuidv4(),
      year: 1,
      age: 18,
      decision: 'Life begins',
      outcome: welcomeMessage,
      statChanges: {},
      timestamp: Date.now(),
    };

    const session: Session = {
      sessionId,
      character,
      stats,
      timeline: [welcomeEvent],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    sessions.set(sessionId, session);
    res.status(201).json({ sessionId, stats, welcomeEvent });
  } catch (error) {
    console.error('startLife error:', error);
    res.status(500).json({ error: 'Failed to start life simulation' });
  }
}

export async function makeDecision(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId, decision } = req.body as {
      sessionId: string;
      decision: string;
    };

    if (!sessionId || !decision?.trim()) {
      res.status(400).json({ error: 'sessionId and decision are required' });
      return;
    }

    const session = sessions.get(sessionId);
    if (!session) {
      res.status(404).json({ error: 'Session not found. Please start a new life.' });
      return;
    }

    const aiResult = await simulateDecision(
      session.character,
      session.stats,
      decision.trim(),
      session.timeline
    );

    const newStats = applyStatChanges(session.stats, aiResult.statChanges);

    const event: LifeEvent = {
      id: uuidv4(),
      year: session.timeline.length + 1,
      age: newStats.age,
      decision: decision.trim(),
      outcome: aiResult.outcome,
      randomEvent: aiResult.randomEvent,
      statChanges: aiResult.statChanges,
      timestamp: Date.now(),
    };

    session.stats = newStats;
    session.timeline.push(event);
    session.updatedAt = Date.now();
    sessions.set(sessionId, session);

    res.json({ event, newStats });
  } catch (error) {
    console.error('makeDecision error:', error);
    res.status(500).json({ error: 'Failed to process decision' });
  }
}

export function getTimeline(req: Request, res: Response): void {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  res.json({ timeline: session.timeline });
}

export function getStats(req: Request, res: Response): void {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  res.json({ stats: session.stats, character: session.character });
}
