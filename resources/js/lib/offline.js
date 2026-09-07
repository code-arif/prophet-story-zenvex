/**
 * Offline support — per-Prophet packs via the Cache API.
 *
 * The service worker (public/sw.js) serves cached content when the network
 * is unavailable. Downloading a Prophet pre-warms the pack cache with every
 * chapter page (Standard + Kid HTML documents, which embed the full content)
 * and its narration audio, so a downloaded story can be re-read and replayed
 * offline. The download state is tracked in localStorage for the UI.
 *
 * Best-effort: the app works fully online without ever using this.
 */
export const PACK_CACHE = 'ps-offline-v1';
const PACKS_KEY = 'ps.offline.packs';

export function offlineSupported() {
  return typeof window !== 'undefined' && typeof caches !== 'undefined';
}

function readPacks() {
  try {
    return JSON.parse(localStorage.getItem(PACKS_KEY)) || {};
  } catch {
    return {}; // Corrupt/absent registry — start fresh.
  }
}

function writePacks(packs) {
  try {
    localStorage.setItem(PACKS_KEY, JSON.stringify(packs));
  } catch {
    // Persist is best-effort only.
  }
}

export function getOfflinePacks() {
  return readPacks();
}

export function isProphetOffline(prophetId) {
  return Boolean(readPacks()[prophetId]);
}

/**
 * Chapter URLs that make up a Prophet's offline pack.
 *
 * @param {{ id: number, audio_url: ?string }[]} chapters
 */
export function packUrlsForProphet(chapters) {
  const urls = [];
  (chapters || []).forEach((ch) => {
    urls.push(`/read/${ch.id}`, `/read/${ch.id}/kid`);
    if (ch.audio_url) urls.push(ch.audio_url);
  });
  return urls;
}

/**
 * Fetch + store the Prophet's chapter pages and narrations in the pack cache.
 *
 * @param {{ prophetId: number, prophetName: string, chapters: array, onProgress?: (saved:number,total:number)=>void }} options
 * @returns {Promise<number>} number of URLs successfully cached
 */
export async function downloadProphetOffline({ prophetId, prophetName, chapters, onProgress }) {
  if (!offlineSupported()) {
    throw new Error('Offline download is not supported in this browser.');
  }

  const urls = packUrlsForProphet(chapters);
  if (urls.length === 0) {
    throw new Error('No chapters to download.');
  }

  const cache = await caches.open(PACK_CACHE);
  let saved = 0;

  // Sequential-ish concurrency (3 at a time) to be gentle on the network.
  const queue = [...urls];
  async function worker() {
    while (queue.length > 0) {
      const url = queue.shift();
      try {
        const res = await fetch(url, { credentials: 'same-origin' });
        if (res && res.ok) {
          await cache.put(url, res);
          saved += 1;
          onProgress?.(saved, urls.length);
        }
      } catch {
        // Keep going — cache what we can.
      }
    }
  }
  await Promise.all([worker(), worker(), worker()]);

  if (saved === 0) {
    throw new Error('Could not download the chapters. Please check your connection and try again.');
  }

  const packs = readPacks();
  packs[prophetId] = {
    prophetName,
    downloadedAt: new Date().toISOString(),
    urls: urls.length,
    saved,
  };
  writePacks(packs);
  return saved;
}

/**
 * Remove a Prophet's offline pack (cache entries + registry record).
 *
 * @param {{ prophetId: number, chapters: array }} options
 */
export async function removeProphetOffline({ prophetId, chapters }) {
  if (!offlineSupported()) return;

  const urls = packUrlsForProphet(chapters);
  const cache = await caches.open(PACK_CACHE);
  await Promise.all(urls.map((u) => cache.delete(u).catch(() => false)));

  const packs = readPacks();
  delete packs[prophetId];
  writePacks(packs);
}