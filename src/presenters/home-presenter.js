import StoryAPI from '../data/story-api.js';

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
            center: [-2.5489, 118.0149], // Center Indonesia
            zoom: 5,
            layers: [osm]
        });

        // Kriteria 2 Advance: Multiple Tile Layer
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

                // List Card (Sudah Update: Menampilkan 3 Data Teks)
                container.innerHTML += `
                    <article class="story-card">
                        <img src="${story.photoUrl}" alt="Foto cerita oleh ${story.name}">
                        <div class="card-body">
                            <h3>${story.name}</h3> <p class="story-date">${new Date(story.createdAt).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p> <p class="story-desc">${story.description.substring(0, 100)}...</p> </div>
                    </article>
                `;
            });
        } catch (err) {
            document.getElementById('storyList').innerHTML = '<p>Gagal memuat data. Token tidak valid.</p>';
        }
    }
};

export default HomePresenter;