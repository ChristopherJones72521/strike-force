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
                margin: 0 auto;
                padding: 0;
            }

            .control {
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(30, 30, 32, 0.8);
                border-radius: 8px;
                overflow: hidden;
                width: 90%;
                max-width: 350px;
                margin: 0 auto;
                padding: 4px;
                position: relative;
            }

            ::slotted(button) {
                flex: 1;
                background: transparent;
                border: none;
                color: rgba(255, 255, 255, 0.6);
                font-size: 0.875rem;
                font-weight: 500;
                padding: 8px 12px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
                white-space: nowrap;
                position: relative;
                overflow: hidden;
                z-index: 2;
                border-radius: 6px;
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
                height: calc(100% - 8px);
                top: 4px;
                background: rgba(50, 50, 55, 0.85);
                transition: all 0.3s cubic-bezier(0.33, 1, 0.68, 1);
                border-radius: 6px;
                z-index: 1;
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
