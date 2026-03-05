import { Character, Stats, LifeEvent, AISimulationResult } from '../models/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type DecisionType =
  | 'education'
  | 'business'
  | 'invest'
  | 'relationship'
  | 'health'
  | 'career'
  | 'relocate'
  | 'travel'
  | 'creative'
  | 'social'
  | 'default';

interface Outcome {
  probability: number;
  narrative: string;
  statChanges: Partial<Omit<Stats, 'age'>>;
}

interface RandomEvent {
  narrative: string;
  statChanges: Partial<Omit<Stats, 'age'>>;
  condition?: (stats: Stats) => boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pickWeighted<T extends { probability: number }>(options: T[]): T {
  const total = options.reduce((sum, o) => sum + o.probability, 0);
  let rand = Math.random() * total;
  for (const option of options) {
    rand -= option.probability;
    if (rand <= 0) return option;
  }
  return options[options.length - 1];
}

function adj(base: number, stat: number, dir: 'pos' | 'neg'): number {
  const delta = ((stat - 50) / 200) * base;
  return dir === 'pos' ? base + delta : base - delta;
}

// ─── Decision Type Detection ──────────────────────────────────────────────────

function detectType(decision: string): DecisionType {
  const d = decision.toLowerCase();
  if (/university|study|school|college|degree|education|learn|course/.test(d)) return 'education';
  if (/business|startup|company|entrepreneur|venture|found|launch/.test(d)) return 'business';
  if (/invest|stock|crypto|fund|trading|portfolio|market/.test(d)) return 'invest';
  if (/relationship|date|marry|love|partner|romance|wedding/.test(d)) return 'relationship';
  if (/health|fitness|gym|exercise|diet|workout|meditat/.test(d)) return 'health';
  if (/career|job|work|promot|profession|employ/.test(d)) return 'career';
  if (/move|abroad|country|relocat|emigrat|immigrat/.test(d)) return 'relocate';
  if (/travel|trip|adventure|explore|backpack|vacation/.test(d)) return 'travel';
  if (/art|music|write|paint|creat|passion|hobby/.test(d)) return 'creative';
  if (/friend|social|network|community|volunteer/.test(d)) return 'social';
  return 'default';
}

// ─── Outcome Tables ────────────────────────────────────────────────────────────

const OUTCOMES: Record<DecisionType, (stats: Stats) => Outcome[]> = {
  education: (stats) => [
    {
      probability: adj(0.50, stats.intelligence, 'pos'),
      narrative:
        'You threw yourself into your studies and graduated with honors. Your professors noticed your dedication, opening doors you never imagined.',
      statChanges: { intelligence: 20, careerLevel: 15, money: -12, happiness: 8 },
    },
    {
      probability: 0.35,
      narrative:
        "You earned your degree. It wasn't easy and the debt stings, but you walked across that stage with your head held high.",
      statChanges: { intelligence: 12, careerLevel: 8, money: -15, happiness: 5, relationships: 5 },
    },
    {
      probability: adj(0.15, stats.happiness, 'neg'),
      narrative:
        'The coursework overwhelmed you and you barely passed. The lessons in resilience were invaluable, even if the grade was not.',
      statChanges: { intelligence: 6, careerLevel: 3, money: -18, happiness: -8 },
    },
  ],
  business: (stats) => [
    {
      probability: adj(0.25, stats.money, 'pos'),
      narrative:
        'Your business took off beyond all expectations. Investors came knocking and within a year you were turning a healthy profit.',
      statChanges: { money: 22, careerLevel: 20, happiness: 18, intelligence: 5 },
    },
    {
      probability: 0.45,
      narrative:
        "The business is running — not booming, but not sinking. You're learning every day about leadership, finance, and building something real.",
      statChanges: { money: 8, careerLevel: 10, intelligence: 8, happiness: 5, health: -5 },
    },
    {
      probability: adj(0.30, stats.money, 'neg'),
      narrative:
        "The business failed. The savings you poured in are gone. It's a crushing blow — but every entrepreneur has failure stories.",
      statChanges: { money: -20, happiness: -15, careerLevel: -5, intelligence: 8 },
    },
  ],
  invest: (stats) => [
    {
      probability: adj(0.35, stats.intelligence, 'pos'),
      narrative:
        'Your investments paid off. You studied the market carefully, diversified wisely, and watched your portfolio grow substantially.',
      statChanges: { money: 20, happiness: 12, intelligence: 5 },
    },
    {
      probability: 0.35,
      narrative:
        "The investments returned modest gains. Nothing spectacular — the market was choppy — but you didn't lose anything.",
      statChanges: { money: 8, intelligence: 5 },
    },
    {
      probability: adj(0.20, stats.intelligence, 'neg'),
      narrative:
        'The investment went south. A downturn you did not see coming wiped out a chunk of your portfolio.',
      statChanges: { money: -18, happiness: -10 },
    },
    {
      probability: 0.10,
      narrative:
        'Incredible luck — one position exploded in value. Right place, right time. You held on and it paid off massively.',
      statChanges: { money: 30, happiness: 20, intelligence: 3 },
    },
  ],
  relationship: (stats) => [
    {
      probability: adj(0.50, stats.happiness, 'pos'),
      narrative:
        "You found a deep, meaningful connection. The relationship brings joy and belonging you hadn't felt before.",
      statChanges: { happiness: 20, relationships: 22, health: 5 },
    },
    {
      probability: 0.30,
      narrative:
        "The relationship has its ups and downs, like all real ones do. You're learning to communicate and compromise.",
      statChanges: { happiness: 8, relationships: 12 },
    },
    {
      probability: adj(0.20, stats.relationships, 'neg'),
      narrative:
        'The relationship ended. Misaligned values and incompatibility neither of you could fix. It hurts, but you carry the lessons forward.',
      statChanges: { happiness: -15, relationships: -8, health: -5 },
    },
  ],
  health: (stats) => [
    {
      probability: adj(0.60, stats.health, 'pos'),
      narrative:
        'You committed to your health and the results are remarkable. Energy soared, mood stabilized, you feel years younger.',
      statChanges: { health: 22, happiness: 15, careerLevel: 5 },
    },
    {
      probability: 0.30,
      narrative:
        "Real progress on your health journey. Habits aren't perfect, but you're more consistent than ever.",
      statChanges: { health: 12, happiness: 8 },
    },
    {
      probability: adj(0.10, stats.health, 'neg'),
      narrative:
        'Despite good intentions, life got in the way. You need a more sustainable approach.',
      statChanges: { health: 3, happiness: -5 },
    },
  ],
  career: (stats) => [
    {
      probability: adj(0.40, stats.careerLevel, 'pos'),
      narrative:
        'Your career made a significant leap. A bold move paid off and your reputation in the industry is growing.',
      statChanges: { careerLevel: 18, money: 15, happiness: 10, intelligence: 5 },
    },
    {
      probability: 0.35,
      narrative:
        "A solid career move. Not dramatic, but you're in a better position — new responsibilities and a clearer path forward.",
      statChanges: { careerLevel: 8, money: 8, intelligence: 5 },
    },
    {
      probability: adj(0.25, stats.careerLevel, 'neg'),
      narrative:
        "The career change didn't pan out. You're rebuilding credibility from scratch. A setback, not a dead end.",
      statChanges: { careerLevel: -5, money: -8, happiness: -8, intelligence: 5 },
    },
  ],
  relocate: (stats) => [
    {
      probability: 0.40,
      narrative:
        'Moving was the adventure you needed. A new culture and new opportunities opened your mind in ways you never anticipated.',
      statChanges: { happiness: 15, intelligence: 12, relationships: -8, money: -5 },
    },
    {
      probability: 0.35,
      narrative:
        "The move was harder than expected — homesickness, language barriers, administrative chaos. But you're adapting.",
      statChanges: { happiness: -5, intelligence: 10, relationships: -12, health: -3 },
    },
    {
      probability: 0.25,
      narrative:
        'Your new home exceeded every expectation — lower costs, richer opportunities, and a new community of friends.',
      statChanges: { happiness: 20, money: 10, intelligence: 8, relationships: 5, health: 5 },
    },
  ],
  travel: (stats) => [
    {
      probability: 0.50,
      narrative:
        'The trip was everything you needed. Fresh perspective, unforgettable memories, and a rekindled sense of wonder.',
      statChanges: { happiness: 18, intelligence: 8, relationships: 5, money: -8 },
    },
    {
      probability: 0.30,
      narrative:
        "Travel broadened your horizons. The expense stung, but experiences like these don't age — they only get better.",
      statChanges: { happiness: 12, intelligence: 5, money: -12 },
    },
    {
      probability: 0.20,
      narrative:
        'Rough patches — missed connections, budget overruns, a brief illness. But even the misadventures made great stories.',
      statChanges: { happiness: 5, intelligence: 8, money: -15, health: -5 },
    },
  ],
  creative: (stats) => [
    {
      probability: 0.40,
      narrative:
        "Pursuing your passion unlocked something dormant. You created work you're proud of and found your community.",
      statChanges: { happiness: 20, intelligence: 10, relationships: 8 },
    },
    {
      probability: 0.40,
      narrative:
        "The creative journey continues. Recognition is sparse, but the work fulfills you in ways a paycheck never could.",
      statChanges: { happiness: 12, intelligence: 8 },
    },
    {
      probability: 0.20,
      narrative:
        'Creative blocks plagued much of the year. The vision and the work refused to match. Persistence is the path through.',
      statChanges: { happiness: -5, intelligence: 5 },
    },
  ],
  social: (stats) => [
    {
      probability: 0.50,
      narrative:
        'Investing in your social life paid dividends. New friendships formed and your network is both personally and professionally valuable.',
      statChanges: { relationships: 20, happiness: 15, careerLevel: 5 },
    },
    {
      probability: 0.35,
      narrative:
        "You made meaningful connections. Not every relationship clicked, but the ones that did are genuine.",
      statChanges: { relationships: 12, happiness: 8 },
    },
    {
      probability: 0.15,
      narrative:
        "Social situations were draining. Some relationships proved shallow or toxic. You're learning to be more selective.",
      statChanges: { relationships: -5, happiness: -8 },
    },
  ],
  default: (_stats) => [
    {
      probability: 0.40,
      narrative:
        'You spent the year finding your footing and working on yourself. Quiet, steady progress. Unremarkable years often lay the groundwork for remarkable ones.',
      statChanges: { happiness: 5, intelligence: 5, health: 3 },
    },
    {
      probability: 0.30,
      narrative:
        'Small wins and small losses. You navigated ordinary challenges with more grace than you give yourself credit for.',
      statChanges: { happiness: 3, money: 3 },
    },
    {
      probability: 0.20,
      narrative:
        "The year tested your patience. Things didn't come together as planned. But you're still here — and that counts.",
      statChanges: { happiness: -3, intelligence: 3 },
    },
    {
      probability: 0.10,
      narrative:
        'Against all odds, a breakout year. Something clicked — mindset, habits, timing. You end the year markedly better.',
      statChanges: { happiness: 15, money: 10, careerLevel: 8, health: 8 },
    },
  ],
};

// ─── Random Life Events ───────────────────────────────────────────────────────

const RANDOM_EVENTS: RandomEvent[] = [
  { narrative: 'You won a small lottery — a pleasant surprise that gave your finances a cushion.', statChanges: { money: 12, happiness: 8 } },
  { narrative: 'An unexpected accident drained your emergency fund and kept you off your feet for weeks.', statChanges: { money: -12, health: -8, happiness: -5 } },
  { narrative: 'An out-of-the-blue promotion at work. Your efforts had been noticed all along.', statChanges: { careerLevel: 10, money: 8, happiness: 10 } },
  { narrative: 'A brief but draining illness forced you to slow down for several weeks.', statChanges: { health: -12, money: -5, happiness: -8 } },
  { narrative: 'You crossed paths with a mentor who saw potential in you and offered invaluable guidance.', statChanges: { intelligence: 12, careerLevel: 8, happiness: 8 } },
  { narrative: 'An economic downturn hit your region and squeezed your finances harder than expected.', statChanges: { money: -10, happiness: -8, careerLevel: -3 } },
  { narrative: 'You discovered a passion project that energizes you every morning before work even starts.', statChanges: { happiness: 15, intelligence: 8 } },
  { narrative: 'A close friend moved away, leaving a gap in your social life that took time to fill.', statChanges: { relationships: -8, happiness: -5 } },
  { narrative: 'A former colleague referred you to an incredible opportunity you never would have found alone.', statChanges: { careerLevel: 8, money: 10, relationships: 5 } },
  { narrative: 'A health scare turned out to be manageable — but it was the wake-up call you needed.', statChanges: { health: -5, happiness: -3, intelligence: 5 } },
  { narrative: 'You reconnected with an old friend and picked up right where you left off.', statChanges: { relationships: 12, happiness: 10 } },
  { narrative: 'Unexpected home repairs drained your savings and tested your patience.', statChanges: { money: -10, happiness: -5 } },
  { narrative: 'You stumbled into a new hobby that quickly became a beloved part of your weekly routine.', statChanges: { happiness: 10, health: 5 } },
  {
    narrative: 'An inheritance from a distant relative arrived unexpectedly, providing a meaningful financial boost.',
    statChanges: { money: 18, happiness: 5 },
    condition: (s) => s.age > 25,
  },
  { narrative: "You completed a personal challenge you'd been putting off for years. The accomplishment was enormous.", statChanges: { happiness: 15, health: 8, intelligence: 5 } },
];

// ─── Core Functions ───────────────────────────────────────────────────────────

function pickRandomEvent(stats: Stats): RandomEvent | undefined {
  if (Math.random() > 0.55) return undefined;
  const eligible = RANDOM_EVENTS.filter((e) => !e.condition || e.condition(stats));
  return eligible[Math.floor(Math.random() * eligible.length)];
}

function mergeStatChanges(
  a: Partial<Omit<Stats, 'age'>>,
  b?: Partial<Omit<Stats, 'age'>>
): Partial<Omit<Stats, 'age'>> {
  if (!b) return a;
  const result = { ...a };
  for (const key of Object.keys(b) as Array<keyof typeof b>) {
    result[key] = ((result[key] ?? 0) + (b[key] ?? 0));
  }
  return result;
}

export function generateWelcomeMessage(character: Character): string {
  const messages = [
    `Welcome to your story, ${character.name}. At 18, standing in ${character.country}, the world stretches endlessly before you.`,
    `Your life begins, ${character.name}. Fresh out of school, full of dreams, rooted in ${character.country} — every decision from here shapes who you become.`,
    `Eighteen years old in ${character.country}, ${character.name}. The chapter where real choices begin. The future is not written yet.`,
    `Here you are, ${character.name}. Age 18, ${character.country} as your starting line. With interests in ${character.interests.join(' and ')}, the seeds of your future are already planted.`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

export function runSimulation(
  stats: Stats,
  decision: string,
  _character: Character
): AISimulationResult {
  const type = detectType(decision);
  const outcomes = OUTCOMES[type](stats);
  const chosen = pickWeighted(outcomes);
  const randomEvent = pickRandomEvent(stats);

  return {
    outcome: chosen.narrative,
    randomEvent: randomEvent?.narrative,
    statChanges: mergeStatChanges(chosen.statChanges, randomEvent?.statChanges),
  };
}
