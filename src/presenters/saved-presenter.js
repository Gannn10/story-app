import StoryDB from '../scripts/data/db.js';

const SavedPresenter = {
    async render() {
        return `
            <section class="home-container">
                <h1>Bookmark Saya</h1>
                <h2>Daftar Cerita Tersimpan Secara Offline</h2>
                <div id="savedList" class="responsive-grid">
                    <p>Memuat bookmark...</p>
                </div>
            </section>
        `;
    },

    async afterRender() {
        // Kita pindahkan logika render list ke fungsi terpisah agar bisa dipanggil ulang
        await this._renderList();
    },

    async _renderList() {
        const stories = await StoryDB.getAll();
        const container = document.getElementById('savedList');
        
        if (!container) return; // Guard agar tidak error jika element hilang

        if (stories.length === 0) {
            container.innerHTML = '<p>Belum ada bookmark tersimpan.</p>';
            return;
        }

        container.innerHTML = '';
        stories.forEach(story => {
            container.innerHTML += `
                <article class="story-card">
                    <img src="${story.photoUrl}" alt="${story.name}">
                    <div class="card-body">
                        <h3>${story.name}</h3>
                        <button class="btn-delete" data-id="${story.id}" style="background:#ef4444; color:white; border:none; padding:8px; border-radius:4px; cursor:pointer;">
                            🗑️ Hapus Bookmark
                        </button>
                    </div>
                </article>
            `;
        });

        // Logika Hapus
        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                
                try {
                    await StoryDB.delete(id);
                    alert('Berhasil dihapus!');
                    
                    // JANGAN PAKAI window.location.reload()
                    // Panggil lagi fungsi render list internal agar UI update otomatis
                    await this._renderList(); 
                } catch (err) {
                    console.error('Gagal menghapus:', err);
                }
            });
        });
    }
};

export default SavedPresenter;