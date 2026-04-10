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
      const vapidPublicKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey,
      });

      // KONVERSI KE JSON OBJEK SESUAI PERMINTAAN REVIEWER
      const subscriptionJSON = subscription.toJSON();

      await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        // FORMAT BODY HARUS SEPERTI INI AGAR TIDAK ERROR 400
        body: JSON.stringify({
          endpoint: subscriptionJSON.endpoint,
          keys: {
            auth: subscriptionJSON.keys.auth,
            p256dh: subscriptionJSON.keys.p256dh,
          },
        }),
      });
      console.log('Berhasil langganan push notification');
    } catch (error) {
      console.error('Gagal subscribe:', error);
    }
  },
};

export default NotificationHelper;