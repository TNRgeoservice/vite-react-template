// ════════════════════════════════════════
// src/lib/firebase.ts
// Firebase client SDK — singleton init
// ════════════════════════════════════════
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth }               from 'firebase/auth';
import { getFirestore, initializeFirestore, Firestore,
         persistentLocalCache }
                                       from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getMessaging, Messaging,
         isSupported }                 from 'firebase/messaging';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// ── Singleton ──────────────────────────────────────────────────────────────
let app:       FirebaseApp;
let auth:      Auth;
let db:        Firestore;
let storage:   FirebaseStorage;
let messaging: Messaging | null = null;

if (typeof window !== 'undefined') {
  app     = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth    = getAuth(app);

  // Firestore — single-tab persistent cache (default tabManager)
  // Note: เปลี่ยนจาก persistentMultipleTabManager เพราะมี race condition
  //       (Firebase v12 INTERNAL ASSERTION FAILED: b815/ca9) เมื่อ navigate
  //       ระหว่างหน้าที่มี onSnapshot listener หลายตัว
  try {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache(),
    });
  } catch {
    // If already initialized (HMR / second import) fall back to getFirestore
    db = getFirestore(app);
  }

  storage = getStorage(app);

  // FCM (optional)
  isSupported().then(supported => {
    if (supported) {
      messaging = getMessaging(app);
    }
  }).catch(() => {});
}

export { app, auth, db, storage, messaging };
export const COL = 'fieldsurvey_points';
