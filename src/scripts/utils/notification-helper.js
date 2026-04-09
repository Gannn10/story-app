const NotificationHelper = {
  async requestPermission() {
    const status = await Notification.requestPermission();
    if (status === 'denied') {
      console.error('Fitur notifikasi ditolak.');
      return;
    }
    console.log('Notifikasi diizinkan!');
  },

  async subscribePushNotification(token) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // VAPID Key Wajib dari Dicoding
      const vapidPublicKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey,
      });

      // Kirim ke endpoint subscribe sesuai dokumentasi
      await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(subscription),
      });
      console.log('Berhasil langganan push notification');
    } catch (error) {
      console.error('Gagal subscribe:', error);
    }
  },
};

export default NotificationHelper;