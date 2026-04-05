import HomePresenter from '../presenters/home-presenter.js';
import AddPresenter from '../presenters/add-presenter.js';
import LoginPresenter from '../presenters/login-presenter.js';
import RegisterPresenter from '../presenters/register-presenter.js';

const routes = {
    '/': HomePresenter,
    '/add': AddPresenter,
    '/login': LoginPresenter,
    '/register': RegisterPresenter,
};

const Router = {
    async init() {
      
        window.addEventListener('hashchange', () => {
            this._renderPage();
        });

        window.addEventListener('load', () => {
            this._renderPage();
        });
    },

    async _renderPage() {
        const url = window.location.hash.slice(1) || '/';
        const token = localStorage.getItem('USER_TOKEN');
        const container = document.querySelector('#mainContent');
        const header = document.querySelector('#mainHeader');

        // 1. PROTEKSI RUTE (Kriteria 1 & 2)

        const publicPages = ['/login', '/register'];
        const isPublicPage = publicPages.includes(url);

        if (!token && !isPublicPage) {
        
            window.location.hash = '#/login';
            return;
        }

        // 2. MANAGEMENT UI (Header)
       
        if (isPublicPage) {
            header.style.display = 'none';
        } else {
            header.style.display = 'block';
        }

        // 3. SELEKSI PRESENTER
        const presenter = routes[url] || HomePresenter;

        // 4. VIEW TRANSITION (Kriteria 1 Advance)
       
        const render = async () => {
           
            container.innerHTML = '<div class="loader-container"><p>Memuat Halaman...</p></div>';
            
            try {
                const html = await presenter.render();
                container.innerHTML = html;
                await presenter.afterRender();
            } catch (error) {
                console.error('Render Error:', error);
                container.innerHTML = '<p class="error">Terjadi kesalahan saat memuat halaman.</p>';
            }
        };

        if (document.startViewTransition) {
            document.startViewTransition(() => render());
        } else {

            await render();
        }
    }
};

export default Router;