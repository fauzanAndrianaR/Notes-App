class LoadingIndicator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                }

                .spinner {
                    border: 8px solid #f3f3f3;
                    border-radius: 50%;
                    border-top: 8px solid #3498db;
                    width: 60px;
                    height: 60px;
                    animation: spin 2s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>

            <div class="loading-overlay">
                <div class="spinner"></div>
            </div>
        `;
    }

    connectedCallback() {
        this.style.display = 'block';
    }

    disconnectedCallback() {
        this.style.display = 'none';
    }
}

customElements.define('loading-indicator', LoadingIndicator);
