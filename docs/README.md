# LifeSim AI

An interactive AI-powered life simulation game. Make decisions, watch your life unfold year by year, powered by Claude AI.

## Tech Stack

| Layer | Tech |
|-------|------|
| Mobile | React Native + Expo (TypeScript) |
| Navigation | React Navigation (Stack) |
| State | Zustand + AsyncStorage |
| Backend | Node.js + Express (TypeScript) |
| AI | Anthropic Claude API (`claude-haiku-4-5`) |

## Project Structure

```
lifesim-ai/
├── mobile/                    # Expo React Native app
│   ├── App.tsx
│   ├── app.json
│   ├── package.json
│   └── src/
│       ├── components/
│       │   ├── LoadingOverlay.tsx
│       │   ├── StatBar.tsx
│       │   ├── StatsOverview.tsx
│       │   └── TimelineCard.tsx
│       ├── navigation/
│       │   ├── AppNavigator.tsx
│       │   └── types.ts
│       ├── screens/
│       │   ├── CreateCharacterScreen.tsx
│       │   ├── SettingsScreen.tsx
│       │   ├── SimulationScreen.tsx
│       │   ├── StatsScreen.tsx
│       │   ├── TimelineScreen.tsx
│       │   └── WelcomeScreen.tsx
│       ├── services/
│       │   ├── api.ts
│       │   └── storage.ts
│       ├── store/
│       │   └── gameStore.ts
│       ├── theme/
│       │   ├── colors.ts
│       │   └── styles.ts
│       └── types/
│           └── index.ts
├── server/                    # Express backend
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── controllers/
│       │   └── lifeController.ts
│       ├── models/
│       │   └── types.ts
│       ├── routes/
│       │   └── lifeRoutes.ts
│       └── services/
│           ├── aiService.ts
│           └── gameService.ts
├── .env.example
└── docs/
    └── README.md
```

## Setup

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Anthropic API key: https://console.anthropic.com

### 1. Environment variables

```bash
cp .env.example .env
# Edit .env and set ANTHROPIC_API_KEY
```

### 2. Start the backend server

```bash
cd server
npm install
npm run dev
```

Server starts at `http://localhost:3000`

Verify: `curl http://localhost:3000/health`

### 3. Start the mobile app

```bash
cd mobile
npm install
npx expo start
```

- Press `a` → Android emulator
- Press `i` → iOS simulator
- Scan QR code → Expo Go on device

### Physical device setup

Set your machine's local IP in `.env`:

```
EXPO_PUBLIC_API_URL=http://192.168.1.X:3000/api
```

## API Reference

| Method | Path | Body | Description |
|--------|------|------|-------------|
| `POST` | `/api/start-life` | `{ character: { name, country, interests } }` | Start new simulation |
| `POST` | `/api/decision` | `{ sessionId, decision }` | Submit a life decision |
| `GET` | `/api/timeline/:sessionId` | — | Get full event history |
| `GET` | `/api/stats/:sessionId` | — | Get current stats |
| `GET` | `/health` | — | Server health check |

## Game Mechanics

### Starting Stats (all 0–100)

| Stat | Start | Description |
|------|-------|-------------|
| Money | 30 | Financial wealth |
| Happiness | 60 | Emotional wellbeing |
| Health | 80 | Physical condition |
| Career | 5 | Professional level |
| Intelligence | 50 | Knowledge & learning |
| Relationships | 40 | Social connections |

### Each Decision

1. User types a decision (or picks a quick option)
2. Backend sends to Claude with full character context
3. Claude returns: outcome narrative + random event + stat changes
4. Stats update, event is added to timeline
5. Age advances by 1 year
6. State auto-saved to device storage
