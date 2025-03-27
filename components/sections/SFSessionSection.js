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
                gap: 1rem;
            }
            
            .session-item {
                display: flex;
                align-items: center;
                padding: 0.75rem 1rem;
                background: rgba(40, 40, 44, 0.5);
                border-radius: 0.75rem;
                transition: all 0.2s ease;
            }
            
            .session-item:hover {
                background: rgba(50, 50, 55, 0.7);
                cursor: pointer;
            }
            
            .session-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 3rem;
                height: 3rem;
                background: rgba(41, 121, 255, 0.15);
                border-radius: 0.75rem;
                margin-right: 1rem;
                flex-shrink: 0;
            }
            
            .session-icon svg {
                width: 1.5rem;
                height: 1.5rem;
                color: #2979FF;
            }
            
            .session-icon.fitness {
                background: rgba(41, 121, 255, 0.15);
            }
            
            .session-icon.fitness svg {
                color: #2979FF;
            }
            
            .session-icon.fight {
                background: rgba(220, 38, 38, 0.15);
            }
            
            .session-icon.fight svg {
                color: #DC2626;
            }
            
            .session-icon.arcade {
                background: rgba(245, 158, 11, 0.15);
            }
            
            .session-icon.arcade svg {
                color: #F59E0B;
            }
            
            .session-icon.challenge {
                background: rgba(139, 92, 246, 0.15);
            }
            
            .session-icon.challenge svg {
                color: #8B5CF6;
            }
            
            .session-info {
                flex: 1;
                min-width: 0;
            }
            
            .session-title {
                font-size: 1rem;
                font-weight: 600;
                color: white;
                margin: 0 0 0.25rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .session-meta {
                font-size: 0.875rem;
                color: rgba(255, 255, 255, 0.6);
                display: flex;
                gap: 0.75rem;
            }
            
            .session-metrics {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 0.25rem;
                flex-shrink: 0;
            }
            
            .metric {
                font-size: 0.875rem;
                color: rgba(255, 255, 255, 0.7);
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
            const sessionDuration = this.formatDuration(session.duration);
            
            const sessionEl = document.createElement('div');
            sessionEl.classList.add('session-item');
            sessionEl.setAttribute('data-id', session.id);
            sessionEl.innerHTML = `
                <div class="session-icon ${session.type || 'fitness'}">
                    ${this.getSessionTypeIcon(session.type)}
                </div>
                <div class="session-info">
                    <h3 class="session-title">${session.title || session.type + ' Session'}</h3>
                    <div class="session-meta">
                        <span>${formattedDate}</span>
                        <span>${sessionDuration}</span>
                    </div>
                </div>
                <div class="session-metrics">
                    <div class="metric">Max: <span class="metric-value">${session.maxForce ? session.maxForce.toFixed(1) : '0.0'}G</span></div>
                    <div class="metric">Avg: <span class="metric-value">${session.avgForce ? session.avgForce.toFixed(1) : '0.0'}G</span></div>
                </div>
            `;
            
            // Add click event
            sessionEl.addEventListener('click', () => {
                window.location.hash = `#/sessions/${session.id}`;
            });
            
            sessionsListEl.appendChild(sessionEl);
        });
    }
    
    getSessionTypeIcon(type) {
        switch(type) {
            case 'fitness':
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>`;
            case 'fight':
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2v20M2 12h20M20 16l-4-4 4-4M8 8l-4 4 4 4"></path>
                </svg>`;
            case 'arcade':
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>`;
            case 'challenge':
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>`;
            default:
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                    <line x1="6" y1="1" x2="6" y2="4"></line>
                    <line x1="10" y1="1" x2="10" y2="4"></line>
                    <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>`;
        }
    }
    
    formatDuration(seconds) {
        if (typeof seconds !== 'number') return '0 min';
        
        const minutes = Math.floor(seconds / 60);
        return `${minutes} min`;
    }
}

customElements.define('sf-session-section', SFSessionSection);
