import { SessionGenerator } from '../utils/SessionGenerator.js';

// Create session generator with user profile
const generator = new SessionGenerator({
  userAge: 30,
  baselineHeartRate: 65
});

// Generate 20 sessions over the last month
const endDate = new Date();
const startDate = new Date(endDate.getTime() - (30 * 24 * 60 * 60 * 1000));

const sessions = generator.generateSessions(20, {
  startDate,
  endDate
});

export default sessions;
