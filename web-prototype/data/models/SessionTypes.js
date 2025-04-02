// Enum-like constants for session types
export const SessionType = {
  ARCADE: {
    id: 'arcade',
    name: 'Arcade',
    modes: {
      POWER: 'power',  // Single punch max force
      SPEED: 'speed'   // 30-second punch count
    },
    durationSeconds: {
      POWER: 10,       // Time window to throw one punch
      SPEED: 30        // Standard speed challenge duration
    },
    samplingRate: 100  // Hz - Higher sampling for precise measurements
  },
  
  WORKOUT: {
    id: 'workout',
    name: 'Workout',
    modes: {
      FREESTYLE: 'freestyle',
      GUIDED: 'guided'
    },
    samplingRate: 60,  // Hz - Standard sampling to preserve battery
    minDurationSeconds: 60
  },
  
  CHALLENGE: {
    id: 'challenge',
    name: 'Challenge',
    samplingRate: 100, // Hz - Higher sampling for competitive mode
    durationSeconds: 60
  },
  
  FIGHT: {
    id: 'fight',
    name: 'Fight',
    samplingRate: 100, // Hz - Higher sampling for competitive mode
    durationSeconds: 60
  }
};
