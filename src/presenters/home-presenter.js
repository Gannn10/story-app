import StoryAPI from '../data/story-api.js';
import StoryDB from '../scripts/data/db.js';

const HomePresenter = {
    async render() {
        return `
            <section class="home-container">
                <h1>Dashboard Story Maps</h1> 
                <div id="mainMap" style="height: 400px; margin-bottom: 20px;"></div>
                <h2>Cerita Terbaru</h2> 
                <div id="storyList" class="responsive-grid"></div>
            </section>
        `;
    },

    async afterRender() {
        const token = localStorage.getItem('USER_TOKEN');
        const map = L.map('mainMap').setView([-2.5489, 118.0149], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        try {
            const { listStory } = await StoryAPI.getAllStories(token);
            const container = document.getElementById('storyList');
            container.innerHTML = '';

            // Ambil data yang sudah ada di DB untuk cek status bookmark
            const savedStories = await StoryDB.getAll();
            const savedIds = savedStories.map((s) => s.id);

            listStory.forEach(story => {
                if (story.lat && story.lon) {
                    L.marker([story.lat, story.lon]).addTo(map).bindPopup(`<b>${story.name}</b>`);
                }

                const isSaved = savedIds.includes(story.id);

                container.innerHTML += `
                    <article class="story-card">
                        <img src="${story.photoUrl}" alt="${story.name}">
                        <div class="card-body">
                            <h3>${story.name}</h3>
                            <p class="story-desc">${story.description.substring(0, 50)}...</p>
                            <button class="btn-save ${isSaved ? 'active' : ''}" 
                                    data-story='${JSON.stringify(story)}' 
                                    title="Simpan Offline">
                                🔖
                            </button>
                        </div>
                    </article>
                `;
            });

            container.querySelectorAll('.btn-save').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const story = JSON.parse(btn.dataset.story);
                    
                    // Efek animasi klik (scale up-down)
                    btn.classList.add('animating');
                    
                    try {
                        await StoryDB.put(story);
                        btn.classList.add('active'); // Ubah warna jadi kuning
                        
                        // TAMBAHAN NOTIFIKASI BERHASIL
                        alert('Berhasil disimpan ke Bookmark!'); 
                        
                    } catch (err) {
                        console.error('Gagal simpan:', err);
                        alert('Gagal menyimpan cerita.');
                    }

                    // Hapus class animasi setelah selesai
                    setTimeout(() => btn.classList.remove('animating'), 300);
                });
            });
        } catch (err) {
            console.error(err);
        }
    }
};

export default HomePresenter;