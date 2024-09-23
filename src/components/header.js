class AppHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="header-container">
                <img src="https://i.pinimg.com/280x280_RS/3d/d2/4e/3dd24e1ad5e0df5ed5a242854ab2191a.jpg" alt="Logo" class="logo">
                <h1>NotesApp</h1>
            </div>
        `;
    }
}

customElements.define('app-header', AppHeader);
