// Session Controller - Maps to Swift View Controller / View Model
export class SessionController {
    constructor(sessionId) {
        this.sessionId = sessionId;
        this.session = {
            id: sessionId,
            type: 'arcade_power',
            date: '2025-03-25T14:30:00',
            maxForce: 8.5,
            avgForce: 6.2,
            punchCount: 42,
            duration: 180,
            achievement: true,
            forceData: Array.from({ length: 180 }, () => Math.random() * 10),
            heartRateData: Array.from({ length: 180 }, () => 60 + Math.random() * 100)
        };
        this.initializeView();
    }

    initializeView() {
        this.renderSessionDetails();
        this.renderForceGraph();
        this.renderHeartRateGraph();
        this.setupEventListeners();
    }

    renderSessionDetails() {
        // Update session info
        document.querySelector('.session-type').textContent = this.formatSessionType(this.session.type);
        document.querySelector('.session-date').textContent = this.formatDate(this.session.date);
        document.querySelector('.session-duration').textContent = this.formatDuration(this.session.duration);
        
        // Update metrics
        document.querySelector('.max-force').textContent = this.session.maxForce.toFixed(1) + ' Gs';
        document.querySelector('.avg-force').textContent = this.session.avgForce.toFixed(1) + ' Gs';
        document.querySelector('.punch-count').textContent = this.session.punchCount;
        
        // Show badges if applicable
        if (this.session.achievement) {
            document.querySelector('.achievement-badge').classList.remove('hidden');
        }
    }

    renderForceGraph() {
        const ctx = document.getElementById('forceGraph').getContext('2d');
        
        if (window.Chart) {
            new window.Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({ length: this.session.forceData.length }, (_, i) => i),
                    datasets: [{
                        label: 'Force (Gs)',
                        data: this.session.forceData,
                        borderColor: 'rgb(99, 102, 241)',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
    }

    renderHeartRateGraph() {
        const ctx = document.getElementById('heartRateGraph').getContext('2d');
        
        if (window.Chart) {
            new window.Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({ length: this.session.heartRateData.length }, (_, i) => i),
                    datasets: [{
                        label: 'Heart Rate (BPM)',
                        data: this.session.heartRateData,
                        borderColor: 'rgb(239, 68, 68)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
    }

    setupEventListeners() {
        const shareBtn = document.querySelector('.share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareSession());
        }
    }

    formatSessionType(type) {
        const types = {
            'arcade_power': 'Arcade Power',
            'arcade_speed': 'Arcade Speed',
            'workout': 'Workout',
            'challenge': 'Challenge',
            'fight': 'Fight'
        };
        return types[type] || type;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    }

    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    shareSession() {
        console.log('Share session:', this.sessionId);
        // TODO: Implement sharing functionality
    }
}

export default SessionController;
