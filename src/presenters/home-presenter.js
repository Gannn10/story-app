// src/presenters/home-presenter.js
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

            listStory.forEach(story => {
                if (story.lat && story.lon) {
                    L.marker([story.lat, story.lon]).addTo(map).bindPopup(`<b>${story.name}</b>`);
                }

                container.innerHTML += `
                    <article class="story-card">
                        <img src="${story.photoUrl}" alt="${story.name}">
                        <div class="card-body">
                            <h3>${story.name}</h3>
                            <p class="story-desc">${story.description.substring(0, 100)}...</p>
                            <button class="btn-save" data-story='${JSON.stringify(story)}' style="background:none; border:none; font-size:1.5rem; cursor:pointer;" title="Simpan Offline">🔖</button>
                        </div>
                    </article>
                `;
            });

            container.querySelectorAll('.btn-save').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const story = JSON.parse(btn.dataset.story);
                    await StoryDB.put(story);
                    alert('Berhasil disimpan ke Bookmark!');
                });
            });
        } catch (err) {
            console.error(err);
        }
    }
};

export default HomePresenter;