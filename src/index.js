// src/index.js
import './styles/style.css';
import Router from './routes/router.js';
import NotificationHelper from './scripts/utils/notification-helper.js';

window.addEventListener('hashchange', () => {
    Router.renderPage();
});

window.addEventListener('load', async () => {
    Router.renderPage();

    // 1. Service Worker (Wajib untuk Installable & Offline)
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./sw.js');
            console.log('SW terdaftar bre!');
        } catch (error) {
            console.error('SW gagal!', error);
        }
    }

    // 2. Notifikasi (Menggunakan VAPID Key dari Dicoding)
    const token = localStorage.getItem('USER_TOKEN');
    if (token) {
        await NotificationHelper.requestPermission();
        await NotificationHelper.subscribePushNotification(token);
    }
});