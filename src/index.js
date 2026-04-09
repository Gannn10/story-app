// src/index.js
import './styles/style.css';
import Router from './routes/router.js';
import NotificationHelper from './scripts/utils/notification-helper.js';

// Jalankan render setiap ada perubahan URL
window.addEventListener('hashchange', () => {
    Router.renderPage();
});

window.addEventListener('load', async () => {
    // 1. Render halaman pertama kali
    Router.renderPage();

    // 2. Service Worker
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./sw.js');
            console.log('SW terdaftar!');
        } catch (error) {
            console.error('SW gagal!', error);
        }
    }

    // 3. Notifikasi
    const token = localStorage.getItem('USER_TOKEN');
    if (token) {
        await NotificationHelper.requestPermission();
        await NotificationHelper.subscribePushNotification(token);
    }
});