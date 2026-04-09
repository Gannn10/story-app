import StoryDB from '../scripts/data/db.js';

const SavedPresenter = {
    async render() {
        return `
            <section class="home-container">
                <h1>Cerita Tersimpan (Offline)</h1>
                <div id="savedList" class="responsive-grid">
                    <p>Belum ada cerita yang disimpan.</p>
                </div>
            </section>
        `;
    },

    async afterRender() {
        const stories = await StoryDB.getAll();
        const container = document.getElementById('savedList');
        
        if (stories.length > 0) {
            container.innerHTML = '';
            stories.forEach(story => {
                container.innerHTML += `
                    <article class="story-card">
                        <img src="${story.photoUrl}" alt="${story.name}">
                        <div class="card-body">
                            <h3>${story.name}</h3>
                            <button class="btn-delete" data-id="${story.id}" style="background: #ef4444; color: white; border: none; padding: 8px; border-radius: 5px; cursor: pointer;">
                                ❌ Hapus dari Simpanan
                            </button>
                        </div>
                    </article>
                `;
            });

            // Logika Hapus (Kriteria CRUD)
            container.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', async () => {
                    await StoryDB.delete(btn.dataset.id);
                    alert('Cerita dihapus dari penyimpanan lokal!');
                    window.location.reload(); // Refresh tampilan
                });
            });
        }
    }
};

export default SavedPresenter;