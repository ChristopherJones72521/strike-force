class NavBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        this.updateActiveLink();
        window.addEventListener('hashchange', () => this.updateActiveLink());
    }

    disconnectedCallback() {
        window.removeEventListener('hashchange', () => this.updateActiveLink());
    }

    updateActiveLink() {
        const currentRoute = window.location.hash || '#/';
        const links = this.shadowRoot.querySelectorAll('.nav-link');
        links.forEach(link => {
            if (link.getAttribute('href') === currentRoute) {
                link.classList.remove('text-white/60');
                link.classList.add('text-white');
            } else {
                link.classList.add('text-white/60');
                link.classList.remove('text-white');
            }
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 50;
                    background: rgba(17, 24, 39, 0.6);
                    backdrop-filter: blur(12px);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .container {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }

                .nav-content {
                    display: flex;
                    justify-content: space-around;
                    padding: 1rem 0;
                }

                .nav-link {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 0.5rem;
                    color: rgba(255, 255, 255, 0.6);
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .nav-link:hover,
                .nav-link.active {
                    color: rgba(255, 255, 255, 1);
                }

                .icon {
                    width: 24px;
                    height: 24px;
                    stroke: currentColor;
                    stroke-width: 2;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    fill: none;
                }

                .label {
                    margin-top: 0.25rem;
                    font-size: 0.75rem;
                    color: currentColor;
                }
            </style>

            <div class="container">
                <nav class="nav-content">
                    <a href="#/" class="nav-link">
                        <svg class="icon" viewBox="0 0 24 24">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        <span class="label">Home</span>
                    </a>
                    <a href="#/history" class="nav-link">
                        <svg class="icon" viewBox="0 0 24 24">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg>
                        <span class="label">History</span>
                    </a>
                    <a href="#/leaderboard" class="nav-link">
                        <svg class="icon" viewBox="0 0 24 24">
                            <circle cx="12" cy="8" r="7"></circle>
                            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                        </svg>
                        <span class="label">Leaderboard</span>
                    </a>
                </nav>
            </div>
        `;
    }
}

customElements.define('nav-bar', NavBar);
