class AccelerationProcessor {
  constructor(options = {}) {
    this.options = {
      threshold: options.threshold || 3.0, // minimum G-force to register
      cooldownMs: options.cooldownMs || 250, // cooldown period between punches
      sampleRate: options.sampleRate || 60, // Hz
      ...options
    };
    this.lastPunchTime = 0;
  }

  // Calculate total force magnitude from XYZ components
  calculateForceMagnitude(x, y, z) {
    return Math.sqrt(x * x + y * y + z * z);
  }

  // Process raw acceleration data into punch events
  processSample(timestamp, x, y, z) {
    const force = this.calculateForceMagnitude(x, y, z);
    const timeSinceLastPunch = timestamp - this.lastPunchTime;

    // Check if force exceeds threshold and we're not in cooldown
    if (force >= this.options.threshold && timeSinceLastPunch >= this.options.cooldownMs) {
      this.lastPunchTime = timestamp;
      return {
        timestamp,
        force,
        components: { x, y, z }
      };
    }
    return null;
  }

  // Process a batch of samples
  processDataBatch(samples) {
    const punches = [];
    let maxForce = 0;
    let totalForce = 0;
    let punchCount = 0;

    samples.forEach(sample => {
      const punch = this.processSample(
        sample.timestamp,
        sample.acceleration.x,
        sample.acceleration.y,
        sample.acceleration.z
      );

      if (punch) {
        punches.push(punch);
        maxForce = Math.max(maxForce, punch.force);
        totalForce += punch.force;
        punchCount++;
      }
    });

    return {
      punches,
      metrics: {
        maxForce,
        averageForce: punchCount > 0 ? totalForce / punchCount : 0,
        punchCount
      }
    };
  }
}
