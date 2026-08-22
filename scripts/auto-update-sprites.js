/**
 * Prime Sprites — Automated Fortnite News & Sprites Updater
 * 
 * Automatically fetches Fortnite API news & cosmetics updates,
 * formats cards according to site guidelines (French "Esprit", no links/authors,
 * clean image error handling), updates index.html and bumps PWA versions.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const INDEX_PATH = path.join(__dirname, '..', 'index.html');
const SW_PATH = path.join(__dirname, '..', 'service-worker.js');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'PrimeSprites-PWA-Bot/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

function bumpVersion(versionStr) {
  // Format: 2026-08-22-v11.28.0 -> increment patch
  const match = versionStr.match(/^(\d{4}-\d{2}-\d{2}-v\d+\.\d+\.)(\d+)$/);
  if (match) {
    const today = new Date().toISOString().split('T')[0];
    const majorMinor = versionStr.match(/-v(\d+\.\d+)\./);
    const mm = majorMinor ? majorMinor[1] : '11.28';
    const nextPatch = parseInt(match[2], 10) + 1;
    return `${today}-v${mm}.${nextPatch}`;
  }
  const today = new Date().toISOString().split('T')[0];
  return `${today}-v11.29.0`;
}

async function runAutoUpdate() {
  console.log('🔄 Checking Fortnite API for new updates & Sprites...');
  
  let htmlContent = fs.readFileSync(INDEX_PATH, 'utf8');
  let swContent = fs.readFileSync(SW_PATH, 'utf8');

  // Extract current PWA version
  const pwaVersionMatch = htmlContent.match(/const PWA_VERSION = "([^"]+)";/);
  if (!pwaVersionMatch) {
    console.error('❌ Could not find PWA_VERSION in index.html');
    process.exit(1);
  }

  const currentVersion = pwaVersionMatch[1];
  console.log(`📌 Current PWA Version: ${currentVersion}`);

  // Fetch news from official Fortnite API endpoint
  let apiNews = null;
  try {
    apiNews = await fetchJson('https://fortnite-api.com/v2/news/br');
  } catch (e) {
    console.warn('⚠️ Could not fetch fortnite-api.com news (offline or rate limited):', e.message);
  }

  let newCardsAdded = 0;

  if (apiNews && apiNews.data && apiNews.data.motds) {
    const motds = apiNews.data.motds;
    console.log(`📰 Found ${motds.length} active MOTD news items from Fortnite API.`);
    
    for (const motd of motds) {
      const title = motd.title || '';
      const body = motd.body || '';
      const imageUrl = motd.image || '';
      
      // Filter for Sprite / Esprit related news or overrides
      if (title.toLowerCase().includes('sprite') || body.toLowerCase().includes('sprite') || 
          title.toLowerCase().includes('esprit') || body.toLowerCase().includes('esprit') ||
          title.toLowerCase().includes('override') || body.toLowerCase().includes('override')) {
        
        const timestamp = Date.now();
        const cardId = `motd-${motd.id || timestamp}`;
        
        if (!htmlContent.includes(cardId)) {
          console.log(`✨ Adding new Fortnite News Card: ${title}`);
          
          // Format title & body replacing Sprite with Esprit for French
          const titleFr = title.replace(/Sprite/gi, 'Esprit');
          const bodyFr = body.replace(/Sprite/gi, 'Esprit');
          
          const newCardHtml = `
        <!-- AUTOMATED NEWS CARD: ${cardId} -->
        <article class="tip-card" data-timestamp="${timestamp}" id="${cardId}">
          <div class="tip-card-header">
            <div class="tip-card-meta">
              <span class="tip-badge leak-badge" style="background: rgba(34, 197, 94, 0.15); color: #4ade80; border-color: rgba(34, 197, 94, 0.3);">\${isFr ? "🟢 ANNONCE FORTNITE OFFICIELLE" : "🟢 OFFICIAL FORTNITE NEWS"}</span>
              <span class="tip-date">\${formatLeakTimestamp(new Date().toISOString())}</span>
            </div>
            <h2 class="tip-card-title">
              \${isFr ? ${JSON.stringify(titleFr)} : ${JSON.stringify(title)}}
            </h2>
          </div>

          <div class="tip-card-body">
            ${imageUrl ? `<div class="tip-media-box">
              <div class="tip-img-wrap">
                <img src="${imageUrl}" alt="\${isFr ? "Annonce Fortnite" : "Fortnite Announcement"}" class="tip-img" loading="lazy" onerror="this.closest('.tip-media-box')?.remove();">
              </div>
            </div>` : ''}

            <div class="tip-content-details">
              <div class="tip-explicatif-block">
                <h3>📌 \${isFr ? "Détails de la mise à jour" : "Update Details"}</h3>
                <p>
                  \${isFr ? ${JSON.stringify(bodyFr)} : ${JSON.stringify(body)}}
                </p>
              </div>
            </div>
          </div>
        </article>
`;
          // Insert at the top of tips-container
          htmlContent = htmlContent.replace(
            '<div class="tips-container">',
            '<div class="tips-container">' + newCardHtml
          );
          newCardsAdded++;
        }
      }
    }
  }

  // Always update & verify versioning
  const newVersion = bumpVersion(currentVersion);
  console.log(`🚀 New PWA Version to set: ${newVersion}`);

  htmlContent = htmlContent.replace(
    /const PWA_VERSION = "([^"]+)";/,
    `const PWA_VERSION = "${newVersion}";`
  );
  
  swContent = swContent.replace(
    /const CACHE_VERSION = "([^"]+)";/,
    `const CACHE_VERSION = "${newVersion}";`
  );

  fs.writeFileSync(INDEX_PATH, htmlContent, 'utf8');
  fs.writeFileSync(SW_PATH, swContent, 'utf8');

  console.log(`✅ Successfully updated files! (${newCardsAdded} new cards added, PWA version set to ${newVersion})`);
}

runAutoUpdate().catch(err => {
  console.error('❌ Auto update error:', err);
  process.exit(1);
});
