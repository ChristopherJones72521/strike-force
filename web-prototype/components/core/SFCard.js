class SFCard extends HTMLElement {
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
            }

            .card {
                background: rgba(31, 41, 55, 0.6);
                backdrop-filter: blur(16px);
                border-radius: 1rem;
                height: 100%;
                width: 100%;
                overflow: hidden;
            }
        `;

        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <div class="card">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('sf-card', SFCard);
