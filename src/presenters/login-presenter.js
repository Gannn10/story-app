import StoryAPI from '../data/story-api.js';

const LoginPresenter = {
    async render() {
        return `
            <section class="auth-container">
                <h1>Masuk ke Akun</h1> 
                
                <form id="loginForm">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" required placeholder="Masukkan email anda">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" required minlength="8" placeholder="Masukkan password anda">
                    </div>
                    <button type="submit" id="loginBtn">Login</button>
                    
                    <p class="mt-2 text-center">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
                </form>
            </section>
        `;
    },

    async afterRender() {
        const form = document.getElementById('loginForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;
            const btn = document.querySelector('#loginBtn');

            try {
                btn.innerText = 'Memproses...';
                btn.disabled = true;

                const response = await StoryAPI.login({ email, password });

                if (!response.error) {
                    localStorage.setItem('USER_TOKEN', response.loginResult.token);
                    alert('Login Berhasil!');
                    window.location.hash = '#/'; 
                } else {
                    alert('Gagal: ' + response.message);
                }
            } catch (error) {
                alert('Terjadi kesalahan jaringan.');
            } finally {
                btn.innerText = 'Login';
                btn.disabled = false;
            }
        });
    }
};

export default LoginPresenter;