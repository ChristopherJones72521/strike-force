# Strike Force Data Models

## Overview
This document describes the data models used in the Strike Force application. All data models are defined using TypeScript interfaces for clarity, even though the application currently uses JavaScript.

## Core Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  country: string;
  dateJoined: string; // ISO date string
  stats: UserStats;
  achievements: Achievement[];
  preferences: UserPreferences;
}

interface UserStats {
  maxForce: number;        // All-time max force in Gs
  avgForce: number;        // Average force across all sessions
  totalSessions: number;   // Total number of completed sessions
  totalPunches: number;    // Total number of recorded punches
  fastestPunch: number;    // Speed in m/s
  caloriesBurned: number; // Total calories burned
  rankings: {
    global: number;
    country: number;
    local: number;
  };
}

interface UserPreferences {
  units: 'metric' | 'imperial';
  shareData: boolean;      // Whether to share data publicly
  notifications: boolean;  // Push notification preferences
  healthSync: boolean;    // Apple Health sync preference
}
```

### Session Types and Data

#### Base Session
All session types extend this base interface:
```typescript
interface BaseSession {
  id: string;
  userId: string;
  type: SessionType;
  date: string;           // ISO date string
  duration: number;       // in seconds
  maxForce: number;      // in Gs
  avgForce: number;      // in Gs
  punchCount: number;
  heartRate?: {
    avg: number;
    max: number;
  };
  caloriesBurned?: number;
}

type SessionType = 
  | 'arcade_power'    // Single punch max force
  | 'arcade_speed'    // 30-second punch count
  | 'workout'         // Extended training
  | 'fight'          // 60-second force accumulation
  | 'challenge';      // Special event/challenge
```

#### Arcade Power Session
```typescript
interface ArcadePowerSession extends BaseSession {
  type: 'arcade_power';
  personalBest: boolean;     // If this was a personal best
  forceComparison: string;   // e.g., "like a kangaroo!"
}
```

#### Arcade Speed Session
```typescript
interface ArcadeSpeedSession extends BaseSession {
  type: 'arcade_speed';
  punchesPerSecond: number;
  personalBest: boolean;
}
```

#### Workout Session
```typescript
interface WorkoutSession extends BaseSession {
  type: 'workout';
  segments: WorkoutSegment[];
  targetAchieved: boolean;
}

interface WorkoutSegment {
  duration: number;        // in seconds
  type: 'power' | 'speed' | 'endurance';
  target: number;         // target force or punch count
  actual: number;         // achieved force or punch count
}
```

#### Fight Session
```typescript
interface FightSession extends BaseSession {
  type: 'fight';
  totalForce: number;     // Accumulated force
  opponent?: string;      // Optional opponent user ID
  winner?: string;        // User ID of winner
}
```

#### Challenge Session
```typescript
interface ChallengeSession extends BaseSession {
  type: 'challenge';
  challengeId: string;
  challengeScore: number;
  ranking: number;        // Ranking in this challenge
  rewards?: Achievement[];
}
```

### Achievement System
```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  dateUnlocked: string;   // ISO date string
  progress?: {
    current: number;
    target: number;
  };
}

type AchievementType =
  | 'power_milestone'    // Force-based achievements
  | 'speed_milestone'    // Speed-based achievements
  | 'endurance'         // Duration-based achievements
  | 'consistency'       // Streak-based achievements
  | 'special';          // Special event achievements
```

## Usage
1. All mock data should follow these schemas
2. Frontend components should expect data in these formats
3. Future API endpoints should return data matching these schemas
4. Validation functions should be created to ensure data conformity
