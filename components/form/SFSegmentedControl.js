class SFSegmentedControl extends HTMLElement {
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
                display: block;
                width: 100%;
                margin: 0;
                padding-top: 0.5rem;
            }

            .control {
                display: grid;
                grid-auto-flow: column;
                grid-auto-columns: 1fr;
                background: rgba(38, 38, 40, 0.8);
                border-radius: 0.75rem;
                overflow: hidden;
                width: 100%;
                border: 1px solid rgba(255, 255, 255, 0.1);
                position: relative;
            }

            ::slotted(button) {
                background: transparent;
                border: none;
                color: rgba(255, 255, 255, 0.6);
                font-size: 0.9rem;
                font-weight: 500;
                padding: 0.6rem 0.375rem;
                cursor: pointer;
                transition: all 0.15s;
                text-align: center;
                white-space: nowrap;
                position: relative;
                overflow: hidden;
                z-index: 2;
            }

            ::slotted(button:focus) {
                outline: none;
            }

            ::slotted(button[selected]) {
                color: white;
                font-weight: 600;
            }

            .selection-indicator {
                position: absolute;
                bottom: 0;
                height: 2px;
                background: #2979FF;
                transition: all 0.3s cubic-bezier(0.33, 1, 0.68, 1);
                border-radius: 2px 2px 0 0;
                z-index: 2;
            }
        `;

        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <div class="control">
                <slot name="option"></slot>
                <div class="selection-indicator"></div>
            </div>
        `;
    }

    setupEventListeners() {
        const slot = this.shadowRoot.querySelector('slot[name="option"]');
        
        slot.addEventListener('slotchange', () => {
            const options = this.getOptions();
            
            // Setup initial selection
            const hasSelected = options.some(opt => opt.hasAttribute('selected'));
            if (options.length > 0 && !hasSelected) {
                options[0].setAttribute('selected', '');
            }
            
            // Add click listeners
            options.forEach(option => {
                option.addEventListener('click', () => this.selectOption(option));
            });
            
            // Initial indicator position
            this.updateSelectionIndicator();
        });
    }

    getOptions() {
        const slot = this.shadowRoot.querySelector('slot[name="option"]');
        return slot.assignedElements().filter(el => el.tagName === 'BUTTON');
    }

    selectOption(selected) {
        const options = this.getOptions();
        options.forEach(option => {
            option.removeAttribute('selected');
        });
        
        selected.setAttribute('selected', '');
        this.updateSelectionIndicator();
        
        // Dispatch change event
        this.dispatchEvent(new CustomEvent('change', {
            detail: { value: selected.value || selected.textContent },
            bubbles: true,
            composed: true
        }));
    }

    updateSelectionIndicator() {
        const indicator = this.shadowRoot.querySelector('.selection-indicator');
        const selected = this.getOptions().find(opt => opt.hasAttribute('selected'));
        
        if (selected && indicator) {
            const control = this.shadowRoot.querySelector('.control');
            const controlRect = control.getBoundingClientRect();
            const selectedRect = selected.getBoundingClientRect();
            
            indicator.style.width = `${selectedRect.width}px`;
            indicator.style.left = `${selectedRect.left - controlRect.left}px`;
        }
    }
}

customElements.define('sf-segmented-control', SFSegmentedControl);
