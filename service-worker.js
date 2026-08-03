"use strict";

const CACHE_VERSION = "2026-08-03-v2";
const CACHE_PREFIX = "sprite-locker-";
const SHELL_CACHE = `${CACHE_PREFIX}shell-${CACHE_VERSION}`;
const ASSET_CACHE = `${CACHE_PREFIX}assets-${CACHE_VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}runtime-${CACHE_VERSION}`;
const SCOPE_URL = new URL("./", self.location.href);
const INDEX_URL = new URL("./index.html", SCOPE_URL).href;
const OFFLINE_DOWNLOADS = new Map();

const SHELL_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./service-worker.js",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./share-card.jpg"
].map(path => new URL(path, SCOPE_URL).href);

const BYPASS_HOSTS = new Set([
  "firestore.googleapis.com",
  "identitytoolkit.googleapis.com",
  "securetoken.googleapis.com",
  "firebaseinstallations.googleapis.com"
]);

function isCacheableResponse(response) {
  return response && (response.ok || response.type === "opaque");
}

function isFortniteAsset(url) {
  return url.hostname === "fortnite.gg" && /\/sprites\/icons\//.test(url.pathname);
}

function isStaticRuntimeAsset(url, request) {
  if (request.destination === "image" || request.destination === "font" || request.destination === "style" || request.destination === "script") return true;
  return /\.(?:avif|gif|jpe?g|png|svg|webp|woff2?|css|js|webmanifest)$/i.test(url.pathname);
}

async function safeCachePut(cache, request, response) {
  if (!isCacheableResponse(response)) return false;
  try {
    await cache.put(request, response.clone());
    return true;
  } catch (_) {
    return false;
  }
}

async function fetchForOffline(rawUrl) {
  const url = new URL(rawUrl, SCOPE_URL);
  const sameOrigin = url.origin === self.location.origin;
  const noCorsImage = !sameOrigin && (url.hostname === "fortnite.gg" || /\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(url.pathname));
  const request = new Request(url.href, {
    mode: sameOrigin ? "same-origin" : (noCorsImage ? "no-cors" : "cors"),
    credentials: sameOrigin ? "same-origin" : "omit",
    cache: "reload"
  });
  const response = await fetch(request);
  return { request, response };
}

async function cacheShellFile(url) {
  const cache = await caches.open(SHELL_CACHE);
  const { request, response } = await fetchForOffline(url);
  if (!isCacheableResponse(response)) throw new Error(`Ressource indisponible : ${url}`);
  await cache.put(request, response.clone());
}

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    await Promise.allSettled(SHELL_FILES.map(cacheShellFile));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(CACHE_PREFIX) && ![SHELL_CACHE, ASSET_CACHE, RUNTIME_CACHE].includes(name)).map(name => caches.delete(name)));
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch (_) {}
    }
    await self.clients.claim();
  })());
});

async function updateInBackground(request, cacheName) {
  try {
    const response = await fetch(request);
    if (isCacheableResponse(response)) {
      const cache = await caches.open(cacheName);
      await safeCachePut(cache, request, response);
    }
    return response;
  } catch (_) {
    return null;
  }
}

async function serveNavigation(event) {
  const shellCache = await caches.open(SHELL_CACHE);
  const cached = await shellCache.match(INDEX_URL, { ignoreSearch: true, ignoreVary: true })
    || await shellCache.match(new URL("./", SCOPE_URL).href, { ignoreSearch: true, ignoreVary: true });
  const refresh = (async () => {
    try {
      const preload = await event.preloadResponse;
      const response = preload || await fetch(event.request);
      if (isCacheableResponse(response)) await shellCache.put(INDEX_URL, response.clone());
      return response;
    } catch (_) {
      return null;
    }
  })();
  event.waitUntil(refresh);
  return cached || await refresh || new Response("Sprite Locker n’est pas encore disponible hors connexion. Ouvre une première fois le site avec Internet.", {
    status: 503,
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request, { ignoreVary: true });
  if (cached) return cached;
  let download = OFFLINE_DOWNLOADS.get(request.url);
  if (!download) {
    download = (async () => {
      const response = await fetch(request);
      await safeCachePut(cache, request, response);
      return response;
    })().finally(() => OFFLINE_DOWNLOADS.delete(request.url));
    OFFLINE_DOWNLOADS.set(request.url, download);
  }
  return (await download).clone();
}

async function staleWhileRevalidate(event, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(event.request, { ignoreVary: true });
  const network = updateInBackground(event.request, cacheName);
  event.waitUntil(network);
  return cached || await network || Response.error();
}

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (BYPASS_HOSTS.has(url.hostname)) return;

  if (request.mode === "navigate") {
    event.respondWith(serveNavigation(event));
    return;
  }

  if (isFortniteAsset(url)) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(event, SHELL_CACHE));
    return;
  }

  if (isStaticRuntimeAsset(url, request)) {
    event.respondWith(staleWhileRevalidate(event, RUNTIME_CACHE));
  }
});

async function cacheOfflineAssets(urls, source) {
  const unique = [...new Set((urls || []).filter(Boolean))];
  const cache = await caches.open(ASSET_CACHE);
  let completed = 0;
  let failed = 0;
  let cursor = 0;
  const total = unique.length;

  const send = payload => {
    try { source?.postMessage(payload); } catch (_) {}
  };

  send({ type: "CACHE_PROGRESS", completed, failed, total, version: CACHE_VERSION });

  async function worker() {
    while (cursor < total) {
      const index = cursor++;
      const rawUrl = unique[index];
      try {
        const absoluteUrl = new URL(rawUrl, SCOPE_URL).href;
        const existing = await cache.match(absoluteUrl, { ignoreVary: true });
        if (!existing) {
          let download = OFFLINE_DOWNLOADS.get(absoluteUrl);
          if (!download) {
            download = (async () => {
              const { request, response } = await fetchForOffline(absoluteUrl);
              if (!isCacheableResponse(response)) throw new Error("Réponse non enregistrable");
              await cache.put(request, response.clone());
              return response;
            })().finally(() => OFFLINE_DOWNLOADS.delete(absoluteUrl));
            OFFLINE_DOWNLOADS.set(absoluteUrl, download);
          }
          await download;
        }
      } catch (_) {
        failed++;
      }
      completed++;
      if (completed === total || completed % 4 === 0) {
        send({ type: "CACHE_PROGRESS", completed, failed, total, version: CACHE_VERSION });
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(6, Math.max(1, total)) }, worker));
  send({ type: "CACHE_COMPLETE", completed, failed, total, version: CACHE_VERSION });
}

self.addEventListener("message", event => {
  if (event.data?.type === "CACHE_ASSETS") {
    event.waitUntil(cacheOfflineAssets(event.data.urls, event.source));
  }
  if (event.data?.type === "SKIP_WAITING") {
    event.waitUntil(self.skipWaiting());
  }
});
