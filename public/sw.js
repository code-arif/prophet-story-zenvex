/* Prophet Stories — offline service worker
 *
 * Best-effort offline support using the Cache API:
 *  - /build/ assets are cached first (immutable, fingerprinted) once seen;
 *  - visited pages are cached so recently opened routes survive offline;
 *  - audio responses are cached on the fly so a chapter listened to once
 *    can be replayed offline;
 *  - "Download for Offline" (per Prophet) pre-warms the pack cache with the
 *    Prophet's chapter pages + narrations.
 *
 * The app still functions fully online without this worker.
 */
const SHELL_CACHE = 'ps-shell-v1';
const PACK_CACHE = 'ps-offline-v1';
const MAX_SHELL_PAGES = 25;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => (k.startsWith('ps-shell-') || k.startsWith('ps-offline-')) && k !== SHELL_CACHE && k !== PACK_CACHE)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Immutable fingerprinted build assets: cache-first.
  if (url.pathname.startsWith('/build/')) {
    event.respondWith(cacheFirst(req, SHELL_CACHE));
    return;
  }

  // Page navigations: network first, fall back to the offline pack, then to
  // any previously visited page, then to the root shell.
  if (req.mode === 'navigate') {
    event.respondWith(
      networkFirst(req, {
        storeIn: SHELL_CACHE,
        trim: MAX_SHELL_PAGES,
        fallbackPacks: [PACK_CACHE],
        fallbackUrl: '/',
      })
    );
    return;
  }

  // Chapter data, audio, images: network first, fall back to the offline pack.
  event.respondWith(
    networkFirst(req, {
      storeAudioIn: PACK_CACHE,
      fallbackPacks: [PACK_CACHE, SHELL_CACHE],
    })
  );
});

async function openCache(name) {
  return name ? caches.open(name) : Promise.resolve(null);
}

async function cacheFirst(req, cacheName) {
  const cache = await openCache(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res && res.ok) await cache.put(req, res.clone());
    return res;
  } catch (e) {
    return hit || Response.error();
  }
}

async function networkFirst(req, { storeIn, trim, storeAudioIn, fallbackPacks = [], fallbackUrl }) {
  const store = await openCache(storeIn);
  const audio = await openCache(storeAudioIn);
  const extras = await Promise.all(fallbackPacks.map(openCache));
  const pools = [audio, store, ...extras].filter(Boolean);

  try {
    const res = await fetch(req);
    if (res && res.ok) {
      const type = (res.headers.get('Content-Type') || '').toLowerCase();
      if (store && type.startsWith('text/html')) {
        await store.put(req, res.clone());
        if (trim) await trimCache(store, trim);
      } else if (audio && type.startsWith('audio/') && res.status === 200 && !res.headers.has('Content-Range')) {
        // Remember narrations (full 200 responses only, not 206 range
        // fragments) so repeat listening works offline.
        await audio.put(req, res.clone());
      }
    }
    return res;
  } catch (e) {
    for (const c of pools) {
      const hit = await c.match(req);
      if (hit) return hit;
    }
    if (fallbackUrl) {
      for (const c of pools) {
        const hit = await c.match(fallbackUrl);
        if (hit) return hit;
      }
    }
    return Response.error();
  }
}

async function trimCache(cache, max) {
  try {
    const keys = await cache.keys();
    if (keys.length <= max) return;
    for (let i = 0; i < keys.length - max; i += 1) {
      await cache.delete(keys[i]);
    }
  } catch (e) {
    /* ignore */
  }
}