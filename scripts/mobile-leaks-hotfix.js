"use strict";

const fs = require("fs");
const path = require("path");

const indexPath = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(indexPath, "utf8");

const HOTFIX_START = "<!-- AUTOFOFO_MOBILE_HOTFIX_START -->";
const HOTFIX_END = "<!-- AUTOFOFO_MOBILE_HOTFIX_END -->";

const hotfix = `${HOTFIX_START}
<style id="autofofo-mobile-leaks-hotfix">
  @media (max-width: 700px) {
    #tipsPage .daily-card-folder { border-radius: 14px !important; }
    #tipsPage .daily-card-header { padding: 12px 14px !important; gap: 10px !important; align-items: flex-start !important; }
    #tipsPage .daily-card-header-main { min-width: 0 !important; width: 100% !important; }
    #tipsPage .daily-date-badge { font-size: .68rem !important; padding: 6px 9px !important; }
    #tipsPage .daily-card-title { font-size: clamp(1.18rem, 6vw, 1.55rem) !important; line-height: 1.02 !important; margin: 8px 0 10px !important; }
    #tipsPage .daily-card-meta-pills { gap: 6px !important; }
    #tipsPage .daily-pill { font-size: .62rem !important; padding: 5px 8px !important; line-height: 1.15 !important; }
    #tipsPage .daily-pill.highlight-pill { display: none !important; }
    #tipsPage .daily-toggle-btn { flex: 0 0 44px !important; width: 44px !important; height: 44px !important; min-height: 44px !important; border-radius: 13px !important; }
    #tipsPage .daily-card-content { padding: 10px !important; }
    #tipsPage .tips-container { gap: 10px !important; }
    #tipsPage .tip-card { padding: 14px !important; border-radius: 15px !important; }
    #tipsPage .tip-card-header { margin-bottom: 10px !important; }
    #tipsPage .tip-card-meta { gap: 6px !important; margin-bottom: 8px !important; }
    #tipsPage .tip-badge { font-size: .58rem !important; padding: 6px 8px !important; line-height: 1.15 !important; max-width: 100% !important; }
    #tipsPage .tip-date { font-size: .62rem !important; padding: 5px 7px !important; }
    #tipsPage .tip-card-title { font-size: clamp(1.05rem, 5.2vw, 1.32rem) !important; line-height: 1.06 !important; }
    #tipsPage .tip-card-body { gap: 10px !important; }
    #tipsPage .tip-explicatif-block { padding: 12px !important; }
    #tipsPage .tip-explicatif-block h3 { font-size: .9rem !important; line-height: 1.15 !important; }
    #tipsPage .tip-explicatif-block p { font-size: .82rem !important; line-height: 1.48 !important; }
    #tipsPage .tip-media-box { margin: 0 !important; }
    #tipsPage .tip-img-wrap { max-height: 210px !important; overflow: hidden !important; border-radius: 12px !important; }
    #tipsPage .tip-img { max-height: 210px !important; object-fit: contain !important; }
  }

  #autofofo-v4200-textures-card {
    border: 1px solid rgba(61,230,239,.55) !important;
    background: linear-gradient(145deg, rgba(8,35,48,.94), rgba(9,18,38,.97)) !important;
    box-shadow: 0 12px 30px rgba(0,0,0,.28), 0 0 18px rgba(61,230,239,.1) !important;
  }
</style>
<script id="autofofo-v4200-textures-runtime">
(() => {
  const TEST_ID = "autofofo-v4200-textures-card";
  const cardMarkup = () => {
    const article = document.createElement("article");
    article.id = TEST_ID;
    article.className = "tip-card featured-leak";
    article.dataset.timestamp = String(new Date("2026-08-23T20:39:00+02:00").getTime());
    article.innerHTML = \`
      <div class="tip-card-header">
        <div class="tip-card-meta">
          <span class="tip-badge leak-badge" style="background:rgba(61,230,239,.14);color:#3de6ef;border-color:rgba(61,230,239,.35);">DATAMINING · ASSETS</span>
          <span class="tip-date">Publié le 23/08/2026 à 20:39</span>
        </div>
        <h2 class="tip-card-title">Six variantes inédites reçoivent de nouvelles textures en v42.00</h2>
      </div>
      <div class="tip-card-body">
        <div class="tip-explicatif-block">
          <h3>Textures ajoutées dans Fortnite: Override</h3>
          <p>Des fichiers de la v42.00 contiennent de nouvelles textures pour six variantes qui n’avaient pas été publiées pendant la Saison 3 :</p>
          <ul>
            <li><strong>Cube :</strong> Canard, Roi et Démon</li>
            <li><strong>Holofoil :</strong> Punk et Démon</li>
            <li><strong>Gemme :</strong> Roi</li>
          </ul>
          <p><strong>Statut :</strong> dataminé. Les textures sont présentes dans les fichiers, mais cela ne confirme ni leur activation dans le catalogue live, ni leur méthode d’obtention, ni une date de sortie.</p>
          <p><strong>Source :</strong> <a href="https://x.com/FireMonkey/status/2091548468602913126" target="_blank" rel="noopener noreferrer">FireMonkey — publication du 23 août 2026</a>.</p>
        </div>
      </div>\`;
    return article;
  };

  function ensureTestCard() {
    const page = document.getElementById("tipsPage");
    if (!page || document.getElementById(TEST_ID)) return;

    const firstFolder = page.querySelector(".daily-card-folder");
    if (firstFolder) {
      firstFolder.parentNode.insertBefore(cardMarkup(), firstFolder);
      return;
    }

    const container = page.querySelector(".tips-container");
    if (container) container.prepend(cardMarkup());
  }

  function run() {
    ensureTestCard();
    setTimeout(ensureTestCard, 150);
    setTimeout(ensureTestCard, 700);
    setTimeout(ensureTestCard, 1600);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, { once: true });
  else run();

  const observer = new MutationObserver(() => ensureTestCard());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("hashchange", run);
})();
</script>
${HOTFIX_END}`;

const existing = new RegExp(`${HOTFIX_START}[\\s\\S]*?${HOTFIX_END}`, "m");
if (existing.test(html)) {
  html = html.replace(existing, hotfix);
} else if (html.includes("</body>")) {
  html = html.replace("</body>", `${hotfix}\n</body>`);
} else {
  throw new Error("Impossible d'injecter le hotfix : </body> introuvable");
}

fs.writeFileSync(indexPath, html, "utf8");
console.log("Autofofo mobile leaks hotfix applied.");
