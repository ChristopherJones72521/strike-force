// Test Data Module for Session Types
export const testData = {
    arcade: {
        // Single punch data
        session: {
            maxForce: "14.3",
            duration: "180",  // milliseconds
            personalBest: "15.2",
            timestamp: new Date().toISOString()
        },
        // Force measurements over time (180ms punch)
        graph: {
            timestamps: Array.from({length: 18}, (_, i) => i * 10),  // 0 to 170ms
            force: [
                0, 2.1, 5.4, 8.9, 11.2, 13.1, 14.3, 14.1,  // Impact phase
                13.2, 11.8, 9.4, 7.2, 5.1, 3.3, 1.8, 0.9,  // Recoil phase
                0.3, 0                                      // Return to rest
            ]
        }
    },

    workout: {
        session: {
            maxForce: "12.8",
            avgForce: "8.7",
            punchCount: "43",
            elapsedTime: "14:22",
            heartRate: {
                current: "142",
                zone: "3",
                zoneRange: "140-160",
                zonePercentage: "65"  // For progress bar
            }
        },
        // Last 20 punches in session
        graph: {
            timestamps: Array.from({length: 20}, (_, i) => {
                const time = new Date();
                time.setSeconds(time.getSeconds() - (20 - i));
                return time.toLocaleTimeString('en-US', { 
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            }),
            force: [
                7.8, 8.2, 9.1, 8.7, 10.2, 11.4, 9.8, 8.9,
                9.2, 8.8, 9.4, 10.1, 11.8, 12.8, 11.2, 10.4,
                9.7, 9.2, 8.8, 8.5
            ]
        }
    },

    challenge: {
        session: {
            player1: {
                name: "Chris",
                force: "13.8",
                isWinner: true
            },
            player2: {
                name: "Mike",
                force: "12.9",
                isWinner: false
            },
            winnerMessage: "You Win! +1.1 Gs",
            winnerBg: "bg-green-500/20"
        },
        graph: {
            player1Force: 13.8,
            player2Force: 12.9
        }
    },

    fight: {
        session: {
            timeRemaining: "45",
            player1: {
                totalForce: "234.5",
                hits: "18",
                isLeading: true
            },
            player2: {
                totalForce: "198.2",
                hits: "15",
                isLeading: false
            },
            avgForcePerHit: "13.2",
            maxSingleHit: "15.8",
            fightStatus: "Leading by 36.3 Gs",
            statusBg: "bg-green-500/20"
        },
        // Rolling 10-second window of force data
        graph: {
            timestamps: Array.from({length: 10}, (_, i) => `:${50-i}s`).reverse(),
            player1Force: [
                12.4, 13.8, 0, 14.2, 13.9, 0, 0, 15.8, 14.1, 13.2
            ],
            player2Force: [
                11.8, 12.4, 13.1, 0, 0, 14.5, 13.8, 12.9, 0, 12.2
            ]
        }
    }
};

// Helper function to generate random force data
export function generateRandomForce(min = 8, max = 16) {
    return Number((Math.random() * (max - min) + min).toFixed(1));
}

// Helper to generate timestamp
export function getCurrentTimestamp() {
    return new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Helper to simulate real-time data updates
export function generateRealtimeData(sessionType) {
    switch(sessionType) {
        case 'arcade':
            return {
                timestamps: Array.from({length: 18}, (_, i) => i * 10),
                force: Array.from({length: 18}, (_, i) => {
                    const mid = 9;
                    return generateRandomForce(0, 15) * (1 - Math.abs(i - mid) / mid);
                })
            };
            
        case 'workout':
            return {
                timestamps: [getCurrentTimestamp()],
                force: [generateRandomForce(7, 13)]
            };
            
        case 'fight':
            return {
                timestamp: getCurrentTimestamp(),
                player1Force: generateRandomForce(10, 16),
                player2Force: generateRandomForce(10, 16)
            };
            
        default:
            return null;
    }
}

// Example of updating session stats
export function updateSessionStats(sessionType, currentStats) {
    switch(sessionType) {
        case 'workout':
            const newForce = generateRandomForce(7, 13);
            return {
                ...currentStats,
                maxForce: Math.max(parseFloat(currentStats.maxForce), newForce).toFixed(1),
                avgForce: ((parseFloat(currentStats.avgForce) * parseInt(currentStats.punchCount) + newForce) / 
                          (parseInt(currentStats.punchCount) + 1)).toFixed(1),
                punchCount: (parseInt(currentStats.punchCount) + 1).toString(),
                heartRate: {
                    ...currentStats.heartRate,
                    current: Math.min(180, parseInt(currentStats.heartRate.current) + 
                             Math.floor(Math.random() * 3 - 1)).toString()
                }
            };
            
        case 'fight':
            const p1Force = generateRandomForce(10, 16);
            const p2Force = generateRandomForce(10, 16);
            return {
                ...currentStats,
                player1: {
                    totalForce: (parseFloat(currentStats.player1.totalForce) + p1Force).toFixed(1),
                    hits: (parseInt(currentStats.player1.hits) + 1).toString(),
                    isLeading: parseFloat(currentStats.player1.totalForce) + p1Force > 
                              parseFloat(currentStats.player2.totalForce) + p2Force
                },
                player2: {
                    totalForce: (parseFloat(currentStats.player2.totalForce) + p2Force).toFixed(1),
                    hits: (parseInt(currentStats.player2.hits) + 1).toString(),
                    isLeading: parseFloat(currentStats.player2.totalForce) + p2Force > 
                              parseFloat(currentStats.player1.totalForce) + p1Force
                }
            };
            
        default:
            return currentStats;
    }
}
