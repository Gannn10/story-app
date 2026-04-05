import StoryAPI from '../data/story-api.js';

const RegisterPresenter = {
    async render() {
        return `
            <section class="auth-container">
                <h1>Daftar Akun Baru</h1> 

                <form id="registerForm">
                    <div class="form-group">
                        <label for="regName">Nama Lengkap</label>
                        <input type="text" id="regName" required placeholder="Nama lengkap anda">
                    </div>
                    <div class="form-group">
                        <label for="regEmail">Email</label>
                        <input type="email" id="regEmail" required placeholder="email@contoh.com">
                    </div>
                    <div class="form-group">
                        <label for="regPassword">Password</label>
                        <input type="password" id="regPassword" required minlength="8" placeholder="Minimal 8 karakter">
                    </div>
                    <button type="submit" id="regBtn">Daftar</button>
                    <p class="mt-2 text-center">Sudah punya akun? <a href="#/login">Login di sini</a></p>
                </form>
            </section>
        `;
    },

    async afterRender() {
        const form = document.getElementById('registerForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.querySelector('#regName').value;
            const email = document.querySelector('#regEmail').value;
            const password = document.querySelector('#regPassword').value;

            try {
                const response = await StoryAPI.register({ name, email, password });
                if (!response.error) {
                    alert('Pendaftaran Berhasil! Silakan Login.');
                    window.location.hash = '#/login';
                } else {
                    alert('Gagal: ' + response.message);
                }
            } catch (error) {
                alert('Terjadi kesalahan saat mendaftar.');
            }
        });
    }
};

export default RegisterPresenter;