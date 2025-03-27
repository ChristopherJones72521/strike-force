class SFQuickStatsSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const style = `
            :host {
                display: block;
                margin-bottom: 1.5rem;
            }
            
            .quick-stats {
                background: rgba(28, 28, 30, 0.8);
                border-radius: 1rem;
                padding: 1.5rem;
                color: white;
            }
            
            .header {
                margin-bottom: 1.25rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .title {
                font-size: 1.25rem;
                font-weight: 600;
                color: white;
                margin: 0;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1.25rem;
            }
            
            .stat-card {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            
            .stat-label {
                font-size: 0.9rem;
                color: rgba(255, 255, 255, 0.6);
            }
            
            .stat-value {
                font-size: 1.75rem;
                font-weight: 600;
                background: linear-gradient(135deg, #00E5FF, #2979FF);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                line-height: 1.2;
            }
            
            .unit {
                font-size: 1rem;
                font-weight: normal;
            }
        `;

        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <div class="quick-stats">
                <div class="header">
                    <h2 class="title">Quick Stats</h2>
                </div>
                <div class="stats-grid">
                    <div class="stat-card" id="max-force">
                        <div class="stat-label">Max Force</div>
                        <div class="stat-value">
                            <slot name="max-force">0</slot>
                            <span class="unit">G</span>
                        </div>
                    </div>
                    <div class="stat-card" id="avg-force">
                        <div class="stat-label">Avg Force</div>
                        <div class="stat-value">
                            <slot name="avg-force">0</slot>
                            <span class="unit">G</span>
                        </div>
                    </div>
                    <div class="stat-card" id="fastest-hands">
                        <div class="stat-label">Fastest Hands</div>
                        <div class="stat-value">
                            <slot name="fastest-hands">0</slot>
                        </div>
                    </div>
                    <div class="stat-card" id="total-sessions">
                        <div class="stat-label">Total Sessions</div>
                        <div class="stat-value">
                            <slot name="total-sessions">0</slot>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('sf-quick-stats-section', SFQuickStatsSection);
