import { mockSessions } from './mockData/sessionHistory.js';

export class HomeController {
    constructor() {
        this.sessions = mockSessions;
        this.currentMetric = 'force';
        this.currentMode = 'avg';
        this.chart = null;
    }

    async initializeView() {
        await new Promise(resolve => setTimeout(resolve, 100));
        this.updateStats();
        this.updateRecentSessions();
        this.initializeGraph();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Metric buttons
        document.querySelectorAll('.metric-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.metric-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentMetric = btn.dataset.metric;
                this.updateGraph();
            });
        });

        // Mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentMode = btn.dataset.mode;
                this.updateGraph();
            });
        });
    }

    updateStats() {
        if (!this.sessions || this.sessions.length === 0) return;

        const stats = this.calculateStats();
        
        const maxForceEl = document.getElementById('maxForce');
        const avgForceEl = document.getElementById('avgForce');
        const fastestHandsEl = document.getElementById('fastestHands');
        const totalPunchesEl = document.getElementById('totalPunches');

        if (maxForceEl) maxForceEl.textContent = stats.maxForce.toFixed(1) + ' Gs';
        if (avgForceEl) avgForceEl.textContent = stats.avgForce.toFixed(1) + ' Gs';
        if (fastestHandsEl) fastestHandsEl.textContent = stats.fastestHands;
        if (totalPunchesEl) totalPunchesEl.textContent = stats.totalPunches;
    }

    calculateStats() {
        let maxForce = 0;
        let fastestHands = 0;
        let totalPunches = 0;

        this.sessions.forEach(session => {
            // Update max force
            if (session.stats.maxForce > maxForce) {
                maxForce = session.stats.maxForce;
            }

            // Update fastest hands (punches per minute)
            const punchesPerMinute = (session.stats.punchCount / session.duration) * 60;
            if (punchesPerMinute > fastestHands) {
                fastestHands = punchesPerMinute;
            }

            // Update total punches
            totalPunches += session.stats.punchCount;
        });

        return {
            maxForce: maxForce,
            avgForce: this.sessions[0].stats.avgForce, // Last session's average
            fastestHands: Math.round(fastestHands),
            totalPunches: totalPunches
        };
    }

    updateRecentSessions() {
        const container = document.getElementById('recentSessions');
        if (!container) return;

        const recentSessions = [...this.sessions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);

        container.innerHTML = recentSessions.map(session => `
            <a href="#/session/${session.id}" class="block bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 hover:bg-gray-800/70 transition">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center">
                        <i data-feather="${this.getSessionIcon(session.type)}" class="w-5 h-5 text-white/60 mr-2"></i>
                        <div>
                            <h3 class="text-lg font-semibold text-white">${this.formatSessionType(session.type)}</h3>
                            <p class="text-sm text-white/60">${new Date(session.date).toLocaleString()}</p>
                        </div>
                    </div>
                    ${session.achievement ? '<div class="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs">New Record!</div>' : ''}
                </div>
                <div class="grid grid-cols-3 gap-4">
                    <div>
                        <div class="text-sm text-white/60">Max Force</div>
                        <div class="text-lg font-semibold text-white">${session.stats.maxForce.toFixed(1)} Gs</div>
                    </div>
                    <div>
                        <div class="text-sm text-white/60">Punches</div>
                        <div class="text-lg font-semibold text-white">${session.stats.punchCount}</div>
                    </div>
                    <div>
                        <div class="text-sm text-white/60">Duration</div>
                        <div class="text-lg font-semibold text-white">${Math.floor(session.duration / 60)}m ${session.duration % 60}s</div>
                    </div>
                </div>
            </a>
        `).join('');

        // Re-initialize Feather icons for the new content
        if (window.feather) {
            feather.replace();
        }
    }

    getSessionIcon(type) {
        const icons = {
            'arcade_power': 'zap',
            'arcade_speed': 'clock',
            'workout': 'activity',
            'challenge': 'award',
            'fight': 'target'
        };
        return icons[type] || 'activity';
    }

    formatSessionType(type) {
        return type.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    updateGraph() {
        const canvas = document.getElementById('forceGraph');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (this.chart) {
            this.chart.destroy();
        }

        // Get data based on current metric and mode
        const data = this.sessions.map(session => {
            const measurements = session.measurements.map(m => ({
                x: new Date(m.timestamp),
                y: this.currentMetric === 'force' ? m.force : m.heartRate
            }));

            if (this.currentMode === 'avg') {
                const avgValue = measurements.reduce((sum, m) => sum + m.y, 0) / measurements.length;
                return {
                    x: new Date(session.date),
                    y: avgValue
                };
            } else {
                const maxValue = Math.max(...measurements.map(m => m.y));
                return {
                    x: new Date(session.date),
                    y: maxValue
                };
            }
        }).sort((a, b) => a.x - b.x);

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: this.currentMetric === 'force' ? 'Force (Gs)' : 'Heart Rate (BPM)',
                    data: data,
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(255, 255, 255, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'h:mm a'
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.6)'
                        }
                    }
                }
            }
        });
    }

    initializeGraph() {
        this.updateGraph();
    }

    cleanup() {
        if (this.chart) {
            this.chart.destroy();
        }
    }
}

export default HomeController;
