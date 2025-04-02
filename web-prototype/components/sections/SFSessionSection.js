class SFSessionSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._sessions = [];
        this._displayLimit = 10; // Maximum number of sessions to display
    }

    connectedCallback() {
        this.render();
    }

    set sessions(value) {
        this._sessions = Array.isArray(value) ? value : [];
        this.updateSessionsList();
    }

    get sessions() {
        return this._sessions;
    }

    render() {
        const style = `
            :host {
                display: block;
                width: 100%;
            }
            
            .sessions-list {
                display: flex;
                flex-direction: column;
                gap: 1.25rem;
            }
            
            .session-item {
                display: flex;
                align-items: flex-start;
                padding: 1rem 1.25rem;
                background: rgba(40, 40, 44, 0.5);
                border-radius: 1rem;
                transition: all 0.2s ease;
            }
            
            .session-item:hover {
                background: rgba(50, 50, 55, 0.7);
                cursor: pointer;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            
            .session-info {
                flex: 1;
                min-width: 0;
            }
            
            .session-title {
                font-size: 1.125rem;
                font-weight: 600;
                color: white;
                margin: 0 0 0.35rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .arcade {
                color: #F59E0B;
            }
            
            .speed {
                color: #8B5CF6;
            }
            
            .fitness {
                color: #2979FF;
            }
            
            .fight {
                color: #DC2626;
            }
            
            .challenge {
                color: #8B5CF6;
            }
            
            .win-indicator {
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-left: 0.5rem;
                background-color: #10B981;
            }
            
            .loss-indicator {
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-left: 0.5rem;
                background-color: #EF4444;
            }
            
            .session-meta {
                font-size: 0.75rem;
                color: rgba(255, 255, 255, 0.5);
                display: flex;
                gap: 0.75rem;
                margin-bottom: 0.75rem;
            }
            
            .session-metrics {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 0.35rem;
                flex-shrink: 0;
            }
            
            .metric {
                font-size: 0.95rem;
                color: rgba(255, 255, 255, 0.85);
                white-space: nowrap;
            }
            
            .metric-value {
                font-weight: 600;
            }
            
            .no-sessions {
                text-align: center;
                padding: 2rem;
                color: rgba(255, 255, 255, 0.6);
            }
        `;

        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <div class="sessions-container">
                <div class="sessions-list" id="sessions-list">
                    <!-- Sessions will be inserted here via JS -->
                    <div class="no-sessions">Loading sessions...</div>
                </div>
            </div>
        `;
    }
    
    updateSessionsList() {
        const sessionsListEl = this.shadowRoot.getElementById('sessions-list');
        
        if (!sessionsListEl) return;
        
        // Clear the list
        sessionsListEl.innerHTML = '';
        
        if (this._sessions.length === 0) {
            sessionsListEl.innerHTML = `<div class="no-sessions">No recent sessions found</div>`;
            return;
        }
        
        // Get only the first N sessions (limit)
        const displaySessions = this._sessions.slice(0, this._displayLimit);
        
        // Add each session to the list
        displaySessions.forEach(session => {
            const sessionDate = new Date(session.date);
            const formattedDate = `${sessionDate.toLocaleDateString()} at ${sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            const sessionDuration = session.duration ? this.formatDuration(session.duration) : '';
            
            // Calculate additional metrics
            const totalForce = session.strikes * session.avgForce;
            const powerType = session.subType === 'power' ? true : (session.strikes < 10 ? true : false);
            const speedType = session.subType === 'speed' ? true : (session.strikes > 100 && session.duration <= 1 ? true : false);
            
            // Determine session type and create title
            let sessionTypeClass = session.type ? session.type.toLowerCase() : 'fitness';
            let sessionTitle = '';
            
            // Create session-specific metrics
            let metricsHTML = '';
            
            // Build win/loss indicator if applicable
            let winLossIndicator = '';
            if (session.type === 'Fight' || session.type === 'Challenge') {
                if (session.won) {
                    winLossIndicator = `<span class="win-indicator" title="Win"></span>`;
                } else {
                    winLossIndicator = `<span class="loss-indicator" title="Loss"></span>`;
                }
            }
            
            // Handle specific session types
            if (sessionTypeClass === 'arcade') {
                if (powerType) {
                    sessionTypeClass = 'arcade';
                    sessionTitle = 'Arcade - Power';
                    metricsHTML = `
                        <div class="metric">Max: <span class="metric-value">${session.maxForce.toFixed(1)}G</span></div>
                    `;
                } else if (speedType) {
                    sessionTypeClass = 'speed';
                    sessionTitle = 'Arcade - Speed';
                    metricsHTML = `
                        <div class="metric">Count: <span class="metric-value">${session.punchesPerMinute}ppm</span></div>
                    `;
                } else {
                    // Detect arcade type based on metrics
                    if (session.punchesPerMinute > 100) {
                        sessionTypeClass = 'speed';
                        sessionTitle = 'Arcade - Speed';
                        metricsHTML = `
                            <div class="metric">Count: <span class="metric-value">${session.punchesPerMinute}ppm</span></div>
                        `;
                    } else {
                        sessionTypeClass = 'arcade';
                        sessionTitle = 'Arcade - Power';
                        metricsHTML = `
                            <div class="metric">Max: <span class="metric-value">${session.maxForce.toFixed(1)}G</span></div>
                        `;
                    }
                }
            } else if (sessionTypeClass === 'fitness') {
                sessionTitle = 'Fitness';
                metricsHTML = `
                    <div class="metric">Time: <span class="metric-value">${sessionDuration}</span></div>
                    <div class="metric">Max: <span class="metric-value">${session.maxForce.toFixed(1)}G</span></div>
                    <div class="metric">Total: <span class="metric-value">${Math.round(totalForce)}</span></div>
                `;
            } else if (sessionTypeClass === 'fight') {
                sessionTitle = 'Fight';
                metricsHTML = `
                    <div class="metric">Total: <span class="metric-value">${Math.round(totalForce)}</span></div>
                    <div class="metric">Max: <span class="metric-value">${session.maxForce.toFixed(1)}G</span></div>
                `;
            } else if (sessionTypeClass === 'challenge') {
                if (powerType) {
                    sessionTypeClass = 'challenge';
                    sessionTitle = 'Challenge - Power';
                    metricsHTML = `
                        <div class="metric">Max: <span class="metric-value">${session.maxForce.toFixed(1)}G</span></div>
                    `;
                } else {
                    sessionTypeClass = 'challenge';
                    sessionTitle = 'Challenge - Speed';
                    metricsHTML = `
                        <div class="metric">Count: <span class="metric-value">${session.punchesPerMinute}ppm</span></div>
                    `;
                }
            }
            
            const sessionEl = document.createElement('div');
            sessionEl.classList.add('session-item');
            sessionEl.setAttribute('data-id', session.id);
            sessionEl.innerHTML = `
                <div class="session-info">
                    <h3 class="session-title ${sessionTypeClass}">${sessionTitle} ${winLossIndicator}</h3>
                    <div class="session-meta">
                        <span>${formattedDate}</span>
                    </div>
                </div>
                <div class="session-metrics">
                    ${metricsHTML}
                </div>
            `;
            
            // Add click event
            sessionEl.addEventListener('click', () => {
                window.location.hash = `#/sessions/${session.id}`;
            });
            
            sessionsListEl.appendChild(sessionEl);
        });
    }
    
    formatDuration(seconds) {
        if (typeof seconds !== 'number') return '';
        
        const minutes = Math.floor(seconds / 60);
        return `${minutes} min`;
    }
}

customElements.define('sf-session-section', SFSessionSection);
