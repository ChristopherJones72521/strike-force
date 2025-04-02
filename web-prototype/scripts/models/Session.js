// Session Model - Maps to Swift struct/class
export class Session {
    constructor({
        id = crypto.randomUUID(),
        type,
        startTime = new Date(),
        endTime = null,
        metrics = {},
        mode = null // For arcade sessions
    }) {
        this.id = id;
        this.type = type; // 'arcade', 'workout', 'challenge', 'fight'
        this.startTime = startTime;
        this.endTime = endTime;
        this.metrics = metrics;
        this.mode = mode; // 'power' or 'speed' for arcade type
    }

    // Will map to Swift computed property
    get duration() {
        if (!this.endTime) return 0;
        return (this.endTime - this.startTime) / 1000; // in seconds
    }

    // Will map to Swift Codable protocol
    toJSON() {
        return {
            id: this.id,
            type: this.type,
            startTime: this.startTime.toISOString(),
            endTime: this.endTime?.toISOString(),
            metrics: this.metrics,
            mode: this.mode,
            duration: this.duration
        };
    }

    // Will map to Swift Codable protocol
    static fromJSON(json) {
        return new Session({
            ...json,
            startTime: new Date(json.startTime),
            endTime: json.endTime ? new Date(json.endTime) : null
        });
    }
}
