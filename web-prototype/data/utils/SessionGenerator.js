// Session Generator
class SessionGenerator {
    constructor() {
        this.sessions = [];
    }

    generateSessions(numDays = 7) {
        const now = new Date();
        const sessions = [];

        for (let i = 0; i < numDays; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            // Generate 1-3 sessions per day
            const sessionsPerDay = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < sessionsPerDay; j++) {
                sessions.push(this.generateSession(date));
            }
        }

        // Sort by date descending
        sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
        return sessions;
    }

    generateSession(date) {
        const types = ['arcade_power', 'arcade_speed', 'workout', 'fight'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        // Base force values
        const baseMaxForce = 8 + Math.random() * 7; // 8-15G
        const baseAvgForce = baseMaxForce * (0.7 + Math.random() * 0.2); // 70-90% of max

        // Add some random variation but maintain an upward trend
        const daysAgo = (new Date() - date) / (1000 * 60 * 60 * 24);
        const progressionFactor = 1 + (daysAgo * 0.01); // 1% improvement per day
        
        const maxForce = baseMaxForce / progressionFactor;
        const avgForce = baseAvgForce / progressionFactor;

        // Session duration based on type
        const duration = type === 'workout' ? 900 : type === 'arcade_speed' ? 30 : 60;

        // Generate punch count based on duration and type
        const punchRate = type === 'arcade_speed' ? 1.5 : 0.4;
        const punchCount = Math.floor(duration * punchRate);

        // Heart rate data
        const baseHeartRate = 120;
        const heartRate = {
            avg: baseHeartRate + Math.floor(Math.random() * 30),
            max: baseHeartRate + Math.floor(Math.random() * 50)
        };

        return {
            id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            date: date.toISOString(),
            duration,
            maxForce: parseFloat(maxForce.toFixed(1)),
            avgForce: parseFloat(avgForce.toFixed(1)),
            punchCount,
            heartRate,
            caloriesBurned: Math.floor(duration * 0.5)
        };
    }
}

// Export the generator
window.SessionGenerator = SessionGenerator;
