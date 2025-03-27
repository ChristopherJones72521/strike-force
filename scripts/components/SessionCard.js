export class SessionCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['session-id', 'type', 'date', 'max-force', 'punch-count', 'duration', 'is-pb', 'has-achievement'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const styles = `
            :host {
                display: block;
            }
            .session-history-item {
                display: block;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(8px);
                border-radius: 0.5rem;
                padding: 1rem;
                text-decoration: none;
                transition: background-color 0.2s;
            }
            .session-history-item:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            .flex {
                display: flex;
            }
            .items-center {
                align-items: center;
            }
            .justify-between {
                justify-content: space-between;
            }
            .gap-2 {
                gap: 0.5rem;
            }
            .mt-1 {
                margin-top: 0.25rem;
            }
            .text-white {
                color: white;
            }
            .text-white-60 {
                color: rgba(255, 255, 255, 0.6);
            }
            .font-medium {
                font-weight: 500;
            }
            .text-sm {
                font-size: 0.875rem;
            }
            .hidden {
                display: none;
            }
            .achievement-badge i {
                color: #fbbf24;
            }
            .personal-best-badge {
                padding: 0.25rem 0.5rem;
                border-radius: 9999px;
                background: rgba(34, 197, 94, 0.2);
                color: #86efac;
                font-size: 0.75rem;
                font-weight: 500;
            }
            .share-btn {
                padding: 0.5rem;
                border-radius: 9999px;
                border: none;
                background: transparent;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            .share-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            .share-btn i {
                color: rgba(255, 255, 255, 0.6);
            }
        `;

        this.shadowRoot.innerHTML = `
            <style>${styles}</style>
            <a href="#/session/${this.getAttribute('session-id')}" class="session-history-item">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="flex items-center gap-2">
                            <i data-feather="${this.getSessionIcon(this.getAttribute('type'))}" class="session-icon w-5 h-5 text-white-60"></i>
                            <span class="session-type text-white font-medium">${this.formatSessionType(this.getAttribute('type'))}</span>
                            <span class="text-white-60">•</span>
                            <span class="session-time text-white-60">${this.formatDate(this.getAttribute('date'))}</span>
                        </div>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-white">Force: ${this.getAttribute('max-force')} Gs</span>
                            <span class="text-white-60">•</span>
                            <span class="text-white">Count: ${this.getAttribute('punch-count')}</span>
                        </div>
                        <div class="text-white-60 text-sm mt-1">
                            Time: ${this.getAttribute('duration')}
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="achievement-badge ${this.hasAttribute('has-achievement') ? '' : 'hidden'}">
                            <i data-feather="award" class="w-5 h-5"></i>
                        </div>
                        <div class="personal-best-badge ${this.hasAttribute('is-pb') ? '' : 'hidden'}">
                            PB
                        </div>
                        <button class="share-btn">
                            <i data-feather="share-2" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
            </a>
        `;

        // Initialize Feather icons
        if (window.feather) {
            this.shadowRoot.querySelectorAll('[data-feather]').forEach(element => {
                const icon = feather.icons[element.getAttribute('data-feather')];
                if (icon) {
                    element.innerHTML = icon.toSvg();
                }
            });
        }

        // Add share button handler
        this.shadowRoot.querySelector('.share-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('share', {
                detail: { sessionId: this.getAttribute('session-id') }
            }));
        });
    }

    getSessionIcon(type) {
        const icons = {
            'arcade_power': 'target',
            'arcade_speed': 'zap',
            'workout': 'activity',
            'challenge': 'award',
            'fight': 'box'
        };
        return icons[type] || 'activity';
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
            month: 'short',
            day: 'numeric'
        });
    }
}

customElements.define('session-card', SessionCard);

export default SessionCard;
