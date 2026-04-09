import './styles/style.css';
import Router from './routes/router.js';
import NotificationHelper from './scripts/utils/notification-helper.js';

window.addEventListener('load', async () => {
    // 1. Jalankan Router
    Router.init();

    // 2. Registrasi Service Worker (WAJIB buat PWA & Mode Offline)
    if ('serviceWorker' in navigator) {
        try {
            // Gunakan path relatif './sw.js' agar aman di GitHub Pages
            await navigator.serviceWorker.register('./sw.js');
            console.log('Service Worker terdaftar!');
        } catch (error) {
            console.error('Service Worker gagal daftar:', error);
        }
    }

    // 3. Inisialisasi Push Notification (Kriteria Reviewer)
    const token = localStorage.getItem('USER_TOKEN');
    if (token) {
        // Minta izin dan Subscribe menggunakan VAPID Key Dicoding
        await NotificationHelper.requestPermission();
        await NotificationHelper.subscribePushNotification(token);
    }
});

// Logout Listener
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('USER_TOKEN');
        window.location.hash = '#/login';
        window.location.reload();
    });
}