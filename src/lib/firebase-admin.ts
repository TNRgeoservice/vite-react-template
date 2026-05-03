// ════════════════════════════════════════
// src/lib/firebase-admin.ts
// Firebase Admin SDK — server-side only
// Used in: Route Handlers, Server Components
// ════════════════════════════════════════
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore }            from 'firebase-admin/firestore';

let adminApp: App | undefined;
let adminDb:  Firestore | undefined;

function getAdminApp(): App {
  if (adminApp) return adminApp;
  const apps = getApps();
  if (apps.length) return apps[0];
  return initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export function getAdminDb(): Firestore {
  if (adminDb) return adminDb;
  adminApp = getAdminApp();
  adminDb  = getFirestore(adminApp);
  return adminDb;
}
