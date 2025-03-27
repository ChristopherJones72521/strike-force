class SFForceSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._data = { maxForce: 14.5, avgForce: 8.1 };
        this._activeMetric = 'max'; // Default to max force
    }

    connectedCallback() {
        this.render();
        this.setupListeners();
    }

    set data(value) {
        this._data = value;
        // No need to update display since we're no longer showing the value directly in this component
    }

    get data() {
        return this._data;
    }

    render() {
        const style = `
            :host {
                display: block;
                width: 100%;
                border-radius: 1rem;
                overflow: hidden;
            }

            .section {
                background: transparent;
                padding: 0;
                color: white;
                width: 100%;
                box-sizing: border-box;
                overflow: hidden;
            }

            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
                padding: 1rem 1rem 0;
            }

            .title {
                font-size: 1.25rem;
                font-weight: 700;
                margin: 0;
                background-image: linear-gradient(to right, #3B82F6, #06B6D4);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                white-space: nowrap;
            }

            .chart-container {
                height: 200px;
                margin: 0 0 1.5rem;
                width: 100%;
                padding: 0;
            }

            .controls-container {
                padding: 0.75rem 0 1.25rem;
                margin-top: 0;
                display: flex;
                justify-content: center;
            }

            .metric-tabs {
                display: flex;
                background: rgba(30, 30, 32, 0.8);
                border-radius: 2rem;
                padding: 0.25rem;
                width: fit-content;
            }

            .metric-tab {
                background: transparent;
                border: none;
                color: rgba(255, 255, 255, 0.6);
                padding: 0.5rem 1rem;
                border-radius: 1.5rem;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 0.875rem;
                font-weight: 500;
                min-width: 3.5rem;
                text-align: center;
            }

            .metric-tab.active {
                background: rgba(40, 40, 42, 0.9);
                color: white;
                font-weight: 600;
            }
        `;

        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <div class="section">
                <div class="header">
                    <h2 class="title">Strike data</h2>
                    <div class="metric-tabs">
                        <button class="metric-tab ${this._activeMetric === 'max' ? 'active' : ''}" data-metric="max">Max</button>
                        <button class="metric-tab ${this._activeMetric === 'avg' ? 'active' : ''}" data-metric="avg">Avg</button>
                    </div>
                </div>
                
                <div class="chart-container">
                    <slot name="chart"></slot>
                </div>
                
                <div class="controls-container">
                    <slot name="control"></slot>
                </div>
            </div>
        `;
    }

    setupListeners() {
        // Listen for toggle button clicks
        const toggleBtns = this.shadowRoot.querySelectorAll('.metric-tab');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this._activeMetric = btn.getAttribute('data-metric');
                
                // Update active state
                toggleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Dispatch event for the chart to update
                this.dispatchEvent(new CustomEvent('metric-change', {
                    detail: { metric: this._activeMetric },
                    bubbles: true,
                    composed: true
                }));
            });
        });
    }
}

customElements.define('sf-force-section', SFForceSection);
