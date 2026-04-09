import StoryAPI from '../data/story-api.js';
import StoryDB from '../scripts/data/db.js'; // Pastikan path ke db.js benar

const HomePresenter = {
    async render() {
        return `
            <section class="home-container">
                <h1>Dashboard Story Maps</h1> 
                <div id="mainMap"></div>

                <h2>Cerita Terbaru dari Seluruh Dunia</h2> 
                <div id="storyList" class="responsive-grid">
                    <p>Memuat data cerita...</p>
                </div>
            </section>
        `;
    },

    async afterRender() {
        const token = localStorage.getItem('USER_TOKEN');
        const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
        const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');

        const map = L.map('mainMap', {
            center: [-2.5489, 118.0149], 
            zoom: 5,
            layers: [osm]
        });

        L.control.layers({ "Street": osm, "Satellite": satellite }).addTo(map);

        try {
            const { listStory } = await StoryAPI.getAllStories(token);
            const container = document.getElementById('storyList');
            container.innerHTML = '';

            listStory.forEach(story => {
                // Marker Peta
                if (story.lat && story.lon) {
                    L.marker([story.lat, story.lon]).addTo(map)
                        .bindPopup(`<b>${story.name}</b><br>${story.description}`);
                }

                // List Card dengan Tombol Simpan (Kriteria IndexedDB)
                container.innerHTML += `
                    <article class="story-card">
                        <img src="${story.photoUrl}" alt="Foto cerita oleh ${story.name}">
                        <div class="card-body">
                            <h3>${story.name}</h3> 
                            <p class="story-date">${new Date(story.createdAt).toLocaleDateString('id-ID', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}</p> 
                            <p class="story-desc">${story.description.substring(0, 100)}...</p> 
                            <button class="btn-save" data-story='${JSON.stringify(story)}'>💾 Simpan Offline</button>
                        </div>
                    </article>
                `;
            });

            // Logika Klik Simpan ke IndexedDB
            container.querySelectorAll('.btn-save').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const storyData = JSON.parse(btn.dataset.story);
                    try {
                        await StoryDB.put(storyData);
                        alert('Cerita berhasil disimpan ke IndexedDB!');
                    } catch (err) {
                        console.error('Gagal simpan:', err);
                    }
                });
            });

        } catch (err) {
            document.getElementById('storyList').innerHTML = '<p>Gagal memuat data. Periksa koneksi atau Token.</p>';
        }
    }
};

export default HomePresenter;