import StoryAPI from '../data/story-api.js';

const AddPresenter = {
    async render() {
        return `
            <section class="add-container">
                <h1>Tambah Cerita Baru</h1>
                <form id="addStoryForm">
                    <div class="form-group">
                        <label for="photo">Pilih Foto</label>
                        <input type="file" id="photo" accept="image/*" required>
                    </div>
                    <div class="form-group">
                        <label for="description">Deskripsi</label>
                        <textarea id="description" required></textarea>
                    </div>

                    <h2>Pilih Lokasi di Peta</h2>
                    <div id="mapPicker" style="height: 300px;"></div>
                    
                    <div class="form-group grid-2">
                        <div>
                            <label for="lat">Latitude</label>
                            <input type="text" id="lat" placeholder="Klik peta..." disabled> </div>
                        <div>
                            <label for="lon">Longitude</label>
                            <input type="text" id="lon" placeholder="Klik peta..." disabled> </div>
                    </div>

                    <button type="submit" id="btnSubmit">Posting Story</button>
                </form>
            </section>
        `;
    },

    async afterRender() {
        const map = L.map('mapPicker').setView([-6.2, 106.8], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        let marker;
        map.on('click', (e) => {
            if (marker) map.removeLayer(marker);
            marker = L.marker(e.latlng).addTo(map);
            document.getElementById('lat').value = e.latlng.lat;
            document.getElementById('lon').value = e.latlng.lng;
        });

        document.getElementById('addStoryForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('USER_TOKEN');
            const formData = new FormData();
            formData.append('description', document.getElementById('description').value);
            formData.append('photo', document.getElementById('photo').files[0]);
            
            // Ambil value meskipun disabled
            const lat = document.getElementById('lat').value;
            const lon = document.getElementById('lon').value;
            if (lat) formData.append('lat', lat);
            if (lon) formData.append('lon', lon);

            const result = await StoryAPI.addStory(token, formData);
            if (!result.error) {
                alert('Berhasil!');
                window.location.hash = '#/';
            }
        });
    }
};

export default AddPresenter;