// ════════════════════════════════════════
// src/lib/fb.ts
// Firebase client init for the Vite landing app.
// แยกจาก src/lib/firebase.ts (ตัวนั้นใช้ process.env.NEXT_PUBLIC_* ของ Next
// ซึ่งรันใน bundle ของ Vite ไม่ได้). config เป็น public client config
// (ตัวเดียวกับ firebase-messaging-sw.js) — ปลอดภัยที่จะฝังตรงนี้.
// ════════════════════════════════════════
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            'AIzaSyATOapsG-1fS8T08d_VaQgRp6D0xvbPw1g',
  authDomain:        'sharedcalendar-d108f.firebaseapp.com',
  projectId:         'sharedcalendar-d108f',
  storageBucket:     'sharedcalendar-d108f.firebasestorage.app',
  messagingSenderId: '103287743987',
  appId:             '1:103287743987:web:dec560d1968111e2901e86',
};

// undefined ตอน SSR/prerender (Node) — guard ด้วย typeof window
// คอมโพเนนต์ต้องอ้าง auth/db เฉพาะใน event handler / useEffect เท่านั้น
let app:  FirebaseApp | undefined;
let auth: Auth | undefined;
let db:   Firestore | undefined;

if (typeof window !== 'undefined') {
  app  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db   = getFirestore(app);
}

export { app, auth, db };
