// ════════════════════════════════════════
// public/firebase-messaging-sw.js
// FCM Service Worker — handles background push notifications
// Must be served from origin root: /firebase-messaging-sw.js
// ════════════════════════════════════════
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyATOapsG-1fS8T08d_VaQgRp6D0xvbPw1g',
  authDomain: 'sharedcalendar-d108f.firebaseapp.com',
  projectId: 'sharedcalendar-d108f',
  storageBucket: 'sharedcalendar-d108f.firebasestorage.app',
  messagingSenderId: '103287743987',
  appId: '1:103287743987:web:dec560d1968111e2901e86',
});

const messaging = firebase.messaging();

// Background handler — shows notification when app is closed/in background
messaging.onBackgroundMessage((payload) => {
  const n = payload.notification || {};
  const d = payload.data || {};
  const title = n.title || d.title || 'TNR MapHub';
  const options = {
    body: n.body || d.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: d.type || 'tnr-notif',
    data: { url: d.url || '/' },
  };
  self.registration.showNotification(title, options);
});

// Click → focus existing tab or open new
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if ('focus' in w) { w.navigate(url); return w.focus(); }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
