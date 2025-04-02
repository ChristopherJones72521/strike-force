// Force comparison module
export const forceComparisons = {
    // Force ranges and their comparisons
    comparisons: [
        { maxForce: 5, text: "That's like a strong handshake!" },
        { maxForce: 8, text: "As powerful as a professional boxer's jab!" },
        { maxForce: 12, text: "You hit like a kangaroo!" },
        { maxForce: 15, text: "That's the force of a professional MMA fighter!" },
        { maxForce: 20, text: "Incredible! That's like a heavyweight champion's cross!" },
        { maxForce: 25, text: "Superhuman! You punch harder than Bruce Lee!" },
        { maxForce: 30, text: "Unstoppable! That's like getting hit by a sledgehammer!" }
    ],

    // Speed mode comparisons
    speedComparisons: [
        { pps: 2, text: "You're warming up!" },
        { pps: 3, text: "Quick as a cat!" },
        { pps: 4, text: "Fast as Muhammad Ali!" },
        { pps: 5, text: "Lightning fast! Like Bruce Lee's one-inch punch!" },
        { pps: 6, text: "Incredible! Your hands are faster than a cobra strike!" }
    ],

    // Get a fun comparison based on force
    getForceComparison(force) {
        for (let i = this.comparisons.length - 1; i >= 0; i--) {
            if (force <= this.comparisons[i].maxForce) {
                return this.comparisons[i].text;
            }
        }
        return "Off the charts! Are you even human?!";
    },

    // Get a speed comparison based on punches per second
    getSpeedComparison(punchesPerSecond) {
        for (let i = this.speedComparisons.length - 1; i >= 0; i--) {
            if (punchesPerSecond <= this.speedComparisons[i].pps) {
                return this.speedComparisons[i].text;
            }
        }
        return "Faster than the speed of light! 🚀";
    },

    // Format rankings
    formatRanking(rank, total, timeframe = "today") {
        if (!rank) return "--";
        return `#${rank} of ${total} ${timeframe}`;
    }
};
