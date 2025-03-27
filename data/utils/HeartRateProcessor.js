class HeartRateProcessor {
    constructor(options = {}) {
        this.userAge = options.age || 30;
        this.maxHR = 220 - this.userAge;
    }

    getZone(heartRate) {
        const percentage = (heartRate / this.maxHR) * 100;
        
        if (percentage >= 90) return 5; // Maximum
        if (percentage >= 80) return 4; // Anaerobic
        if (percentage >= 70) return 3; // Aerobic
        if (percentage >= 60) return 2; // Endurance
        return 1; // Recovery
    }

    getZoneColor(zone) {
        const colors = {
            1: '#34C759', // Recovery - Green
            2: '#5856D6', // Endurance - Blue
            3: '#FF9500', // Aerobic - Orange
            4: '#FF3B30', // Anaerobic - Red
            5: '#AF52DE'  // Maximum - Purple
        };
        return colors[zone] || colors[1];
    }

    getZoneLabel(zone) {
        const labels = {
            1: 'Recovery',
            2: 'Endurance',
            3: 'Aerobic',
            4: 'Anaerobic',
            5: 'Maximum'
        };
        return labels[zone] || labels[1];
    }

    getZoneRange(zone) {
        const ranges = {
            1: '50-60%',
            2: '60-70%',
            3: '70-80%',
            4: '80-90%',
            5: '90-100%'
        };
        return ranges[zone] || ranges[1];
    }

    // Get all zone information
    getAllZones() {
        return [1, 2, 3, 4, 5].map(zone => ({
            zone,
            label: this.getZoneLabel(zone),
            range: this.getZoneRange(zone),
            color: this.getZoneColor(zone),
            minHR: Math.round(this.maxHR * (zone === 1 ? 0.5 : 0.5 + (zone - 1) * 0.1)),
            maxHR: Math.round(this.maxHR * (0.5 + zone * 0.1))
        }));
    }

    // Process heart rate data with zones
    processHeartRateData(data) {
        return data.map(hr => ({
            ...hr,
            zone: this.getZone(hr.value),
            color: this.getZoneColor(this.getZone(hr.value))
        }));
    }

    // Calculate zone distribution
    calculateZoneDistribution(heartRateData) {
        const zoneCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        const total = heartRateData.length;

        heartRateData.forEach(hr => {
            const zone = this.getZone(hr.value);
            zoneCount[zone]++;
        });

        return Object.entries(zoneCount).map(([zone, count]) => ({
            zone: parseInt(zone),
            label: this.getZoneLabel(parseInt(zone)),
            percentage: Math.round((count / total) * 100),
            color: this.getZoneColor(parseInt(zone))
        }));
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeartRateProcessor;
}
