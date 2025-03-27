class HeartRateProcessor {
  constructor(options = {}) {
    // Using the common formula: Max HR = 220 - age
    this.age = options.age || 30;
    this.maxHR = 220 - this.age;
    
    // Define zone thresholds
    this.zones = {
      rest: { min: 0, max: 65, color: 'rgb(52, 199, 89)' },    // Green
      zone1: {                                                  // Blue
        min: this.maxHR * 0.5,
        max: this.maxHR * 0.6,
        color: 'rgb(0, 122, 255)'
      },
      zone2: {                                                  // Purple
        min: this.maxHR * 0.6,
        max: this.maxHR * 0.7,
        color: 'rgb(88, 86, 214)'
      },
      zone3: {                                                  // Orange
        min: this.maxHR * 0.7,
        max: this.maxHR * 0.8,
        color: 'rgb(255, 149, 0)'
      },
      zone4: {                                                  // Red
        min: this.maxHR * 0.8,
        max: this.maxHR * 0.9,
        color: 'rgb(255, 59, 48)'
      },
      zone5: {                                                  // Dark Red
        min: this.maxHR * 0.9,
        max: this.maxHR,
        color: 'rgb(215, 0, 21)'
      }
    };
  }

  // Get the zone for a given heart rate
  getZone(heartRate) {
    if (heartRate <= this.zones.rest.max) return 'rest';
    if (heartRate <= this.zones.zone1.max) return 'zone1';
    if (heartRate <= this.zones.zone2.max) return 'zone2';
    if (heartRate <= this.zones.zone3.max) return 'zone3';
    if (heartRate <= this.zones.zone4.max) return 'zone4';
    return 'zone5';
  }

  // Get color for a specific heart rate
  getColorForHeartRate(heartRate) {
    return this.zones[this.getZone(heartRate)].color;
  }

  // Process heart rate data to include zones and colors
  processHeartRateData(data) {
    return data.map(point => ({
      ...point,
      zone: this.getZone(point.value),
      color: this.getColorForHeartRate(point.value)
    }));
  }

  // Calculate zone statistics for a session
  calculateZoneStats(data) {
    const zoneStats = Object.keys(this.zones).reduce((acc, zone) => {
      acc[zone] = 0;
      return acc;
    }, {});

    data.forEach(point => {
      zoneStats[this.getZone(point.value)]++;
    });

    // Convert to percentages
    const total = Object.values(zoneStats).reduce((sum, count) => sum + count, 0);
    Object.keys(zoneStats).forEach(zone => {
      zoneStats[zone] = (zoneStats[zone] / total) * 100;
    });

    return zoneStats;
  }

  // Generate zone legend data
  getZoneLegend() {
    return Object.entries(this.zones).map(([key, zone]) => ({
      name: this._formatZoneName(key),
      color: zone.color,
      range: `${Math.round(zone.min)}-${Math.round(zone.max)} bpm`
    }));
  }

  _formatZoneName(key) {
    switch (key) {
      case 'rest': return 'Rest';
      case 'zone1': return 'Very Light';
      case 'zone2': return 'Light';
      case 'zone3': return 'Moderate';
      case 'zone4': return 'Hard';
      case 'zone5': return 'Maximum';
      default: return key;
    }
  }
}
