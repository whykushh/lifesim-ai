import { Character, Stats, LifeEvent } from '../types';

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

export interface SimulationResult {
  outcome: string;
  randomEvent?: string;
  statChanges: Partial<Omit<Stats, 'age'>>;
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

// Nudge a base probability up/down based on a stat value (0–100)
function adj(base: number, stat: number, dir: 'pos' | 'neg'): number {
  const delta = ((stat - 50) / 200) * base; // ±25% max
  return dir === 'pos' ? base + delta : base - delta;
}

// ─── Decision Type Detection ──────────────────────────────────────────────────

function detectType(decision: string): DecisionType {
  const d = decision.toLowerCase();
  if (/university|study|school|college|degree|education|learn|course|phd|master/.test(d)) return 'education';
  if (/business|startup|company|entrepreneur|venture|found|launch|product/.test(d)) return 'business';
  if (/invest|stock|crypto|fund|trading|portfolio|market|bonds|shares/.test(d)) return 'invest';
  if (/relationship|date|marry|love|partner|romance|wedding|girlfriend|boyfriend/.test(d)) return 'relationship';
  if (/health|fitness|gym|exercise|diet|workout|meditat|run|yoga|sport/.test(d)) return 'health';
  if (/career|job|work|promot|profession|employ|boss|office|salary|raise/.test(d)) return 'career';
  if (/move|abroad|country|relocat|emigrat|immigrat|city|overseas/.test(d)) return 'relocate';
  if (/travel|trip|adventure|explore|backpack|vacation|holiday|tour/.test(d)) return 'travel';
  if (/art|music|write|paint|creat|passion|hobby|film|design|craft/.test(d)) return 'creative';
  if (/friend|social|network|community|volunteer|club|group|meet/.test(d)) return 'social';
  return 'default';
}

// ─── Outcome Tables ────────────────────────────────────────────────────────────

const OUTCOMES: Record<DecisionType, (stats: Stats) => Outcome[]> = {
  education: (stats) => [
    {
      probability: adj(0.50, stats.intelligence, 'pos'),
      narrative:
        'You threw yourself into your studies and graduated with honors. Your professors noticed your dedication, opening doors you never imagined. The knowledge gained will serve you for decades.',
      statChanges: { intelligence: 20, careerLevel: 15, money: -12, happiness: 8 },
    },
    {
      probability: 0.35,
      narrative:
        'You earned your degree — it wasn\'t always easy and the debt stings, but you walked across that stage with your head held high. A new chapter begins.',
      statChanges: { intelligence: 12, careerLevel: 8, money: -15, happiness: 5, relationships: 5 },
    },
    {
      probability: adj(0.15, stats.happiness, 'neg'),
      narrative:
        'The coursework overwhelmed you and you barely passed. The experience left you questioning your path — though the lessons in resilience were invaluable.',
      statChanges: { intelligence: 6, careerLevel: 3, money: -18, happiness: -8 },
    },
  ],

  business: (stats) => [
    {
      probability: adj(0.25, stats.money, 'pos') + adj(0, stats.intelligence, 'pos'),
      narrative:
        'Your business took off beyond all expectations. Word of mouth spread fast, investors came knocking, and within a year you were turning a healthy profit.',
      statChanges: { money: 22, careerLevel: 20, happiness: 18, intelligence: 5 },
    },
    {
      probability: 0.45,
      narrative:
        'The business is running — not booming, but not sinking. You\'re learning every day: leadership, finance, and how hard building something really is.',
      statChanges: { money: 8, careerLevel: 10, intelligence: 8, happiness: 5, health: -5 },
    },
    {
      probability: adj(0.30, stats.money, 'neg'),
      narrative:
        'The business failed. The market was against you and the savings you poured in are gone. It\'s a crushing blow — but every entrepreneur has failure stories.',
      statChanges: { money: -20, happiness: -15, careerLevel: -5, intelligence: 8 },
    },
  ],

  invest: (stats) => [
    {
      probability: adj(0.35, stats.intelligence, 'pos'),
      narrative:
        'Your investments paid off. You studied the market carefully, diversified wisely, and watched your portfolio grow substantially. Financial independence feels closer.',
      statChanges: { money: 20, happiness: 12, intelligence: 5 },
    },
    {
      probability: 0.35,
      narrative:
        'The investments returned modest gains. Nothing spectacular — the market was choppy — but you didn\'t lose anything and you\'re getting better at reading signals.',
      statChanges: { money: 8, intelligence: 5 },
    },
    {
      probability: adj(0.20, stats.intelligence, 'neg'),
      narrative:
        'The investment went south. A downturn you didn\'t see coming wiped out a chunk of your portfolio. An expensive lesson in risk management.',
      statChanges: { money: -18, happiness: -10 },
    },
    {
      probability: 0.10,
      narrative:
        'Incredible luck — one position exploded in value. You were in the right place at the right time. You nearly sold too early, but held on, and it paid off massively.',
      statChanges: { money: 30, happiness: 20, intelligence: 3 },
    },
  ],

  relationship: (stats) => [
    {
      probability: adj(0.50, stats.happiness, 'pos'),
      narrative:
        'You found a deep, meaningful connection this year. The relationship brings joy and belonging you hadn\'t felt before. You\'re genuinely happier together than apart.',
      statChanges: { happiness: 20, relationships: 22, health: 5 },
    },
    {
      probability: 0.30,
      narrative:
        'The relationship has its ups and downs, like all real ones do. You\'re learning to communicate and compromise. Hard work — but the rewarding kind.',
      statChanges: { happiness: 8, relationships: 12 },
    },
    {
      probability: adj(0.20, stats.relationships, 'neg'),
      narrative:
        'The relationship ended. There were arguments, misaligned values, and ultimately incompatibility neither of you could fix. It hurts, but you\'ll carry the lessons forward.',
      statChanges: { happiness: -15, relationships: -8, health: -5 },
    },
  ],

  health: (stats) => [
    {
      probability: adj(0.60, stats.health, 'pos'),
      narrative:
        'You committed to your health and the results are remarkable. Energy soared, mood stabilized, and you feel years younger. Your body is thanking you.',
      statChanges: { health: 22, happiness: 15, careerLevel: 5 },
    },
    {
      probability: 0.30,
      narrative:
        'Real progress on your health journey. The habits aren\'t perfect, but you\'re more consistent than ever. Slow progress is still progress.',
      statChanges: { health: 12, happiness: 8 },
    },
    {
      probability: adj(0.10, stats.health, 'neg'),
      narrative:
        'Despite good intentions, life got in the way. Stress took over. You need a more sustainable approach rather than going all-in and burning out.',
      statChanges: { health: 3, happiness: -5 },
    },
  ],

  career: (stats) => [
    {
      probability: adj(0.40, stats.careerLevel, 'pos'),
      narrative:
        'Your career made a significant leap. A bold move paid off — new role, a negotiation win, or a high-visibility project. Your reputation in the industry is growing.',
      statChanges: { careerLevel: 18, money: 15, happiness: 10, intelligence: 5 },
    },
    {
      probability: 0.35,
      narrative:
        'A solid career move. Not dramatic, but you\'re in a better position — new responsibilities, slightly better pay, and a clearer path forward.',
      statChanges: { careerLevel: 8, money: 8, intelligence: 5 },
    },
    {
      probability: adj(0.25, stats.careerLevel, 'neg'),
      narrative:
        'The career change didn\'t pan out as hoped. The new environment was hard to adapt to and you\'re rebuilding credibility. A setback, not a dead end.',
      statChanges: { careerLevel: -5, money: -8, happiness: -8, intelligence: 5 },
    },
  ],

  relocate: (stats) => [
    {
      probability: 0.40,
      narrative:
        'Moving was the adventure you needed. A new culture and new opportunities opened your mind in ways you didn\'t anticipate. You\'re growing into a more worldly version of yourself.',
      statChanges: { happiness: 15, intelligence: 12, relationships: -8, money: -5 },
    },
    {
      probability: 0.35,
      narrative:
        'The move was harder than expected — language barrier, homesickness, administrative chaos. But you\'re adapting. Resilience built in adversity is the most durable kind.',
      statChanges: { happiness: -5, intelligence: 10, relationships: -12, health: -3 },
    },
    {
      probability: 0.25,
      narrative:
        'Your new home exceeded every expectation. Lower cost of living, richer opportunities, and you\'ve already built a small community of friends. Best decision in years.',
      statChanges: { happiness: 20, money: 10, intelligence: 8, relationships: 5, health: 5 },
    },
  ],

  travel: (stats) => [
    {
      probability: 0.50,
      narrative:
        'The trip was everything you needed. Stepping outside your routine gave you fresh perspective, unforgettable memories, and a rekindled sense of wonder.',
      statChanges: { happiness: 18, intelligence: 8, relationships: 5, money: -8 },
    },
    {
      probability: 0.30,
      narrative:
        'Travel broadened your horizons. The expense stung a little, but experiences like these don\'t age — they only get better with time.',
      statChanges: { happiness: 12, intelligence: 5, money: -12 },
    },
    {
      probability: 0.20,
      narrative:
        'The adventure had rough patches — missed connections, budget overruns, a brief illness. But even the misadventures made for great stories.',
      statChanges: { happiness: 5, intelligence: 8, money: -15, health: -5 },
    },
  ],

  creative: (stats) => [
    {
      probability: 0.40,
      narrative:
        'Pursuing your passion unlocked something dormant in you. You created work you\'re proud of, found your community, and remembered why you fell in love with it.',
      statChanges: { happiness: 20, intelligence: 10, relationships: 8 },
    },
    {
      probability: 0.40,
      narrative:
        'The creative journey continues. Recognition is sparse, but the work fulfills you in ways a paycheck never could. You\'re building something authentic.',
      statChanges: { happiness: 12, intelligence: 8 },
    },
    {
      probability: 0.20,
      narrative:
        'Creative blocks and self-doubt plagued much of the year. The vision in your head and the work on the page refused to match. Persistence is the path through.',
      statChanges: { happiness: -5, intelligence: 5 },
    },
  ],

  social: (stats) => [
    {
      probability: 0.50,
      narrative:
        'Investing in your social life paid dividends. New friendships formed, old ones deepened, and you built a network that\'s both personally and professionally valuable.',
      statChanges: { relationships: 20, happiness: 15, careerLevel: 5 },
    },
    {
      probability: 0.35,
      narrative:
        'You made meaningful connections. Not every relationship clicked, but the ones that did are genuine. Your circle is slowly becoming the community you always wanted.',
      statChanges: { relationships: 12, happiness: 8 },
    },
    {
      probability: 0.15,
      narrative:
        'Social situations were draining this year. Some relationships proved shallow, others turned toxic. You\'re learning to be more selective with your energy.',
      statChanges: { relationships: -5, happiness: -8 },
    },
  ],

  default: (_stats) => [
    {
      probability: 0.40,
      narrative:
        'You spent the year finding your footing and working on yourself. No grand gestures — just steady, quiet progress. Unremarkable years often lay the groundwork for remarkable ones.',
      statChanges: { happiness: 5, intelligence: 5, health: 3 },
    },
    {
      probability: 0.30,
      narrative:
        'This year brought small wins and small losses. You navigated ordinary challenges with more grace than you give yourself credit for. Keep going.',
      statChanges: { happiness: 3, money: 3 },
    },
    {
      probability: 0.20,
      narrative:
        'The year tested your patience. Things didn\'t come together as planned and you spent more time waiting than doing. But you\'re still here — and that counts.',
      statChanges: { happiness: -3, intelligence: 3 },
    },
    {
      probability: 0.10,
      narrative:
        'Against all odds, this turned out to be a breakout year. Something clicked — mindset, habits, timing. You\'re ending the year markedly better than you started.',
      statChanges: { happiness: 15, money: 10, careerLevel: 8, health: 8 },
    },
  ],
};

// ─── Random Life Events ───────────────────────────────────────────────────────

const RANDOM_EVENTS: RandomEvent[] = [
  {
    narrative: 'You won a small lottery — nothing life-changing, but a pleasant surprise that gave your finances a cushion.',
    statChanges: { money: 12, happiness: 8 },
  },
  {
    narrative: 'An unexpected accident drained your emergency fund and kept you off your feet for weeks.',
    statChanges: { money: -12, health: -8, happiness: -5 },
  },
  {
    narrative: 'You received an out-of-the-blue promotion. Your efforts had been noticed all along.',
    statChanges: { careerLevel: 10, money: 8, happiness: 10 },
  },
  {
    narrative: 'A brief but draining illness forced you to slow down for several weeks.',
    statChanges: { health: -12, money: -5, happiness: -8 },
  },
  {
    narrative: 'You crossed paths with a mentor who saw potential in you and offered invaluable guidance.',
    statChanges: { intelligence: 12, careerLevel: 8, happiness: 8 },
  },
  {
    narrative: 'An economic downturn hit your region and squeezed your finances harder than expected.',
    statChanges: { money: -10, happiness: -8, careerLevel: -3 },
  },
  {
    narrative: 'You discovered a passion project that energizes you every morning before work even starts.',
    statChanges: { happiness: 15, intelligence: 8 },
  },
  {
    narrative: 'A close friend moved away, leaving a gap in your social life that took time to fill.',
    statChanges: { relationships: -8, happiness: -5 },
  },
  {
    narrative: 'A former colleague referred you to an incredible opportunity you never would have found on your own.',
    statChanges: { careerLevel: 8, money: 10, relationships: 5 },
  },
  {
    narrative: 'A health scare turned out to be manageable — but it was the wake-up call you needed.',
    statChanges: { health: -5, happiness: -3, intelligence: 5 },
  },
  {
    narrative: 'You reconnected with an old friend and picked up right where you left off, as if no time had passed.',
    statChanges: { relationships: 12, happiness: 10 },
  },
  {
    narrative: 'Unexpected home repairs drained your savings and tested your patience for weeks.',
    statChanges: { money: -10, happiness: -5 },
  },
  {
    narrative: 'You stumbled into a new hobby that quickly became a beloved part of your weekly routine.',
    statChanges: { happiness: 10, health: 5 },
  },
  {
    narrative: 'An inheritance from a distant relative arrived unexpectedly, providing a meaningful financial boost.',
    statChanges: { money: 18, happiness: 5 },
    condition: (stats) => stats.age > 25,
  },
  {
    narrative: 'You completed a personal challenge you\'d been putting off for years. The sense of accomplishment was enormous.',
    statChanges: { happiness: 15, health: 8, intelligence: 5 },
  },
  {
    narrative: 'A spontaneous act of kindness from a stranger changed your perspective on people in the best possible way.',
    statChanges: { happiness: 8, relationships: 5 },
  },
  {
    narrative: 'Your startup idea suddenly gained viral traction online, generating unexpected revenue and attention.',
    statChanges: { money: 15, careerLevel: 12, happiness: 12 },
    condition: (stats) => stats.careerLevel > 20,
  },
];

// ─── Decision Choices ─────────────────────────────────────────────────────────

export interface DecisionOption {
  emoji: string;
  title: string;
  desc: string;
  decision: string;
  color: string;
  darkColor: string;
}

const CARD_PALETTE = [
  { color: '#FF5722', darkColor: '#BF360C' },
  { color: '#FF9800', darkColor: '#E65100' },
  { color: '#4CAF50', darkColor: '#1B5E20' },
  { color: '#2196F3', darkColor: '#0D47A1' },
  { color: '#9C27B0', darkColor: '#4A148C' },
  { color: '#E91E63', darkColor: '#880E4F' },
  { color: '#00BCD4', darkColor: '#006064' },
  { color: '#8BC34A', darkColor: '#33691E' },
  { color: '#FF6F00', darkColor: '#BF360C' },
  { color: '#3F51B5', darkColor: '#1A237E' },
  { color: '#F44336', darkColor: '#B71C1C' },
  { color: '#00ACC1', darkColor: '#006064' },
];

const DECISION_POOL: Omit<DecisionOption, 'color'>[] = [
  { emoji: '💼', title: 'Launch a Startup', desc: 'Build your own empire', decision: 'start a business and launch a startup' },
  { emoji: '📈', title: 'Play the Market', desc: 'Invest in stocks & shares', decision: 'invest in stocks and the stock market' },
  { emoji: '💰', title: 'Negotiate a Raise', desc: "Demand what you're worth", decision: 'negotiate a raise and advance my career' },
  { emoji: '🏢', title: 'Climb the Ladder', desc: 'Get a powerful new role', decision: 'get a new job and climb the career ladder' },
  { emoji: '📊', title: 'Go Freelance', desc: 'Be your own boss', decision: 'start freelancing and work for myself' },
  { emoji: '🪙', title: 'Buy Crypto', desc: 'High risk, high reward', decision: 'invest in cryptocurrency and digital assets' },
  { emoji: '🎓', title: 'Get a Degree', desc: 'Earn your diploma', decision: 'go to university and get a degree' },
  { emoji: '📚', title: 'Study Hard', desc: 'Master a new skill', decision: 'study intensively and take courses' },
  { emoji: '🔬', title: 'Master Science', desc: 'Become the expert', decision: 'study science and pursue a PhD' },
  { emoji: '🗣️', title: 'Learn a Language', desc: 'Open new doors', decision: 'learn a new language and new culture' },
  { emoji: '🏋️', title: 'Hit the Gym', desc: 'Transform your body', decision: 'go to the gym and focus on fitness' },
  { emoji: '🧘', title: 'Find Balance', desc: 'Mind & body harmony', decision: 'meditate and focus on health and wellness' },
  { emoji: '🏃', title: 'Run a Marathon', desc: 'Push your limits', decision: 'train for and run a marathon' },
  { emoji: '🥗', title: 'Eat Clean', desc: 'Fuel your body right', decision: 'eat healthy and change my diet' },
  { emoji: '❤️', title: 'Find Love', desc: 'Open your heart', decision: 'date and find a romantic relationship' },
  { emoji: '👫', title: 'Deepen Bonds', desc: 'Invest in your people', decision: 'strengthen my relationships and friendships' },
  { emoji: '🤝', title: 'Build Network', desc: 'Who you know matters', decision: 'network and build professional relationships' },
  { emoji: '👨‍👩‍👧', title: 'Start a Family', desc: 'Build your legacy', decision: 'start a family and have children' },
  { emoji: '🌍', title: 'Move Abroad', desc: 'Start fresh overseas', decision: 'move abroad to a new country and culture' },
  { emoji: '✈️', title: 'Travel the World', desc: 'Explore the unknown', decision: 'travel and explore the world' },
  { emoji: '🏄', title: 'Go Wild', desc: 'Live on the edge', decision: 'try extreme sports and wild adventures' },
  { emoji: '🎨', title: 'Pursue Your Art', desc: 'Create something great', decision: 'pursue art and creative expression' },
  { emoji: '🎵', title: 'Make Music', desc: 'Chase the dream', decision: 'write music and start a band' },
  { emoji: '✍️', title: 'Write a Book', desc: 'Tell your story', decision: 'write and publish a book' },
  { emoji: '🎮', title: 'Build an App', desc: 'Code your vision', decision: 'build an app and software product' },
  { emoji: '🏆', title: 'Enter a Contest', desc: 'Prove yourself', decision: 'enter a competition and prove myself' },
  { emoji: '🙏', title: 'Give Back', desc: 'Volunteer your time', decision: 'volunteer and help the community' },
  { emoji: '🏠', title: 'Buy Property', desc: 'Invest in real estate', decision: 'invest in real estate and buy property' },
  { emoji: '🎭', title: 'Join a Club', desc: 'Find your tribe', decision: 'join a social club and meet new people' },
  { emoji: '⚡', title: 'Take a Risk', desc: 'Bet on yourself', decision: 'take a massive risk and leap into the unknown' },
  { emoji: '🚀', title: 'Go Big', desc: 'All or nothing', decision: 'go all in on my biggest ambition' },
  { emoji: '🎲', title: 'Roll the Dice', desc: 'Leave it to fate', decision: 'make a spontaneous life-changing decision' },
];

export function generateDecisionChoices(stats: Stats, exclude?: string): DecisionOption[] {
  let pool = DECISION_POOL.filter(d => d.decision !== exclude);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const picked = pool.slice(0, 4);
  const shuffledPalette = [...CARD_PALETTE].sort(() => Math.random() - 0.5);
  return picked.map((d, i) => ({ ...d, ...shuffledPalette[i % shuffledPalette.length] }));
}

// ─── Core Engine ──────────────────────────────────────────────────────────────

function pickRandomEvent(stats: Stats): RandomEvent | undefined {
  if (Math.random() > 0.55) return undefined; // ~45% chance of a random event
  const eligible = RANDOM_EVENTS.filter(
    (e) => !e.condition || e.condition(stats)
  );
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
    `Welcome to your story, ${character.name}. At 18, standing in ${character.country}, the world stretches endlessly before you. What will you make of it?`,
    `Your life begins, ${character.name}. Fresh out of school, full of dreams, rooted in ${character.country} — every decision from here shapes who you become.`,
    `Eighteen years old in ${character.country}, ${character.name}. The chapter where real choices begin. The future isn't written yet — that's entirely the point.`,
    `Here you are, ${character.name}. Age 18, ${character.country} as your starting line. With interests in ${character.interests.join(' and ')}, the seeds of your future are already planted. Now comes the tending.`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

export function runSimulation(
  stats: Stats,
  decision: string,
  character: Character
): SimulationResult {
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
