// Session model for Strike Force app
class Session {
  constructor(data) {
    this.id = data.id;                     // UUID
    this.type = data.type;                 // SessionType
    this.startTime = data.startTime;       // ISO date string
    this.endTime = data.endTime;           // ISO date string
    this.duration = data.duration;         // Seconds
    
    // Metrics
    this.metrics = {
      maxForce: data.metrics?.maxForce || 0,       // G-force
      avgForce: data.metrics?.avgForce || 0,       // G-force
      punchCount: data.metrics?.punchCount || 0,   // Count
      avgHeartRate: data.metrics?.avgHeartRate || 0, // BPM
      maxHeartRate: data.metrics?.maxHeartRate || 0, // BPM
      calories: data.metrics?.calories || 0        // kcal
    };
  }

  // Format duration as MM:SS
  getFormattedDuration() {
    const minutes = Math.floor(this.duration / 60);
    const seconds = this.duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Get session date as locale string
  getFormattedDate() {
    return new Date(this.startTime).toLocaleDateString();
  }

  // Get time of day as locale string
  getFormattedTime() {
    return new Date(this.startTime).toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit'
    });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Session;
}
