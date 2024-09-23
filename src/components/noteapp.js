const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class NoteApp extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._notes = [];
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                #note-form {
                    background-color: #E2DAD6;
                    border-radius: 12px;
                    padding: 20px;
                    max-width: 60%;
                    margin: 0 auto;
                    margin-bottom: 20px;
                    transition: box-shadow 0.3s;
                    border: rgb(63, 61, 61) solid;
                }

                #note-form:hover {
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
                }

                @media (max-width: 768px) {
                    #note-form {
                        max-width: 90%;
                    }
                }

                #note-form input, #note-form textarea {
                    width: 100%;
                    padding: 12px;
                    margin: 10px 0;
                    border-radius: 6px;
                    border: 1px solid #ccc;
                    box-sizing: border-box;
                    font-size: 16px;
                    transition: border-color 0.3s, box-shadow 0.3s;
                    background-color: #F5EDED;
                }

                #note-form button {
                    background-color: #007bff;
                    color: #fff;
                    padding: 12px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.3s, transform 0.3s;
                    display: block;
                    margin: 20px auto 0;
                    width: 50%;
                }

                #note-form button:hover {
                    background-color: #0056b3;
                    transform: translateY(-2px);
                }

                #note-form span {
                    display: block;
                    margin-top: -8px;
                    margin-bottom: 10px;
                    font-size: 12px;
                    color: red;
                    font-family: inherit;
                }

                #note-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    max-width: 90%;
                    margin: 0 auto;
                }

                .loading-indicator {
                    text-align: center;
                    margin: 20px 0;
                    font-size: 18px;
                    color: #007bff;
                    display: none;
                }

                .note-card {
                    border: 1px solid #ddd;
                    padding: 15px;
                    border-radius: 8px;
                    background-color: #F5EDED;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 20px;
                    border: rgb(63, 61, 61) solid;
                    transition: transform 0.3s ease-in-out;
                    cursor: pointer;
                }

                .note-card:hover {
                    transform: scale(1.05);
                }

                .note-card h2 {
                    margin: 0 0 5px 0;
                }

                .note-card p {
                    font-size: 14px;
                    color: #555;
                }

                .note-card small {
                    font-size: 12px;
                    color: #888;
                }
            </style>

            <form id="note-form">
                <input type="text" id="title" placeholder="Masukan Judul" required>
                <span id="title-error" style="display: none;">Title is required.</span>
                <textarea id="body" placeholder="Masukan Note" required></textarea>
                <span id="body-error" style="display: none;">Body is required.</span>
                <button type="submit">Add Note</button>
            </form>

            <div class="loading-indicator">Loading...</div>
            <div id="note-list"></div>
        `;
    }

    async fetchNotes() {
        const loadingIndicator = this.shadowRoot.querySelector('.loading-indicator');
        loadingIndicator.style.display = 'block';  // Tampilkan loading indicator

        try {
            const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
                headers: {
                    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
                }
            });

            const data = await response.json();
            if (response.ok) {
                this._notes = data.data || [];
                this.renderNotes();  // Render daftar catatan setelah berhasil fetch
            } else {
                console.error('Failed to fetch notes:', data.message);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            await delay(2000);  // Tunda minimal 2 detik sebelum menghilangkan loading indicator
            loadingIndicator.style.display = 'none';
        }
    }

    renderNotes() {
        const noteList = this.shadowRoot.querySelector('#note-list');
        noteList.innerHTML = '';  // Clear the list

        this._notes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.classList.add('note-card');
            noteCard.innerHTML = `
                <h2>${note.title}</h2>
                <p>${note.body}</p>
                <small>${new Date(note.createdAt).toLocaleDateString()}</small>
                <button id="delete-btn" data-id="${note.id}">Delete</button>
            `;

            noteCard.querySelector('#delete-btn').addEventListener('click', () => this.deleteNote(note.id));
            noteList.appendChild(noteCard);
        });
    }

    async deleteNote(id) {
        const loadingIndicator = this.shadowRoot.querySelector('.loading-indicator');
        loadingIndicator.style.display = 'block';  // Show loading indicator during delete

        try {
            const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
                }
            });

            if (response.ok) {
                this._notes = this._notes.filter(note => note.id !== id);
                this.renderNotes();
            } else {
                console.error('Failed to delete note');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        } finally {
            await delay(2000);
            loadingIndicator.style.display = 'none';  // Hide loading indicator after delete
        }
    }

    connectedCallback() {
        this.fetchNotes();  // Fetch notes when the component is first added

        const form = this.shadowRoot.querySelector('#note-form');
        const titleInput = this.shadowRoot.querySelector('#title');
        const bodyInput = this.shadowRoot.querySelector('#body');
        const titleError = this.shadowRoot.querySelector('#title-error');
        const bodyError = this.shadowRoot.querySelector('#body-error');
        const loadingIndicator = this.shadowRoot.querySelector('.loading-indicator');

        titleInput.addEventListener('input', () => {
            if (titleInput.value.trim() === '') {
                titleError.style.display = 'inline';
            } else {
                titleError.style.display = 'none';
            }
        });

        bodyInput.addEventListener('input', () => {
            if (bodyInput.value.trim() === '') {
                bodyError.style.display = 'inline';
            } else {
                bodyError.style.display = 'none';
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = titleInput.value.trim();
            const body = bodyInput.value.trim();

            if (title !== '' && body !== '') {
                loadingIndicator.style.display = 'block';  // Show loading indicator during add

                try {
                    const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
                        },
                        body: JSON.stringify({ title, body })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        this._notes = [data.data, ...this._notes];
                        this.renderNotes();  // Re-render notes list
                        form.reset();  // Reset the form
                    } else {
                        console.error('Failed to add note:', data.message);
                    }
                } catch (error) {
                    console.error('Error adding note:', error);
                } finally {
                    await delay(1000);
                    loadingIndicator.style.display = 'none';  // Hide loading indicator after adding
                }
            }
        });
    }
}

customElements.define('note-app', NoteApp);
