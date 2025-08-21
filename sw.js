// 役割: 必要ファイルをキャッシュしてオフライン配信
const CACHE_NAME = 'character-create-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.webmanifest',
    './assets/Wizard_OldMan_Front_Pixel.png',
    './icons/CharacterCreate_Logo_192x192.png',
    './icons/CharacterCreate_Logo_512x512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    event.respondWith(
        caches.match(request).then((cached) =>
            cached || fetch(request).then((res) => {
                // GET のみキャッシュ（POST 等は除外）
                if (request.method === 'GET' && res.ok) {
                    const copy = res.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                }
                return res;
            }).catch(() => caches.match('./index.html')) // ネット不通時のフォールバック
        )
    );
});