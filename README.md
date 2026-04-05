# 📸 Story App - Gani (Submission 2 PWA)

Aplikasi berbagi cerita (Story App) berbasis Web yang menerapkan fitur **Progressive Web Apps (PWA)**, **Push Notification**, dan **Penyimpanan Offline**. Proyek ini merupakan tugas akhir untuk kelulusan kelas Menjadi Front-End Web Developer Expert di Dicoding.

## 🚀 Fitur Utama (Sesuai Kriteria)

### 1. PWA & Offline Access (Advanced)
* **Installable**: Aplikasi dapat diinstal di perangkat Mobile maupun Desktop melalui prompt instalasi.
* **Offline Mode**: Menggunakan Service Worker dengan strategi caching *Network First* dan *Stale-While-Revalidate* agar aplikasi tetap dapat diakses sebagian saat tidak ada koneksi internet.
* **App Shell**: Aset statis (HTML, CSS, JS) disimpan di Cache Storage untuk pemuatan instan.

### 2. Push Notification (Advanced)
* **Real-time Notification**: Menampilkan notifikasi dinamis saat ada aksi tertentu (seperti trigger dari API).
* **Navigation Action**: Klik pada notifikasi akan mengarahkan pengguna langsung ke halaman aplikasi yang sesuai.

### 3. Implementasi IndexedDB (Advanced)
* **Data Persistence**: Menggunakan library `idb` untuk menyimpan, menampilkan, dan menghapus data story secara lokal.
* **Offline Fallback**: Saat perangkat offline, aplikasi secara otomatis mengambil data dari IndexedDB agar pengguna tetap bisa melihat cerita yang sudah tersimpan.

### 4. Navigasi & UI
* **Single Page Application (SPA)**: Perpindahan halaman tanpa reload menggunakan hash-based router.
* **Peta Interaktif**: Menampilkan lokasi cerita menggunakan library Leaflet.
* **Aksesibilitas**: Menerapkan elemen semantik, kontras warna yang baik, dan fitur *Skip to Content*.

## 🛠️ Teknologi yang Digunakan
* **Build Tool**: Vite
* **Language**: JavaScript (ES6 Modules)
* **Library Peta**: Leaflet.js
* **Database Lokal**: IndexedDB (idb library)
* **CSS Framework**: Custom CSS dengan desain responsif

## 📦 Cara Menjalankan Secara Lokal
1. Clone repository ini.
2. Jalankan `npm install` untuk mengunduh dependensi.
3. Jalankan `npm run dev` untuk mode pengembangan.
4. Jalankan `npm run build` dan `npm run preview` untuk mencoba versi produksi/PWA.

## 🌐 Deployment
Aplikasi ini telah dideploy secara publik dan dapat diakses melalui:
👉 **[https://gannn10.github.io/story-app/](https://gannn10.github.io/story-app/)**