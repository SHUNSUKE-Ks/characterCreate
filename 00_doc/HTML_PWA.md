最短 PWA レシピ（HTML のみ）

1. フォルダ構成 /public ├─ index.html ├─ manifest.webmanifest ├─ sw.js └─ icons/ ├─ icon-192.png └─ icon-512.png

2. index.html（最低限）

3. manifest.webmanifest { "name": "Quick PWA", "short_name": "QuickPWA", "start_url": "/", "scope": "/", "display": "standalone", "background_color": "#ffffff", "theme_color": "#0ea5e9", "icons": [ { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" }, { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" } ] }

役割: インストール可能化のメタ情報（アプリアイコン/表示モード/開始 URL など）

4. sw.js（最小のオフライン対応） // 役割: 必要ファイルをキャッシュしてオフライン配信 const CACHE_NAME = 'quick-pwa-v1'; const ASSETS = ['/', '/index.html', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => { event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))); self.skipWaiting(); });

self.addEventListener('activate', (event) => { event.waitUntil( caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))) ) ); self.clients.claim(); });

self.addEventListener('fetch', (event) => { const { request } = event; event.respondWith( caches.match(request).then((cached) => cached || fetch(request).then((res) => { // GET のみキャッシュ（POST 等は除外） if (request.method === 'GET' && res.ok) { const copy = res.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)); } return res; }).catch(() => caches.match('/index.html')) // ネット不通時のフォールバック ) ); });

5. デプロイ要件 Git → Vercel
