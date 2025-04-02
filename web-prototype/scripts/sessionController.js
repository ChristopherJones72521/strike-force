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
        document.getElementById('sessionType').textContent = this.formatSessionType(this.session.type);
        document.getElementById('sessionDate').textContent = this.formatDate(this.session.date);
        document.getElementById('sessionDuration').textContent = this.formatDuration(this.session.duration);
        
        // Update metrics - Note: HTML uses IDs like maxForce, avgForce, punchCount, heartRate
        document.getElementById('maxForce').textContent = this.session.maxForce.toFixed(1) + ' Gs';
        document.getElementById('avgForce').textContent = this.session.avgForce.toFixed(1) + ' Gs';
        document.getElementById('punchCount').textContent = this.session.punchCount;
        // Assuming heartRate is also needed based on HTML structure
        const avgHeartRate = this.session.heartRateData.length > 0 
            ? (this.session.heartRateData.reduce((a, b) => a + b, 0) / this.session.heartRateData.length).toFixed(0) + ' BPM'
            : '--';
        document.getElementById('heartRate').textContent = avgHeartRate;

        // Update additional stats if elements exist (using IDs from HTML)
        const caloriesEl = document.getElementById('caloriesBurned');
        if (caloriesEl) caloriesEl.textContent = '--'; // Placeholder - data not in session object
        const totalForceEl = document.getElementById('totalForce');
        if (totalForceEl) totalForceEl.textContent = '--'; // Placeholder - data not in session object
        const challengeScoreEl = document.getElementById('challengeScore');
        if (challengeScoreEl) challengeScoreEl.textContent = '--'; // Placeholder - data not in session object
        
        // Show badges if applicable - Assuming there's an element with class 'achievement-badge'
        const achievementBadge = document.querySelector('.achievement-badge');
        if (this.session.achievement && achievementBadge) {
            achievementBadge.classList.remove('hidden');
        } else if (achievementBadge) {
            achievementBadge.classList.add('hidden');
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
