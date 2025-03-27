// Mock Session History Data
export const mockSessions = [
    {
        id: 1,
        type: 'arcade_power',
        date: '2025-03-25T14:30:00',
        duration: 180,
        achievement: true,
        measurements: [
            { timestamp: '2025-03-25T14:30:15', force: 7.2, heartRate: 125 },
            { timestamp: '2025-03-25T14:30:30', force: 8.1, heartRate: 132 },
            { timestamp: '2025-03-25T14:30:45', force: 8.5, heartRate: 138 },
            { timestamp: '2025-03-25T14:31:00', force: 7.9, heartRate: 142 }
        ],
        stats: {
            maxForce: 8.5,
            avgForce: 6.2,
            punchCount: 42,
            avgHeartRate: 135
        }
    },
    {
        id: 2,
        type: 'workout',
        date: '2025-03-25T16:45:00',
        duration: 900,
        measurements: [
            { timestamp: '2025-03-25T16:45:15', force: 8.4, heartRate: 128 },
            { timestamp: '2025-03-25T16:45:30', force: 9.2, heartRate: 135 },
            { timestamp: '2025-03-25T16:45:45', force: 8.7, heartRate: 142 },
            { timestamp: '2025-03-25T16:46:00', force: 8.9, heartRate: 145 }
        ],
        stats: {
            maxForce: 9.2,
            avgForce: 7.1,
            punchCount: 156,
            avgHeartRate: 138
        }
    },
    {
        id: 3,
        type: 'arcade_speed',
        date: '2025-03-25T18:20:00',
        duration: 300,
        measurements: [
            { timestamp: '2025-03-25T18:20:15', force: 7.2, heartRate: 130 },
            { timestamp: '2025-03-25T18:20:30', force: 7.8, heartRate: 138 },
            { timestamp: '2025-03-25T18:20:45', force: 7.5, heartRate: 142 },
            { timestamp: '2025-03-25T18:21:00', force: 7.4, heartRate: 145 }
        ],
        stats: {
            maxForce: 7.8,
            avgForce: 5.9,
            punchCount: 89,
            avgHeartRate: 139
        }
    }
];
