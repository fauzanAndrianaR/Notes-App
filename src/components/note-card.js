class NoteCard extends HTMLElement {
    set note(note) {
        this.innerHTML = `
            <div class="note-card">
                <h2>${note.title}</h2>
                <p>${note.body}</p>
                <small>${new Date(note.createdAt).toLocaleDateString()}</small>
                <button id="delete-btn">Delete</button>
            </div>
        `;

    
}}

customElements.define('note-card', NoteCard);
