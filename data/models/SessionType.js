// Session types supported by the app
const SessionType = {
    ARCADE: 'Arcade',
    WORKOUT: 'Workout',
    CHALLENGE: 'Challenge',
    FIGHT: 'Fight',
    
    // Helper method to get all types
    all() {
        return [this.ARCADE, this.WORKOUT, this.CHALLENGE, this.FIGHT];
    },
    
    // Helper method to get random type
    random() {
        const types = this.all();
        return types[Math.floor(Math.random() * types.length)];
    }
};
