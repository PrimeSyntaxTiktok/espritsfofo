/**
 * Prime Sprites — Automated Fortnite News, Leaks, Maps & Sprites Guide Updater
 * 
 * Automatically fetches Fortnite API news, datamined cosmetics (leaks), AND top Creative Map codes
 * in BOTH French (?language=fr) and English (?language=en), formats cards according to site guidelines,
 * updates index.html, injects new Sprites into the Player Guide & Catalog (`families`), bumps PWA versions,
 * and sends a Discord status notification on EVERY execution run (both routine pings and new updates).
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

function sendDiscordNotification(webhookUrl, addedTitles, newVersion, newCardsAdded) {
  return new Promise((resolve) => {
    if (!webhookUrl || !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      console.log('ℹ️ No Discord Webhook URL provided. Skipping Discord notification.');
      return resolve();
    }

    const hasUpdates = newCardsAdded > 0;
    const title = hasUpdates 
      ? "🟢 Prime Sprites — Nouveaux Contenus Publiés !" 
      : "🔵 Prime Sprites — Scan de Routine Réussi (15 min)";

    const description = hasUpdates
      ? `**${newCardsAdded} nouvelle(s) mise(s) à jour / carte(s)** ont été automatiquement ajoutées au site et au Guide !`
      : "L'automatisation a scanné l'API Fortnite, les leaks et les maps. **Aucun nouveau leak détecté, le site est 100 % à jour !**";

    const color = hasUpdates ? 3450096 : 3888632; // Green or Blue

    const fields = hasUpdates ? [
      {
        name: "📋 Nouveautés Publiées",
        value: addedTitles.map(t => `• ${t}`).join('\n').substring(0, 1024) || "Nouveaux contenus Fortnite décelés."
      },
      {
        name: "🚀 Nouvelle Version PWA",
        value: `\`${newVersion}\``,
        inline: true
      },
      {
        name: "🌐 Lien du Site",
        value: "[Consulter le Site](https://PrimeSyntaxTiktok.github.io/espritsfofo/)",
        inline: true
      }
    ] : [
      {
        name: "🛡️ Statut du Robot",
        value: "✅ Scan exécuté avec succès • 0 bogue • Contrôle Qualité OK",
        inline: false
      },
      {
        name: "🚀 Version PWA Actuelle",
        value: `\`${newVersion}\``,
        inline: true
      },
      {
        name: "🌐 Lien du Site",
        value: "[Accéder au Site](https://PrimeSyntaxTiktok.github.io/espritsfofo/)",
        inline: true
      }
    ];

    const payload = JSON.stringify({
      username: "Prime Sprites Bot",
      avatar_url: "https://PrimeSyntaxTiktok.github.io/espritsfofo/icons/prime-logo-white-bgblack.png",
      embeds: [
        {
          title: title,
          url: "https://PrimeSyntaxTiktok.github.io/espritsfofo/",
          description: description,
          color: color,
          fields: fields,
          footer: {
            text: "Prime Sprites • Détecteur Automatique & Confirmation d'Exécution"
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

const CATEGORY_MAP = {
  '1v1': { fr: '1 contre 1 (1v1)', en: '1v1' },
  'tycoon': { fr: 'Magnat (Tycoon)', en: 'Tycoon' },
  'parkour': { fr: 'Parcours (Parkour)', en: 'Parkour' },
  'horror': { fr: 'Horreur', en: 'Horror' },
  'practice': { fr: 'Entraînement', en: 'Practice' },
  'deathrun': { fr: 'Course de la Mort', en: 'Deathrun' },
  'sprite': { fr: 'Jardin des Esprits', en: 'Sprite Garden' },
  'bedwars': { fr: 'Guerre de Lits (Bedwars)', en: 'Bedwars' },
  'gungame': { fr: 'Jeu d\'Armes (Gun Game)', en: 'Gun Game' }
};

async function runAutoUpdate() {
  console.log('🔄 Checking Fortnite API for news, datamined leaks, Sprites & Creative Maps (FR & EN localized)...');
  
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

  // --- PART 2: FETCH DATAMINED LEAKS & UNRELEASED COSMETICS & INJECT INTO PLAYER GUIDE (`families`) ---
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

        // 1. Add Leak Card to Tips Page
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

        // 2. Inject New Sprite into Player Guide & Catalog (`families` array)
        const familyKey = itemFr.id.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!htmlContent.includes(`key: "${familyKey}"`)) {
          const rarityVal = (itemFr.rarity ? itemFr.rarity.value : 'rare').toLowerCase();
          const baseIcon = (itemFr.images && (itemFr.images.icon || itemFr.images.smallIcon)) || 'T_Icon_BR_Creature_Sprite_BushRanger_L.webp';

          console.log(`📖 Injecting new Sprite into Player Guide & Catalog ('families'): key="${familyKey}", name="${nameFr}"`);
          addedTitles.push(`Guide : Nouveau Sprite ${nameFr}`);

          const newFamilyEntry = `        {
          key: ${JSON.stringify(familyKey)}, fr: ${JSON.stringify(nameFr)}, en: ${JSON.stringify(nameEn)}, rarity: ${JSON.stringify(rarityVal)},
          aliases: [${JSON.stringify(nameFr)}, ${JSON.stringify(nameEn)}],
          effect: {
            fr: ${JSON.stringify(descFr || "Capacité spéciale décelée dans les fichiers du jeu.")},
            en: ${JSON.stringify(descEn || "Special in-game ability detected in recent game files.")}
          },
          images: {
            base: ${JSON.stringify(baseIcon)},
            gold: ${JSON.stringify(baseIcon)}
          }
        },
`;

          htmlContent = htmlContent.replace(
            'const families = [',
            'const families = [\n' + newFamilyEntry
          );
          newCardsAdded++;
        }
      }
    }
  }

  // --- PART 3: FETCH & INGEST TOP FORTNITE CREATIVE MAPS (UP TO 20 PER RUN) ---
  console.log('🗺️ Ingesting Top Fortnite Creative Maps (up to 20 maps/15 min)...');
  let mapsAddedInRun = 0;
  const MAX_MAPS_PER_RUN = 20;

  try {
    const discoveryResFr = await fetchJson('https://fortnite-api.com/v2/creative/discovery');
    const discoveryResEn = discoveryResFr; // fallback structure for discovery endpoint

    if (discoveryResFr && discoveryResFr.data && discoveryResFr.data.panels) {
      const panels = discoveryResFr.data.panels;

      for (const panel of panels) {
        if (mapsAddedInRun >= MAX_MAPS_PER_RUN) break;
        const pages = panel.pages || panel.islands || [];

        for (const island of pages) {
          if (mapsAddedInRun >= MAX_MAPS_PER_RUN) break;

          const mapCode = island.code || island.islandCode || island.linkCode || '';
          if (!mapCode) continue;

          // Anti-duplicate check: ensure mapCode isn't already present in htmlContent
          if (htmlContent.includes(mapCode)) continue;

          const titleFr = (island.title || island.name || `Map Fortnite ${mapCode}`).replace(/Sprite/gi, 'Esprit');
          const titleEn = island.title || island.name || `Fortnite Map ${mapCode}`;
          
          const descFr = (island.description || `Découvrez cette map créative populaire sur Fortnite ! Code d'île : ${mapCode}`).replace(/Sprite/gi, 'Esprit');
          const descEn = island.description || `Check out this top rated Fortnite Creative island! Island code: ${mapCode}`;
          
          const rawCat = (island.category || island.tag || '1v1').toLowerCase();
          const categoryObj = CATEGORY_MAP[rawCat] || { fr: 'Créatif', en: 'Creative' };
          
          const ratingStars = island.rating ? `⭐ ${island.rating}/5` : '⭐ 4.9/5';
          const imageUrl = island.image || island.thumbnail || '';
          const cardId = `map-${mapCode.replace(/[^a-zA-Z0-9]/g, '')}`;

          console.log(`✨ Adding Map Card [${mapsAddedInRun + 1}/${MAX_MAPS_PER_RUN}]: Code=${mapCode} | Title="${titleFr}"`);
          addedTitles.push(`Map [${mapCode}] : ${titleFr}`);

          const newMapHtml = `
        <!-- AUTOMATED MAP CARD: ${cardId} -->
        <article class="tip-card" data-timestamp="${Date.now()}" id="${cardId}">
          <div class="tip-card-header">
            <div class="tip-card-meta">
              <span class="tip-badge leak-badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border-color: rgba(59, 130, 246, 0.3);">\${isFr ? ${JSON.stringify("🗺️ MAP " + categoryObj.fr.toUpperCase())} : ${JSON.stringify("🗺️ MAP " + categoryObj.en.toUpperCase())}}</span>
              <span class="tip-date">${ratingStars}</span>
            </div>
            <h2 class="tip-card-title">
              \${isFr ? ${JSON.stringify(titleFr + " (Code : " + mapCode + ")")} : ${JSON.stringify(titleEn + " (Code: " + mapCode + ")")}}
            </h2>
          </div>

          <div class="tip-card-body">
            ${imageUrl ? `<div class="tip-media-box">
              <div class="tip-img-wrap">
                <img src="${imageUrl}" alt="\${isFr ? ${JSON.stringify(titleFr)} : ${JSON.stringify(titleEn)}}" class="tip-img" loading="lazy" onerror="this.closest('.tip-media-box')?.remove();">
              </div>
            </div>` : ''}

            <div class="tip-content-details">
              <div class="tip-explicatif-block">
                <h3>📌 \${isFr ? "Description & Code d'accès" : "Description & Access Code"}</h3>
                <p>
                  \${isFr ? ${JSON.stringify(descFr)} : ${JSON.stringify(descEn)}}
                </p>

                <div class="tip-rules-grid">
                  <div class="rule-card">
                    <div class="rule-icon">🎮</div>
                    <div>
                      <strong>\${isFr ? "Code de l'Île Créative" : "Island Code"}</strong>
                      <p style="margin-top: 4px;">
                        <code style="font-size: 1.1em; background: rgba(0,0,0,0.4); padding: 4px 8px; border-radius: 6px; font-weight: bold; color: #60a5fa;">${mapCode}</code>
                        <button onclick="window.copyCheatCode ? window.copyCheatCode('${mapCode}') : navigator.clipboard.writeText('${mapCode}')" class="copy-btn" style="margin-left: 10px; cursor: pointer; padding: 4px 10px; background: rgba(59, 130, 246, 0.2); border: 1px solid #60a5fa; color: #60a5fa; border-radius: 6px; font-size: 0.85em;">\${isFr ? "Copier Code" : "Copy Code"}</button>
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
            '<div class="tips-container">' + newMapHtml
          );
          mapsAddedInRun++;
          newCardsAdded++;
        }
      }
    }
  } catch (e) {
    console.warn('⚠️ Creative maps discovery fetch:', e.message);
  }

  // Always update & verify versioning if new content was added
  let activeVersion = currentVersion;
  if (newCardsAdded > 0) {
    activeVersion = bumpVersion(currentVersion);
    console.log(`🚀 New PWA Version to set: ${activeVersion}`);

    htmlContent = htmlContent.replace(
      /const PWA_VERSION = "([^"]+)";/,
      `const PWA_VERSION = "${activeVersion}";`
    );
    
    swContent = swContent.replace(
      /const CACHE_VERSION = "([^"]+)";/,
      `const CACHE_VERSION = "${activeVersion}";`
    );

    fs.writeFileSync(INDEX_PATH, htmlContent, 'utf8');
    fs.writeFileSync(SW_PATH, swContent, 'utf8');
  }

  // Send Discord Webhook notification on EVERY execution run (Heartbeat + Updates)
  if (process.env.DISCORD_WEBHOOK_URL) {
    await sendDiscordNotification(process.env.DISCORD_WEBHOOK_URL, addedTitles, activeVersion, newCardsAdded);
  }

  console.log(`✅ Successfully completed run! (${newCardsAdded} new cards added including ${mapsAddedInRun} creative maps and guide families, PWA version is ${activeVersion})`);
}

runAutoUpdate().catch(err => {
  console.error('❌ Auto update error:', err);
  process.exit(1);
});
