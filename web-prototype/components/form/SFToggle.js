class SFToggle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        const style = `
            :host {
                display: inline-block;
            }

            .toggle {
                display: flex;
                background: rgba(28, 28, 30, 0.8);
                border-radius: 0.5rem;
                padding: 0.125rem;
                gap: 0.125rem;
                width: fit-content;
            }

            ::slotted(button) {
                background: transparent;
                border: none;
                color: rgba(255, 255, 255, 0.6);
                font-size: 0.75rem;
                font-weight: 500;
                padding: 0.25rem 0.5rem;
                border-radius: 0.375rem;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
                white-space: nowrap;
                min-width: 2.5rem;
            }

            ::slotted(button[selected]) {
                background: white;
                color: rgba(28, 28, 30, 0.9);
                font-weight: 600;
            }

            ::slotted(button:not([selected]):hover) {
                color: rgba(255, 255, 255, 0.8);
                background: rgba(255, 255, 255, 0.1);
            }
        `;

        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <div class="toggle">
                <slot></slot>
            </div>
        `;
    }

    setupEventListeners() {
        const slot = this.shadowRoot.querySelector('slot');
        slot.addEventListener('slotchange', () => {
            const buttons = slot.assignedElements();
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    buttons.forEach(b => b.removeAttribute('selected'));
                    button.setAttribute('selected', '');
                    this.dispatchEvent(new CustomEvent('change', {
                        detail: { value: button.value }
                    }));
                });
            });
        });
    }
}

customElements.define('sf-toggle', SFToggle);
