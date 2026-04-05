import Router from './routes/router.js';

// 1. Inisialisasi Router saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    Router.init();

    // 2. Logika Logout Global (Kriteria 1: Memisahkan Auth)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Hapus session
            localStorage.removeItem('USER_TOKEN');
            
            // Redirect ke login
            window.location.hash = '#/login';
            
            // Opsional: Reload untuk membersihkan state memory
            window.location.reload();
        });
    }

    // 3. Menangani tampilan Navbar berdasarkan status Login
    handleNavbarVisibility();
    window.addEventListener('hashchange', handleNavbarVisibility);
});

// Fungsi pembantu untuk menyembunyikan nav jika belum login (Aksesibilitas & UX)
function handleNavbarVisibility() {
    const token = localStorage.getItem('USER_TOKEN');
    const header = document.querySelector('header');
    
    if (!token) {
        header.style.display = 'none';
        document.body.classList.add('not-logged-in');
    } else {
        header.style.display = 'block';
        document.body.classList.remove('not-logged-in');
    }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered!', reg))
      .catch(err => console.error('SW registration failed:', err));
  });
}