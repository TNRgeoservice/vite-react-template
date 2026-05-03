// ════════════════════════════════════════
// src/hooks/useFCM.ts
// FCM Web Push — token save + foreground toast
// Port จาก js/fcm-notifications.js (ย่อ — skip notification center modal)
// ════════════════════════════════════════
'use client';

import { useEffect, useState, useCallback } from 'react';
import { getToken, onMessage, isSupported, deleteToken } from 'firebase/messaging';
import { doc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, messaging } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || '';

export interface FCMToast {
  id: number;
  title: string;
  body: string;
  icon: string;
  url?: string;
  type: string;
}

export function useFCM() {
  const user = useAuthStore((s) => s.user);
  const [toasts, setToasts] = useState<FCMToast[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  // Request permission + save token
  const requestPermission = useCallback(async () => {
    if (!user || !messaging || !VAPID_KEY) return false;
    try {
      const supported = await isSupported();
      if (!supported) return false;

      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') return false;

      // Register service worker (Next.js serves /firebase-messaging-sw.js from /public)
      const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: reg,
      });
      if (!token) return false;

      await setDoc(doc(db, 'users', user.uid, 'fcmTokens', token), {
        token,
        device: navigator.userAgent.slice(0, 100),
        platform: detectPlatform(),
        createdAt: serverTimestamp(),
        active: true,
      });
      return true;
    } catch (e) {
      console.warn('[FCM] requestPermission', e);
      return false;
    }
  }, [user]);

  // Auto-subscribe when user logs in and permission already granted
  useEffect(() => {
    if (!user || !messaging) return;
    if (Notification.permission !== 'granted') return;
    requestPermission().catch(() => {});
  }, [user, requestPermission]);

  // Foreground message listener
  useEffect(() => {
    if (!messaging) return;
    const unsub = onMessage(messaging, (payload) => {
      const n = payload.notification || {};
      const d = (payload.data || {}) as Record<string, string>;
      const toast: FCMToast = {
        id: Date.now() + Math.random(),
        title: n.title || d.title || 'TNR MapHub',
        body: n.body || d.body || '',
        icon: d.icon || '📢',
        url: d.url,
        type: d.type || 'info',
      };
      setToasts((prev) => [...prev, toast]);
      // auto-dismiss
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 5000);
    });
    return unsub;
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const disableFCM = useCallback(async () => {
    if (!user || !messaging) return;
    try {
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (token) {
        await deleteToken(messaging);
        await deleteDoc(doc(db, 'users', user.uid, 'fcmTokens', token));
      }
    } catch (e) {
      console.warn('[FCM] disable', e);
    }
  }, [user]);

  return { permission, requestPermission, toasts, dismissToast, disableFCM };
}

function detectPlatform() {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return 'android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  if (/macintosh/i.test(ua)) return 'mac';
  if (/windows/i.test(ua)) return 'windows';
  return 'web';
}
