// Service worker: gjør at selve appen åpner uten nett.
// Øk versjonsnummeret når du legger ut nye filer.
const CACHE = 'handleliste-v6';
const SHELL = [
  './', './index.html', './style.css', './app.js', './varer.js', './kassal.js', './db-firebase.js', './db-local.js',
  './firebase-config.js', './manifest.webmanifest', './icons/icon.svg', './icons/icon-192.png', './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === location.origin;
  const cacheable = same || /(^|\.)(gstatic\.com|googleapis\.com)$/.test(url.hostname) && !url.hostname.startsWith('firestore');
  if (!cacheable || url.pathname.includes('/google.firestore')) return;
  // hent fra nett, fall tilbake på lagret kopi
  e.respondWith(
    fetch(req).then((res) => {
      if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: same }).then((r) => r || (req.mode === 'navigate' ? caches.match('./index.html') : undefined)))
  );
});
