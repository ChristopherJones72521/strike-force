class SFMetricCard extends HTMLElement {
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
                width: 100%;
                height: 100%;
            }

            .card-content {
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 0.5rem;
            }

            ::slotted([slot="title"]) {
                color: rgba(255, 255, 255, 0.6);
                font-size: 0.875rem;
                font-weight: 500;
                margin: 0;
                line-height: 1.25;
            }

            ::slotted([slot="value"]) {
                color: white;
                font-size: 2rem;
                font-weight: 700;
                margin: 0;
                line-height: 1;
            }
        `;

        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <div class="card-content">
                <slot name="title"></slot>
                <slot name="value"></slot>
            </div>
        `;
    }
}

customElements.define('sf-metric-card', SFMetricCard);
