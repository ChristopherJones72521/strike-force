// Session Summary Service - Maps to Swift SummaryViewModel
export class SessionSummaryService {
    constructor() {
        this.achievements = {
            powerhouse: {
                title: "Powerhouse! 💪",
                description: "Achieved a force over 10G",
                condition: (metrics) => metrics.maxForce > 10
            },
            speedDemon: {
                title: "Speed Demon! ⚡",
                description: "Over 100 punches in Speed mode",
                condition: (metrics) => metrics.punchCount > 100
            },
            consistent: {
                title: "Consistency is Key! 🎯",
                description: "Maintained average force above 5G",
                condition: (metrics) => metrics.avgForce > 5
            },
            endurance: {
                title: "Endurance Master! 🏃‍♂️",
                description: "Completed a 10+ minute workout",
                condition: (metrics) => metrics.duration > 600
            },
            heartRate: {
                title: "Heart of a Champion! ❤️",
                description: "Stayed in optimal heart rate zone",
                condition: (metrics) => metrics.heartRate?.zoneTime > 300
            }
        };
    }

    // Format duration in MM:SS
    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Calculate session goal progress
    calculateGoalProgress(session) {
        switch (session.type) {
            case 'arcade':
                if (session.mode === 'power') {
                    // Goal: Reach 15G force
                    return Math.min(100, (session.metrics.maxForce / 15) * 100);
                } else {
                    // Goal: 120 punches in 30 seconds
                    return Math.min(100, (session.metrics.punchCount / 120) * 100);
                }
            case 'workout':
                // Goal: 500 total force accumulation
                return Math.min(100, (session.metrics.totalForce / 500) * 100);
            case 'fight':
                // Goal: 1000 total force in 60 seconds
                return Math.min(100, (session.metrics.totalForce / 1000) * 100);
            default:
                return 0;
        }
    }

    // Get achievements earned in session
    getAchievements(session) {
        return Object.entries(this.achievements)
            .filter(([_, achievement]) => achievement.condition(session.metrics))
            .map(([id, achievement]) => ({
                id,
                ...achievement
            }));
    }

    // Generate share text
    generateShareText(session) {
        const emoji = this.getSessionEmoji(session);
        const type = session.type.charAt(0).toUpperCase() + session.type.slice(1);
        
        let text = `${emoji} ${type} Session Complete!\n\n`;
        
        // Add key metrics
        if (session.metrics.maxForce) {
            text += `🎯 Max Force: ${session.metrics.maxForce.toFixed(1)}G\n`;
        }
        if (session.metrics.punchCount) {
            text += `👊 Punches: ${session.metrics.punchCount}\n`;
        }
        if (session.metrics.avgForce) {
            text += `📊 Avg Force: ${session.metrics.avgForce.toFixed(1)}G\n`;
        }
        
        // Add achievements
        const achievements = this.getAchievements(session);
        if (achievements.length > 0) {
            text += `\n🏆 Achievements:\n`;
            achievements.forEach(achievement => {
                text += `• ${achievement.title}\n`;
            });
        }
        
        return text;
    }

    // Get emoji for session type
    getSessionEmoji(session) {
        switch (session.type) {
            case 'arcade':
                return session.mode === 'power' ? '🎯' : '⚡';
            case 'workout':
                return '💪';
            case 'challenge':
                return '🏆';
            case 'fight':
                return '🥊';
            default:
                return '🎮';
        }
    }

    // Generate shareable URL
    generateShareableUrl(session) {
        const baseUrl = window.location.origin;
        const params = new URLSearchParams({
            type: session.type,
            mode: session.mode || '',
            id: session.id
        });
        return `${baseUrl}/share?${params.toString()}`;
    }

    // Format metrics for display
    formatMetrics(session) {
        return {
            maxForce: session.metrics.maxForce?.toFixed(1) || '0.0',
            punchCount: session.metrics.punchCount || 0,
            avgForce: session.metrics.avgForce?.toFixed(1) || '0.0',
            duration: this.formatDuration(session.duration),
            goalProgress: this.calculateGoalProgress(session)
        };
    }
}
