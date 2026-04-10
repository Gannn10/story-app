import './styles/style.css';
import Router from './routes/router.js';
import NotificationHelper from './scripts/utils/notification-helper.js';

window.addEventListener('hashchange', () => {
    Router.renderPage();
});

window.addEventListener('load', async () => {
    // 1. Render halaman pertama kali saat aplikasi dibuka
    Router.renderPage();

    // 2. Registrasi Service Worker (WAJIB untuk Installable & Mode Offline)
    if ('serviceWorker' in navigator) {
        try {
            // Memanggil sw.js dari folder public (saat build akan berada di root dist)
            await navigator.serviceWorker.register('sw.js');
            console.log('Service Worker Berhasil Aktif!');
        } catch (error) {
            console.error('Service Worker Gagal Daftar:', error);
        }
    }

    // 3. Inisialisasi Notifikasi (Hanya jika user sudah login/memiliki token)
    const token = localStorage.getItem('USER_TOKEN');
    if (token) {
        // Minta izin notifikasi
        await NotificationHelper.requestPermission();
        // Lakukan subscribe ke server Dicoding
        await NotificationHelper.subscribePushNotification(token);
    }
});

// 4. Perbaikan Fitur Keluar (Sesuai Tips Reviewer)
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Hapus token dari local storage agar akses tertutup
        localStorage.removeItem('USER_TOKEN'); 
        
        // Arahkan kembali ke halaman login
        window.location.hash = '#/login'; 
        
        // Refresh halaman untuk membersihkan state aplikasi
        window.location.reload(); 
    });
}