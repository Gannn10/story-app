// src/index.js
import './styles/style.css';
import Router from './routes/router.js';
import NotificationHelper from './scripts/utils/notification-helper.js';

window.addEventListener('hashchange', () => {
    Router.renderPage();
});

window.addEventListener('load', async () => {
    Router.renderPage();

    if ('serviceWorker' in navigator) {
        try {
            // Memanggil sw.js dari folder public (hasil build akan di root)
            await navigator.serviceWorker.register('sw.js');
            console.log('SW Berhasil Aktif!');
        } catch (error) {
            console.error('SW Gagal Daftar:', error);
        }
    }

    const token = localStorage.getItem('USER_TOKEN');
    if (token) {
        await NotificationHelper.requestPermission();
        await NotificationHelper.subscribePushNotification(token);
    }
});