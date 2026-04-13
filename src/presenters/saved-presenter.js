import StoryDB from '../scripts/data/db.js';

const SavedPresenter = {
    async render() {
        return `
            <section class="home-container">
                <h1>Bookmark Saya</h1>
                <h2>Daftar Cerita Tersimpan Offline</h2>
                <div id="savedList" class="responsive-grid"></div>
            </section>
        `;
    },

    async afterRender() {
        await this._renderList();
    },

    async _renderList() {
        const stories = await StoryDB.getAll();
        const container = document.getElementById('savedList');
        
        if (!container) return;

        if (stories.length === 0) {
            container.innerHTML = '<p>Belum ada bookmark tersimpan.</p>';
            return;
        }

        container.innerHTML = '';
        stories.forEach(story => {
            const date = new Date(story.createdAt).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            container.innerHTML += `
                <article class="story-card">
                    <img src="${story.photoUrl}" alt="${story.name}">
                    <div class="card-body">
                        <h3>${story.name}</h3> <p class="story-date">${date}</p> <p class="story-desc">${story.description.substring(0, 50)}...</p> <button class="btn-delete" data-id="${story.id}" style="background:#ef4444; color:white; border:none; padding:8px; border-radius:4px; cursor:pointer;">
                            🗑️ Hapus Bookmark
                        </button>
                    </div>
                </article>
            `;
        });

        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                await StoryDB.delete(btn.dataset.id);
                alert('Berhasil dihapus!');
                await this._renderList(); // Update UI tanpa reload putih
            });
        });
    }
};

export default SavedPresenter;