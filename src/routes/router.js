import HomePresenter from '../presenters/home-presenter.js';
import AddPresenter from '../presenters/add-presenter.js';
import LoginPresenter from '../presenters/login-presenter.js';
import RegisterPresenter from '../presenters/register-presenter.js';
import SavedPresenter from '../presenters/saved-presenter.js'; // Import Presenter Baru

const routes = {
    '/': HomePresenter,
    '/add': AddPresenter,
    '/saved': SavedPresenter, // Tambahkan ini bre
    '/login': LoginPresenter,
    '/register': RegisterPresenter,
};

const Router = {
    async init() {
        // Router.js kamu sudah bagus, panggil renderPage saat load & hashchange
        window.addEventListener('hashchange', () => this._renderPage());
        window.addEventListener('load', () => this._renderPage());
    },

    async _renderPage() {
        const url = window.location.hash.slice(1) || '/';
        const token = localStorage.getItem('USER_TOKEN');
        const container = document.querySelector('#mainContent');
        const header = document.querySelector('#mainHeader');

        const publicPages = ['/login', '/register'];
        const isPublicPage = publicPages.includes(url);

        if (!token && !isPublicPage) {
            window.location.hash = '#/login';
            return;
        }

        if (header) {
            header.style.display = isPublicPage ? 'none' : 'block';
        }

        const presenter = routes[url] || HomePresenter;

        const render = async () => {
            container.innerHTML = '<div class="loader-container"><p>Memuat Halaman...</p></div>';
            try {
                const html = await presenter.render();
                container.innerHTML = html;
                if (presenter.afterRender) await presenter.afterRender();
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