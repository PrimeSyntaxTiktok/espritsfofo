"use strict";

const CACHE_VERSION = "2026-08-23-v11.45.0-v4200-textures";
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
  "./icons/prime-logo-white-transparent.png",
  "./icons/prime-logo-black-transparent.png",
  "./share-card.jpg",
  "./share-card.svg",
  "./bg-desktop.jpg",
  "./bg-mobile.jpg"
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
  return (url.hostname === "fortnite.gg" && /\/sprites\/icons\//.test(url.pathname))
    || url.hostname === "static.wikia.nocookie.net";
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
  const noCorsImage = !sameOrigin && (url.hostname === "fortnite.gg" || url.hostname === "static.wikia.nocookie.net" || /\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(url.pathname));
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

async function injectPrimeSpritesRuntimePatch(response) {
  if (!response || !response.ok || response.type === "opaque") return response;
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  try {
    const html = await response.text();
    if (html.includes('id="prime-tips-mobile-fix"')) {
      return new Response(html, { status: response.status, statusText: response.statusText, headers: response.headers });
    }

    const patch = `
<style id="prime-tips-mobile-fix">
@media (max-width: 700px) {
  #tipsPage { padding-inline: 0 !important; }
  #tipsPage .tips-container { gap: 10px !important; }
  #tipsPage .daily-card-folder {
    border-radius: 14px !important;
    box-shadow: 0 8px 22px rgba(0,0,0,.28) !important;
  }
  #tipsPage .daily-card-header {
    padding: 12px !important;
    gap: 10px !important;
    align-items: flex-start !important;
  }
  #tipsPage .daily-card-header-main {
    flex: 1 1 auto !important;
    min-width: 0 !important;
  }
  #tipsPage .daily-date-badge {
    padding: 6px 9px !important;
    font-size: .68rem !important;
    letter-spacing: .04em !important;
  }
  #tipsPage .daily-card-title {
    margin: 8px 0 9px !important;
    font-size: 1.28rem !important;
    line-height: 1.02 !important;
    letter-spacing: -.025em !important;
  }
  #tipsPage .daily-card-meta-pills {
    gap: 6px !important;
    flex-wrap: nowrap !important;
  }
  #tipsPage .daily-pill {
    max-width: 100% !important;
    padding: 6px 8px !important;
    font-size: .62rem !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  #tipsPage .daily-pill.highlight-pill { display: none !important; }
  #tipsPage .daily-toggle-btn {
    flex: 0 0 42px !important;
    width: 42px !important;
    height: 42px !important;
    border-radius: 13px !important;
  }
  #tipsPage .daily-card-content { padding: 10px !important; }
  #tipsPage .tip-card {
    padding: 14px !important;
    border-radius: 14px !important;
    box-shadow: 0 8px 20px rgba(0,0,0,.25) !important;
  }
  #tipsPage .tip-card-header {
    gap: 8px !important;
    margin-bottom: 10px !important;
  }
  #tipsPage .tip-card-meta {
    gap: 6px !important;
    margin-bottom: 7px !important;
  }
  #tipsPage .tip-badge {
    max-width: 100% !important;
    padding: 6px 8px !important;
    font-size: .6rem !important;
    line-height: 1.15 !important;
    white-space: normal !important;
  }
  #tipsPage .tip-date { font-size: .64rem !important; }
  #tipsPage .tip-card-title {
    font-size: 1.12rem !important;
    line-height: 1.07 !important;
    letter-spacing: -.015em !important;
  }
  #tipsPage .tip-card-body { gap: 10px !important; }
  #tipsPage .tip-card-body p { font-size: .88rem !important; line-height: 1.5 !important; }
  #tipsPage .tip-media-box { margin-block: 2px !important; }
  #tipsPage .tip-img-wrap { max-height: 220px !important; overflow: hidden !important; }
}
</style>
<script id="prime-autofofo-test-runtime">
(() => {
  const TEST_SELECTOR = '[data-autofofo-test="true"]';
  let queued = false;

  function ensureTestCard() {
    const page = document.getElementById('tipsPage');
    if (!page || page.querySelector(TEST_SELECTOR)) return;

    const firstFolder = page.querySelector('.daily-card-folder');
    const container = firstFolder?.querySelector('.daily-card-content .tips-container') || page.querySelector('.tips-container');
    if (!container) return;

    const card = document.createElement('article');
    card.className = 'tip-card featured-leak';
    card.setAttribute('data-autofofo-test', 'true');
    card.style.borderColor = 'rgba(61,230,239,.58)';
    card.style.background = 'linear-gradient(145deg, rgba(13,35,55,.92), rgba(9,18,37,.98))';
    card.innerHTML = `
      <div class="tip-card-header">
        <div class="tip-card-meta">
          <span class="tip-badge leak-badge" style="background:rgba(61,230,239,.14);color:#3de6ef;border-color:rgba(61,230,239,.35);">TEST AUTOMATISATION</span>
          <span class="tip-date">Publié le 23/08/2026 à 19:11</span>
        </div>
        <h2 class="tip-card-title">Test Autofofo — publication GitHub réussie</h2>
      </div>
      <div class="tip-card-body">
        <p style="margin:0;color:var(--muted);">Message de test technique ajouté automatiquement depuis GitHub. Ce contenu n’est pas un leak Fortnite.</p>
      </div>`;

    container.prepend(card);
    if (firstFolder) firstFolder.classList.add('is-open');
  }

  function scheduleEnsure() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      ensureTestCard();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleEnsure, { once: true });
  } else {
    scheduleEnsure();
  }

  window.addEventListener('hashchange', scheduleEnsure);
  const observer = new MutationObserver(scheduleEnsure);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
</script>`;

    const modified = html.includes("</head>")
      ? html.replace("</head>", patch + "\n</head>")
      : patch + html;

    const headers = new Headers(response.headers);
    headers.delete("content-length");
    return new Response(modified, { status: response.status, statusText: response.statusText, headers });
  } catch (_) {
    return response;
  }
}

async function serveNavigation(event) {
  const shellCache = await caches.open(SHELL_CACHE);
  try {
    const preload = await event.preloadResponse;
    const response = preload || await fetch(event.request);
    if (isCacheableResponse(response)) {
      await shellCache.put(INDEX_URL, response.clone());
    }
    return await injectPrimeSpritesRuntimePatch(response);
  } catch (_) {
    const cached = await shellCache.match(INDEX_URL, { ignoreSearch: true, ignoreVary: true })
      || await shellCache.match(new URL("./", SCOPE_URL).href, { ignoreSearch: true, ignoreVary: true });
    if (cached) return await injectPrimeSpritesRuntimePatch(cached);
    return new Response("Sprite Locker n’est pas disponible hors connexion. Veuillez vous connecter une première fois à Internet.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }
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
