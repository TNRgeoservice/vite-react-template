// ════════════════════════════════════════
// next.config.js — TNR MapHub
// ════════════════════════════════════════
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Output ──────────────────────────────
  // Use 'standalone' for Docker / self-hosted
  // Use 'export' for Netlify/Vercel static (no SSR)
  // Default: full SSR on Vercel
  // output: 'standalone',

  // ── Images ──────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'server.arcgisonline.com' },
    ],
    // Automatically optimize to WebP/AVIF via next/image
    minimumCacheTTL: 86400,
  },

  // ── Headers (Security + CORS for map tiles) ──
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'geolocation=(self), camera=(self)' },
        ],
      },
      {
        // Allow MapLibre to load tiles cross-origin
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },

  // ── Redirects ────────────────────────────
  async redirects() {
    return [
      // Legacy hash-based URL → new SSR route
      // /#plot=land:123 → /plot/123
      // Handled client-side in app/page.tsx via useEffect
    ];
  },

  // ── Transpile packages ────────────────────
  transpilePackages: ['react-map-gl'],

  // ── Env (public vars — safe to expose) ───
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_VAPID_KEY:          process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    NEXT_PUBLIC_GMAPS_API_KEY:               process.env.NEXT_PUBLIC_GMAPS_API_KEY,
    NEXT_PUBLIC_SITE_URL:                    process.env.NEXT_PUBLIC_SITE_URL || 'https://tnrmaphub.netlify.app',
  },
};

module.exports = nextConfig;


