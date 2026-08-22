/**
 * Prime Sprites — Automated Fortnite News, Leaks & Sprites Updater
 * 
 * Automatically fetches Fortnite API news AND newly datamined cosmetics (leaks)
 * in BOTH French (?language=fr) and English (?language=en), formats cards according to site guidelines,
 * updates index.html, bumps PWA versions, and notifies Discord.
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

function sendDiscordNotification(webhookUrl, addedTitles, newVersion) {
  return new Promise((resolve) => {
    if (!webhookUrl || !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      console.log('ℹ️ No Discord Webhook URL provided. Skipping Discord notification.');
      return resolve();
    }

    const payload = JSON.stringify({
      username: "Prime Sprites Bot",
      avatar_url: "https://PrimeSyntaxTiktok.github.io/espritsfofo/icons/prime-logo-white-bgblack.png",
      embeds: [
        {
          title: "🟠 Prime Sprites — Nouveaux Leaks / Esprits Détectés !",
          url: "https://PrimeSyntaxTiktok.github.io/espritsfofo/",
          description: `**${addedTitles.length} nouveau(x) leak(s) / actualité(s) d'Esprits** ont été automatiquement ajoutés au site !`,
          color: 16345634, // #f97316 orange
          fields: [
            {
              name: "📋 Nouveautés Publiées",
              value: addedTitles.map(t => `• ${t}`).join('\n').substring(0, 1024) || "Nouveaux éléments dataminés découverts."
            },
            {
              name: "🚀 Nouvelle Version PWA",
              value: `\`${newVersion}\``,
              inline: true
            },
            {
              name: "🌐 Lien du Site",
              value: "[Consulter les Leaks](https://PrimeSyntaxTiktok.github.io/espritsfofo/)",
              inline: true
            }
          ],
          footer: {
            text: "Prime Sprites • Détecteur Automatique de Leaks GitHub Actions"
          },
          timestamp: new Date().toISOString()
        }
      ]
    });

    const parsedUrl = new URL(webhookUrl);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      console.log(`📢 Discord Notification Status: ${res.statusCode}`);
      resolve();
    });

    req.on('error', (e) => {
      console.warn('⚠️ Discord Webhook Notification failed:', e.message);
      resolve();
    });

    req.write(payload);
    req.end();
  });
}

function bumpVersion(versionStr) {
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
  console.log('🔄 Checking Fortnite API for news & datamined leaks (FR & EN localized)...');
  
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

  let newCardsAdded = 0;
  const addedTitles = [];

  // --- PART 1: FETCH OFFICIAL NEWS ---
  let newsFr = null;
  let newsEn = null;
  try {
    newsFr = await fetchJson('https://fortnite-api.com/v2/news/br?language=fr');
    newsEn = await fetchJson('https://fortnite-api.com/v2/news/br?language=en');
  } catch (e) {
    console.warn('⚠️ Could not fetch fortnite-api.com news:', e.message);
  }

  if (newsFr && newsFr.data && newsFr.data.motds && newsEn && newsEn.data && newsEn.data.motds) {
    const motdsFr = newsFr.data.motds;
    const motdsEn = newsEn.data.motds;
    
    console.log(`📰 Found ${motdsFr.length} active MOTDs in French & English.`);
    
    for (let i = 0; i < motdsFr.length; i++) {
      const itemFr = motdsFr[i];
      const itemEn = motdsEn.find(m => m.id === itemFr.id) || motdsEn[i] || itemFr;

      const titleEn = itemEn.title || itemFr.title || '';
      const bodyEn = itemEn.body || itemFr.body || '';
      
      let titleFr = itemFr.title || itemEn.title || '';
      let bodyFr = itemFr.body || itemEn.body || '';
      titleFr = titleFr.replace(/Sprite/gi, 'Esprit');
      bodyFr = bodyFr.replace(/Sprite/gi, 'Esprit');
      
      const imageUrl = itemFr.image || itemEn.image || '';
      
      if (titleEn.toLowerCase().includes('sprite') || bodyEn.toLowerCase().includes('sprite') || 
          titleFr.toLowerCase().includes('esprit') || bodyFr.toLowerCase().includes('esprit') ||
          titleEn.toLowerCase().includes('override') || bodyEn.toLowerCase().includes('override')) {
        
        const timestamp = Date.now();
        const cardId = `motd-${itemFr.id || timestamp}`;
        
        if (!htmlContent.includes(cardId)) {
          console.log(`✨ Adding bilingual news card: FR="${titleFr}" | EN="${titleEn}"`);
          addedTitles.push(titleFr);
          
          const newCardHtml = `
        <!-- AUTOMATED BILINGUAL NEWS CARD: ${cardId} -->
        <article class="tip-card" data-timestamp="${timestamp}" id="${cardId}">
          <div class="tip-card-header">
            <div class="tip-card-meta">
              <span class="tip-badge leak-badge" style="background: rgba(34, 197, 94, 0.15); color: #4ade80; border-color: rgba(34, 197, 94, 0.3);">\${isFr ? "🟢 ANNONCE FORTNITE OFFICIELLE" : "🟢 OFFICIAL FORTNITE NEWS"}</span>
              <span class="tip-date">\${formatLeakTimestamp(new Date().toISOString())}</span>
            </div>
            <h2 class="tip-card-title">
              \${isFr ? ${JSON.stringify(titleFr)} : ${JSON.stringify(titleEn)}}
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
                <h3>📌 \${isFr ? "Détails officiels en jeu" : "Official In-Game Details"}</h3>
                <p>
                  \${isFr ? ${JSON.stringify(bodyFr)} : ${JSON.stringify(bodyEn)}}
                </p>
              </div>
            </div>
          </div>
        </article>
`;
          htmlContent = htmlContent.replace(
            '<div class="tips-container">',
            '<div class="tips-container">' + newCardHtml
          );
          newCardsAdded++;
        }
      }
    }
  }

  // --- PART 2: FETCH DATAMINED LEAKS & UNRELEASED COSMETICS ---
  let leaksFr = null;
  let leaksEn = null;
  try {
    leaksFr = await fetchJson('https://fortnite-api.com/v2/cosmetics/br/new?language=fr');
    leaksEn = await fetchJson('https://fortnite-api.com/v2/cosmetics/br/new?language=en');
  } catch (e) {
    console.warn('⚠️ Could not fetch fortnite-api.com new cosmetics leaks:', e.message);
  }

  if (leaksFr && leaksFr.data && leaksFr.data.items && leaksEn && leaksEn.data && leaksEn.data.items) {
    const itemsFr = leaksFr.data.items;
    const itemsEn = leaksEn.data.items;

    console.log(`📦 Found ${itemsFr.length} newly datamined cosmetics items.`);

    for (let i = 0; i < itemsFr.length; i++) {
      const itemFr = itemsFr[i];
      const itemEn = itemsEn.find(it => it.id === itemFr.id) || itemsFr[i];

      const nameEn = itemEn.name || itemFr.name || '';
      const descEn = itemEn.description || itemFr.description || '';
      
      let nameFr = itemFr.name || itemEn.name || '';
      let descFr = itemFr.description || itemEn.description || '';
      nameFr = nameFr.replace(/Sprite/gi, 'Esprit');
      descFr = descFr.replace(/Sprite/gi, 'Esprit');

      const isSpriteRelated = nameEn.toLowerCase().includes('sprite') || nameFr.toLowerCase().includes('esprit') ||
                              descEn.toLowerCase().includes('sprite') || descFr.toLowerCase().includes('esprit') ||
                              (itemFr.type && itemFr.type.value === 'sprite') ||
                              nameEn.toLowerCase().includes('override') || nameFr.toLowerCase().includes('override');

      if (isSpriteRelated) {
        const cardId = `leak-${itemFr.id}`;

        if (!htmlContent.includes(cardId)) {
          const timestamp = Date.now();
          const iconUrl = (itemFr.images && (itemFr.images.icon || itemFr.images.smallIcon)) || '';
          
          console.log(`✨ Adding Datamined Leak Card: FR="${nameFr}" | EN="${nameEn}"`);
          addedTitles.push(`Datamine : ${nameFr}`);

          const newLeakHtml = `
        <!-- AUTOMATED BILINGUAL LEAK CARD: ${cardId} -->
        <article class="tip-card featured-leak" data-timestamp="${timestamp}" id="${cardId}">
          <div class="tip-card-header">
            <div class="tip-card-meta">
              <span class="tip-badge leak-badge" style="background: rgba(249, 115, 22, 0.15); color: #fb923c; border-color: rgba(249, 115, 22, 0.3);">\${isFr ? "🟠 DATAMINE · SAISON 4" : "🟠 DATAMINE · SEASON 4"}</span>
              <span class="tip-date">\${formatLeakTimestamp(new Date().toISOString())}</span>
            </div>
            <h2 class="tip-card-title">
              \${isFr ? ${JSON.stringify(`Datamine : Nouvel Esprit / Asset Découvert (${nameFr})`)} : ${JSON.stringify(`Datamine: New Sprite / Asset Discovered (${nameEn})`)}}
            </h2>
          </div>

          <div class="tip-card-body">
            ${iconUrl ? `<div class="tip-media-box">
              <div class="tip-img-wrap">
                <img src="${iconUrl}" alt="\${isFr ? ${JSON.stringify(nameFr)} : ${JSON.stringify(nameEn)}}" class="tip-img" loading="lazy" onerror="this.closest('.tip-media-box')?.remove();">
              </div>
            </div>` : ''}

            <div class="tip-content-details">
              <div class="tip-explicatif-block">
                <h3>📌 \${isFr ? "Détails de l'élément dataminé dans les fichiers" : "Datamined Item Details"}</h3>
                <p>
                  \${isFr ? ${JSON.stringify(`Cet élément non encore activé a été décelé dans les fichiers récents du jeu. Description : ${descFr}`)} : ${JSON.stringify(`This unreleased item was detected in recent game files. Description: ${descEn}`)}}
                </p>

                <div class="tip-rules-grid">
                  <div class="rule-card">
                    <div class="rule-icon">⚙️</div>
                    <div>
                      <strong>\${isFr ? "Rareté & Statut" : "Rarity & Status"}</strong>
                      <p>
                        \${isFr ? ${JSON.stringify(`Rareté : ${itemFr.rarity ? itemFr.rarity.displayValue : 'Inconnue'} • Statut : Dataminé / Non publié.`)} : ${JSON.stringify(`Rarity: ${itemEn.rarity ? itemEn.rarity.displayValue : 'Unknown'} • Status: Datamined / Unreleased.`)}}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
`;
          htmlContent = htmlContent.replace(
            '<div class="tips-container">',
            '<div class="tips-container">' + newLeakHtml
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

  // If new cards were added, send Discord Webhook notification if configured
  if (newCardsAdded > 0 && process.env.DISCORD_WEBHOOK_URL) {
    await sendDiscordNotification(process.env.DISCORD_WEBHOOK_URL, addedTitles, newVersion);
  }

  console.log(`✅ Successfully updated files! (${newCardsAdded} new cards added, PWA version set to ${newVersion})`);
}

runAutoUpdate().catch(err => {
  console.error('❌ Auto update error:', err);
  process.exit(1);
});
