export class HistoryController {
    constructor() {
        this.sessions = [
            {
                id: 1,
                type: 'arcade_power',
                date: '2025-03-25T14:30:00',
                maxForce: 8.5,
                avgForce: 6.2,
                punchCount: 42,
                duration: 180,
                achievement: true
            },
            {
                id: 2,
                type: 'workout',
                date: '2025-03-25T16:45:00',
                maxForce: 9.2,
                avgForce: 7.1,
                punchCount: 156,
                duration: 900
            },
            {
                id: 3,
                type: 'arcade_speed',
                date: '2025-03-25T18:20:00',
                maxForce: 7.8,
                avgForce: 5.9,
                punchCount: 89,
                duration: 300
            }
        ];
        this.filterType = 'all';
        this.sortBy = 'date';
        this.sortOrder = 'desc';
        this.initializeView();
    }

    initializeView() {
        this.setupFilters();
        this.setupSorting();
        this.renderSessions();
    }

    setupFilters() {
        const filterSelect = document.getElementById('sessionTypeFilter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.filterType = e.target.value;
                this.renderSessions();
            });
        }
    }

    setupSorting() {
        const sortSelect = document.getElementById('sortBy');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const [sort, order] = e.target.value.split('-');
                this.sortBy = sort;
                this.sortOrder = order;
                this.renderSessions();
            });
        }
    }

    renderSessions() {
        const container = document.getElementById('sessionList');
        
        // Clear existing sessions
        container.innerHTML = '';
        
        // Filter and sort sessions
        let filteredSessions = this.filterSessions(this.sessions);
        filteredSessions = this.sortSessions(filteredSessions);
        
        // Render each session
        filteredSessions.forEach(session => {
            const sessionCard = document.createElement('session-card');
            sessionCard.setAttribute('session-id', session.id);
            sessionCard.setAttribute('type', session.type);
            sessionCard.setAttribute('date', session.date);
            sessionCard.setAttribute('max-force', session.maxForce.toFixed(1));
            sessionCard.setAttribute('punch-count', session.punchCount);
            sessionCard.setAttribute('duration', this.formatDuration(session.duration));
            
            if (session.maxForce === this.getPersonalBest()) {
                sessionCard.setAttribute('is-pb', '');
            }
            if (session.achievement) {
                sessionCard.setAttribute('has-achievement', '');
            }

            sessionCard.addEventListener('share', (e) => {
                this.shareSession(e.detail.sessionId);
            });

            container.appendChild(sessionCard);
        });
    }

    filterSessions(sessions) {
        if (this.filterType === 'all') return sessions;
        return sessions.filter(s => s.type === this.filterType);
    }

    sortSessions(sessions) {
        return [...sessions].sort((a, b) => {
            let aValue, bValue;
            
            switch (this.sortBy) {
                case 'date':
                    aValue = new Date(a.date).getTime();
                    bValue = new Date(b.date).getTime();
                    break;
                case 'force':
                    aValue = a.maxForce;
                    bValue = b.maxForce;
                    break;
                case 'duration':
                    aValue = a.duration;
                    bValue = b.duration;
                    break;
                default:
                    return 0;
            }
            
            return this.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
        });
    }

    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    getPersonalBest() {
        return Math.max(...this.sessions.map(s => s.maxForce));
    }

    shareSession(sessionId) {
        console.log('Share session:', sessionId);
    }
}

export default HistoryController;
