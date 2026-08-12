
    (() => {
      "use strict";

      function createStarExplosion(x, y) {
        const reducedMotion = document.getElementById("reducedMotion");
        if (reducedMotion && reducedMotion.checked) return;
        const canvas = document.getElementById("vfxCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }
        
        const particles = [];
        const colors = ['#f7ed38', '#ffd700', '#ffffff', '#49efa0', '#ff007f', '#00e5ff'];
        
        for (let i = 0; i < 150; i++) {
          particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 60, // Énorme vitesse horizontale
            vy: (Math.random() - 0.5) * 60 - 10, // Énorme vitesse verticale vers le haut
            size: Math.random() * 8 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1,
            decay: Math.random() * 0.008 + 0.005, // Disparaît plus lentement
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.4
          });
        }
        
        function drawStar(cx, cy, spikes, outerRadius, innerRadius, color, rot) {
          let rot_step = Math.PI / spikes;
          let r_x = cx, r_y = cy, angle = rot;
          ctx.beginPath();
          for (let i = 0; i < spikes; i++) {
            r_x = cx + Math.cos(angle) * outerRadius;
            r_y = cy + Math.sin(angle) * outerRadius;
            ctx.lineTo(r_x, r_y);
            angle += rot_step;
            r_x = cx + Math.cos(angle) * innerRadius;
            r_y = cy + Math.sin(angle) * innerRadius;
            ctx.lineTo(r_x, r_y);
            angle += rot_step;
          }
          ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
          ctx.fill();
        }

        function animate() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          let stillAlive = false;
          particles.forEach(p => {
            if (p.life <= 0) return;
            stillAlive = true;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.35;
            p.life -= p.decay;
            p.rotation += p.rotSpeed;
            ctx.globalAlpha = Math.max(0, p.life);
            drawStar(p.x, p.y, 5, p.size * 2, p.size, p.color, p.rotation);
          });
          if (stillAlive) requestAnimationFrame(animate);
          else ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        animate();
      }


      const IMAGE_ROOT = "https://fortnite.gg/img/x/sprites/icons/";
      const STORAGE_KEY = "prime-fortnite-esprits-v41-20";
      const META_KEY = "prime-fortnite-esprits-v41-20-meta";
      const AUTH_REDIRECT_KEY = "prime-fortnite-google-redirect-pending";
      const VISITOR_DAY_KEY = "sprite-locker-visitor-day";
      const VISITOR_HOUR_KEY = "sprite-locker-visitor-hour";
      const VISITOR_LIFETIME_KEY = "sprite-locker-visitor-lifetime";
      const FIREBASE_SDK_VERSION = "12.16.0";
      const PATCH_RELEASED_AT = "2026-08-04T14:30:00+02:00";
      const PWA_VERSION = "2026-08-11-v7";
      const PWA_INSTALLED_KEY = "sprite-locker-pwa-installed-v1";
      const PWA_OFFLINE_READY_KEY = "sprite-locker-offline-ready-v1";
      let deferredInstallPrompt = null;
      let pwaInstallBannerDismissed = false;
      let offlineCacheStarted = false;
      let offlineRegistration = null;
      const FIREBASE_CONFIG = Object.freeze({
        apiKey: "AIzaSyD39GIbGoaZepVfNB1Qj33VLus_x-hR5Jg",
        authDomain: "budget-master-pro-27c23.firebaseapp.com",
        projectId: "budget-master-pro-27c23",
        storageBucket: "budget-master-pro-27c23.firebasestorage.app",
        messagingSenderId: "625395489880",
        appId: "1:625395489880:web:14d8a071d7573d93dafe2d",
        measurementId: "G-528WFJ7ZWN"
      });

      window.addEventListener("beforeinstallprompt", event => {
        event.preventDefault();
        deferredInstallPrompt = event;
        if (!isPwaInstalledOnThisDevice()) showPwaInstallBanner();
      });

      window.addEventListener("appinstalled", () => {
        markPwaInstalled();
        showToast("Sprite Locker est installé sur cet appareil.");
      });

      const browserLanguages = (Array.isArray(navigator.languages) && navigator.languages.length
        ? navigator.languages
        : [navigator.language || "en"]
      ).map(language => String(language || "").toLowerCase());
      const firstSupportedLanguage = browserLanguages.find(language => /^(fr|en)(-|$)/.test(language)) || "en";
      const APP_LANGUAGE = firstSupportedLanguage.startsWith("fr") ? "fr" : "en";
      const APP_LOCALE = APP_LANGUAGE === "fr" ? "fr-FR" : "en-US";

      const COPY = {
        fr: {
          title: "Sprite Locker — Collection Fortnite",
          description: "Suivi mobile des 109 versions d’esprits récupérables dans Fortnite Chapitre 7 Saison 3.",
          socialDescription: "Suis les 109 versions d’esprits Fortnite récupérables, leurs variantes et leur maîtrise.",
          socialImageAlt: "Logo F de Sprite Locker sur un fond Fortnite bleu et violet",
          navMain: "Navigation principale",
          brandHome: "Sprite Locker, accueil",
          brandSubtitle: "Collection Prime",
          quickAccess: "Accès rapides",
          progress: "Progression",
          locker: "Casier",
          season: "Chapitre 7 · Saison 3",
          heroEyebrow: "Collection officielle du joueur",
          heroTitleHtml: "Maîtrise ton <span>esprit</span>",
          heroCopy: "Rassemble chaque esprit, suis ta maîtrise et complète le casier ultime de la saison.",
          collectionInfo: "Informations sur la collection",
          families: "familles",
          versions: "versions",
          upToDate: "à jour",
          progressSection: "Progression de la collection",
          cloudLocker: "Casier cloud",
          firebaseSync: "Synchronisation Firebase",
          savedOnDevice: "Enregistré sur cet appareil",
          local: "Local",
          localOffline: "Local hors connexion",
          connect: "Connexion",
          signIn: "Connexion Google",
          syncNow: "Synchroniser",
          signOut: "Déconnexion",
          signOutAria: "Se déconnecter de Firebase",
          globalProgress: "Progression globale",
          seasonLocker: "Ton casier de saison",
          progressCopy: "Chaque version récupérée te rapproche du 100 %.",
          completed: "complété",
          collectionCompleted: "Collection complétée",
          ownedPlural: "Possédés",
          masteredPlural: "Maîtrisés",
          missingPlural: "Manquants",
          visitorCounterAria: "Compteur public de visiteurs",
          visitorCounterTitle: "Visiteurs",
          visitorCounterLoading: "Connexion au compteur…",
          visitorCounterLive: "Compteur public en direct",
          visitorCounterError: "Compteur temporairement indisponible",
          visitorsToday: "Aujourd’hui",
          visitorsTotal: "Total",
          lockerAnalysis: "Analyse du casier",
          progressByVariant: "Progression par variante",
          fiveCollections: "8 collections à compléter",
          variantCompleted: "Variante {variant} complétée",
          catalogNav: "Catalogue",
          patchNotesNav: "Patch Notes",
          patchKicker: "Mise à jour v41.35",
          patchTitleHtml: "Nouvelle interface <span>Catalogue &amp; Guide</span>",
          patchLead: "La collection s’enrichit d’une toute nouvelle interface par cartes interactives et d’une meilleure expérience sur mobile et PC.",
          parisTime: "heure de Paris",
          patchSummaryAria: "Résumé de la mise à jour",
          patchMetricTotal: "Versions récupérables",
          patchMetricAdded: "Nouveaux ajouts",
          patchMetricFamilies: "Familles d’esprits",
          patchNewTitle: "Nouvelle Interface (Cartes &amp; Slide)",
          patchNewJohn: "Chaque esprit possède désormais sa propre carte dédiée.",
          patchNewLlama: "Fais glisser de gauche à droite sur la carte pour voir toutes ses variantes.",
          patchNewPeely: "Vue claire sur la maîtrise, le nombre de variantes et la progression.",
          patchVariantsTitle: "Correctifs &amp; Navigation PC",
          patchVariantsQuack: "Repositionnement des flèches de défilement (‹ ›) dans l’en-tête de carte.",
          patchVariantsZero: "Résolution du chevauchement avec le texte du nombre de variantes sur PC.",
          patchVariantsRare: "Navigation fluide et lisibilité optimale sur tous les écrans.",
          patchAppTitle: "Améliorations PWA",
          patchAppLevels: "Installation automatique instantanée sur tous les navigateurs compatibles.",
          patchAppData: "Affichage du logo garanti dans la bannière d’installation.",
          patchAppFilters: "Guide interactif d’installation étape par étape pour Safari sur iOS.",
          patchNoticeTitle: "Contenu encore non sorti",
          patchNoticeCopy: "Ironmouse et les variantes Gemme encore signalées comme non sorties ne sont pas ajoutés au total : ils rejoindront le catalogue dès leur disponibilité officielle.",
          patchCatalogButton: "Voir le catalogue",
          catalogTitle: "Tous les esprits",
          spiritLocker: "Le casier des esprits",
          shown: "affichés",
          fullCatalog: "Variantes sorties vérifiées",
          filtersActive: "Filtres actifs",
          searchAndFilters: "Recherche et filtres",
          searchPlaceholder: "Rechercher un esprit…",
          searchAria: "Rechercher un esprit",
          backupOptions: "Sauvegarde et options",
          collectionStatus: "État de collection",
          all: "Tous",
          missingFilter: "Manquants",
          masteredFilter: "★ Maîtrisés",
          filterVariant: "Filtrer par variante",
          allVariants: "Toutes variantes",
          filterRarity: "Filtrer par rareté",
          allRarities: "Toutes raretés",
          sortCollection: "Trier la collection",
          sortCatalog: "Ordre collection",
          sortName: "Nom A–Z",
          sortRarity: "Rareté décroissante",
          exportBackup: "Exporter ma sauvegarde",
          importBackup: "Importer une sauvegarde",
          resetAll: "Tout réinitialiser",
          developedBy: "Développé par",
          mobileNav: "Navigation mobile",
          home: "Accueil",
          cloud: "Cloud",
          backToTop: "Revenir en haut",
          close: "Fermer",
          ability: "Capacité",
          variantBonus: "Bonus de variante",
          iHave: "✓ Je l’ai",
          mastered: "Maîtrisé",
          next: "Suivant →",
          personalNote: "Ma note personnelle",
          notePlaceholder: "Ex. trouvé près de…, à améliorer…",
          addDialogKicker: "Ajout au casier",
          addDialogTitle: "Configurer l’esprit",
          addDialogCopy: "Indique s’il est déjà maîtrisé avant de l’ajouter.",
          masteryQuestion: "Est-il maîtrisé ?",
          notMastered: "Pas encore",
          yesMastered: "Oui, maîtrisé",
          confirmAdd: "Ajouter au casier",
          removeDialogKicker: "Gestion du casier",
          removeDialogTitle: "Retirer cet esprit ?",
          removeDialogCopy: "Cette action retirera l’esprit du casier ainsi que son statut de maîtrise.",
          keepInLocker: "Le conserver",
          confirmRemove: "Oui, le retirer",
          spriteAddedToast: "{name} ajouté au casier",
          spriteRemovedToast: "{name} retiré du casier",
          resetTitle: "Réinitialiser la collection ?",
          resetCopy: "Toute ta collection et toutes tes notes seront effacées sur cet appareil et, si tu es connecté, dans Firebase.",
          cancel: "Annuler",
          eraseAll: "Tout effacer",
          base: "Base",
          gold: "Or",
          gummy: "Gummy",
          galaxy: "Galaxie",
          holofoil: "Holo Brillant",
          cube: "Cube",
          gem: "Gemme",
          quack: "Canardesque",
          rare: "Rare",
          epic: "Épique",
          legendary: "Légendaire",
          mythic: "Mythique",
          viewDetails: "Voir les détails de {name}",
          informationAbout: "Informations sur {name}",
          inLocker: "Dans le casier",
          spriteNumber: "Esprit // {number}",
          obtained: "Obtenu",
          missing: "Manquant",
          removeFromLocker: "Retirer du casier",
          addToLocker: "Ajouter au casier",
          addedToLocker: "Ajouté au casier",
          addShort: "Ajouter",
          removeMastery: "Retirer la maîtrise",
          markMastered: "Marquer comme maîtrisé",
          master: "Maîtriser",
          emptyTitle: "Aucun esprit trouvé",
          emptyCopy: "Essaie un autre filtre ou efface ta recherche.",
          countOf: "{count} sur {total}",
          variantKicker: "{rarity} · Variante {variant}",
          catalogEntry: "Esprit // {number} · v41.30",
          dialogObtained: "✓ Obtenu",
          dialogHave: "+ Je l’ai",
          dialogMastered: "★ Maîtrisé",
          dialogMarkMastered: "☆ Marquer maîtrisé",
          syncPending: "À synchroniser",
          offline: "Hors connexion",
          syncing: "Synchronisation…",
          synced: "Synchronisé",
          syncError: "Erreur de synchro",
          firebaseConnecting: "Connexion à Firebase…",
          googleSuccess: "Connexion Google réussie",
          redirectFailed: "La redirection Google n’a pas pu être terminée",
          resumeSignIn: "Connexion à reprendre",
          signInFailed: "Connexion impossible",
          localDataKept: "Données locales conservées",
          firebaseUnavailable: "Firebase indisponible",
          openingGoogle: "Ouverture de Google…",
          httpsRequired: "Hébergement HTTPS requis",
          hostedOnly: "La connexion Google fonctionne depuis le site hébergé, pas en ouvrant directement le fichier",
          firebaseUnavailableNow: "Firebase n’est pas disponible pour le moment",
          googleSigningIn: "Connexion Google…",
          signingOut: "Déconnexion…",
          signedOutLocalKept: "Déconnecté — données locales conservées",
          signOutFailed: "Déconnexion impossible",
          backupExported: "Sauvegarde exportée",
          collectionImported: "Collection importée",
          invalidBackup: "Fichier de sauvegarde invalide",
          collectionReset: "Collection réinitialisée",
          exportAppName: "Prime — Collection d’esprits Fortnite",
          exportFilename: "collection-esprits-fortnite",
          errorUnauthorizedDomain: "Autorise {domain} dans Firebase Authentication",
          errorHttps: "Ouvre l’app depuis une adresse HTTPS pour te connecter",
          errorStorage: "Le stockage privé du navigateur bloque la connexion Google",
          errorCancelled: "Connexion Google annulée",
          errorPopupBlocked: "La fenêtre Google a été bloquée",
          errorCredential: "Ce compte utilise déjà une autre méthode de connexion",
          errorTooMany: "Trop de tentatives : réessaie dans quelques instants",
          errorDisabled: "Ce compte Google a été désactivé",
          errorFirebaseConfig: "La configuration Firebase de ce site n’est pas autorisée",
          errorFirestore: "Accès Firestore refusé par les règles",
          errorNetwork: "Connexion internet indisponible",
          errorFirebase: "Firebase est momentanément indisponible",
          googleConnected: "Compte Google connecté",
          firebaseBackupActive: "Sauvegarde Firebase active",
          chapterSeasonShort: "Chapitre 7 · Saison 3"
        },
        en: {
          title: "Sprite Locker — Fortnite Collection",
          description: "Mobile tracker for all 109 obtainable Sprite versions in Fortnite Chapter 7 Season 3.",
          socialDescription: "Track all 109 obtainable Fortnite Sprite versions, their variants, and mastery.",
          socialImageAlt: "Sprite Locker F logo on a blue and purple Fortnite background",
          navMain: "Main navigation",
          brandHome: "Sprite Locker, home",
          brandSubtitle: "Prime Collection",
          quickAccess: "Quick links",
          progress: "Progress",
          locker: "Locker",
          season: "Chapter 7 · Season 3",
          heroEyebrow: "Official player collection",
          heroTitleHtml: "Master your <span>Sprite</span>",
          heroCopy: "Collect every Sprite, track mastery, and complete the ultimate season locker.",
          collectionInfo: "Collection information",
          families: "families",
          versions: "versions",
          upToDate: "up to date",
          progressSection: "Collection progress",
          cloudLocker: "Cloud Locker",
          firebaseSync: "Firebase sync",
          savedOnDevice: "Saved on this device",
          local: "Local",
          localOffline: "Local · offline",
          connect: "Sign in",
          signIn: "Sign in with Google",
          syncNow: "Sync now",
          signOut: "Sign out",
          signOutAria: "Sign out of Firebase",
          globalProgress: "Overall progress",
          seasonLocker: "Your season locker",
          progressCopy: "Every collected version brings you closer to 100%.",
          completed: "complete",
          collectionCompleted: "Collection completion",
          ownedPlural: "Owned",
          masteredPlural: "Mastered",
          missingPlural: "Missing",
          visitorCounterAria: "Public visitor counter",
          visitorCounterTitle: "Visitors",
          visitorCounterLoading: "Connecting to counter…",
          visitorCounterLive: "Live public counter",
          visitorCounterError: "Counter temporarily unavailable",
          visitorsToday: "Today",
          visitorsTotal: "Total",
          lockerAnalysis: "Locker analysis",
          progressByVariant: "Progress by variant",
          fiveCollections: "8 collections to complete",
          variantCompleted: "{variant} variant completion",
          catalogNav: "Catalog",
          patchNotesNav: "Patch Notes",
          patchKicker: "Update v41.35",
          patchTitleHtml: "New interface <span>Catalog &amp; Guide</span>",
          patchLead: "The collection upgrades with a brand-new interactive card interface and an improved experience across mobile and PC.",
          parisTime: "Paris time",
          patchSummaryAria: "Update summary",
          patchMetricTotal: "Obtainable versions",
          patchMetricAdded: "New additions",
          patchMetricFamilies: "Sprite families",
          patchNewTitle: "New Card &amp; Slide Interface",
          patchNewJohn: "Each Sprite now has its own dedicated card.",
          patchNewLlama: "Swipe left to right on the card to view all its variants.",
          patchNewPeely: "Clear view of mastery, variant count, and overall progress.",
          patchVariantsTitle: "Fixes &amp; PC Navigation",
          patchVariantsQuack: "Navigation arrows (‹ ›) repositioned into the card header.",
          patchVariantsZero: "Fixed arrows overlapping variant count text on PC.",
          patchVariantsRare: "Smooth navigation and clean readable layout on all screens.",
          patchAppTitle: "PWA Improvements",
          patchAppLevels: "Instant automatic PWA installation on supported browsers.",
          patchAppData: "PWA install banner logo display guaranteed.",
          patchAppFilters: "Interactive step-by-step installation guide for Safari on iOS.",
          patchNoticeTitle: "Still unreleased",
          patchNoticeCopy: "Ironmouse and the Gem variants still marked unreleased are excluded from the total. They will join the catalog as soon as they officially become available.",
          patchCatalogButton: "View catalog",
          catalogTitle: "All Sprites",
          spiritLocker: "The Sprite Locker",
          shown: "shown",
          fullCatalog: "Released variants verified",
          filtersActive: "Filters active",
          searchAndFilters: "Search and filters",
          searchPlaceholder: "Search for a Sprite…",
          searchAria: "Search for a Sprite",
          backupOptions: "Backup and options",
          collectionStatus: "Collection status",
          all: "All",
          missingFilter: "Missing",
          masteredFilter: "★ Mastered",
          filterVariant: "Filter by variant",
          allVariants: "All variants",
          filterRarity: "Filter by rarity",
          allRarities: "All rarities",
          sortCollection: "Sort collection",
          sortCatalog: "Collection order",
          sortName: "Name A–Z",
          sortRarity: "Rarity descending",
          exportBackup: "Export my backup",
          importBackup: "Import a backup",
          resetAll: "Reset everything",
          developedBy: "Developed by",
          mobileNav: "Mobile navigation",
          home: "Home",
          cloud: "Cloud",
          backToTop: "Back to top",
          close: "Close",
          ability: "Ability",
          variantBonus: "Variant bonus",
          iHave: "✓ I own it",
          mastered: "Mastered",
          next: "Next →",
          personalNote: "My personal note",
          notePlaceholder: "E.g. found near…, trading notes…",
          addDialogKicker: "Add to Locker",
          addDialogTitle: "Configure this Sprite",
          addDialogCopy: "Indicate whether it is already mastered before adding it.",
          masteryQuestion: "Is it mastered?",
          notMastered: "Not yet",
          yesMastered: "Yes, mastered",
          confirmAdd: "Add to Locker",
          removeDialogKicker: "Locker management",
          removeDialogTitle: "Remove this Sprite?",
          removeDialogCopy: "This will remove the Sprite from your Locker together with its mastery status.",
          keepInLocker: "Keep it",
          confirmRemove: "Yes, remove it",
          spriteAddedToast: "{name} added to your Locker",
          spriteRemovedToast: "{name} removed from your Locker",
          resetTitle: "Reset the collection?",
          resetCopy: "Your entire collection and personal notes will be erased from this device and, if you are signed in, from Firebase.",
          cancel: "Cancel",
          eraseAll: "Erase everything",
          base: "Base",
          gold: "Gold",
          gummy: "Gummy",
          galaxy: "Galaxy",
          holofoil: "Holofoil",
          cube: "Cube",
          gem: "Gem",
          quack: "Quack",
          rare: "Rare",
          epic: "Epic",
          legendary: "Legendary",
          mythic: "Mythic",
          viewDetails: "View details for {name}",
          informationAbout: "Information about {name}",
          inLocker: "In locker",
          spriteNumber: "Sprite // {number}",
          obtained: "Owned",
          missing: "Missing",
          removeFromLocker: "Remove from locker",
          addToLocker: "Add to locker",
          addedToLocker: "Added to locker",
          addShort: "Add",
          removeMastery: "Remove mastery",
          markMastered: "Mark as mastered",
          master: "Master",
          emptyTitle: "No Sprite found",
          emptyCopy: "Try another filter or clear your search.",
          countOf: "{count} of {total}",
          variantKicker: "{rarity} · {variant} Variant",
          catalogEntry: "Sprite // {number} · v41.30",
          dialogObtained: "✓ Owned",
          dialogHave: "+ I own it",
          dialogMastered: "★ Mastered",
          dialogMarkMastered: "☆ Mark mastered",
          syncPending: "Waiting to sync",
          offline: "Offline",
          syncing: "Syncing…",
          synced: "Synced",
          syncError: "Sync error",
          firebaseConnecting: "Connecting to Firebase…",
          googleSuccess: "Google sign-in successful",
          redirectFailed: "Google redirect could not be completed",
          resumeSignIn: "Resume sign-in",
          signInFailed: "Sign-in failed",
          localDataKept: "Local data preserved",
          firebaseUnavailable: "Firebase unavailable",
          openingGoogle: "Opening Google…",
          httpsRequired: "HTTPS hosting required",
          hostedOnly: "Google sign-in works from the hosted site, not by opening the file directly",
          firebaseUnavailableNow: "Firebase is currently unavailable",
          googleSigningIn: "Signing in with Google…",
          signingOut: "Signing out…",
          signedOutLocalKept: "Signed out — local data preserved",
          signOutFailed: "Sign-out failed",
          backupExported: "Backup exported",
          collectionImported: "Collection imported",
          invalidBackup: "Invalid backup file",
          collectionReset: "Collection reset",
          exportAppName: "Prime — Fortnite Sprite Collection",
          exportFilename: "fortnite-sprite-collection",
          errorUnauthorizedDomain: "Allow {domain} in Firebase Authentication",
          errorHttps: "Open the app from an HTTPS address to sign in",
          errorStorage: "Private browser storage is blocking Google sign-in",
          errorCancelled: "Google sign-in cancelled",
          errorPopupBlocked: "The Google window was blocked",
          errorCredential: "This account already uses another sign-in method",
          errorTooMany: "Too many attempts — try again shortly",
          errorDisabled: "This Google account has been disabled",
          errorFirebaseConfig: "This site’s Firebase configuration is not authorized",
          errorFirestore: "Firestore access denied by the rules",
          errorNetwork: "Internet connection unavailable",
          errorFirebase: "Firebase is temporarily unavailable",
          googleConnected: "Google account connected",
          firebaseBackupActive: "Firebase backup active",
          chapterSeasonShort: "Chapter 7 · Season 3"
        }
      };

      function t(key, variables = {}) {
        const template = COPY[APP_LANGUAGE][key] ?? COPY.en[key] ?? key;
        return String(template).replace(/\{(\w+)\}/g, (_, name) => variables[name] ?? `{${name}}`);
      }

      const variants = {
        base: {
          fr: "Base", en: "Base", color: "#ffffff",
          effect: {
            fr: "Aucun bonus de variante : seule la capacité propre de l’esprit s’applique.",
            en: "No variant bonus: only this Sprite’s own ability applies."
          }
        },
        gold: {
          fr: "Or", en: "Gold", color: "#ffe46b",
          effect: {
            fr: "Accorde un bonus d’EXP pour chaque élimination.",
            en: "Grants bonus XP for each elimination."
          }
        },
        gummy: {
          fr: "Gummy", en: "Gummy", color: "#ff83c8",
          effect: {
            fr: "Augmente de 10 % la Poussière d’esprit gagnée lors de l’extraction.",
            en: "Increases Sprite Dust earned on extraction by 10%."
          }
        },
        galaxy: {
          fr: "Galaxie", en: "Galaxy", color: "#a8a0ff",
          effect: {
            fr: "Accorde davantage de munitions lors de l’ouverture des boîtes de munitions.",
            en: "Grants more ammo when opening ammo boxes."
          }
        },
        holofoil: {
          fr: "Holo Brillant", en: "Holofoil", color: "#78f4ee",
          effect: {
            fr: "Augmente de 5 % pour l’escouade la chance de trouver d’autres variantes rares dans les coffres.",
            en: "Increases the squad’s chance of finding other rare variants in chests by 5%."
          }
        },
        cube: {
          fr: "Cube", en: "Cube", color: "#a665ff",
          effect: {
            fr: "Accorde l’effet Surmultiplication lorsque tu te trouves dans la tempête.",
            en: "Grants the Overdrive effect while you are in the Storm."
          }
        },
        gem: {
          fr: "Gemme", en: "Gem", color: "#70f0ff",
          effect: {
            fr: "Réduit de 30 % les dégâts de chute.",
            en: "Reduces fall damage by 30%."
          }
        },
        quack: {
          fr: "Canardesque", en: "Quack", color: "#ffe84a",
          effect: {
            fr: "Quand cet esprit gagne de la progression, chaque autre esprit transporté en reçoit 50 % supplémentaires.",
            en: "Whenever this Sprite gains progress, every other carried Sprite receives an extra 50% of that progress."
          }
        }
      };

      const families = [
        {
          key: "batman", fr: "Esprit de Batman", en: "Batman Sprite", rarity: "mythic",
          aliases: ["Esprit Batman"],
          effect: {
            fr: "Permet de s’élancer dans les airs et de déployer la Bat-Cape.",
            en: "Launches you into the air and deploys the Bat-Cape."
          },
          images: {
            base: "T_Icon_BR_FossilMeal_Default_L.webp",
            gold: "T_Icon_BR_FossilMeal_Gold_L.webp",
            gummy: "T_Icon_BR_FossilMeal_Candy_L.webp",
            galaxy: "T_Icon_BR_FossilMeal_Galaxy_L.webp",
            holofoil: "T_Icon_BR_FossilMeal_Holofoil_L.webp",
            cube: "T_Icon_BR_FossilMeal_Cube_L.webp"
          }
        },
        {
          key: "water", fr: "Esprit de l’eau", en: "Water Sprite", rarity: "rare",
          effect: {
            fr: "Régénère le bouclier dans l’eau. La régénération passe de 2 à 6 points par pulsation entre les niveaux 1 et 5.",
            en: "Regenerates Shield while you are in water. Regeneration rises from 2 to 6 per pulse between Levels 1 and 5."
          },
          images: {
            base: "T_Icon_BR_Creature_Sprite_Water_Unvault_Ch7S3_ui_L.webp",
            gold: "T_Icon_BR_Creature_Sprite_Water_Gold_ui_L.webp",
            gummy: "T_Icon_BR_Creature_Sprite_Water_Candy_ui_L.webp",
            galaxy: "T_Icon_BR_Creature_Sprite_Water_Galaxy_ui_L.webp",
            holofoil: "T_Icon_BR_Creature_Sprite_Water_Holofoil_ui_L.webp",
            gem: "T_Icon_BR_Creature_Sprite_Water_Gem_ui_L.webp",
            quack: "T_Icon_BR_Creature_Sprite_Water_Quack_ui_L.webp"
          }
        },
        {
          key: "earth", fr: "Esprit de la terre", en: "Earth Sprite", rarity: "rare",
          effect: {
            fr: "Donne une chance de trouver du butin rare supplémentaire en ouvrant des coffres.",
            en: "Gives you a chance to find additional rare loot when opening chests."
          },
          images: {
            base: "T_Icon_BR_Creature_Sprite_Earth_Ch7S3_UI_L.webp",
            gold: "T_Icon_BR_Creature_Sprite_Earth_Gold_ui_L.webp",
            gummy: "T_Icon_BR_Creature_Sprite_Earth_Candy_ui_L.webp",
            galaxy: "T_Icon_BR_Creature_Sprite_Earth_Galaxy_ui_L.webp",
            cube: "T_Icon_BR_Creature_Sprite_Earth_Cube_ui_L.webp",
            gem: "T_Icon_BR_Creature_Sprite_Earth_Gem_ui_L.webp",
            quack: "T_Icon_BR_Creature_Sprite_Earth_Quack_ui_L.webp"
          }
        },
        {
          key: "fire", fr: "Esprit de feu", en: "Fire Sprite", rarity: "rare",
          aliases: ["Esprit du feu"],
          effect: {
            fr: "Déclenche une explosion de feu après avoir infligé suffisamment de dégâts à un adversaire.",
            en: "Triggers a burst of fire after you deal enough damage to an opponent."
          },
          images: {
            base: "T_Icon_BR_Creature_Sprite_Fire_Unvault_Ch7S3_ui_L.webp",
            gold: "T_Icon_BR_Creature_Sprite_Fire_Gold_ui_L.webp",
            gummy: "T_Icon_BR_Creature_Sprite_Fire_Candy_ui_L.webp",
            galaxy: "T_Icon_BR_Creature_Sprite_Fire_Galaxy_ui_L.webp",
            holofoil: "T_Icon_BR_Creature_Sprite_Fire_Holofoil_ui_L.webp",
            cube: "T_Icon_BR_Creature_Sprite_Fire_Cube_ui_L.webp",
            quack: "T_Icon_BR_Creature_Sprite_Fire_Quack_ui_L.webp"
          }
        },
        {
          key: "duck", fr: "Esprit canard", en: "Duck Sprite", rarity: "epic",
          effect: {
            fr: "Régénère le bouclier lorsque tu utilises une emote ou que tu fais un Jam.",
            en: "Regenerates Shield while you emote or Jam."
          },
          images: {
            base: "T_Icon_BR_Duck_Default_L.webp",
            gold: "T_Icon_BR_Duck_Gold_L.webp",
            gummy: "T_Icon_BR_Duck_Candy_L.webp",
            galaxy: "T_Icon_BR_Duck_Galaxy_L.webp",
            gem: "T_Icon_BR_Duck_Gem_L.webp"
          }
        },
        {
          key: "ghost", fr: "Esprit fantôme", en: "Ghost Sprite", rarity: "epic",
          effect: {
            fr: "Te rend invisible pendant un court instant après un rechargement.",
            en: "Turns you invisible briefly after reloading."
          },
          images: {
            base: "T_Icon_BR_Creature_Sprite_Ghost_Unvault_L.webp",
            gold: "T_Icon_BR_Creature_Sprite_Ghost_Gold_L.webp",
            gummy: "T_Icon_BR_Creature_Sprite_Ghost_Candy_L.webp",
            galaxy: "T_Icon_BR_Creature_Sprite_Ghost_Galaxy_L.webp",
            holofoil: "T_Icon_BR_Creature_Sprite_Ghost_Holo_L.webp"
          }
        },
        {
          key: "dream", fr: "Esprit onirique", en: "Dream Sprite", rarity: "legendary",
          aliases: ["Esprit des rêves", "Esprit de rêve", "Dream", "Onirique"],
          effect: {
            fr: "Donne un objet aléatoire à chaque montée de niveau et libère du butin légendaire au niveau maximal.",
            en: "Grants a random item at each level-up and drops Legendary loot at max level."
          },
          images: {
            base: "T_Icon_BR_Creature_Sprite_Sleepy_ui_L.webp",
            gold: "T_Icon_BR_Creature_Sprite_Sleepy_Gold_ui_L.webp",
            gummy: "T_Icon_BR_Creature_Sprite_Sleepy_Candy_ui_L.webp",
            galaxy: "T_Icon_BR_Creature_Sprite_Sleepy_Galaxy_ui_L.webp",
            cube: "T_Icon_BR_Creature_Sprite_Sleepy_Cube_ui_L.webp"
          }
        },
        {
          key: "demon", fr: "Esprit démoniaque", en: "Demon Sprite", rarity: "epic",
          aliases: ["Esprit démon"],
          effect: {
            fr: "Rend des PV et du bouclier à chaque élimination : de 10 points au niveau 1 à 30 au niveau 5.",
            en: "Restores Health and Shield with each elimination, from 10 at Level 1 to 30 at Level 5."
          },
          images: {
            base: "T_Icon_BR_RedDemon_Default_L.webp",
            gold: "T_Icon_BR_RedDemon_Gold_L.webp",
            gummy: "T_Icon_BR_RedDemon_Candy_L.webp",
            galaxy: "T_Icon_BR_RedDemon_Galaxy_L.webp",
            gem: "T_Icon_BR_RedDemon_Gem_L.webp"
          }
        },
        {
          key: "punk", fr: "Esprit punk", en: "Punk Sprite", rarity: "legendary",
          aliases: ["Esprit de Punk"],
          effect: {
            fr: "Peut occasionnellement accorder une amélioration de munitions illimitées… ou un effet surprise.",
            en: "Can occasionally grant unlimited ammo… or a surprise effect."
          },
          images: {
            base: "T_Icon_BR_Creature_Sprite_Punk_ui_L.webp",
            gold: "T_Icon_BR_Creature_Sprite_Punk_Gold_ui_L.webp",
            gummy: "T_Icon_BR_Creature_Sprite_Punk_Candy_ui_L.webp",
            galaxy: "T_Icon_BR_Creature_Sprite_Punk_Galaxy_ui_L.webp",
            cube: "T_Icon_BR_Creature_Sprite_Punk_Cube_ui_L.webp",
            gem: "T_Icon_BR_Creature_Sprite_Punk_Gem_ui_L.webp"
          }
        },
        {
          key: "king", fr: "Esprit royal", en: "King Sprite", rarity: "epic",
          aliases: ["Esprit roi", "Esprit du roi"],
          effect: {
            fr: "Augmente les dégâts de la pioche : le bonus progresse de 30 à 120 dégâts entre les niveaux 1 et 5.",
            en: "Increases Pickaxe damage, with the bonus rising from 30 to 120 between Levels 1 and 5."
          },
          images: {
            base: "T_Icon_BR_Creature_Sprite_King_ui_L.webp",
            gold: "T_Icon_BR_Creature_Sprite_King_Gold_ui_L.webp",
            gummy: "T_Icon_BR_Creature_Sprite_King_Candy_ui_L.webp",
            galaxy: "T_Icon_BR_Creature_Sprite_King_Galaxy_ui_L.webp",
            holofoil: "T_Icon_BR_Creature_Sprite_King_Holofoil_ui_L.webp"
          }
        },
        {
          key: "vini", fr: "Esprit de Vini Jr.", en: "Vini Jr. Sprite", rarity: "mythic",
          aliases: ["Esprit Vini Jr."],
          effect: {
            fr: "Après un sprint, rend la glissade destructrice. Toucher un ennemi avec une glissade augmente la cadence de tir et la vitesse de rechargement.",
            en: "After sprinting, makes your slide destructive. Hitting an enemy with a slide increases fire rate and reload speed."
          },
          images: { base: "T_Icon_BR_CokeParmesan_Default_L.webp" }
        },
        {
          key: "burnt-peanut", fr: "Esprit cacahuète", en: "Burnt Peanut", rarity: "mythic",
          aliases: ["Cacahuète brûlée", "Esprit cacahuète brûlée", "Esprit de la cacahuète brûlée", "Arachide brûlée"],
          effect: {
            fr: "Peut faire apparaître du butin supplémentaire après une élimination, avec une chance de butin mythique au niveau maximal.",
            en: "Can spawn extra loot after an elimination, with a chance of Mythic loot at max level."
          },
          images: { base: "T_Icon_BR_Creature_Sprite_BurntPeanut_ui_L.webp" }
        },
        {
          key: "zero-point", fr: "Esprit du Point Zéro", en: "Zero Point Sprite", rarity: "mythic",
          aliases: ["Esprit du Point zéro", "Esprit Point Zéro"],
          effect: {
            fr: "Fait apparaître une mini bulle protectrice lorsque tu utilises un objet de soin sur toi-même.",
            en: "Spawns a small protective bubble when you use a healing item on yourself."
          },
          images: {
            base: "T_Icon_BR_Creature_Sprite_ZeroPoint_ui_L.webp",
            gold: "T_Icon_BR_Creature_Sprite_ZeroPoint_Gold_ui_L.webp",
            gummy: "T_Icon_BR_Creature_Sprite_ZeroPoint_Candy_ui_L.webp",
            galaxy: "T_Icon_BR_Creature_Sprite_ZeroPoint_Galaxy_ui_L.webp",
            holofoil: "T_Icon_BR_Creature_Sprite_ZeroPoint_Holofoil_ui_L.webp",
            cube: "T_Icon_BR_Creature_Sprite_ZeroPoint_Cube_ui_L.webp",
            gem: "T_Icon_BR_Creature_Sprite_ZeroPoint_Gem_ui_L.webp",
            quack: "T_Icon_BR_Creature_Sprite_ZeroPoint_Quack_ui_L.webp"
          }
        },
        {
          key: "fishy", fr: "Esprit de Poiscaille", en: "Fishy Sprite", rarity: "rare",
          aliases: ["Esprit poisson", "Esprit poiscaille"],
          effect: {
            fr: "Augmente la vitesse de nage et accorde une accélération de déplacement après avoir subi des dégâts.",
            en: "Increases swim speed and grants a movement boost after you take damage."
          },
          images: {
            base: "T_Icon_BR_Creature_Sprite_Fishy_ui_L.webp",
            gold: "T_Icon_BR_Creature_Sprite_Fishy_Gold_ui_L.webp",
            gummy: "T_Icon_BR_Creature_Sprite_Fishy_Candy_ui_L.webp",
            galaxy: "T_Icon_BR_Creature_Sprite_Fishy_Galaxy_ui_L.webp",
            cube: "T_Icon_BR_Creature_Sprite_Fishy_Cube_L.webp"
          }
        },
        {
          key: "striker", fr: "Esprit buteur", en: "Striker Sprite", rarity: "epic",
          aliases: ["Esprit frappeur", "Esprit de foot"],
          effect: {
            fr: "Accorde l’effet Surmultiplication après un rétablissement, un franchissement ou une course murale, pendant 6 à 10 secondes selon le niveau.",
            en: "Grants Overdrive after mantling, hurdling, or wall running for 6 to 10 seconds depending on level."
          },
          images: {
            base: "T_Icon_BR_Creature_Sprite_Soccer_ui_L.webp",
            gold: "T_Icon_BR_Creature_Sprite_Soccer_Gold_L.webp",
            gummy: "T_Icon_BR_Creature_Sprite_Soccer_Candy_L.webp",
            galaxy: "T_Icon_BR_Creature_Sprite_Soccer_Galaxy_L.webp",
            holofoil: "T_Icon_BR_Creature_Sprite_Soccer_Holofoil_L.webp"
          }
        },
        {
          key: "aura", fr: "Esprit à aura", en: "Aura Sprite", rarity: "epic",
          aliases: ["Esprit aura", "Esprit d’Aura"],
          effect: {
            fr: "Accorde une charge de roche antigravité après avoir infligé une quantité définie de dégâts.",
            en: "Grants an anti-gravity rock charge after you deal a set amount of damage."
          },
          images: {
            base: "T_Icon_BR_Creature_Sprite_Drifter_ui_L.webp",
            gold: "T_Icon_BR_Creature_Sprite_Drifter_Gold_ui_L.webp",
            gummy: "T_Icon_BR_Creature_Sprite_Drifter_Candy_ui_L.webp",
            galaxy: "T_Icon_BR_Creature_Sprite_Drifter_Galaxy_ui_L.webp",
            gem: "T_Icon_BR_Creature_Sprite_Drifter_Gem_ui_L.webp"
          }
        },
        {
          key: "boss", fr: "Esprit de boss", en: "Boss Sprite", rarity: "legendary",
          aliases: ["Esprit boss", "Esprit du boss"],
          effect: {
            fr: "Augmente fortement le maximum de PV et de bouclier.",
            en: "Significantly increases your maximum Health and Shield."
          },
          images: {
            base: "T_Icon_BR_Creature_Sprite_Boss_ui_L.webp",
            gold: "T_Icon_BR_Creature_Sprite_Boss_Gold_ui_L.webp",
            gummy: "T_Icon_BR_Creature_Sprite_Boss_Candy_ui_L.webp",
            galaxy: "T_Icon_BR_Creature_Sprite_Boss_Galaxy_ui_L.webp",
            cube: "T_Icon_BR_Creature_Sprite_Boss_Cube_ui_L.webp"
          }
        },
        {
          key: "grim", fr: "Esprit de la Faucheuse", en: "Grim Sprite", rarity: "mythic",
          aliases: ["Esprit faucheur", "Esprit sinistre"],
          effect: {
            fr: "Marque automatiquement les ennemis qui t’infligent des dégâts.",
            en: "Automatically marks enemies who damage you."
          },
          images: {
            base: "T_Icon_BR_GrimReaper_Default_L.webp",
            gold: "T_Icon_BR_GrimReaper_Gold_L.webp",
            gummy: "T_Icon_BR_GrimReaper_Candy_L.webp",
            galaxy: "T_Icon_BR_GrimReaper_Galaxy_L.webp",
            cube: "T_Icon_BR_GrimReaper_Cube_L.webp",
            holofoil: "T_Icon_BR_GrimReaper_Holofoil_L.webp",
            gem: "T_Icon_BR_GrimReaper_Gem_L.webp"
          }
        },
        {
          key: "air", fr: "Esprit de l’air", en: "Air Sprite", rarity: "rare",
          aliases: ["Esprit du vent", "Esprit de vent"],
          effect: {
            fr: "Augmente la vitesse de sprint et la hauteur de saut, tout en annulant les dégâts de chute. La hauteur progresse avec le niveau.",
            en: "Increases sprint speed and jump height while preventing fall damage. Jump height rises with level."
          },
          images: {
            base: "T_Icon_BR_Air_Default_L.webp",
            gold: "T_Icon_BR_Air_Gold_L.webp",
            gummy: "T_Icon_BR_Air_Candy_L.webp",
            galaxy: "T_Icon_BR_Air_Galaxy_L.webp",
            holofoil: "T_Icon_BR_Air_Holo_L.webp"
          }
        },
        {
          key: "seven", fr: "Esprit des Sept", en: "Seven Sprite", rarity: "legendary",
          aliases: ["Esprit de Seven"],
          effect: {
            fr: "Rend visibles pour l’escouade les traces de pas des ennemis pendant 10 à 30 secondes selon le niveau.",
            en: "Reveals enemy footsteps to the squad for 10 to 30 seconds depending on level."
          },
          images: {
            base: "T_Icon_BR_Creature_Sprite_Seven_ui_L.webp",
            gold: "T_Icon_BR_Creature_Sprite_Seven_Gold_ui_L.webp",
            gummy: "T_Icon_BR_Creature_Sprite_Seven_Candy_ui_L.webp",
            galaxy: "T_Icon_BR_Creature_Sprite_Seven_Galaxy_ui_L.webp",
            holofoil: "T_Icon_BR_Creature_Sprite_Seven_Holofoil_ui_L.webp"
          }
        },
        {
          key: "pollo", fr: "Pollo", en: "Pollo", rarity: "mythic",
          aliases: ["Esprit Pollo", "Pollo Sprite"],
          effect: {
            fr: "Après une élimination, régénère progressivement le bouclier du joueur et des membres proches de son escouade pendant 6 à 10 secondes selon le niveau.",
            en: "After an elimination, gradually restores Shield for you and nearby squad members for 6 to 10 seconds depending on level."
          },
          images: { base: "T_Icon_BR_CompanyStargazer_Default_L.webp" }
        },
        {
          key: "john-wick", fr: "Esprit John Wick", en: "John Wick Sprite", rarity: "mythic",
          aliases: ["Esprit de John Wick", "John Wick"],
          effect: {
            fr: "Mettre K.-O. un joueur révèle les autres adversaires à proximité.",
            en: "Knocking a player reveals other nearby opponents."
          },
          images: { base: "T_Icon_Reload_FillerGrunt_icon_L.webp" }
        },
        {
          key: "llama", fr: "Esprit lama veinard", en: "Lootin’ Llama Sprite", rarity: "legendary",
          aliases: ["Esprit lama", "Lama veinard", "Llama Sprite"],
          effect: {
            fr: "Ouvrir des boîtes de munitions permet parfois d’améliorer ton arme.",
            en: "Opening ammo boxes has a chance to upgrade your weapon."
          },
          images: {
            base: "T_Icon_BR_Creature_Sprite_Llama_ui_L.webp",
            gold: "T_Icon_BR_Creature_Sprite_Llama_Gold_ui_L.webp",
            gummy: "T_Icon_BR_Creature_Sprite_Llama_Candy_ui_L.webp",
            galaxy: "T_Icon_BR_Creature_Sprite_Llama_Galaxy_ui_L.webp",
            gem: "T_Icon_BR_Creature_Sprite_Llama_Gem_ui_L.webp"
          }
        },
        {
          key: "peely", fr: "Esprit de Banane dénicheur", en: "Peeky Peely Sprite", rarity: "legendary",
          aliases: ["Esprit de Banane", "Esprit Banane", "Peely Sprite"],
          effect: {
            fr: "Indique les variantes d’esprits rares à proximité, y compris les ennemis qui en transportent, mais révèle aussi ta position.",
            en: "Marks nearby rare Sprite variants or enemies carrying them, but also reveals your location."
          },
          images: {
            base: "T_Icon_BR_Creature_Sprite_Peely_ui_L.webp",
            gold: "T_Icon_BR_Creature_Sprite_Peely_Gold_ui_L.webp",
            gummy: "T_Icon_BR_Creature_Sprite_Peely_Candy_ui_L.webp",
            galaxy: "T_Icon_BR_Creature_Sprite_Peely_Galaxy_ui_L.webp",
            holofoil: "T_Icon_BR_Creature_Sprite_Peely_Holofoil_ui_L.webp"
          }
        },
        {
          key: "ironmouse", fr: "Esprit d'Ironmouse", en: "Ironmouse Sprite", rarity: "mythic",
          aliases: ["Esprit Ironmouse", "Ironmouse", "Esprit d'Ironmouse"],
          effect: {
            fr: "Régénère la santé quand tes PV sont bas, tout en accordant un effet de camouflage et une gravité réduite.",
            en: "Regenerates Health when health is low, while granting a Cloak effect and low gravity."
          },
          images: { base: "https://static.wikia.nocookie.net/fortnite/images/a/ad/Ironmouse_Sprite_-_Item_-_Fortnite.png/revision/latest" }
        }
      ];

      /*
       * Classement éditorial du Guide — une seule catégorie principale par famille.
       * Les paliers correspondent aux valeurs affichées en jeu pour les niveaux 1 à 5.
       */
      const guideProfiles = Object.freeze({
        batman: {
          category: "mobility", summonCost: 6750,
          ability: { fr: "Permet de s’élancer dans les airs puis de déployer la Bat-Cape.", en: "Launches you into the air, then deploys the Bat-Cape." },
          note: { fr: "Effet fixe : aucune progression chiffrée par niveau n’est publiée.", en: "Fixed effect: no numerical level scaling is published." }
        },
        water: {
          category: "healing", summonCost: 100,
          ability: { fr: "Régénère le bouclier lorsque tu te tiens dans l’eau, pour toi et les membres proches de ton escouade.", en: "Regenerates Shield while you stand in water for you and nearby squad members." },
          levelCaption: { fr: "Bouclier par pulsation", en: "Shield per tick" }, levels: ["2", "3", "4", "5", "6"]
        },
        earth: {
          category: "loot", summonCost: 100,
          ability: { fr: "Donne une chance de trouver du butin rare supplémentaire en ouvrant un coffre.", en: "Grants a chance to find additional rare loot when opening a chest." },
          levelCaption: { fr: "Chance de butin supplémentaire", en: "Extra loot chance" }, levels: ["10 %", "12,5 %", "15 %", "17,5 %", "20 %"]
        },
        fire: {
          category: "combat", summonCost: 100,
          ability: { fr: "Déclenche une explosion de feu après avoir infligé suffisamment de dégâts à un adversaire.", en: "Triggers a fiery burst after dealing enough damage to an enemy." },
          levelCaption: { fr: "Dégâts requis pour déclencher", en: "Damage required to trigger" }, levels: ["150", "125", "100", "75", "50"]
        },
        duck: {
          category: "healing", summonCost: 2700,
          ability: { fr: "Régénère le bouclier lorsque tu utilises une emote ou que tu participes à un Jam.", en: "Regenerates Shield while you emote or Jam." },
          levelCaption: { fr: "Bouclier par pulsation", en: "Shield per tick" }, levels: ["2", "3", "4", "6", "8"]
        },
        ghost: {
          category: "defense", summonCost: 2700,
          ability: { fr: "Accorde le camouflage pendant une courte durée après un rechargement.", en: "Grants Cloak for a short duration after reloading." },
          levelCaption: { fr: "Durée du camouflage", en: "Cloak duration" }, levels: ["3 s", "3,5 s", "4 s", "4,5 s", "5 s"]
        },
        dream: {
          category: "loot", summonCost: 4500,
          ability: { fr: "Accorde un objet aléatoire à chaque niveau et libère du butin légendaire au niveau maximal.", en: "Grants a random item at each level and bursts with Legendary loot at max level." },
          note: { fr: "La valeur du butin augmente à chaque niveau. Aucun tableau chiffré officiel n’est publié.", en: "Loot value increases at every level. No official numerical table is published." }
        },
        demon: {
          category: "healing", summonCost: 2700,
          ability: { fr: "Rend des PV et du bouclier à chaque élimination.", en: "Restores Health and Shield with each elimination." },
          levelCaption: { fr: "Soin par élimination", en: "Healing per elimination" }, levels: ["10", "15", "20", "25", "30"]
        },
        punk: {
          category: "combat", summonCost: 4500,
          ability: { fr: "Peut ne rien accorder… ou déclencher un bonus aléatoire pouvant aller jusqu’aux munitions illimitées.", en: "May grant nothing… or trigger a random bonus that can include unlimited ammo." },
          note: { fr: "Effet aléatoire : aucune probabilité officielle par niveau n’est publiée.", en: "Random effect: no official per-level probability is published." }
        },
        king: {
          category: "combat", summonCost: 2700,
          ability: { fr: "Augmente les dégâts infligés avec la pioche.", en: "Increases damage dealt with your Pickaxe." },
          levelCaption: { fr: "Dégâts bonus de pioche", en: "Bonus Pickaxe damage" }, levels: ["+30", "+40", "+60", "+80", "+120"]
        },
        vini: {
          category: "combat", summonCost: 6750,
          ability: { fr: "Après un sprint, la glissade devient destructrice. Percuter un ennemi augmente aussi la cadence de tir et la vitesse de rechargement.", en: "After sprinting, sliding becomes destructive. Slide-kicking an enemy also boosts fire rate and reload speed." },
          levelCaption: { fr: "Dégâts de glissade · cadence", en: "Slide damage · fire rate" }, levels: ["40 · +10 %", "45 · +20 %", "50 · +30 %", "55 · +40 %", "60 · +50 %"]
        },
        "burnt-peanut": {
          category: "loot", summonCost: 6750,
          ability: { fr: "Après une élimination, peut faire apparaître du butin supplémentaire, parfois mythique au niveau maximal.", en: "After an elimination, can spawn extra loot, sometimes Mythic at max level." },
          levelCaption: { fr: "Chance de butin supplémentaire", en: "Extra loot chance" }, levels: ["20 %", "30 %", "40 %", "50 %", "60 %"],
          note: { fr: "Au niveau 5 : 10 % de chance que le butin supplémentaire soit mythique.", en: "At Level 5: a 10% chance for the extra loot to be Mythic." }
        },
        "zero-point": {
          category: "defense", summonCost: 6750,
          ability: { fr: "Crée une mini bulle protectrice lorsque tu utilises sur toi un objet de soin, hors éclaboussures et grenades.", en: "Spawns a Shield Bubble Jr. when you use a healing item on yourself, excluding splashes and grenades." },
          levelCaption: { fr: "Durée de la bulle", en: "Bubble duration" }, levels: ["6 s", "7 s", "8 s", "9 s", "10 s"]
        },
        fishy: {
          category: "mobility", summonCost: 1800,
          ability: { fr: "Augmente fortement la vitesse de nage et accorde brièvement un bonus de déplacement après avoir subi des dégâts.", en: "Greatly increases swim speed and briefly boosts movement speed after taking damage." },
          levelCaption: { fr: "Nage · déplacement", en: "Swim · movement" }, levels: ["+25 % · +10 %", "+50 % · +20 %", "+100 % · +30 %", "+150 % · +40 %", "+200 % · +50 %"]
        },
        striker: {
          category: "mobility", summonCost: 2700,
          ability: { fr: "Accorde Surmultiplication après un rétablissement, un franchissement ou une course murale.", en: "Grants Overdrive after mantling, hurdling, or wall scrambling." },
          levelCaption: { fr: "Durée de Surmultiplication", en: "Overdrive duration" }, levels: ["6 s", "7 s", "8 s", "9 s", "10 s"]
        },
        aura: {
          category: "mobility", summonCost: 2700,
          ability: { fr: "Accorde une charge de roche antigravité après avoir infligé suffisamment de dégâts à des ennemis.", en: "Grants a Shock Rock charge after dealing enough damage to enemies." },
          levelCaption: { fr: "Dégâts requis pour la charge", en: "Damage required for a charge" }, levels: ["175", "150", "125", "100", "75"]
        },
        boss: {
          category: "defense", summonCost: 4500,
          ability: { fr: "Augmente simultanément le maximum de PV et de bouclier.", en: "Increases both your maximum Health and Shield." },
          levelCaption: { fr: "Maximum de PV et bouclier", en: "Max Health and Shield" }, levels: ["+5 / +5", "+10 / +10", "+15 / +15", "+20 / +20", "+25 / +25"]
        },
        grim: {
          category: "squad", summonCost: 6750,
          ability: { fr: "Marque automatiquement les joueurs qui t’infligent des dégâts.", en: "Automatically marks players who damage you." },
          levelCaption: { fr: "Durée du marquage", en: "Mark duration" }, levels: ["3 s", "3,5 s", "4 s", "4,5 s", "5 s"]
        },
        air: {
          category: "mobility", summonCost: 1800,
          ability: { fr: "Augmente la vitesse de sprint et la hauteur de saut, tout en annulant les dégâts de chute.", en: "Increases sprint speed and jump height while nullifying fall damage." },
          note: { fr: "La hauteur de saut augmente à chaque niveau. Les valeurs exactes ne sont pas publiées.", en: "Jump height increases at every level. Exact values are not published." }
        },
        seven: {
          category: "squad", summonCost: 4500,
          ability: { fr: "Rend visibles pour l’escouade les traces laissées par les joueurs ennemis.", en: "Makes enemy player foot trails visible to your Squad." },
          levelCaption: { fr: "Durée des traces visibles", en: "Visible foot-trail duration" }, levels: ["10 s", "15 s", "20 s", "25 s", "30 s"]
        },
        pollo: {
          category: "squad", summonCost: 6750,
          ability: { fr: "Après une élimination, régénère progressivement le bouclier du joueur et des membres proches de son escouade.", en: "After an elimination, gradually restores Shield for you and nearby squad members." },
          levelCaption: { fr: "Durée de régénération", en: "Regeneration duration" }, levels: ["6 s", "7 s", "8 s", "9 s", "10 s"]
        },
        "john-wick": {
          category: "squad", summonCost: 6750,
          ability: { fr: "Mettre un joueur K.-O. révèle les autres adversaires à proximité.", en: "Knocking a player reveals other nearby opponents." },
          levelCaption: { fr: "Durée du marquage", en: "Mark duration" }, levels: ["3 s", "3,5 s", "4 s", "4,5 s", "5 s"]
        },
        llama: {
          category: "loot", summonCost: 4500,
          ability: { fr: "Ouvrir une boîte de munitions peut améliorer l’une de tes armes.", en: "Opening an ammo box can upgrade one of your weapons." },
          levelCaption: { fr: "Chance d’amélioration", en: "Upgrade chance" }, levels: ["5 %", "10 %", "15 %", "17 %", "20 %"]
        },
        peely: {
          category: "loot", summonCost: 4500,
          ability: { fr: "Émet une détection des joueurs transportant des esprits rares à proximité, mais te marque aussi sur la carte.", en: "Pings nearby players carrying rare Sprites, but also marks you on the map." },
          levelCaption: { fr: "Rayon de détection", en: "Ping radius" }, levels: ["40 m", "50 m", "60 m", "70 m", "80 m"]
        },
        ironmouse: {
          category: "healing", summonCost: 6750,
          ability: { fr: "Régénère progressivement la santé quand tes PV sont bas, tout en t'accordant la gravité réduite et le camouflage.", en: "Regenerates Health over time when low, while granting low gravity and cloaking." },
          levelCaption: { fr: "Régénération & Camouflage", en: "Regen & Cloak" }, levels: ["Actif", "Actif", "Actif", "Actif", "Actif"],
          note: { fr: "Disponible dans les coffres à Esprits et coffres de relique (2.14 % de chance).", en: "Found in Sprite Chests and Relic Chests (2.14% drop chance)." }
        }
      });

      const rarityLabels = {
        fr: { rare: "Rare", epic: "Épique", legendary: "Légendaire", mythic: "Mythique" },
        en: { rare: "Rare", epic: "Epic", legendary: "Legendary", mythic: "Mythic" }
      };

      const localizedName = sprite => sprite[APP_LANGUAGE];
      const localizedVariant = key => variants[key][APP_LANGUAGE];
      const localizedEffect = value => typeof value === "string" ? value : value[APP_LANGUAGE];
      const rarityLabel = key => rarityLabels[APP_LANGUAGE][key];

      const rarityRank = { rare: 1, epic: 2, legendary: 3, mythic: 4 };
      const rarityGlow = {
        rare: "rgba(61,174,255,.42)",
        epic: "rgba(180,92,255,.43)",
        legendary: "rgba(255,146,61,.43)",
        mythic: "rgba(246,223,50,.39)"
      };

      const sprites = [];
      families.forEach((family, familyIndex) => {
        Object.entries(family.images).forEach(([variant, filename], variantIndex) => {
          const v = variants[variant];
          const guideProfile = guideProfiles[family.key] || null;
          sprites.push({
            id: `${family.key}-${variant}`,
            catalogNumber: sprites.length + 1,
            familyKey: family.key,
            familyIndex,
            variantIndex,
            variant,
            fr: family.fr,
            en: variant === "base" ? family.en : `${v.en} ${family.en}`,
            aliases: family.aliases || [],
            rarity: family.rarity,
            effect: guideProfile?.ability || family.effect,
            guideCategory: guideProfile?.category || "combat",
            guideProfile,
            image: filename.startsWith("http") ? filename : (IMAGE_ROOT + filename)
          });
        });
      });

      let state = loadState();
      let localUpdatedAt = loadLocalUpdatedAt();
      let statusFilter = "all";
      let activePage = "home";
      let activeDialogId = null;
      let pendingLockerId = null;
      let pendingMastered = false;
      let toastTimer = null;
      let firebaseSdk = null;
      let firebaseAuth = null;
      let firebaseDb = null;
      let firebaseUser = null;
      let firebaseInitializing = false;
      let firebaseReady = false;
      let firebaseRuntimeConfig = FIREBASE_CONFIG;
      let cloudUnsubscribe = null;
      let cloudSyncTimer = null;
      let cloudSyncing = false;
      let cloudSyncQueued = false;
      let cloudSyncQueuedPull = false;
      let authSequence = 0;
      let authUnsubscribe = null;
      let authActionInProgress = false;
      let publicCounterStarted = false;
      let spriteImageObserver = null;
      let renderFrame = 0;
      let imageWarmupStarted = false;
      const warmedImageUrls = new Set();
      const warmingImages = new Set();

      const grid = document.getElementById("spriteGrid");
      const spriteCardCache = new Map();
      const searchInput = document.getElementById("searchInput");
      const variantFilter = document.getElementById("variantFilter");
      const rarityFilter = document.getElementById("rarityFilter");
      const sortSelect = document.getElementById("sortSelect");
      const detailDialog = document.getElementById("detailDialog");
      const guideDetailDialog = document.getElementById("guideDetailDialog");
      const addSpriteDialog = document.getElementById("addSpriteDialog");
      const removeSpriteDialog = document.getElementById("removeSpriteDialog");
      const addSpriteNotMastered = document.getElementById("addSpriteNotMastered");
      const addSpriteMastered = document.getElementById("addSpriteMastered");
      const resetDialog = document.getElementById("resetDialog");
      const progressTrack = document.querySelector(".progress-track");
      const authToggleButton = document.getElementById("authToggleBtn");
      const syncState = document.getElementById("syncState");
      const syncStateText = document.getElementById("syncStateText");
      const accountAvatar = document.getElementById("accountAvatar");
      const firebaseIcon = document.getElementById("firebaseIcon");
      const variantProgressControls = [
        ["base", "Base"],
        ["gold", "Gold"],
        ["gummy", "Gummy"],
        ["galaxy", "Galaxy"],
        ["holofoil", "Holofoil"],
        ["cube", "Cube"],
        ["gem", "Gem"],
        ["quack", "Quack"]
      ].map(([key, suffix]) => {
        const fill = document.getElementById(`variant${suffix}Fill`);
        return {
          key,
          stat: document.getElementById(`variant${suffix}Stat`),
          fill,
          track: fill.parentElement
        };
      });

      function populateVariantFilterOptions() {
        const selectedValue = variantFilter.value || "all";
        variantFilter.innerHTML = [
          `<option value="all">${esc(t("allVariants"))}</option>`,
          ...Object.keys(variants).map(key => `<option value="${esc(key)}">${esc(localizedVariant(key))}</option>`)
        ].join("");
        variantFilter.value = selectedValue === "all" || variants[selectedValue] ? selectedValue : "all";
      }

      function applyStaticTranslations() {
        const setText = (selector, key) => {
          const element = document.querySelector(selector);
          if (element) element.textContent = t(key);
        };
        const setAttribute = (selector, attribute, key) => {
          const element = document.querySelector(selector);
          if (element) element.setAttribute(attribute, t(key));
        };
        const setOption = (selectId, value, key) => {
          const option = document.querySelector(`#${selectId} option[value="${value}"]`);
          if (option) option.textContent = t(key);
        };
        const setMeta = (selector, key) => {
          const meta = document.querySelector(selector);
          if (meta) meta.setAttribute("content", t(key));
        };

        document.documentElement.lang = APP_LANGUAGE;
        document.documentElement.dataset.language = APP_LANGUAGE;
        document.title = t("title");
        setMeta('meta[name="description"]', "description");
        setMeta('meta[property="og:title"]', "title");
        setMeta('meta[property="og:description"]', "socialDescription");
        setMeta('meta[property="og:image:alt"]', "socialImageAlt");
        setMeta('meta[name="twitter:title"]', "title");
        setMeta('meta[name="twitter:description"]', "socialDescription");
        setMeta('meta[name="twitter:image:alt"]', "socialImageAlt");
        const openGraphLocale = document.querySelector('meta[property="og:locale"]');
        if (openGraphLocale) openGraphLocale.content = APP_LANGUAGE === "fr" ? "fr_FR" : "en_US";

        setAttribute(".topbar", "aria-label", "navMain");
        setAttribute(".brand", "aria-label", "brandHome");
        setText(".brand-copy small", "brandSubtitle");
        setAttribute(".topbar-links", "aria-label", "quickAccess");
        document.querySelectorAll(".topbar-links a").forEach(link => {
          const target = link.dataset.pageTarget;
          if (target === "home") link.textContent = t("home");
          else if (target === "catalog") link.textContent = t("catalogNav");
          else if (target === "guide") link.textContent = "Guide";
          else if (target === "settings") link.textContent = APP_LANGUAGE === "fr" ? "Réglages" : "Settings";
          else if (target === "reviews") link.textContent = APP_LANGUAGE === "fr" ? "Avis" : "Reviews";
          else if (target === "patch-notes") link.textContent = t("patchNotesNav");
          else if (target === "admin") link.textContent = "Admin";
        });
        const heroTitle = document.querySelector(".hero-text h1");
        if (heroTitle) heroTitle.innerHTML = t("heroTitleHtml");

        setAttribute("#progress", "aria-label", "progressSection");
        syncStateText.textContent = navigator.onLine === false ? t("localOffline") : t("local");
        authToggleButton.innerHTML = `<span class="auth-google" aria-hidden="true">G</span><span>${t("connect")}</span>`;
        authToggleButton.setAttribute("aria-label", t("signIn"));

        const progressCopy = document.querySelector(".progress-copy");
        if (progressCopy) {
          progressCopy.querySelector(".progress-overline").textContent = t("globalProgress");
          progressCopy.querySelector("strong").textContent = t("seasonLocker");
          progressCopy.querySelector("small").textContent = t("progressCopy");
        }
        setText(".progress-ring span", "completed");
        setAttribute(".progress-track", "aria-label", "collectionCompleted");
        const statLabels = document.querySelectorAll(".stat > div > span");
        if (statLabels[0]) statLabels[0].textContent = t("ownedPlural");
        if (statLabels[1]) statLabels[1].textContent = t("masteredPlural");
        if (statLabels[2]) statLabels[2].textContent = t("missingPlural");
        setAttribute("#visitorCounter", "aria-label", "visitorCounterAria");
        setText("#visitorCounterTitle", "visitorCounterTitle");
        setText("#visitorCounterStatus", "visitorCounterLoading");
        setText("#visitorsTodayLabel", "visitorsToday");
        setText("#visitorsTotalLabel", "visitorsTotal");

        setText(".variant-overview .progress-overline", "lockerAnalysis");
        setText("#variantOverviewTitle", "progressByVariant");
        setText(".variant-overview-hint", "fiveCollections");
        document.querySelectorAll(".variant-meter").forEach(meter => {
          const key = meter.dataset.variant;
          const label = localizedVariant(key);
          const labelElement = meter.querySelector(".variant-meter-top span");
          const track = meter.querySelector(".variant-meter-track");
          if (labelElement) labelElement.innerHTML = `<i aria-hidden="true"></i>${label}`;
          if (track) track.setAttribute("aria-label", t("variantCompleted", { variant: label }));
        });

        setText(".section-kicker", "catalogNav");
        setText("#collectionTitle", "catalogTitle");
        const resultSummary = document.querySelector(".result-line > span:first-child");
        if (resultSummary) resultSummary.innerHTML = `<strong id="resultCount">${sprites.length}</strong> ${t("shown")}`;
        setText("#activeHint", "fullCatalog");
        setAttribute(".toolbar", "aria-label", "searchAndFilters");
        searchInput.placeholder = t("searchPlaceholder");
        searchInput.setAttribute("aria-label", t("searchAria"));
        setAttribute("#toolsToggle", "aria-label", "backupOptions");
        setAttribute(".chips", "aria-label", "collectionStatus");
        const statusKeys = { all: "all", missing: "missingFilter", mastered: "masteredFilter" };
        document.querySelectorAll("[data-status]").forEach(button => {
          button.textContent = t(statusKeys[button.dataset.status]);
        });

        variantFilter.setAttribute("aria-label", t("filterVariant"));
        populateVariantFilterOptions();
        rarityFilter.setAttribute("aria-label", t("filterRarity"));
        setOption("rarityFilter", "all", "allRarities");
        Object.keys(rarityLabels.en).forEach(key => setOption("rarityFilter", key, key));
        sortSelect.setAttribute("aria-label", t("sortCollection"));
        setOption("sortSelect", "catalog", "sortCatalog");
        setOption("sortSelect", "name", "sortName");
        setOption("sortSelect", "rarity", "sortRarity");
        setText("#exportBtn", "exportBackup");
        setText("#importBtn", "importBackup");
        setText("#resetBtn", "resetAll");

        const developerCredit = document.querySelector(".developer-credit");
        if (developerCredit) developerCredit.innerHTML = `<span class="developer-signal" aria-hidden="true"></span>${t("developedBy")} <strong>PrimeSyntax</strong> <span aria-hidden="true">.</span>`;
        setAttribute(".mobile-dock", "aria-label", "mobileNav");
        document.querySelectorAll(".mobile-dock-item").forEach(item => {
          const target = item.dataset.pageTarget;
          const span = item.querySelector("span");
          if (!span) return;
          if (target === "home") span.textContent = t("home");
          else if (target === "catalog") span.textContent = t("catalogNav");
          else if (target === "guide") span.textContent = "Guide";
          else if (target === "settings") span.textContent = APP_LANGUAGE === "fr" ? "Réglages" : "Settings";
          else if (target === "reviews") span.textContent = APP_LANGUAGE === "fr" ? "Avis" : "Reviews";
          else if (target === "patch-notes") span.textContent = t("patchNotesNav");
          else if (target === "admin") span.textContent = "Admin";
        });
        setAttribute("#topBtn", "aria-label", "backToTop");

        setText("#patchKicker", "patchKicker");
        const patchTitle = document.getElementById("patchNotesTitle");
        if (patchTitle) patchTitle.innerHTML = t("patchTitleHtml");
        setText("#patchLead", "patchLead");
        setAttribute(".patch-metrics", "aria-label", "patchSummaryAria");
        [
          ["#patchMetricTotal", "patchMetricTotal"],
          ["#patchMetricAdded", "patchMetricAdded"],
          ["#patchMetricFamilies", "patchMetricFamilies"],
          ["#patchNewTitle", "patchNewTitle"],
          ["#patchNewJohn", "patchNewJohn"],
          ["#patchNewLlama", "patchNewLlama"],
          ["#patchNewPeely", "patchNewPeely"],
          ["#patchVariantsTitle", "patchVariantsTitle"],
          ["#patchVariantsQuack", "patchVariantsQuack"],
          ["#patchVariantsZero", "patchVariantsZero"],
          ["#patchVariantsRare", "patchVariantsRare"],
          ["#patchAppTitle", "patchAppTitle"],
          ["#patchAppLevels", "patchAppLevels"],
          ["#patchAppData", "patchAppData"],
          ["#patchAppFilters", "patchAppFilters"],
          ["#patchNoticeTitle", "patchNoticeTitle"],
          ["#patchNoticeCopy", "patchNoticeCopy"],
          ["#patchCatalogButton", "patchCatalogButton"]
        ].forEach(([selector, key]) => setText(selector, key));
        const patchDateText = document.getElementById("patchDateText");
        if (patchDateText) {
          const formattedDate = new Intl.DateTimeFormat(APP_LOCALE, {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/Paris"
          }).format(new Date(PATCH_RELEASED_AT));
          patchDateText.textContent = `${formattedDate} · ${t("parisTime")}`;
        }

        setAttribute("#detailClose", "aria-label", "close");
        setText(".effect-box strong", "ability");
        setText(".variant-box strong", "variantBonus");
        setText("#dialogOwned", "iHave");
        setText("#dialogMastered", "mastered");
        setText("#dialogNext", "next");
        const notesLabel = document.querySelector(".notes-label");
        if (notesLabel && notesLabel.firstChild) notesLabel.firstChild.nodeValue = t("personalNote");
        const note = document.getElementById("dialogNote");
        if (note) note.placeholder = t("notePlaceholder");
        setText("#addSpriteDialogKicker", "addDialogKicker");
        setText("#addSpriteDialogTitle", "addDialogTitle");
        setText("#addSpriteDialogCopy", "addDialogCopy");
        setText("#addSpriteMasteryLabel", "masteryQuestion");
        setText("#addSpriteNotMastered", "notMastered");
        setText("#addSpriteMastered", "yesMastered");
        setText("#cancelAddSprite", "cancel");
        setText("#confirmAddSprite", "confirmAdd");
        setText("#removeSpriteDialogKicker", "removeDialogKicker");
        setText("#removeSpriteDialogTitle", "removeDialogTitle");
        setText("#removeSpriteDialogCopy", "removeDialogCopy");
        setText("#cancelRemoveSprite", "keepInLocker");
        setText("#confirmRemoveSprite", "confirmRemove");
        setText("#resetDialog h2", "resetTitle");
        setText("#resetDialog p", "resetCopy");
        setText("#cancelReset", "cancel");
        setText("#confirmReset", "eraseAll");
      }

      function blankEntry() {
        return { owned: false, mastered: false, note: "", modifiedAt: 0 };
      }

      function normalizeEntry(value) {
        const entry = blankEntry();
        if (!value || typeof value !== "object") return entry;
        entry.owned = Boolean(value.owned);
        entry.mastered = Boolean(value.mastered);
        entry.note = typeof value.note === "string" ? value.note.slice(0, 500) : "";
        entry.modifiedAt = Math.max(0, Number(value.modifiedAt) || 0);
        if (entry.mastered) entry.owned = true;
        return entry;
      }

      function loadState() {
        try {
          const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
          const result = {};
          sprites.forEach(sprite => { result[sprite.id] = normalizeEntry(saved[sprite.id]); });
          return result;
        } catch (_) {
          const result = {};
          sprites.forEach(sprite => { result[sprite.id] = blankEntry(); });
          return result;
        }
      }

      function loadLocalUpdatedAt() {
        try {
          const raw = localStorage.getItem(META_KEY);
          const saved = raw ? JSON.parse(raw) : null;
          const timestamp = typeof saved === "number" ? saved : Number(saved && saved.updatedAtMs);
          if (Number.isFinite(timestamp) && timestamp > 0) return timestamp;
          if (localStorage.getItem(STORAGE_KEY)) return Date.now();
        } catch (_) {}
        return 0;
      }

      function nextMutationTime() {
        localUpdatedAt = Math.max(Date.now(), localUpdatedAt + 1);
        return localUpdatedAt;
      }

      function touchEntry(entry) {
        entry.modifiedAt = nextMutationTime();
        return entry;
      }

      function saveState({ sync = true } = {}) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
          localStorage.setItem(META_KEY, JSON.stringify({ updatedAtMs: localUpdatedAt }));
        } catch (_) {}
        if (sync) scheduleCloudSync();
      }

      function entriesEqual(left, right) {
        return left.owned === right.owned &&
          left.mastered === right.mastered &&
          left.note === right.note &&
          left.modifiedAt === right.modifiedAt;
      }

      function stateFingerprint(collection = state) {
        return JSON.stringify(sprites.map(sprite => {
          const entry = normalizeEntry(collection[sprite.id]);
          return [sprite.id, entry.owned, entry.mastered, entry.note, entry.modifiedAt];
        }));
      }

      function esc(value) {
        return String(value).replace(/[&<>'"]/g, char => ({
          "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
        })[char]);
      }

      function cardTemplate(sprite, index) {
        const entry = state[sprite.id] || blankEntry();
        const variant = variants[sprite.variant];
        const name = localizedName(sprite);
        const immediateImage = index < 8;
        const classes = ["sprite-card", entry.owned ? "owned" : "", entry.mastered ? "mastered" : ""].filter(Boolean).join(" ");
        return `
          <article class="${classes}" data-id="${sprite.id}" data-rarity="${sprite.rarity}" data-variant="${sprite.variant}" style="--glow:${rarityGlow[sprite.rarity]};--variant-color:${variant.color}">
            <div class="card-media">
              <button class="image-button" type="button" data-action="details" data-id="${sprite.id}" aria-label="${esc(t("viewDetails", { name }))}">
                <div class="sprite-image">
                <img ${immediateImage ? `src="${sprite.image}"` : `data-src="${sprite.image}"`} class="${immediateImage ? "is-loading" : "is-pending"}" alt="${esc(name)}" width="600" height="600" loading="${immediateImage ? "eager" : "lazy"}" decoding="async" fetchpriority="${index < 3 ? "high" : "low"}" referrerpolicy="no-referrer">
                </div>
              </button>
              <div class="badges">
                <span class="badge ${sprite.rarity}">${rarityLabel(sprite.rarity)}</span>
                <span class="badge variant">${localizedVariant(sprite.variant)}</span>
              </div>
              <span class="card-mastery-status" aria-hidden="true">★ ${t("mastered")}</span>
              <button class="locker-toggle" type="button" data-action="owned" data-id="${sprite.id}" aria-pressed="${entry.owned}" aria-label="${esc(entry.owned ? t("removeFromLocker") : t("addToLocker"))} : ${esc(name)}"><span class="locker-toggle-icon" aria-hidden="true">${entry.owned ? "✓" : "+"}</span><span class="locker-toggle-label">${entry.owned ? t("inLocker") : t("addShort")}</span></button>
              <button class="info-btn" type="button" data-action="details" data-id="${sprite.id}" aria-label="${esc(t("informationAbout", { name }))}">i</button>
            </div>
            <div class="card-body">
              <div class="card-headerline">
                <span class="card-catalog">${t("spriteNumber", { number: String(sprite.catalogNumber).padStart(3, "0") })}</span>
                <span class="card-state-label">${entry.owned ? t("obtained") : t("missing")}</span>
              </div>
              <div class="card-title-row">
                <div>
                  <h3 class="card-title">${esc(name)}</h3>
                  <span class="card-subtitle">${t("chapterSeasonShort")}</span>
                </div>
              </div>
            </div>
          </article>`;
      }

      function syncSpriteCardState(card, sprite) {
        const entry = state[sprite.id] || blankEntry();
        const stateSignature = `${Number(entry.owned)}:${Number(entry.mastered)}`;
        if (card.dataset.stateSignature === stateSignature) return;
        card.classList.toggle("owned", entry.owned);
        card.classList.toggle("mastered", entry.mastered);

        const ownedButton = card.querySelector(".locker-toggle");
        const stateLabel = card.querySelector(".card-state-label");
        if (ownedButton) {
          const name = localizedName(sprite);
          ownedButton.setAttribute("aria-pressed", String(entry.owned));
          ownedButton.setAttribute("aria-label", `${entry.owned ? t("removeFromLocker") : t("addToLocker")} : ${name}`);
          ownedButton.innerHTML = `<span class="locker-toggle-icon" aria-hidden="true">${entry.owned ? "✓" : "+"}</span><span class="locker-toggle-label">${entry.owned ? t("inLocker") : t("addShort")}</span>`;
        }
        if (stateLabel) stateLabel.textContent = entry.owned ? t("obtained") : t("missing");
        card.dataset.stateSignature = stateSignature;
      }

      function spriteCardElement(sprite, index) {
        let card = spriteCardCache.get(sprite.id);
        if (!card) {
          const template = document.createElement("template");
          template.innerHTML = cardTemplate(sprite, index).trim();
          card = template.content.firstElementChild;
          spriteCardCache.set(sprite.id, card);
        }
        syncSpriteCardState(card, sprite);
        return card;
      }

      function normalizedText(value) {
        return String(value ?? "")
          .normalize("NFKD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[’'`´]/g, " ")
          .replace(/&/g, " et ")
          .replace(/[^a-z0-9]+/gi, " ")
          .trim()
          .replace(/\s+/g, " ")
          .toLowerCase();
      }

      const SEARCH_IGNORED_TOKENS = new Set([
        "a", "au", "aux", "d", "de", "des", "du", "en", "et", "l", "la", "le", "les", "un", "une",
        "and", "for", "of", "the", "to", "ability", "bonus", "capacite", "esprit", "esprits", "level", "niveau", "sprite", "sprites", "variant", "variante"
      ]);

      function searchTokens(value, { ignoreGeneric = false } = {}) {
        const tokens = normalizedText(value).split(" ").filter(Boolean);
        if (!ignoreGeneric) return tokens;
        const meaningful = tokens.filter(token => !SEARCH_IGNORED_TOKENS.has(token));
        return meaningful.length ? meaningful : tokens;
      }

      function copyMapCode(code, buttonEl) {
        if (!code) return;
        try {
          navigator.clipboard.writeText(code);
          playSfx("click");
          if (buttonEl) {
            const prevText = buttonEl.textContent;
            buttonEl.textContent = "Copié ! ✓";
            buttonEl.style.background = "#4fe29a";
            buttonEl.style.color = "#000";
            setTimeout(() => {
              buttonEl.textContent = prevText;
              buttonEl.style.background = "";
              buttonEl.style.color = "";
            }, 1800);
          }
          showToast(`Code d'île copié : ${code}`);
        } catch (_) {
          showToast(`Code : ${code}`);
        }
      }

      document.addEventListener("click", event => {
        const copyBtn = event.target.closest("[data-action='copy-code']");
        if (copyBtn) {
          event.preventDefault();
          copyMapCode(copyBtn.dataset.code, copyBtn);
          return;
        }

        const mapCatBtn = event.target.closest("[data-maps-category]");
        if (mapCatBtn) {
          document.querySelectorAll("[data-maps-category]").forEach(b => b.classList.remove("is-active"));
          currentMapsCategory = mapCatBtn.dataset.mapsCategory;
          mapCatBtn.classList.add("is-active");
          playSfx("click");
          renderMaps();
          return;
        }
      });

      document.getElementById("mapsSearchInput")?.addEventListener("input", event => {
        currentMapsSearch = event.target.value;
        renderMaps();
      });

      let currentMapsCategory = "all";
      let currentMapsSearch = "";
      let editingMapId = null;

      function renderMapCategoryFilters(mapsList) {
        const container = document.getElementById("mapsCategoryFilters");
        if (!container) return;

        if (!mapsList || mapsList.length === 0) {
          container.innerHTML = "";
          container.style.display = "none";
          return;
        }

        container.style.display = "flex";

        const availableCategories = Array.from(
          new Set(mapsList.map(m => String(m.category || "Général").trim()).filter(Boolean))
        );

        if (currentMapsCategory !== "all" && !availableCategories.includes(currentMapsCategory)) {
          currentMapsCategory = "all";
        }

        let html = `<button class="tips-chip${currentMapsCategory === "all" ? " is-active" : ""}" data-maps-category="all" type="button">Toutes les maps 🗺️ (${mapsList.length})</button>`;

        availableCategories.forEach(cat => {
          const count = mapsList.filter(m => String(m.category || "Général").trim() === cat).length;
          const isActive = currentMapsCategory === cat;
          html += `<button class="tips-chip${isActive ? " is-active" : ""}" data-maps-category="${esc(cat)}" type="button">${esc(cat)} (${count})</button>`;
        });

        container.innerHTML = html;
      }

      function renderMaps() {
        const grid = document.getElementById("mapsGrid");
        const countTotal = document.getElementById("mapsCountTotal");
        if (!grid) return;

        const mapsList = Array.isArray(adminContent.creativeMaps) ? adminContent.creativeMaps : [];

        if (countTotal) countTotal.textContent = String(mapsList.length);

        renderMapCategoryFilters(mapsList);

        const query = normalizedText(currentMapsSearch);

        const filtered = mapsList.filter(map => {
          const cat = String(map.category || "Général").trim();
          if (currentMapsCategory !== "all" && cat !== currentMapsCategory) return false;
          if (!query) return true;
          const titleMatch = normalizedText(map.title).includes(query);
          const codeMatch = normalizedText(map.code).includes(query);
          const descMatch = normalizedText(map.description || "").includes(query);
          const catMatch = normalizedText(cat).includes(query);
          return titleMatch || codeMatch || descMatch || catMatch;
        });

        if (filtered.length === 0) {
          const emptyCopy = mapsList.length === 0
            ? "L'administrateur n'a pas encore publié de carte sur le site."
            : "Aucune carte ne correspond à ta recherche dans cette catégorie.";
          grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: rgba(8,13,32,0.6); border: 1px dashed rgba(255,255,255,0.15); border-radius: 18px;">
              <span style="font-size: 2.5rem; display: block; margin-bottom: 10px;">🗺️</span>
              <h3 style="margin: 0 0 6px; color: #fff; font-size: 1.1rem;">${mapsList.length === 0 ? "Aucune map disponible" : "Aucune map trouvée"}</h3>
              <p style="margin: 0; color: #8b97b7; font-size: 0.88rem;">${emptyCopy}</p>
            </div>
          `;
          return;
        }

        grid.innerHTML = filtered.map(map => {
          const badgeLabel = map.category ? String(map.category).trim() : "🗺️ Carte Créative";
          return `
            <article class="map-card" data-map-id="${esc(map.id)}">
              <div class="map-card-thumb">
                <img src="${esc(map.image)}" alt="${esc(map.title)}" loading="lazy" onerror="this.onerror=null;this.src='https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_CokeParmesan_Default_L.webp';">
                <span class="map-card-badge">${esc(badgeLabel)}</span>
              </div>
              <div class="map-card-content">
                <h3 class="map-card-title">${esc(map.title)}</h3>
                ${map.description ? `<p class="map-card-desc">${esc(map.description)}</p>` : ""}
                <div class="map-card-code-row">
                  <div class="map-code-box">
                    <span class="map-code-label">Code d'île</span>
                    <strong class="map-code-value">${esc(map.code)}</strong>
                  </div>
                  <button class="map-copy-btn" type="button" data-action="copy-code" data-code="${esc(map.code)}">
                    <span aria-hidden="true">📋</span>
                    <span>Copier</span>
                  </button>
                </div>
              </div>
            </article>
          `;
        }).join("");
      }

      function renderAdminMapQuickList() {
        const list = document.getElementById("adminMapQuickList");
        if (!list) return;
        const maps = adminDraft && Array.isArray(adminDraft.creativeMaps) && adminDraft.creativeMaps.length
          ? adminDraft.creativeMaps
          : (adminContent.creativeMaps || []);

        list.innerHTML = maps.length ? maps.map((map, index) => {
          const published = (adminContent.creativeMaps || []).some(m => m.id === map.id || (m.code === map.code && m.title === map.title));
          const mapId = map.id || `map-${index}`;
          return `<article class="admin-patch-quick-row">
            <div><strong>${esc(map.title || "Map Créative")}</strong><small>${esc(map.code || "Sans code")} · ${published ? "publiée" : "brouillon"}</small></div>
            <div class="admin-patch-quick-actions">
              <button type="button" data-admin-manage-action="edit" data-admin-manage-type="map" data-admin-manage-index="${index}" data-map-id="${esc(mapId)}"><span aria-hidden="true">✎</span>Modifier</button>
              <button class="is-danger" type="button" data-admin-manage-action="delete" data-admin-manage-type="map" data-admin-manage-index="${index}" data-map-id="${esc(mapId)}"><span aria-hidden="true">×</span>Supprimer</button>
            </div>
          </article>`;
        }).join("") : `<div class="empty-state"><strong>Aucune Map enregistrée</strong>Les maps publiées apparaîtront ici avec leurs boutons de gestion.</div>`;
      }

      function normalizedPage(value) {
        const route = String(value || "").split("/")[0];
        if (route === "inventory") return "catalog";
        return ["home", "catalog", "guide", "maps", "settings", "admin", "patch-notes", "reviews"].includes(route) ? route : "home";
      }

      function updateCollectionPageCopy() {
        const kicker = document.querySelector(".collection-area .section-kicker");
        if (kicker) kicker.textContent = t("catalogNav");
        document.getElementById("collectionTitle").textContent = t("catalogTitle");
        document.getElementById("activeHint").textContent = t("fullCatalog");
      }

      function showPage(page, { updateHash = true } = {}) {
        activePage = normalizedPage(String(page || "home").replace(/^#/, ""));
        const homeVisible = activePage === "home";
        const collectionVisible = activePage === "catalog";
        const patchNotesVisible = activePage === "patch-notes";
        const guideVisible = activePage === "guide";
        const mapsVisible = activePage === "maps";
        const settingsVisible = activePage === "settings";
        const adminVisible = activePage === "admin";
        const reviewsVisible = activePage === "reviews";

        document.documentElement.dataset.appPage = activePage;
        document.getElementById("homePage").classList.toggle("is-active", homeVisible);
        document.getElementById("collectionPage").classList.toggle("is-active", collectionVisible);
        document.getElementById("patchNotesPage").classList.toggle("is-active", patchNotesVisible);
        document.getElementById("guidePage").classList.toggle("is-active", guideVisible);
        if (document.getElementById("mapsPage")) {
          document.getElementById("mapsPage").classList.toggle("is-active", mapsVisible);
        }
        document.getElementById("settingsPage").classList.toggle("is-active", settingsVisible);
        document.getElementById("adminPage").classList.toggle("is-active", adminVisible);
        if (document.getElementById("reviewsPage")) {
          document.getElementById("reviewsPage").classList.toggle("is-active", reviewsVisible);
        }

        document.querySelectorAll("[data-page-target]").forEach(link => {
          if (link.dataset.pageTarget === activePage) link.setAttribute("aria-current", "page");
          else link.removeAttribute("aria-current");
        });
        const mobileDock = document.querySelector(".mobile-dock");
        const activeMobileLink = mobileDock?.querySelector(`[data-page-target="${activePage}"]`);
        if (mobileDock && activeMobileLink && typeof mobileDock.scrollTo === "function" && window.innerWidth <= 700) {
          const targetLeft = activeMobileLink.offsetLeft - (mobileDock.clientWidth - activeMobileLink.offsetWidth) / 2;
          mobileDock.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
        }

        statusFilter = "all";
        document.querySelectorAll("[data-status]").forEach(button => {
          button.setAttribute("aria-selected", String(activePage === "catalog" && button.dataset.status === "all"));
        });
        if (collectionVisible) {
          updateCollectionPageCopy();
          render();
        } else if (guideVisible) {
          renderGuide();
          updateStats();
        } else if (mapsVisible) {
          renderMaps();
          updateStats();
        } else if (settingsVisible) {
          renderAppearanceControls();
          updateStats();
        } else if (adminVisible) {
          renderAdminAccess();
          updateStats();
        } else if (reviewsVisible) {
          if (typeof fetchReviews === "function") fetchReviews();
          updateStats();
        } else {
          updateStats();
        }

        const nextHash = `#${activePage}`;
        if (updateHash && location.hash !== nextHash) history.pushState({ page: activePage }, "", nextHash);
        else if (!updateHash && location.hash !== nextHash) history.replaceState({ page: activePage }, "", nextHash);
        if (typeof window.scrollTo === "function") window.scrollTo({ top: 0, behavior: "auto" });
      }

      function setupMobileDockSwipe() {
        const dock = document.querySelector(".mobile-dock");
        if (!dock || dock.dataset.swipeReady === "true") return;
        dock.dataset.swipeReady = "true";
        let startX = 0;
        let startY = 0;
        let startScrollLeft = 0;
        let tracking = false;
        let suppressClick = false;

        dock.addEventListener("touchstart", event => {
          if (event.touches.length !== 1) return;
          const touch = event.touches[0];
          startX = touch.clientX;
          startY = touch.clientY;
          startScrollLeft = dock.scrollLeft;
          tracking = true;
          suppressClick = false;
        }, { passive: true });

        dock.addEventListener("touchmove", event => {
          if (!tracking || event.touches.length !== 1) return;
          const touch = event.touches[0];
          const deltaX = startX - touch.clientX;
          const deltaY = startY - touch.clientY;
          if (Math.abs(deltaX) <= Math.abs(deltaY) || Math.abs(deltaX) < 3) return;
          event.preventDefault();
          suppressClick = true;
          dock.classList.add("is-dragging");
          dock.scrollLeft = startScrollLeft + deltaX;
        }, { passive: false });

        const endTouch = () => {
          tracking = false;
          dock.classList.remove("is-dragging");
          setTimeout(() => { suppressClick = false; }, 160);
        };
        dock.addEventListener("touchend", endTouch, { passive: true });
        dock.addEventListener("touchcancel", endTouch, { passive: true });
        dock.addEventListener("click", event => {
          if (!suppressClick) return;
          event.preventDefault();
          event.stopPropagation();
        }, true);
        dock.addEventListener("wheel", event => {
          if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
          event.preventDefault();
          dock.scrollLeft += event.deltaY;
        }, { passive: false });
      }

      function getVisibleSprites() {
        const rawQuery = searchInput.value.trim();
        const query = normalizedText(rawQuery);
        const selectedVariant = variantFilter.value;
        const selectedRarity = rarityFilter.value;

        const result = sprites.map(sprite => {
          const entry = state[sprite.id] || blankEntry();
          const searchScore = query ? scoreSpriteSearch(sprite, rawQuery) : 1;
          const matchesVariant = selectedVariant === "all" || sprite.variant === selectedVariant;
          const matchesRarity = selectedRarity === "all" || sprite.rarity === selectedRarity;
          const matchesStatus = statusFilter === "all" ||
            (statusFilter === "missing" && !entry.owned) ||
            (statusFilter === "mastered" && entry.mastered);
          return { sprite, searchScore, visible: searchScore > 0 && matchesVariant && matchesRarity && matchesStatus };
        }).filter(item => item.visible);

        const compareBySelectedSort = (a, b) => {
          if (sortSelect.value === "name") {
            return localizedName(a.sprite).localeCompare(localizedName(b.sprite), APP_LOCALE);
          }
          if (sortSelect.value === "rarity") {
            return rarityRank[b.sprite.rarity] - rarityRank[a.sprite.rarity] ||
              a.sprite.familyIndex - b.sprite.familyIndex || a.sprite.variantIndex - b.sprite.variantIndex;
          }
          return a.sprite.familyIndex - b.sprite.familyIndex || a.sprite.variantIndex - b.sprite.variantIndex;
        };

        result.sort((a, b) => (query ? b.searchScore - a.searchScore : 0) || compareBySelectedSort(a, b));
        return result.map(item => item.sprite);
      }

      function familyVariantTileTemplate(sprite, imageIndex) {
        const entry = state[sprite.id] || blankEntry();
        const variant = variants[sprite.variant];
        const name = localizedName(sprite);
        const immediateImage = imageIndex < 12;
        return `
          <article class="family-variant-tile${entry.owned ? " is-owned" : " is-missing"}${entry.mastered ? " is-mastered" : ""}" data-id="${esc(sprite.id)}" data-variant="${esc(sprite.variant)}" style="--variant-color:${variant.color}">
            <button class="family-variant-visual" type="button" data-action="details" data-id="${esc(sprite.id)}" aria-label="${esc(t("viewDetails", { name }))}">
              <img ${immediateImage ? `src="${sprite.image}"` : `data-src="${sprite.image}"`} class="${immediateImage ? "is-loading" : "is-pending"}" alt="${esc(`${name} · ${localizedVariant(sprite.variant)}`)}" width="240" height="240" loading="${immediateImage ? "eager" : "lazy"}" decoding="async" fetchpriority="${imageIndex < 4 ? "high" : "low"}" referrerpolicy="no-referrer">
              <span class="family-variant-lock"${entry.owned ? " hidden" : ""} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="10" width="14" height="11" rx="3"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path></svg></span>
              <span class="family-variant-mastered"${entry.mastered ? "" : " hidden"} aria-hidden="true">★</span>
            </button>
            <strong class="family-variant-name">${esc(localizedVariant(sprite.variant))}</strong>
            <button class="family-variant-action" type="button" data-action="owned" data-id="${esc(sprite.id)}" aria-pressed="${entry.owned}" aria-label="${esc(entry.owned ? t("removeFromLocker") : t("addToLocker"))} : ${esc(name)}"><span aria-hidden="true">${entry.owned ? "✓" : "+"}</span>${entry.owned ? t("inLocker") : t("addShort")}</button>
          </article>`;
      }

      function familyRowTemplate(familySprites, rowIndex, imageOffset) {
        const familyKey = familySprites[0].familyKey;
        const allFamilySprites = sprites.filter(sprite => sprite.familyKey === familyKey).sort((a, b) => a.variantIndex - b.variantIndex);
        const representative = allFamilySprites.find(sprite => sprite.variant === "base") || allFamilySprites[0] || familySprites[0];
        const familyName = localizedName(representative);
        const ownedCount = allFamilySprites.filter(sprite => (state[sprite.id] || blankEntry()).owned).length;
        const totalCount = allFamilySprites.length;
        const progress = totalCount ? Math.round((ownedCount / totalCount) * 100) : 0;
        const trackId = `family-track-${String(familyKey).replace(/[^a-z0-9_-]/gi, "-")}`;
        return `
          <section class="family-row" data-family="${esc(familyKey)}" data-row-index="${rowIndex}" style="--family-glow:${rarityGlow[representative.rarity]};--family-progress:${progress}%">
            <header class="family-row-head">
              <div class="family-row-title"><i aria-hidden="true"></i><h3>${esc(familyName)}</h3><button type="button" data-action="details" data-id="${esc(representative.id)}" aria-label="${esc(t("informationAbout", { name: familyName }))}">i</button></div>
              <div class="family-row-count"><strong>${ownedCount}/${totalCount}</strong><span>${APP_LANGUAGE === "fr" ? "variantes" : "variants"}</span></div>
              <div class="family-scroll-controls" aria-hidden="false">
                <button type="button" data-action="scroll-family" data-direction="-1" aria-controls="${esc(trackId)}" aria-label="${APP_LANGUAGE === "fr" ? "Variantes précédentes" : "Previous variants"}">‹</button>
                <button type="button" data-action="scroll-family" data-direction="1" aria-controls="${esc(trackId)}" aria-label="${APP_LANGUAGE === "fr" ? "Variantes suivantes" : "Next variants"}">›</button>
              </div>
            </header>
            <div class="family-row-progress" role="progressbar" aria-label="${esc(familyName)}" aria-valuemin="0" aria-valuemax="${totalCount}" aria-valuenow="${ownedCount}"><i></i></div>
            <div class="family-row-body">
              <button class="family-preview" type="button" data-action="details" data-id="${esc(representative.id)}" aria-label="${esc(t("viewDetails", { name: familyName }))}"><img ${rowIndex < 6 ? `src="${representative.image}"` : `data-src="${representative.image}"`} class="${rowIndex < 6 ? "is-loading" : "is-pending"}" alt="${esc(familyName)}" width="260" height="260" loading="${rowIndex < 6 ? "eager" : "lazy"}" decoding="async" referrerpolicy="no-referrer"></button>
              <div class="family-variants-shell">
                <div class="family-variants-track" id="${esc(trackId)}" tabindex="0" aria-label="${esc(`${familyName} · ${APP_LANGUAGE === "fr" ? "variantes, fais glisser vers la droite" : "variants, swipe right"}`)}">
                  ${familySprites.map((sprite, index) => familyVariantTileTemplate(sprite, imageOffset + index)).join("")}
                </div>
              </div>
            </div>
          </section>`;
      }

      function groupedVisibleSpriteRows(visibleSprites) {
        const groups = new Map();
        visibleSprites.forEach(sprite => {
          if (!groups.has(sprite.familyKey)) groups.set(sprite.familyKey, []);
          groups.get(sprite.familyKey).push(sprite);
        });
        return [...groups.values()].map(group => group.sort((a, b) => a.variantIndex - b.variantIndex));
      }

      function setupFamilyVariantCarousels() {
        grid.querySelectorAll(".family-variants-track").forEach(track => {
          const updateEdges = () => {
            track.dataset.atStart = String(track.scrollLeft <= 2);
            track.dataset.atEnd = String(track.scrollLeft + track.clientWidth >= track.scrollWidth - 2);
          };
          track.addEventListener("scroll", updateEdges, { passive: true });
          track.addEventListener("wheel", event => {
            if (track.scrollWidth <= track.clientWidth || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
            const atStart = track.scrollLeft <= 1;
            const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
            if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd)) return;
            event.preventDefault();
            track.scrollLeft += event.deltaY;
          }, { passive: false });
          updateEdges();
        });
      }

      function settleSpriteImage(image, loaded) {
        image.classList.remove("is-pending", "is-loading");
        image.classList.toggle("is-loaded", loaded);
        image.classList.toggle("broken", !loaded);
        if (loaded && image.currentSrc) warmedImageUrls.add(image.currentSrc);
      }

      function trackSpriteImage(image) {
        if (image.dataset.imageTracked === "true") return;
        image.dataset.imageTracked = "true";
        if (image.complete) {
          settleSpriteImage(image, image.naturalWidth > 0);
          return;
        }
        image.addEventListener("load", () => {
          if (typeof image.decode === "function") {
            image.decode().catch(() => {}).finally(() => settleSpriteImage(image, true));
          } else {
            settleSpriteImage(image, true);
          }
        }, { once: true });
        image.addEventListener("error", () => settleSpriteImage(image, false), { once: true });
      }

      function activateSpriteImage(image, eager = true) {
        const source = image.dataset.src;
        if (!source) {
          trackSpriteImage(image);
          return;
        }
        image.classList.remove("is-pending");
        image.classList.add("is-loading");
        image.loading = eager ? "eager" : "lazy";
        image.fetchPriority = eager ? "auto" : "low";
        delete image.dataset.src;
        image.src = source;
        trackSpriteImage(image);
      }

      function setupProgressiveSpriteImages() {
        if (spriteImageObserver) {
          spriteImageObserver.disconnect();
          spriteImageObserver = null;
        }
        const images = [...grid.querySelectorAll(".sprite-image img, .family-preview img, .family-variant-visual img")];
        images.filter(image => image.hasAttribute("src")).forEach(trackSpriteImage);
        const pending = images.filter(image => image.dataset.src);
        if (!pending.length) return;

        if ("IntersectionObserver" in window) {
          spriteImageObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (!entry.isIntersecting) return;
              spriteImageObserver.unobserve(entry.target);
              activateSpriteImage(entry.target, true);
            });
          }, {
            root: null,
            rootMargin: window.innerWidth < 720 ? "1800px 0px" : "1300px 0px",
            threshold: 0.01
          });
          pending.forEach(image => spriteImageObserver.observe(image));
        } else {
          pending.forEach(image => activateSpriteImage(image, false));
        }
      }

      function isStandaloneDisplay() {
        return Boolean(
          window.matchMedia?.("(display-mode: standalone)").matches
          || window.matchMedia?.("(display-mode: fullscreen)").matches
          || window.navigator.standalone === true
        );
      }

      function isPwaInstalledOnThisDevice() {
        return isStandaloneDisplay() || localStorage.getItem(PWA_INSTALLED_KEY) === "1";
      }

      function markPwaInstalled() {
        localStorage.setItem(PWA_INSTALLED_KEY, "1");
        document.documentElement.classList.add("pwa-installed");
        deferredInstallPrompt = null;
        hidePwaInstallBanner();
      }

      function showPwaInstallBanner() {
        if (pwaInstallBannerDismissed || isPwaInstalledOnThisDevice()) return;
        const banner = document.getElementById("pwaInstallBanner");
        if (!banner) return;
        banner.hidden = false;
      }

      function hidePwaInstallBanner() {
        const banner = document.getElementById("pwaInstallBanner");
        if (banner) banner.hidden = true;
      }

      async function detectRelatedInstalledApp() {
        if (typeof navigator.getInstalledRelatedApps !== "function") return false;
        try {
          const installed = await navigator.getInstalledRelatedApps();
          return installed.some(app => app.platform === "webapp" || app.url?.includes("manifest.webmanifest"));
        } catch (_) {
          return false;
        }
      }

      function installInstructions() {
        const ua = navigator.userAgent || "";
        const isIos = /iPad|iPhone|iPod/i.test(ua);
        const isAndroid = /Android/i.test(ua);
        if (isIos) {
          return {
            copy: "Sur iPhone ou iPad, l’installation se fait depuis Safari.",
            steps: ["Ouvre ce site dans Safari.", "Appuie sur le bouton Partager.", "Choisis « Sur l’écran d’accueil », puis confirme avec Ajouter."]
          };
        }
        if (isAndroid) {
          return {
            copy: "L’option d’installation se trouve dans le menu de ton navigateur.",
            steps: ["Ouvre le menu ⋮ en haut à droite.", "Choisis « Installer l’application » ou « Ajouter à l’écran d’accueil ».", "Confirme l’installation de Sprite Locker."]
          };
        }
        return {
          copy: "Ton navigateur n’a pas ouvert automatiquement la fenêtre d’installation.",
          steps: ["Ouvre le menu principal du navigateur.", "Choisis « Installer Sprite Locker » ou l’icône d’installation dans la barre d’adresse.", "Confirme pour ouvrir ensuite Sprite Locker comme une application."]
        };
      }

      function openInstallHelp() {
        const dialog = document.getElementById("pwaInstallHelp");
        const copy = document.getElementById("pwaInstallHelpCopy");
        const list = document.getElementById("pwaInstallSteps");
        if (!dialog || !copy || !list) return;
        const instructions = installInstructions();
        copy.textContent = instructions.copy;
        list.replaceChildren(...instructions.steps.map(step => {
          const item = document.createElement("li");
          item.textContent = step;
          return item;
        }));
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
      }

      async function requestPersistentStorage() {
        if (!navigator.storage?.persist) return;
        try { await navigator.storage.persist(); } catch (_) {}
      }

      async function installPwaFromBanner() {
        requestPersistentStorage();
        if (!deferredInstallPrompt) {
          /* Some browsers (e.g. Samsung Internet) fire beforeinstallprompt late.
             Wait briefly to see if one arrives before showing manual instructions. */
          const latePrompt = await new Promise(resolve => {
            const handler = event => { event.preventDefault(); resolve(event); };
            window.addEventListener("beforeinstallprompt", handler, { once: true });
            setTimeout(() => { window.removeEventListener("beforeinstallprompt", handler); resolve(null); }, 800);
          });
          if (latePrompt) {
            deferredInstallPrompt = latePrompt;
          } else {
            openInstallHelp();
            return;
          }
        }
        const button = document.getElementById("pwaInstallButton");
        if (button) button.disabled = true;
        const prompt = deferredInstallPrompt;
        deferredInstallPrompt = null;
        try {
          await prompt.prompt();
          const choice = await prompt.userChoice;
          if (choice?.outcome === "accepted") {
            markPwaInstalled();
          } else {
            /* User dismissed — allow them to retry without reloading the page.
               Re-store if the browser allows re-use, otherwise wait for a new event. */
            deferredInstallPrompt = prompt;
            showPwaInstallBanner();
          }
        } catch (_) {
          openInstallHelp();
        } finally {
          if (button) button.disabled = false;
        }
      }

      async function initializePwaInstallExperience() {
        if (isStandaloneDisplay()) {
          markPwaInstalled();
          return;
        }
        if (await detectRelatedInstalledApp()) {
          markPwaInstalled();
          return;
        }
        window.setTimeout(showPwaInstallBanner, 650);
      }

      function updateOfflineProgress({ completed = 0, total = 0, failed = 0, complete = false } = {}) {
        const banner = document.getElementById("pwaInstallBanner");
        const status = document.getElementById("pwaOfflineStatus");
        const percent = total ? Math.round((completed / total) * 100) : 0;
        if (banner) banner.style.setProperty("--pwa-progress", `${percent}%`);
        if (!status) return;

        if (complete && failed === 0) {
          status.textContent = `Mode hors connexion prêt · ${total} ressources`;
          banner?.setAttribute("data-offline-ready", "true");
          localStorage.setItem(PWA_OFFLINE_READY_KEY, PWA_VERSION);
          return;
        }
        if (complete) {
          status.textContent = `${Math.max(0, total - failed)}/${total} ressources prêtes · nouvelle tentative au prochain démarrage`;
          banner?.setAttribute("data-offline-ready", "false");
          localStorage.removeItem(PWA_OFFLINE_READY_KEY);
          return;
        }
        status.textContent = total ? `Téléchargement hors connexion · ${completed}/${total}` : "Préparation du mode hors connexion…";
      }

      function handleOfflineWorkerMessage(event) {
        const payload = event.data || {};
        if (payload.version !== PWA_VERSION) return;
        if (payload.type === "CACHE_PROGRESS") updateOfflineProgress(payload);
        if (payload.type === "CACHE_COMPLETE") {
          updateOfflineProgress({ ...payload, complete: true });
          if (payload.failed === 0 && localStorage.getItem("sprite-locker-offline-toast") !== PWA_VERSION) {
            localStorage.setItem("sprite-locker-offline-toast", PWA_VERSION);
            showToast("Sprite Locker est maintenant disponible hors connexion.");
          }
        }
      }

      async function collectOfflineAssetUrls() {
        const urls = [
          "./",
          "./index.html",
          "./manifest.webmanifest",
          "./service-worker.js",
          "./icons/icon.svg",
          "./icons/icon-192.png",
          "./icons/icon-512.png",
          "./icons/icon-maskable-512.png",
          "./icons/apple-touch-icon.png",
          "./share-card.jpg",
          ...sprites.map(sprite => sprite.image),
          ...[...document.querySelectorAll("img[src]")].map(image => image.currentSrc || image.src)
        ];

        const fontStylesheet = document.querySelector('link[rel="stylesheet"][href*="fonts.googleapis.com"]')?.href;
        if (fontStylesheet) {
          urls.push(fontStylesheet);
          try {
            const response = await fetch(fontStylesheet, { mode: "cors", cache: "force-cache" });
            if (response.ok) {
              const css = await response.text();
              for (const match of css.matchAll(/url\((['"]?)(https:\/\/[^)'"\s]+)\1\)/g)) urls.push(match[2]);
            }
          } catch (_) {}
        }

        return [...new Set(urls.filter(Boolean).map(url => {
          try { return new URL(url, location.href).href; } catch (_) { return null; }
        }).filter(Boolean))];
      }

      async function initializeOfflineSupport() {
        const canUseWorker = "serviceWorker" in navigator && (window.isSecureContext || /^(localhost|127\.0\.0\.1)$/i.test(location.hostname));
        if (!canUseWorker) return false;
        if (offlineCacheStarted) return true;
        offlineCacheStarted = true;

        if (localStorage.getItem(PWA_OFFLINE_READY_KEY) === PWA_VERSION) {
          updateOfflineProgress({ completed: 1, total: 1, complete: true });
        }

        try {
          let refreshing = false;
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
          });
          navigator.serviceWorker.addEventListener("message", handleOfflineWorkerMessage);
          offlineRegistration = await navigator.serviceWorker.register("./service-worker.js", { scope: "./", updateViaCache: "none" });
          
          try { offlineRegistration.update(); } catch(e) {}
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && offlineRegistration) {
              try { offlineRegistration.update(); } catch(e) {}
            }
          });

          const ready = await navigator.serviceWorker.ready;
          const urls = await collectOfflineAssetUrls();
          const worker = ready.active || offlineRegistration.active || offlineRegistration.waiting || offlineRegistration.installing;
          if (!worker) throw new Error("Service Worker indisponible");
          worker.postMessage({ type: "CACHE_ASSETS", urls, version: PWA_VERSION });
          return true;
        } catch (_) {
          offlineCacheStarted = false;
          const status = document.getElementById("pwaOfflineStatus");
          if (status) status.textContent = navigator.onLine ? "Mode hors connexion en attente" : "Première connexion requise pour terminer le téléchargement";
          return false;
        }
      }

      function initializePwa() {
        document.getElementById("pwaInstallButton")?.addEventListener("click", installPwaFromBanner);
        document.getElementById("pwaInstallLater")?.addEventListener("click", () => {
          pwaInstallBannerDismissed = true;
          hidePwaInstallBanner();
        });
        document.getElementById("pwaInstallHelpClose")?.addEventListener("click", () => document.getElementById("pwaInstallHelp")?.close());
        document.getElementById("pwaInstallHelp")?.addEventListener("click", event => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        });
        initializePwaInstallExperience();
        initializeOfflineSupport();
        window.addEventListener("pageshow", event => {
          if (!event.persisted || isPwaInstalledOnThisDevice()) return;
          pwaInstallBannerDismissed = false;
          showPwaInstallBanner();
        });
        window.addEventListener("online", () => {
          if (!offlineCacheStarted || localStorage.getItem(PWA_OFFLINE_READY_KEY) !== PWA_VERSION) initializeOfflineSupport();
        });
      }

      function warmSpriteImage(url) {
        if (!url || warmedImageUrls.has(url)) return;
        warmedImageUrls.add(url);
        const image = new Image();
        warmingImages.add(image);
        image.decoding = "async";
        image.fetchPriority = "low";
        image.referrerPolicy = "no-referrer";
        image.onload = () => warmingImages.delete(image);
        image.onerror = () => {
          warmingImages.delete(image);
          warmedImageUrls.delete(url);
        };
        image.src = url;
      }

      function startBackgroundImageWarmup() {
        if (imageWarmupStarted) return;
        imageWarmupStarted = true;
        const supportsOfflineWorker = "serviceWorker" in navigator && (window.isSecureContext || /^(localhost|127\.0\.0\.1)$/i.test(location.hostname));
        if (supportsOfflineWorker) {
          initializeOfflineSupport().then(ready => {
            if (!ready) startDirectImageWarmup();
          });
          return;
        }
        startDirectImageWarmup();
      }

      function startDirectImageWarmup() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const queue = [...new Set(sprites.map(sprite => sprite.image))];
        let cursor = 0;
        const batchSize = connection && connection.effectiveType === "3g" ? 2 : 5;
        const scheduleIdle = callback => {
          if ("requestIdleCallback" in window) {
            window.requestIdleCallback(callback, { timeout: 1400 });
          } else {
            setTimeout(() => callback({ didTimeout: true, timeRemaining: () => 8 }), 120);
          }
        };
        const runBatch = deadline => {
          if (document.hidden) {
            setTimeout(() => scheduleIdle(runBatch), 600);
            return;
          }
          let loaded = 0;
          while (cursor < queue.length && loaded < batchSize && (deadline.didTimeout || deadline.timeRemaining() > 3)) {
            warmSpriteImage(queue[cursor++]);
            loaded++;
          }
          if (cursor < queue.length) setTimeout(() => scheduleIdle(runBatch), 260);
        };
        setTimeout(() => scheduleIdle(runBatch), 900);
      }

      function updateRenderedCard(id) {
        const tile = grid.querySelector(`.family-variant-tile[data-id="${id}"]`);
        if (!tile) {
          updateStats();
          return;
        }
        const sprite = sprites.find(item => item.id === id);
        if (!sprite) return;
        const entry = state[id] || blankEntry();
        tile.classList.toggle("is-owned", entry.owned);
        tile.classList.toggle("is-missing", !entry.owned);
        tile.classList.toggle("is-mastered", entry.mastered);
        const lock = tile.querySelector(".family-variant-lock");
        const mastery = tile.querySelector(".family-variant-mastered");
        const action = tile.querySelector(".family-variant-action");
        if (lock) lock.hidden = entry.owned;
        if (mastery) mastery.hidden = !entry.mastered;
        if (action) {
          action.setAttribute("aria-pressed", String(entry.owned));
          action.setAttribute("aria-label", `${entry.owned ? t("removeFromLocker") : t("addToLocker")} : ${localizedName(sprite)}`);
          action.innerHTML = `<span aria-hidden="true">${entry.owned ? "✓" : "+"}</span>${entry.owned ? t("inLocker") : t("addShort")}`;
        }
        const row = tile.closest(".family-row");
        if (row) {
          const familySprites = sprites.filter(item => item.familyKey === sprite.familyKey);
          const ownedCount = familySprites.filter(item => (state[item.id] || blankEntry()).owned).length;
          const count = row.querySelector(".family-row-count strong");
          const progress = row.querySelector(".family-row-progress");
          if (count) count.textContent = `${ownedCount}/${familySprites.length}`;
          if (progress) {
            progress.setAttribute("aria-valuenow", String(ownedCount));
            progress.querySelector("i").style.width = `${familySprites.length ? Math.round(ownedCount / familySprites.length * 100) : 0}%`;
          }
        }
        updateStats();
      }

      function refreshAfterStateChange(id) {
        if (statusFilter !== "all") {
          render();
        } else {
          updateRenderedCard(id);
        }
      }

      function scheduleRender() {
        if (renderFrame) cancelAnimationFrame(renderFrame);
        renderFrame = requestAnimationFrame(() => {
          renderFrame = 0;
          render();
        });
      }

      function render() {
        if (renderFrame) {
          cancelAnimationFrame(renderFrame);
          renderFrame = 0;
        }
        if (spriteImageObserver) spriteImageObserver.disconnect();
        const visible = getVisibleSprites();
        if (visible.length) {
          const groups = groupedVisibleSpriteRows(visible);
          let imageOffset = 0;
          grid.classList.add("family-collection-grid");
          grid.innerHTML = groups.map((group, index) => {
            const row = familyRowTemplate(group, index, imageOffset);
            imageOffset += group.length;
            return row;
          }).join("");
          setupFamilyVariantCarousels();
        } else {
          grid.classList.add("family-collection-grid");
          grid.innerHTML = `<div class="empty-state"><strong>${t("emptyTitle")}</strong>${t("emptyCopy")}</div>`;
        }

        document.getElementById("resultCount").textContent = visible.length;
        document.getElementById("activeHint").textContent = visible.length === sprites.length ? t("fullCatalog") : t("filtersActive");
        updateStats();
        setupProgressiveSpriteImages();
      }

      function updateStats() {
        const entries = sprites.map(sprite => state[sprite.id] || blankEntry());
        const owned = entries.filter(entry => entry.owned);
        const mastered = entries.filter(entry => entry.mastered).length;
        const percent = Math.round((owned.length / sprites.length) * 100);

        document.getElementById("ownedStat").textContent = `${owned.length}/${sprites.length}`;
        document.getElementById("masteredStat").textContent = `${mastered}/${sprites.length}`;
        document.getElementById("missingStat").textContent = String(sprites.length - owned.length);
        document.getElementById("percentStat").textContent = `${percent} %`;
        document.getElementById("progressFill").style.width = `${percent}%`;
        document.querySelector(".progress-wrap").style.setProperty("--progress", String(percent));
        progressTrack.setAttribute("aria-valuenow", String(percent));

        const variantTotals = {};
        const variantOwned = {};
        sprites.forEach((sprite, index) => {
          variantTotals[sprite.variant] = (variantTotals[sprite.variant] || 0) + 1;
          if (entries[index].owned) variantOwned[sprite.variant] = (variantOwned[sprite.variant] || 0) + 1;
        });
        variantProgressControls.forEach(control => {
          const total = variantTotals[control.key] || 0;
          const count = variantOwned[control.key] || 0;
          const variantPercent = total ? Math.round((count / total) * 100) : 0;
          control.stat.textContent = `${count}/${total}`;
          control.fill.style.width = `${variantPercent}%`;
          control.track.setAttribute("aria-valuenow", String(variantPercent));
          control.track.setAttribute("aria-valuetext", t("countOf", { count, total }));
        });
      }

      function setPendingMastery(mastered) {
        pendingMastered = Boolean(mastered);
        addSpriteNotMastered.setAttribute("aria-pressed", String(!pendingMastered));
        addSpriteMastered.setAttribute("aria-pressed", String(pendingMastered));
      }

      function openAddSpriteDialog(id, { mastered = false } = {}) {
        const sprite = sprites.find(item => item.id === id);
        if (!sprite) return;
        pendingLockerId = id;
        setPendingMastery(mastered);
        document.getElementById("addSpriteName").textContent = localizedName(sprite);
        if (!addSpriteDialog.open) addSpriteDialog.showModal();
      }

      function openRemoveSpriteDialog(id) {
        const sprite = sprites.find(item => item.id === id);
        if (!sprite) return;
        pendingLockerId = id;
        document.getElementById("removeSpriteName").textContent = localizedName(sprite);
        if (!removeSpriteDialog.open) removeSpriteDialog.showModal();
      }

      function requestLockerChange(id) {
        const entry = state[id] || blankEntry();
        if (entry.owned) openRemoveSpriteDialog(id);
        else openAddSpriteDialog(id);
      }

      function restorePendingControls(id) {
        if (!id) return;
        updateRenderedCard(id);
        if (activeDialogId === id && detailDialog.open) syncDialogButtons();
      }

      function cancelAddSprite() {
        const id = pendingLockerId;
        closeDialog(addSpriteDialog);
        pendingLockerId = null;
        restorePendingControls(id);
      }

      function cancelRemoveSprite() {
        const id = pendingLockerId;
        closeDialog(removeSpriteDialog);
        pendingLockerId = null;
        restorePendingControls(id);
      }

      function confirmAddSprite(event) {
        const id = pendingLockerId;
        const sprite = sprites.find(item => item.id === id);
        if (!sprite) return;
        const entry = state[id] || blankEntry();
        const wasMastered = entry.mastered;
        entry.owned = true;
        entry.mastered = pendingMastered;
        state[id] = touchEntry(entry);
        saveState();
        closeDialog(addSpriteDialog);
        pendingLockerId = null;
        refreshAfterStateChange(id);
        if (activeDialogId === id && detailDialog.open) syncDialogButtons();
        showToast(t("spriteAddedToast", { name: localizedName(sprite) }));
        if (pendingMastered && !wasMastered) {
          playSfx("mastery");
          if (event && typeof event.clientX === "number" && event.clientX > 0) {
            createStarExplosion(event.clientX, event.clientY);
          } else {
            createStarExplosion(window.innerWidth / 2, window.innerHeight / 2);
          }
        } else {
          playSfx("add");
        }
      }

      function confirmRemoveSprite() {
        const id = pendingLockerId;
        const sprite = sprites.find(item => item.id === id);
        if (!sprite) return;
        setOwned(id, false);
        closeDialog(removeSpriteDialog);
        pendingLockerId = null;
        refreshAfterStateChange(id);
        if (activeDialogId === id && detailDialog.open) syncDialogButtons();
        showToast(t("spriteRemovedToast", { name: localizedName(sprite) }));
      }

      function setOwned(id, owned) {
        const entry = state[id] || blankEntry();
        entry.owned = owned;
        if (!owned) {
          entry.mastered = false;
        }
        state[id] = touchEntry(entry);
        saveState();
        playSfx(owned ? "add" : "remove");
      }

      function setMastered(id, mastered) {
        const entry = state[id] || blankEntry();
        entry.mastered = mastered;
        if (mastered) {
          entry.owned = true;
        }
        state[id] = touchEntry(entry);
        saveState();
        playSfx(mastered ? "mastery" : "remove");
      }

      function openDetails(id) {
        const sprite = sprites.find(item => item.id === id);
        if (!sprite) return;
        activeDialogId = id;
        const entry = state[id] || blankEntry();
        const variant = variants[sprite.variant];
        const name = localizedName(sprite);
        const image = document.getElementById("dialogImage");
        image.classList.remove("broken");
        image.src = sprite.image;
        image.alt = name;
        image.onerror = () => image.classList.add("broken");
        document.getElementById("dialogImageBox").style.setProperty("--glow", rarityGlow[sprite.rarity]);
        document.getElementById("dialogKicker").textContent = t("variantKicker", { rarity: rarityLabel(sprite.rarity), variant: localizedVariant(sprite.variant) });
        document.getElementById("dialogTitle").textContent = name;
        document.getElementById("dialogOriginal").textContent = t("catalogEntry", { number: String(sprite.catalogNumber).padStart(3, "0") });
        document.getElementById("dialogEffect").textContent = localizedEffect(sprite.effect);
        document.getElementById("dialogVariantEffect").textContent = localizedEffect(variant.effect);
        document.getElementById("dialogNote").value = entry.note;
        syncDialogButtons();
        if (!detailDialog.open) detailDialog.showModal();
      }

      function syncDialogButtons() {
        if (!activeDialogId) return;
        const entry = state[activeDialogId] || blankEntry();
        const ownedButton = document.getElementById("dialogOwned");
        const masteredButton = document.getElementById("dialogMastered");
        ownedButton.setAttribute("aria-pressed", String(entry.owned));
        ownedButton.textContent = entry.owned ? t("dialogObtained") : t("dialogHave");
        masteredButton.setAttribute("aria-pressed", String(entry.mastered));
        masteredButton.textContent = entry.mastered ? t("dialogMastered") : t("dialogMarkMastered");
      }

      function closeDialog(dialog) {
        if (dialog && dialog.open) dialog.close();
      }

      function showToast(message) {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
      }

      function setSyncStatus(kind, message) {
        syncState.dataset.state = kind;
        syncStateText.textContent = message;
      }

      function runtimeFirebaseConfig() {
        const hostname = location.hostname.toLowerCase();
        const firebaseHostingDomains = [
          `${FIREBASE_CONFIG.projectId}.firebaseapp.com`,
          `${FIREBASE_CONFIG.projectId}.web.app`
        ];
        if (firebaseHostingDomains.includes(hostname)) {
          return Object.freeze({ ...FIREBASE_CONFIG, authDomain: hostname });
        }
        return FIREBASE_CONFIG;
      }

      function isHostedAuthContext() {
        return (location.protocol === "https:" || location.protocol === "http:") && Boolean(location.hostname);
      }

      function isMobileDevice() {
        const touchMac = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
        const mobileAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
        const userAgentDataMobile = Boolean(navigator.userAgentData && navigator.userAgentData.mobile);
        const coarsePointer = typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
        return touchMac || mobileAgent || userAgentDataMobile || (coarsePointer && navigator.maxTouchPoints > 0);
      }

      function redirectIsSameOrigin() {
        return isHostedAuthContext() && location.hostname.toLowerCase() === String(firebaseRuntimeConfig.authDomain || "").toLowerCase();
      }

      function setRedirectPending(pending) {
        try {
          if (pending) sessionStorage.setItem(AUTH_REDIRECT_KEY, String(Date.now()));
          else sessionStorage.removeItem(AUTH_REDIRECT_KEY);
        } catch (_) {}
      }

      function redirectWasPending() {
        try { return Boolean(sessionStorage.getItem(AUTH_REDIRECT_KEY)); } catch (_) { return false; }
      }

      function setAuthBusy(busy) {
        authActionInProgress = busy;
        authToggleButton.disabled = busy;
        authToggleButton.classList.toggle("is-busy", busy);
        document.getElementById("firebaseCard").setAttribute("aria-busy", String(busy));
      }

      function updateAccountInterface(user) {
        const connected = Boolean(user);
        authToggleButton.dataset.connected = String(connected);
        authToggleButton.disabled = authActionInProgress;
        authToggleButton.innerHTML = connected
          ? `<span class="auth-power" aria-hidden="true">↪</span><span>${t("signOut")}</span>`
          : `<span class="auth-google" aria-hidden="true">G</span><span>${t("connect")}</span>`;
        authToggleButton.setAttribute("aria-label", t(connected ? "signOutAria" : "signIn"));

        const reviewGate = document.getElementById("reviewAuthGate");
        const reviewForm = document.getElementById("reviewForm");
        if (reviewGate && reviewForm) {
          reviewGate.hidden = connected;
          reviewForm.hidden = !connected;
        }
        if (typeof updateReviewModalUserPreview === "function") {
          updateReviewModalUserPreview();
        }

        if (!connected) {
          accountAvatar.hidden = true;
          accountAvatar.removeAttribute("src");
          firebaseIcon.hidden = false;
          setSyncStatus("local", navigator.onLine === false ? t("localOffline") : t("local"));
          setAdminAccess(false);
          return;
        }

        if (user.photoURL) {
          accountAvatar.src = user.photoURL;
          accountAvatar.hidden = false;
          firebaseIcon.hidden = true;
          accountAvatar.onerror = () => {
            accountAvatar.hidden = true;
            firebaseIcon.hidden = false;
          };
        } else {
          accountAvatar.hidden = true;
          firebaseIcon.hidden = false;
        }
      }

      function cloudDocumentReference() {
        if (!firebaseSdk || !firebaseDb || !firebaseUser) return null;
        return firebaseSdk.doc(firebaseDb, "users", firebaseUser.uid, "primebudget", "fortniteEsprits");
      }

      function mergeCloudData(data) {
        const remoteCollection = data && typeof data === "object"
          ? (data.collection || data.entries || data.sprites || {})
          : {};
        const timestampObject = data && data.updatedAt;
        const remoteUpdatedAt = Math.max(0,
          Number(data && data.updatedAtMs) || 0,
          timestampObject && typeof timestampObject.toMillis === "function" ? timestampObject.toMillis() : 0
        );
        const previousLocalUpdatedAt = localUpdatedAt;
        const before = stateFingerprint();
        const merged = {};
        let shouldPush = false;

        sprites.forEach(sprite => {
          const localEntry = normalizeEntry(state[sprite.id]);
          const remoteEntry = normalizeEntry(remoteCollection[sprite.id]);
          let chosen = localEntry;

          if (remoteEntry.modifiedAt > localEntry.modifiedAt) {
            chosen = remoteEntry;
          } else if (localEntry.modifiedAt > remoteEntry.modifiedAt) {
            shouldPush = true;
          } else if (!entriesEqual(localEntry, remoteEntry)) {
            if (remoteUpdatedAt > previousLocalUpdatedAt) {
              chosen = remoteEntry;
            } else {
              shouldPush = true;
            }
          }
          merged[sprite.id] = chosen;
        });

        state = merged;
        localUpdatedAt = Math.max(
          previousLocalUpdatedAt,
          remoteUpdatedAt,
          ...Object.values(merged).map(entry => entry.modifiedAt)
        );
        const changed = before !== stateFingerprint();
        if (changed || localUpdatedAt !== previousLocalUpdatedAt) saveState({ sync: false });
        return { changed, shouldPush };
      }

      function refreshAfterCloudMerge() {
        render();
        if (!activeDialogId || !detailDialog.open) return;
        syncDialogButtons();
        const note = document.getElementById("dialogNote");
        if (document.activeElement !== note) note.value = (state[activeDialogId] || blankEntry()).note;
      }

      function friendlyFirebaseError(error) {
        const code = String(error && error.code || "");
        if (code.includes("unauthorized-domain")) return t("errorUnauthorizedDomain", { domain: location.hostname || (APP_LANGUAGE === "fr" ? "ce domaine" : "this domain") });
        if (code.includes("operation-not-supported-in-this-environment")) return t("errorHttps");
        if (code.includes("web-storage-unsupported")) return t("errorStorage");
        if (code.includes("popup-closed") || code.includes("cancelled-popup")) return t("errorCancelled");
        if (code.includes("popup-blocked")) return t("errorPopupBlocked");
        if (code.includes("account-exists-with-different-credential")) return t("errorCredential");
        if (code.includes("too-many-requests")) return t("errorTooMany");
        if (code.includes("user-disabled")) return t("errorDisabled");
        if (code.includes("invalid-api-key") || code.includes("app-not-authorized")) return t("errorFirebaseConfig");
        if (code.includes("permission-denied")) return t("errorFirestore");
        if (code.includes("network-request-failed") || code.includes("unavailable")) return t("errorNetwork");
        return t("errorFirebase");
      }

      function scheduleCloudSync() {
        if (!firebaseUser || !firebaseReady) return;
        clearTimeout(cloudSyncTimer);
        setSyncStatus("pending", navigator.onLine === false ? t("offline") : t("syncPending"));
        cloudSyncTimer = setTimeout(() => synchronizeCloud({ pull: false }), 900);
      }

      async function synchronizeCloud({ pull = false } = {}) {
        if (!firebaseSdk || !firebaseDb || !firebaseUser) return;
        if (cloudSyncing) {
          cloudSyncQueued = true;
          cloudSyncQueuedPull = cloudSyncQueuedPull || pull;
          return;
        }
        if (navigator.onLine === false) {
          setSyncStatus("pending", t("offline"));
          return;
        }

        cloudSyncing = true;
        setSyncStatus("loading", t("syncing"));
        const userId = firebaseUser.uid;
        const reference = cloudDocumentReference();

        try {
          let shouldWrite = !pull;
          if (pull) {
            const snapshot = await firebaseSdk.getDoc(reference);
            if (!firebaseUser || firebaseUser.uid !== userId) return;
            if (snapshot.exists()) {
              const result = mergeCloudData(snapshot.data());
              if (result.changed) refreshAfterCloudMerge();
              shouldWrite = result.shouldPush;
            } else {
              shouldWrite = true;
            }
          }

          if (shouldWrite) {
            localUpdatedAt = Math.max(localUpdatedAt, Date.now());
            saveState({ sync: false });
            await firebaseSdk.setDoc(reference, {
              app: "fortnite-esprits",
              schemaVersion: 2,
              updatedAt: firebaseSdk.serverTimestamp(),
              updatedAtMs: localUpdatedAt,
              collection: state
            }, { merge: true });
          }

          if (firebaseUser && firebaseUser.uid === userId) setSyncStatus("synced", t("synced"));
        } catch (error) {
          if (firebaseUser && firebaseUser.uid === userId) {
            const offline = navigator.onLine === false || String(error && error.code || "").includes("unavailable");
            setSyncStatus(offline ? "pending" : "error", offline ? t("offline") : t("syncError"));
            if (!offline) showToast(friendlyFirebaseError(error));
          }
        } finally {
          cloudSyncing = false;
          if (cloudSyncQueued) {
            const queuedPull = cloudSyncQueuedPull;
            cloudSyncQueued = false;
            cloudSyncQueuedPull = false;
            setTimeout(() => synchronizeCloud({ pull: queuedPull }), 0);
          }
        }
      }

      function startCloudListener() {
        if (cloudUnsubscribe) cloudUnsubscribe();
        const reference = cloudDocumentReference();
        if (!reference) return;
        const userId = firebaseUser.uid;
        cloudUnsubscribe = firebaseSdk.onSnapshot(reference, { includeMetadataChanges: true }, snapshot => {
          if (!firebaseUser || firebaseUser.uid !== userId) return;
          if (!snapshot.exists()) {
            scheduleCloudSync();
            return;
          }
          const result = mergeCloudData(snapshot.data());
          if (result.changed) refreshAfterCloudMerge();
          if (result.shouldPush) {
            scheduleCloudSync();
          } else if (snapshot.metadata.hasPendingWrites) {
            setSyncStatus("loading", t("syncing"));
          } else if (navigator.onLine === false || snapshot.metadata.fromCache) {
            setSyncStatus("pending", t("offline"));
          } else {
            setSyncStatus("synced", t("synced"));
          }
        }, error => {
          const offline = navigator.onLine === false || String(error && error.code || "").includes("unavailable");
          setSyncStatus(offline ? "pending" : "error", offline ? t("offline") : t("syncError"));
        });
      }

      async function handleAuthState(user) {
        const sequence = ++authSequence;
        if (cloudUnsubscribe) {
          cloudUnsubscribe();
          cloudUnsubscribe = null;
        }
        firebaseUser = user || null;
        if (firebaseUser) {
          adminAccess = false;
          document.querySelectorAll("[data-admin-link]").forEach(link => { link.hidden = true; });
        }
        if (firebaseUser) setRedirectPending(false);
        setAuthBusy(false);
        updateAccountInterface(firebaseUser);
        if (!firebaseUser) {
          setAdminAccess(false);
          return;
        }
        setSyncStatus("loading", t("firebaseConnecting"));
        await synchronizeCloud({ pull: true });
        await checkAdminAccess(firebaseUser);
        if (sequence === authSequence && firebaseUser && firebaseUser.uid === user.uid) {
          startCloudListener();
        }
      }

      async function initializeFirebaseSync() {
        if (firebaseReady || firebaseInitializing) return;
        firebaseInitializing = true;
        setAuthBusy(true);
        setSyncStatus("loading", t("firebaseConnecting"));
        try {
          const firebaseCdn = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}`;
          const [appModule, authModule, firestoreModule] = await Promise.all([
            import(`${firebaseCdn}/firebase-app.js`),
            import(`${firebaseCdn}/firebase-auth.js`),
            import(`${firebaseCdn}/firebase-firestore.js`)
          ]);
          firebaseRuntimeConfig = runtimeFirebaseConfig();
          const app = appModule.getApps().length ? appModule.getApp() : appModule.initializeApp(firebaseRuntimeConfig);
          firebaseAuth = authModule.getAuth(app);
          firebaseAuth.languageCode = APP_LANGUAGE;
          firebaseDb = firestoreModule.getFirestore(app);
          firebaseSdk = {
            GoogleAuthProvider: authModule.GoogleAuthProvider,
            signInWithPopup: authModule.signInWithPopup,
            signInWithRedirect: authModule.signInWithRedirect,
            signOut: authModule.signOut,
            doc: firestoreModule.doc,
            getDoc: firestoreModule.getDoc,
            setDoc: firestoreModule.setDoc,
            deleteDoc: firestoreModule.deleteDoc,
            collection: firestoreModule.collection,
            getDocs: firestoreModule.getDocs,
            query: firestoreModule.query,
            orderBy: firestoreModule.orderBy,
            limit: firestoreModule.limit,
            writeBatch: firestoreModule.writeBatch,
            increment: firestoreModule.increment,
            onSnapshot: firestoreModule.onSnapshot,
            serverTimestamp: firestoreModule.serverTimestamp
          };

          const persistenceOptions = [
            authModule.browserLocalPersistence,
            authModule.browserSessionPersistence,
            authModule.inMemoryPersistence
          ].filter(Boolean);
          for (const persistence of persistenceOptions) {
            try {
              await authModule.setPersistence(firebaseAuth, persistence);
              break;
            } catch (_) {}
          }

          firebaseReady = true;
          loadPublishedContent();
          fetchReviews();
          setTimeout(() => { try { startPublicVisitorCounter(); } catch (_) {} }, 0);
          const hadRedirectPending = redirectWasPending();
          let redirectResult = null;
          try {
            redirectResult = await authModule.getRedirectResult(firebaseAuth);
            if (redirectResult && redirectResult.user) {
              setRedirectPending(false);
              showToast(t("googleSuccess"));
            } else if (hadRedirectPending && !firebaseAuth.currentUser) {
              setRedirectPending(false);
              setSyncStatus("error", t("resumeSignIn"));
            }
          } catch (error) {
            setRedirectPending(false);
            setSyncStatus("error", t("signInFailed"));
            showToast(friendlyFirebaseError(error));
          }

          if (authUnsubscribe) authUnsubscribe();
          authUnsubscribe = authModule.onAuthStateChanged(firebaseAuth, user => handleAuthState(user), error => {
            setAuthBusy(false);
            setSyncStatus("error", t("signInFailed"));
            showToast(friendlyFirebaseError(error));
          });
          setTimeout(() => {
            if (firebaseReady && authActionInProgress && !redirectWasPending()) {
              setAuthBusy(false);
              updateAccountInterface(firebaseAuth.currentUser || null);
            }
          }, 1500);
        } catch (error) {
          firebaseReady = false;
          setAuthBusy(false);
          updateAccountInterface(null);
          setSyncStatus(navigator.onLine === false ? "local" : "error", navigator.onLine === false ? t("localOffline") : t("firebaseUnavailable"));
        } finally {
          firebaseInitializing = false;
          if (!authActionInProgress) authToggleButton.disabled = false;
        }
      }

      async function ensureFirebaseReady() {
        if (firebaseReady) return true;
        if (!firebaseInitializing) initializeFirebaseSync();
        const startedAt = Date.now();
        while (firebaseInitializing && Date.now() - startedAt < 10000) {
          await new Promise(resolve => setTimeout(resolve, 40));
        }
        return firebaseReady;
      }

      function publicCounterPeriods() {
        const now = new Date();
        const day = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-");
        return { day, hour: `${day}-${String(now.getHours()).padStart(2, "0")}` };
      }

      function publicCounterNumber(snapshot) {
        if (!snapshot || !snapshot.exists()) return 0;
        const count = Number(snapshot.data().count);
        return Number.isFinite(count) && count >= 0 ? Math.floor(count) : 0;
      }

      async function startPublicVisitorCounter() {
        if (publicCounterStarted || !firebaseReady || !firebaseSdk || !firebaseDb) return;
        publicCounterStarted = true;
        const panel = document.getElementById("visitorCounter");
        const status = document.getElementById("visitorCounterStatus");
        const todayOutput = document.getElementById("visitorsToday");
        const totalOutput = document.getElementById("visitorsTotal");
        if (!panel || !status || !todayOutput || !totalOutput) return;
        const failSafely = () => {
          panel.dataset.state = "error";
          status.textContent = t("visitorCounterError");
        };

        try {
          const period = publicCounterPeriods();
          const totalRef = firebaseSdk.doc(firebaseDb, "publicStats", "traffic");
          const dayRef = firebaseSdk.doc(firebaseDb, "publicStats", "traffic", "days", period.day);
          const hourRef = firebaseSdk.doc(firebaseDb, "publicStats", "traffic", "hours", period.hour);
          const batch = firebaseSdk.writeBatch(firebaseDb);
          let pendingWrite = false;
          if (localStorage.getItem(VISITOR_HOUR_KEY) !== period.hour) {
            batch.set(hourRef, { count: firebaseSdk.increment(1), period: period.hour, updatedAt: firebaseSdk.serverTimestamp() }, { merge: true });
            pendingWrite = true;
          }
          if (localStorage.getItem(VISITOR_DAY_KEY) !== period.day) {
            batch.set(dayRef, { count: firebaseSdk.increment(1), date: period.day, updatedAt: firebaseSdk.serverTimestamp() }, { merge: true });
            pendingWrite = true;
          }
          if (localStorage.getItem(VISITOR_LIFETIME_KEY) !== "1") {
            batch.set(totalRef, { count: firebaseSdk.increment(1), updatedAt: firebaseSdk.serverTimestamp() }, { merge: true });
            pendingWrite = true;
          }
          if (pendingWrite) {
            await batch.commit();
            localStorage.setItem(VISITOR_HOUR_KEY, period.hour);
            localStorage.setItem(VISITOR_DAY_KEY, period.day);
            localStorage.setItem(VISITOR_LIFETIME_KEY, "1");
          }

          firebaseSdk.onSnapshot(dayRef, snapshot => {
            todayOutput.textContent = publicCounterNumber(snapshot).toLocaleString(APP_LOCALE);
            panel.dataset.state = "live";
            status.textContent = t("visitorCounterLive");
          }, failSafely);
          firebaseSdk.onSnapshot(totalRef, snapshot => {
            totalOutput.textContent = publicCounterNumber(snapshot).toLocaleString(APP_LOCALE);
          }, failSafely);
        } catch (_) {
          failSafely();
        }
      }

      function popupCanFallbackToRedirect(error) {
        const code = String(error && error.code || "");
        return redirectIsSameOrigin() && (
          code.includes("popup-blocked") ||
          code.includes("operation-not-supported-in-this-environment") ||
          code.includes("web-storage-unsupported")
        );
      }

      async function startGoogleRedirect(provider) {
        setRedirectPending(true);
        setSyncStatus("loading", t("openingGoogle"));
        try {
          await firebaseSdk.signInWithRedirect(firebaseAuth, provider);
        } catch (error) {
          setRedirectPending(false);
          throw error;
        }
      }

      async function connectGoogleAccount() {
        if (authActionInProgress) return;
        if (!isHostedAuthContext()) {
          setSyncStatus("error", t("httpsRequired"));
          showToast(t("hostedOnly"));
          return;
        }
        await ensureFirebaseReady();
        if (!firebaseSdk || !firebaseAuth) {
          showToast(t("firebaseUnavailableNow"));
          return;
        }
        setAuthBusy(true);
        try {
          setSyncStatus("loading", t("googleSigningIn"));
          const provider = new firebaseSdk.GoogleAuthProvider();
          provider.setCustomParameters({ prompt: "select_account" });

          if (isMobileDevice() && redirectIsSameOrigin()) {
            await startGoogleRedirect(provider);
            return;
          }

          try {
            const result = await firebaseSdk.signInWithPopup(firebaseAuth, provider);
            if (result && result.user) showToast(t("googleSuccess"));
          } catch (popupError) {
            if (!popupCanFallbackToRedirect(popupError)) throw popupError;
            await startGoogleRedirect(provider);
            return;
          }
        } catch (error) {
          updateAccountInterface(firebaseAuth.currentUser || firebaseUser);
          setSyncStatus("error", t("signInFailed"));
          showToast(friendlyFirebaseError(error));
        } finally {
          if (!redirectWasPending()) setAuthBusy(false);
        }
      }

      async function disconnectGoogleAccount() {
        if (!firebaseSdk || !firebaseAuth || authActionInProgress) return;
        setAuthBusy(true);
        setSyncStatus("loading", t("signingOut"));
        try {
          setRedirectPending(false);
          clearTimeout(cloudSyncTimer);
          if (cloudUnsubscribe) {
            cloudUnsubscribe();
            cloudUnsubscribe = null;
          }
          await firebaseSdk.signOut(firebaseAuth);
          firebaseUser = null;
          updateAccountInterface(null);
          showToast(t("signedOutLocalKept"));
        } catch (error) {
          updateAccountInterface(firebaseAuth.currentUser || firebaseUser);
          setSyncStatus("error", t("signOutFailed"));
          showToast(friendlyFirebaseError(error));
        } finally {
          setAuthBusy(false);
        }
      }

      const APPEARANCE_KEY = "sprite-locker-appearance-v1";
      const ADMIN_CONTENT_KEY = "sprite-locker-admin-content-v1";
      const ADMIN_DRAFT_KEY = "sprite-locker-admin-draft-v1";
      const DEFAULT_APPEARANCE = Object.freeze({ accent: "#24a9ff", background: "night", cardSize: "medium", density: "balanced", reducedMotion: false, sfxEnabled: true });
      
      let sfxAudioCtx = null;
      function getSfxAudioContext() {
        if (!sfxAudioCtx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) sfxAudioCtx = new AudioCtx();
        }
        if (sfxAudioCtx && sfxAudioCtx.state === "suspended") {
          sfxAudioCtx.resume().catch(() => {});
        }
        return sfxAudioCtx;
      }

      function playSfx(type) {
        if (!appearanceSettings.sfxEnabled) return;
        const ctx = getSfxAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        try {
          if (type === "click") {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(650, now);
            osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.04);
          } else if (type === "add") {
            [659.25, 987.77].forEach((freq, idx) => {
              const startTime = now + idx * 0.06;
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = "triangle";
              osc.frequency.setValueAtTime(freq, startTime);
              gain.gain.setValueAtTime(0.16, startTime);
              gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(startTime);
              osc.stop(startTime + 0.22);
            });
          } else if (type === "mastery") {
            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
            notes.forEach((freq, idx) => {
              const startTime = now + idx * 0.045;
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = "sine";
              osc.frequency.setValueAtTime(freq, startTime);
              gain.gain.setValueAtTime(0.2, startTime);
              gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(startTime);
              osc.stop(startTime + 0.35);
            });
          } else if (type === "remove") {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(380, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.09);
            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.09);
          }
        } catch (_) {}
      }
      const capabilityMeta = {
        healing: {
          label: "Soins", icon: "＋", color: "#4fe29a", copy: "Régénération directe de PV ou de bouclier.",
          terms: ["soin", "soins", "sante", "pv", "bouclier", "regenere", "rend des", "heal", "health", "shield", "restore", "regenerates"]
        },
        mobility: {
          label: "Mobilité", icon: "➜", color: "#57d9ff", copy: "Vitesse, sauts, glissades et déplacements.",
          terms: ["vitesse", "sprint", "saut", "glissade", "nage", "air", "envol", "surmultiplication", "movement", "speed", "jump", "slide", "swim", "launch", "overdrive", "mantling"]
        },
        defense: {
          label: "Défense", icon: "◆", color: "#8f9dff", copy: "Protection, camouflage et résistance personnelle.",
          terms: ["protect", "protection", "bulle", "invisible", "degats de chute", "maximum de pv", "maximum health", "fall damage", "bubble", "invisible", "preventing fall"]
        },
        loot: {
          label: "Butin", icon: "⬡", color: "#ffd15c", copy: "Objets, améliorations et récompenses supplémentaires.",
          terms: ["butin", "coffre", "munitions", "objet aleatoire", "rare", "loot", "chest", "ammo", "random item", "spawn extra"]
        },
        combat: {
          label: "Combat", icon: "✦", color: "#ff6f87", copy: "Dégâts, cadence et puissance offensive.",
          terms: ["degats", "elimination", "cadence de tir", "rechargement", "pioche", "explosion", "ennemi", "adversaire", "damage", "elimination", "fire rate", "reload", "pickaxe", "opponent", "enemy"]
        },
        squad: {
          label: "Soutien d’escouade", icon: "●", color: "#c48cff", copy: "Repérage et avantages utiles à l’équipe.",
          terms: ["escouade", "allie", "traces de pas", "chaque autre esprit", "squad", "teammate", "footsteps", "every other carried"]
        }
      };

      const GUIDE_CATEGORY_ORDER = ["healing", "mobility", "defense", "loot", "combat", "squad"];

      const searchDocumentCache = new Map();

      const categorySearchAliases = {
        healing: ["soin", "soins", "guerison", "healing", "heal"],
        mobility: ["mobilite", "deplacement", "deplacements", "mobility"],
        defense: ["defense", "protection", "defence"],
        loot: ["butin", "loot"],
        combat: ["combat"],
        squad: ["soutien", "escouade", "equipe", "squad", "team support"]
      };

      let appearanceSettings = loadAppearanceSettings();
      let adminAccess = false;
      let adminContent = loadAdminContent();
      let adminDraft = loadAdminDraft();
      let adminDraftDirty = false;
      let patchEditorContext = null;

      function loadAppearanceSettings() {
        try {
          const saved = JSON.parse(localStorage.getItem(APPEARANCE_KEY) || "{}");
          return {
            accent: /^#[0-9a-f]{6}$/i.test(saved.accent || "") ? saved.accent.toLowerCase() : DEFAULT_APPEARANCE.accent,
            background: ["night", "galaxy", "storm", "zero"].includes(saved.background) ? saved.background : DEFAULT_APPEARANCE.background,
            cardSize: ["small", "medium", "large"].includes(saved.cardSize) ? saved.cardSize : DEFAULT_APPEARANCE.cardSize,
            density: ["dense", "balanced", "airy"].includes(saved.density) ? saved.density : DEFAULT_APPEARANCE.density,
            reducedMotion: Boolean(saved.reducedMotion),
            sfxEnabled: saved.sfxEnabled !== undefined ? Boolean(saved.sfxEnabled) : DEFAULT_APPEARANCE.sfxEnabled
          };
        } catch (_) { return { ...DEFAULT_APPEARANCE }; }
      }

      function normalizeAdminContent(value = {}) {
        return {
          additions: Array.isArray(value.additions) ? value.additions : [],
          variants: Array.isArray(value.variants) ? value.variants : [],
          overrides: value.overrides && typeof value.overrides === "object" ? value.overrides : {},
          variantOverrides: value.variantOverrides && typeof value.variantOverrides === "object" ? value.variantOverrides : {},
          patchNotes: Array.isArray(value.patchNotes) ? value.patchNotes : [],
          creativeMaps: Array.isArray(value.creativeMaps) ? value.creativeMaps : [],
          updatedAtMs: Math.max(0, Number(value.updatedAtMs) || 0)
        };
      }

      function loadAdminContent() {
        try { return normalizeAdminContent(JSON.parse(localStorage.getItem(ADMIN_CONTENT_KEY) || "{}")); }
        catch (_) { return normalizeAdminContent(); }
      }

      function loadAdminDraft() {
        try { return normalizeAdminContent(JSON.parse(localStorage.getItem(ADMIN_DRAFT_KEY) || "{}")); }
        catch (_) { return normalizeAdminContent(); }
      }

      function hexToRgb(hex) {
        const value = String(hex).replace("#", "");
        return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)].join(", ");
      }

      function applyAppearance() {
        const root = document.documentElement;
        root.style.setProperty("--accent", appearanceSettings.accent);
        root.style.setProperty("--accent-rgb", hexToRgb(appearanceSettings.accent));
        root.dataset.background = appearanceSettings.background;
        root.dataset.cardSize = appearanceSettings.cardSize;
        root.dataset.density = appearanceSettings.density;
        root.dataset.reducedMotion = String(appearanceSettings.reducedMotion);
        const themeMeta = document.querySelector('meta[name="theme-color"]');
        if (themeMeta) themeMeta.content = appearanceSettings.accent;
      }

      function saveAppearance() {
        try { localStorage.setItem(APPEARANCE_KEY, JSON.stringify(appearanceSettings)); } catch (_) {}
        applyAppearance();
        renderAppearanceControls();
      }

      function renderAppearanceControls() {
        const color = document.getElementById("accentColor");
        if (!color) return;
        color.value = appearanceSettings.accent;
        document.getElementById("accentColorValue").textContent = appearanceSettings.accent.toUpperCase();
        document.getElementById("reducedMotion").checked = appearanceSettings.reducedMotion;
        const sfxInput = document.getElementById("sfxEnabled");
        if (sfxInput) sfxInput.checked = Boolean(appearanceSettings.sfxEnabled);
        document.querySelectorAll("[data-color]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.color.toLowerCase() === appearanceSettings.accent.toLowerCase())));
        document.querySelectorAll("[data-background]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.background === appearanceSettings.background)));
        document.querySelectorAll("[data-card-size]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.cardSize === appearanceSettings.cardSize)));
        document.querySelectorAll("[data-density]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.density === appearanceSettings.density)));
      }

      function containsNormalizedPhrase(haystack, needle) {
        const normalizedNeedle = normalizedText(needle);
        return Boolean(normalizedNeedle) && ` ${normalizedText(haystack)} `.includes(` ${normalizedNeedle} `);
      }

      function spriteCapabilityKeys(sprite) {
        if (GUIDE_CATEGORY_ORDER.includes(sprite.guideCategory)) return [sprite.guideCategory];
        const haystack = [sprite.fr, sprite.en, sprite.effect?.fr, sprite.effect?.en].filter(Boolean).join(" ");
        const detected = Object.entries(capabilityMeta)
          .filter(([, meta]) => meta.terms.some(term => containsNormalizedPhrase(haystack, term)))
          .map(([key]) => key);
        return [detected[0] || "combat"];
      }

      function searchStem(token) {
        if (token.length > 5 && token.endsWith("ies")) return `${token.slice(0, -3)}y`;
        if (token.length > 4 && token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1);
        return token;
      }

      function damerauLevenshtein(a, b) {
        if (a === b) return 0;
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        
        const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
        
        for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
        
        for (let i = 1; i <= a.length; i++) {
          for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
              matrix[i - 1][j] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j - 1] + cost
            );
            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
              matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + cost);
            }
          }
        }
        return matrix[a.length][b.length];
      }

      function tokenMatchQuality(queryToken, candidateToken) {
        if (queryToken === candidateToken) return 4;
        if (searchStem(queryToken) === searchStem(candidateToken)) return 3.6;
        if (candidateToken.startsWith(queryToken)) {
          if (queryToken.length === 1) return 1.8;
          if (queryToken.length === 2) return 2.5;
          return 3;
        }
        
        const distance = damerauLevenshtein(queryToken, candidateToken);
        if (queryToken.length >= 3 && queryToken.length <= 5 && distance === 1) return 2.4;
        if (queryToken.length >= 6) {
          if (distance === 1) return 2.6;
          if (distance === 2) return 1.8;
        }
        return 0;
      }

      function bestTokenQuality(queryToken, candidateTokens) {
        let best = 0;
        const searchableTokens = queryToken.length <= 2
          ? candidateTokens.filter(candidateToken => !SEARCH_IGNORED_TOKENS.has(candidateToken))
          : candidateTokens;
        searchableTokens.forEach(candidateToken => {
          best = Math.max(best, tokenMatchQuality(queryToken, candidateToken));
        });
        return best;
      }

      function uniqueSearchTokens(values) {
        return [...new Set(values.flatMap(value => searchTokens(value)))];
      }

      function buildSearchDocument(sprite) {
        const cached = searchDocumentCache.get(sprite.id);
        if (cached) return cached;

        const variant = variants[sprite.variant] || variants.base;
        const names = [sprite.fr, sprite.en, ...(sprite.aliases || [])].filter(Boolean).map(normalizedText);
        const abilities = [sprite.effect?.fr, sprite.effect?.en].filter(Boolean).map(normalizedText);
        const variantValues = [variant.fr, variant.en, variant.effect?.fr, variant.effect?.en].filter(Boolean).map(normalizedText);
        const rarityValues = [sprite.rarity, rarityLabels.fr[sprite.rarity], rarityLabels.en[sprite.rarity]].filter(Boolean).map(normalizedText);
        const categoryKeys = spriteCapabilityKeys(sprite);
        const categoryValues = categoryKeys.flatMap(key => [key, capabilityMeta[key].label, ...(categorySearchAliases[key] || [])]).map(normalizedText);
        const document = {
          names,
          abilities,
          variants: variantValues,
          rarities: rarityValues,
          categories: categoryValues,
          nameTokens: uniqueSearchTokens(names),
          abilityTokens: uniqueSearchTokens(abilities),
          variantTokens: uniqueSearchTokens(variantValues),
          rarityTokens: uniqueSearchTokens(rarityValues),
          categoryTokens: uniqueSearchTokens(categoryValues)
        };
        document.allText = normalizedText([...names, ...abilities, ...variantValues, ...rarityValues, ...categoryValues].join(" "));
        document.allTokens = uniqueSearchTokens([document.allText]);
        searchDocumentCache.set(sprite.id, document);
        return document;
      }

      function buildSearchIndex(sprite) {
        return buildSearchDocument(sprite).allText;
      }

      function scoreSpriteSearch(sprite, rawQuery) {
        const query = normalizedText(rawQuery);
        if (!query) return 1;

        const originalTokens = searchTokens(query);
        const tokens = searchTokens(query, { ignoreGeneric: true });
        const document = buildSearchDocument(sprite);
        const nameIntent = originalTokens.some(token => ["esprit", "esprits", "sprite", "sprites"].includes(token));
        if (nameIntent && tokens.some(token => bestTokenQuality(token, document.nameTokens) === 0)) return 0;
        const overallQualities = tokens.map(token => bestTokenQuality(token, document.allTokens));
        if (overallQualities.some(quality => quality === 0)) return 0;

        const zones = [
          [document.nameTokens, 180],
          [document.abilityTokens, 120],
          [document.variantTokens, 110],
          [document.rarityTokens, 100],
          [document.categoryTokens, 75]
        ];
        let score = 100 + overallQualities.reduce((total, quality) => total + quality * 12, 0);

        tokens.forEach(token => {
          let bestZoneScore = 0;
          zones.forEach(([zoneTokens, weight]) => {
            bestZoneScore = Math.max(bestZoneScore, bestTokenQuality(token, zoneTokens) * weight);
          });
          score += bestZoneScore;
        });

        const meaningfulPhrase = tokens.join(" ");
        if (document.names.some(name => name === query)) score += 2400;
        else if (document.names.some(name => containsNormalizedPhrase(name, query))) score += 1200;
        else if (meaningfulPhrase && document.names.some(name => containsNormalizedPhrase(name, meaningfulPhrase))) score += 900;

        if (document.variants.some(value => value === query)) score += 800;
        if (document.rarities.some(value => value === query)) score += 700;
        if (document.abilities.some(value => containsNormalizedPhrase(value, query))) score += 500;
        if (tokens.every(token => bestTokenQuality(token, document.nameTokens) > 0)) score += 550;
        return score;
      }

      function representativeSprites() {
        const seen = new Set();
        return sprites.filter(sprite => {
          if (seen.has(sprite.familyKey)) return false;
          seen.add(sprite.familyKey);
          return true;
        });
      }

      function localizedGuideValue(value) {
        if (!value) return "";
        if (typeof value === "string") return value;
        return value[APP_LANGUAGE] || value.fr || value.en || "";
      }

      function guideProfileFor(sprite) {
        const profile = sprite.guideProfile || guideProfiles[sprite.familyKey];
        if (profile) return profile;
        return {
          category: GUIDE_CATEGORY_ORDER.includes(sprite.guideCategory) ? sprite.guideCategory : "combat",
          summonCost: null,
          ability: sprite.effect,
          note: {
            fr: "Les paliers détaillés de cet esprit ajouté par l’administration ne sont pas encore renseignés.",
            en: "Detailed level values for this admin-added Sprite have not been entered yet."
          }
        };
      }

      function guideCardTemplate(sprite, profile, meta) {
        return `
          <article class="guide-card" data-guide-family="${esc(sprite.familyKey)}" data-guide-card-category="${esc(profile.category)}" style="--guide-color:${meta.color}">
            <div class="guide-card-media">
              <img src="${esc(sprite.image)}" alt="${esc(localizedName(sprite))}" loading="lazy" decoding="async" referrerpolicy="no-referrer">
              <span class="guide-category-badge">${esc(meta.label)}</span>
            </div>
            <div class="guide-card-content">
              <div class="guide-card-top">
                <span class="badge ${sprite.rarity}">${rarityLabel(sprite.rarity)}</span>
                <span class="guide-card-en">${esc(sprite.en)}</span>
              </div>
              <h3>${esc(localizedName(sprite))}</h3>
              <p class="guide-ability">${esc(localizedGuideValue(profile.ability) || localizedEffect(sprite.effect))}</p>
              <div class="guide-card-footer">
                <button class="guide-detail-btn" type="button" data-guide-sprite="${esc(sprite.id)}">${APP_LANGUAGE === "fr" ? "Voir le guide" : "View guide"}</button>
              </div>
            </div>
          </article>`;
      }

      function openGuideDetails(id) {
        const sprite = sprites.find(item => item.id === id);
        if (!sprite || !guideDetailDialog) return;
        const profile = guideProfileFor(sprite);
        const category = GUIDE_CATEGORY_ORDER.includes(profile.category) ? profile.category : "combat";
        const meta = capabilityMeta[category];
        const levels = Array.isArray(profile.levels) ? profile.levels.slice(0, 5) : [];
        const cost = Number.isFinite(profile.summonCost)
          ? new Intl.NumberFormat(APP_LOCALE).format(profile.summonCost)
          : (APP_LANGUAGE === "fr" ? "Non renseigné" : "Not listed");
        const image = document.getElementById("guideDialogImage");
        const rarity = document.getElementById("guideDialogRarity");
        const levelBlock = document.getElementById("guideDialogLevelBlock");

        guideDetailDialog.querySelector(".guide-dialog-inner").style.setProperty("--guide-color", meta.color);
        image.classList.remove("broken");
        image.src = sprite.image;
        image.alt = localizedName(sprite);
        image.onerror = () => image.classList.add("broken");
        document.getElementById("guideDialogCategory").textContent = meta.label;
        rarity.className = `badge ${sprite.rarity}`;
        rarity.textContent = rarityLabel(sprite.rarity);
        document.getElementById("guideDialogEnglish").textContent = sprite.en;
        document.getElementById("guideDialogTitle").textContent = localizedName(sprite);
        document.getElementById("guideDialogAbility").textContent = localizedGuideValue(profile.ability) || localizedEffect(sprite.effect);
        document.getElementById("guideDialogLevelCaption").textContent = localizedGuideValue(profile.levelCaption) || (APP_LANGUAGE === "fr" ? "Progression des niveaux" : "Level progression");
        document.getElementById("guideDialogLevelGrid").innerHTML = levels.map((value, index) => `<span class="guide-level"><b>${APP_LANGUAGE === "fr" ? "Niv." : "Lvl."} ${index + 1}</b><span>${esc(value)}</span></span>`).join("");
        levelBlock.hidden = !levels.length;
        document.getElementById("guideDialogNote").textContent = localizedGuideValue(profile.note);
        document.getElementById("guideDialogCost").textContent = `${cost} ${APP_LANGUAGE === "fr" ? "Poussières" : "Dust"}`;
        if (!guideDetailDialog.open) guideDetailDialog.showModal();
      }

      function setupGuideCarousels() {
        document.querySelectorAll(".guide-category-track").forEach(track => {
          const updateEdges = () => {
            track.dataset.atStart = String(track.scrollLeft <= 2);
            track.dataset.atEnd = String(track.scrollLeft + track.clientWidth >= track.scrollWidth - 2);
          };
          const slide = direction => track.scrollBy({
            left: direction * Math.max(260, track.clientWidth * .78),
            behavior: appearanceSettings.reducedMotion ? "auto" : "smooth"
          });
          track.addEventListener("scroll", updateEdges, { passive: true });
          track.addEventListener("wheel", event => {
            if (track.scrollWidth <= track.clientWidth || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
            const atStart = track.scrollLeft <= 1;
            const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
            if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd)) return;
            event.preventDefault();
            track.scrollBy({ left: event.deltaY, behavior: "auto" });
          }, { passive: false });
          track.addEventListener("keydown", event => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            slide(event.key === "ArrowRight" ? 1 : -1);
          });
          track._guideSlide = slide;
          requestAnimationFrame(updateEdges);
        });
      }

      function renderGuide() {
        const familiesInGuide = representativeSprites().map(sprite => ({ sprite, profile: guideProfileFor(sprite) }));
        document.getElementById("guideGrid").innerHTML = GUIDE_CATEGORY_ORDER.map(category => {
          const meta = capabilityMeta[category];
          const entries = familiesInGuide
            .filter(({ profile }) => profile.category === category)
            .sort((left, right) => localizedName(left.sprite).localeCompare(localizedName(right.sprite), APP_LOCALE));
          if (!entries.length) return "";
          const trackId = `guide-track-${category}`;
          return `
            <section class="guide-category-section" data-guide-section="${category}" style="--guide-color:${meta.color}" aria-labelledby="guide-section-${category}">
              <header class="guide-category-head">
                <div class="guide-category-title"><span aria-hidden="true">${meta.icon}</span><div><h2 id="guide-section-${category}">${esc(meta.label)}</h2><p>${esc(meta.copy)}</p></div></div>
                <div class="guide-category-actions">
                  <span class="guide-category-count">${entries.length} ${APP_LANGUAGE === "fr" ? `esprit${entries.length > 1 ? "s" : ""}` : `Sprite${entries.length > 1 ? "s" : ""}`}</span>
                  <div class="guide-scroll-controls">
                    <button type="button" data-guide-scroll="-1" aria-controls="${trackId}" aria-label="${APP_LANGUAGE === "fr" ? "Esprits précédents" : "Previous Sprites"}">‹</button>
                    <button type="button" data-guide-scroll="1" aria-controls="${trackId}" aria-label="${APP_LANGUAGE === "fr" ? "Esprits suivants" : "Next Sprites"}">›</button>
                  </div>
                </div>
              </header>
              <div class="guide-carousel-shell">
                <div class="guide-category-track" id="${trackId}" tabindex="0" aria-label="${esc(`${meta.label} · ${APP_LANGUAGE === "fr" ? "fais glisser vers la droite" : "swipe right"}`)}">
                  ${entries.map(({ sprite, profile }) => guideCardTemplate(sprite, profile, meta)).join("")}
                </div>
              </div>
            </section>`;
        }).join("");
        setupGuideCarousels();
      }

      const baseSpriteSnapshot = new Map(sprites.map(sprite => [sprite.id, {
        fr: sprite.fr, en: sprite.en, rarity: sprite.rarity, effect: sprite.effect,
        image: sprite.image, releaseDate: sprite.releaseDate || ""
      }]));
      const baseVariantSnapshot = Object.fromEntries(Object.entries(variants).map(([key, variant]) => [key, {
        fr: variant.fr,
        en: variant.en,
        color: variant.color,
        effect: { fr: variant.effect.fr, en: variant.effect.en }
      }]));
      const adminManagedSpriteIds = new Set();

      function openPatchNoteEditor(context, body, title = "") {
        patchEditorContext = context;
        document.getElementById("patchEditorTitle").value = title;
        document.getElementById("patchEditorBody").value = body;
        const dialog = document.getElementById("patchNoteEditor");
        if (!dialog.open) dialog.showModal();
      }

      async function savePatchNoteEditor({ publish = true } = {}) {
        if (!patchEditorContext || !adminAccess) return;
        const body = document.getElementById("patchEditorBody").value.trim();
        const title = document.getElementById("patchEditorTitle").value.trim().slice(0, 100) || "Mise à jour Sprite Locker";
        if (!body) return showToast("Le contenu ne peut pas être vide");
        const context = patchEditorContext;
        try {
          let currentNotes = Array.isArray(adminDraft.patchNotes) && adminDraft.patchNotes.length
            ? [...adminDraft.patchNotes]
            : [...(adminContent.patchNotes || [])];

          let targetIndex = -1;
          if (context.id) {
            targetIndex = currentNotes.findIndex(n => n.id === context.id);
          }
          if (targetIndex < 0 && Number.isFinite(context.index)) {
            targetIndex = context.index;
          }

          if (targetIndex >= 0 && currentNotes[targetIndex]) {
            currentNotes[targetIndex] = {
              ...currentNotes[targetIndex],
              title,
              body: body.slice(0, 1800),
              updatedAtMs: Date.now()
            };
          } else {
            currentNotes.push({
              id: context.id || `patch-${Date.now().toString(36)}`,
              title,
              body: body.slice(0, 1800),
              date: new Date().toISOString(),
              createdAtMs: Date.now(),
              updatedAtMs: Date.now()
            });
          }

          adminDraft = normalizeAdminContent({
            ...adminDraft,
            patchNotes: currentNotes,
            updatedAtMs: Date.now()
          });

          if (publish) {
            await publishAdminContent();
            showToast("Patch Note mis à jour et publié !");
          } else {
            markAdminDraft("Patch Note modifié dans le brouillon");
            showToast("Modification enregistrée dans le brouillon");
          }
          document.getElementById("patchNoteEditor").close();
          patchEditorContext = null;
        } catch (error) {
          showToast(friendlyFirebaseError(error));
        }
      }

      function normalizeManagedSprite(item, fallback = {}) {
        const variant = variants[item.variant] ? item.variant : (fallback.variant || "base");
        const familyKey = slugForAdmin(item.familyKey || fallback.familyKey || item.fr || "sprite");
        const id = String(item.id || `${familyKey}-${variant}`);
        const effectText = String(item.effect || fallback.effect && localizedEffect(fallback.effect) || "Capacité à venir.").slice(0, 500);
        return {
          id,
          catalogNumber: sprites.length + 1,
          familyKey,
          familyIndex: Number.isFinite(Number(item.familyIndex)) ? Number(item.familyIndex) : sprites.length + 100,
          variantIndex: Object.keys(variants).indexOf(variant),
          variant,
          fr: String(item.fr || fallback.fr || "Nouvel esprit").slice(0, 60),
          en: String(item.en || fallback.en || item.fr || "New Sprite").slice(0, 60),
          aliases: Array.isArray(item.aliases) ? item.aliases : [],
          rarity: rarityRank[item.rarity] ? item.rarity : (fallback.rarity || "rare"),
          effect: { fr: effectText, en: String(item.effectEn || fallback.effect && fallback.effect.en || effectText).slice(0, 500) },
          guideCategory: GUIDE_CATEGORY_ORDER.includes(item.guideCategory) ? item.guideCategory : (fallback.guideCategory || "combat"),
          guideProfile: fallback.guideProfile || null,
          image: String(item.image || fallback.image || ""),
          releaseDate: String(item.releaseDate || "")
        };
      }

      function applyAdminContent(content, { announce = false } = {}) {
        adminManagedSpriteIds.forEach(id => {
          const index = sprites.findIndex(sprite => sprite.id === id);
          if (index >= 0) sprites.splice(index, 1);
        });
        adminManagedSpriteIds.clear();

        Object.entries(baseVariantSnapshot).forEach(([key, snapshot]) => {
          Object.assign(variants[key], {
            fr: snapshot.fr,
            en: snapshot.en,
            color: snapshot.color,
            effect: { fr: snapshot.effect.fr, en: snapshot.effect.en }
          });
        });
        Object.entries(content.variantOverrides || {}).forEach(([key, override]) => {
          if (!variants[key] || !override || typeof override !== "object") return;
          const fallback = baseVariantSnapshot[key];
          const color = /^#[0-9a-f]{6}$/i.test(String(override.color || "")) ? String(override.color).toLowerCase() : fallback.color;
          Object.assign(variants[key], {
            fr: String(override.fr || fallback.fr).trim().slice(0, 40) || fallback.fr,
            en: String(override.en || fallback.en).trim().slice(0, 40) || fallback.en,
            color,
            effect: {
              fr: String(override.effectFr || fallback.effect.fr).trim().slice(0, 500) || fallback.effect.fr,
              en: String(override.effectEn || fallback.effect.en).trim().slice(0, 500) || fallback.effect.en
            }
          });
        });

        baseSpriteSnapshot.forEach((snapshot, id) => {
          const sprite = sprites.find(item => item.id === id);
          if (!sprite) return;
          Object.assign(sprite, snapshot);
          const family = families.find(item => item.key === sprite.familyKey);
          if (family && sprite.variant !== "base") sprite.en = `${variants[sprite.variant].en} ${family.en}`;
        });

        const additions = [...(content.additions || [])];
        additions.forEach((item, index) => {
          const sprite = normalizeManagedSprite({ ...item, familyIndex: families.length + index });
          if (!sprite.image || sprites.some(existing => existing.id === sprite.id)) return;
          sprites.push(sprite);
          adminManagedSpriteIds.add(sprite.id);
        });

        (content.variants || []).forEach((item, index) => {
          const fallback = sprites.find(sprite => sprite.familyKey === item.familyKey) || {};
          const sprite = normalizeManagedSprite({ ...item, familyIndex: fallback.familyIndex ?? families.length + additions.length + index }, fallback);
          if (!sprite.image || sprites.some(existing => existing.id === sprite.id)) return;
          sprites.push(sprite);
          adminManagedSpriteIds.add(sprite.id);
        });

        Object.entries(content.overrides || {}).forEach(([id, override]) => {
          const sprite = sprites.find(item => item.id === id);
          if (!sprite || !override || typeof override !== "object") return;
          if (override.fr) sprite.fr = String(override.fr).slice(0, 60);
          if (override.en) sprite.en = String(override.en).slice(0, 60);
          if (rarityRank[override.rarity]) sprite.rarity = override.rarity;
          if (override.image) sprite.image = String(override.image);
          if (override.effect) sprite.effect = { fr: String(override.effect).slice(0, 500), en: String(override.effectEn || override.effect).slice(0, 500) };
          sprite.releaseDate = String(override.releaseDate || sprite.releaseDate || "");
        });

        searchDocumentCache.clear();
        spriteCardCache.clear();
        sprites.sort((a, b) => a.familyIndex - b.familyIndex || a.variantIndex - b.variantIndex);
        sprites.forEach((sprite, index) => {
          sprite.catalogNumber = index + 1;
          if (!state[sprite.id]) state[sprite.id] = blankEntry();
        });
        renderPublishedPatchNotes(content.patchNotes || []);
        populateVariantFilterOptions();
        populateAdminSelectors();
        if (activePage === "catalog") render();
        if (activePage === "guide") renderGuide();
        updateStats();
        if (announce) showToast("Aperçu du catalogue appliqué");
      }

      function renderPublishedPatchNotes(notes) {
        document.querySelectorAll(".custom-patch-entry").forEach(el => el.remove());
        const page = document.getElementById("patchNotesPage");
        if (!page) return;

        (notes || []).forEach((note, index) => {
          const noteId = note.id || `patch-${index}`;
          const dateVal = note.date || note.createdAtMs || Date.now();
          const parsedDate = new Date(dateVal);
          const dateLabel = Number.isNaN(parsedDate.getTime()) ? "Date récente" : parsedDate.toLocaleString(APP_LOCALE, { dateStyle: "long", timeStyle: "short" });
          
          const article = document.createElement("article");
          article.className = "patch-entry custom-patch-entry";
          article.setAttribute("data-patch-id", noteId);
          article.setAttribute("data-timestamp", parsedDate.getTime() || 0);
          
          article.innerHTML = `
            <header class="patch-simple-head"><div><span class="patch-kicker">Patch Note publié</span><h1>${esc(note.title || "Mise à jour Sprite Locker")}</h1></div><time class="patch-date">${esc(dateLabel)}</time></header>
            <section class="patch-card"><ul class="patch-list">${String(note.body || "").split(/\n+/).filter(Boolean).map(line => `<li>${esc(line)}</li>`).join("")}</ul></section>
            ${adminAccess ? `<div class="patch-admin-actions"><button type="button" data-patch-admin-action="edit" data-patch-id="${esc(noteId)}"><span aria-hidden="true">✎</span>Modifier</button><button class="is-danger" type="button" data-patch-admin-action="delete" data-patch-id="${esc(noteId)}"><span aria-hidden="true">×</span>Supprimer</button></div>` : ""}
          `;
          page.appendChild(article);
        });

        const allEntries = Array.from(page.querySelectorAll(".patch-entry"));
        allEntries.forEach(entry => {
          if (!entry.hasAttribute("data-timestamp")) {
            const timeEl = entry.querySelector("time[datetime]");
            if (timeEl) {
              const ts = new Date(timeEl.getAttribute("datetime")).getTime();
              entry.setAttribute("data-timestamp", ts || 0);
            } else {
              entry.setAttribute("data-timestamp", 0);
            }
          }
        });

        allEntries.sort((a, b) => {
          const tsA = Number(a.getAttribute("data-timestamp")) || 0;
          const tsB = Number(b.getAttribute("data-timestamp")) || 0;
          return tsB - tsA;
        });

        allEntries.forEach(entry => page.appendChild(entry));
        
        const oldFeed = document.getElementById("publishedPatchFeed");
        if (oldFeed) oldFeed.remove();
      }

      function loadPublishedContent() {
        if (!firebaseSdk || !firebaseDb) return;
        try {
          const catalogRef = firebaseSdk.doc(firebaseDb, "spriteLockerContent", "catalog");
          firebaseSdk.onSnapshot(catalogRef, snapshot => {
            if (snapshot.exists()) {
              const remote = normalizeAdminContent(snapshot.data());
              adminContent = remote;
              try { localStorage.setItem(ADMIN_CONTENT_KEY, JSON.stringify(adminContent)); } catch (_) {}
              if (!adminDraftDirty && !localStorage.getItem(ADMIN_DRAFT_KEY)) {
                adminDraft = normalizeAdminContent(adminContent);
              }
              applyAdminContent(adminContent);
            }
          }, error => {
            console.warn("Erreur écoute catalogue distant:", error);
          });
        } catch (err) {
          console.error("Erreur initialisation catalogue:", err);
        }
      }

      function setAdminAccess(allowed) {
        adminAccess = Boolean(allowed);
        document.querySelectorAll("[data-admin-link]").forEach(link => { link.hidden = !adminAccess; });
        renderPublishedPatchNotes(adminContent.patchNotes || []);
        renderAdminAccess();
        if (typeof fetchReviews === "function" && firebaseReady) {
          fetchReviews();
        }
      }

      async function checkAdminAccess(user) {
        if (!user || !firebaseSdk || !firebaseDb) {
          return setAdminAccess(false);
        }
        try {
          const snapshot = await firebaseSdk.getDoc(firebaseSdk.doc(firebaseDb, "spriteLockerAdmins", user.uid));
          setAdminAccess(snapshot.exists() && snapshot.data().active === true);
        } catch (_) {
          setAdminAccess(false);
        }
      }

      function renderAdminAccess() {
        const locked = document.getElementById("adminLocked");
        const workspace = document.getElementById("adminWorkspace");
        const guard = document.getElementById("adminGuardState");
        const entryCopy = document.getElementById("adminEntryCopy");
        if (!locked || !workspace) return;
        locked.hidden = adminAccess;
        workspace.hidden = !adminAccess;
        guard.textContent = adminAccess ? "Compte administrateur vérifié" : (firebaseUser ? "Compte non autorisé" : "Connexion requise");
        guard.classList.toggle("is-ready", adminAccess);
        entryCopy.textContent = adminAccess
          ? "Ton compte est autorisé : le catalogue global peut être mis à jour."
          : "Connecte ton compte administrateur pour gérer le catalogue et les Patch Notes.";
        const entryButton = document.querySelector("#adminEntry button");
        if (entryButton) entryButton.disabled = !adminAccess && Boolean(firebaseUser);
        renderAdminHistory();
      }

      function populateAdminSelectors() {
        const variantOptions = Object.keys(variants).map(key => `<option value="${key}">${esc(localizedVariant(key))}</option>`).join("");
        document.querySelectorAll(".admin-variant-select").forEach(select => {
          const value = select.value;
          select.innerHTML = variantOptions;
          if (variants[value]) select.value = value;
        });
        const spriteOptions = sprites.map(sprite => `<option value="${esc(sprite.id)}">${esc(localizedName(sprite))} · ${esc(localizedVariant(sprite.variant))}</option>`).join("");
        const edit = document.getElementById("adminEditSprite");
        if (edit) {
          const value = edit.value;
          edit.innerHTML = spriteOptions;
          edit.value = sprites.some(sprite => sprite.id === value) ? value : (sprites[0] && sprites[0].id || "");
          fillAdminEditForm();
        }
        const familyOptions = representativeSprites().map(sprite => `<option value="${esc(sprite.familyKey)}">${esc(sprite.fr)}</option>`).join("");
        const family = document.getElementById("adminVariantFamily");
        if (family) family.innerHTML = familyOptions;
        fillAdminVariantEditForm();
      }

      function fillAdminEditForm() {
        const form = document.getElementById("adminEditForm");
        if (!form) return;
        const sprite = sprites.find(item => item.id === form.elements.spriteId.value);
        if (!sprite) return;
        form.elements.fr.value = sprite.fr;
        form.elements.en.value = sprite.en;
        form.elements.effect.value = localizedEffect(sprite.effect);
        form.elements.rarity.value = sprite.rarity;
        form.elements.image.value = sprite.image;
        form.elements.releaseDate.value = sprite.releaseDate || "";
      }

      function fillAdminVariantEditForm() {
        const form = document.getElementById("adminVariantEditForm");
        if (!form) return;
        const key = form.elements.variantKey.value;
        const fallback = baseVariantSnapshot[key];
        if (!fallback) return;
        const override = adminDraft && adminDraft.variantOverrides && adminDraft.variantOverrides[key] || {};
        form.elements.fr.value = override.fr || fallback.fr;
        form.elements.en.value = override.en || fallback.en;
        form.elements.color.value = /^#[0-9a-f]{6}$/i.test(String(override.color || "")) ? String(override.color).toLowerCase() : fallback.color;
        form.elements.effectFr.value = override.effectFr || fallback.effect.fr;
        form.elements.effectEn.value = override.effectEn || fallback.effect.en;
      }

      function activateAdminTab(tab) {
        const selected = document.querySelector(`[data-admin-tab="${tab}"]`);
        if (!selected) return;
        document.querySelectorAll("[data-admin-tab]").forEach(item => item.setAttribute("aria-selected", String(item === selected)));
        document.querySelectorAll("[data-admin-panel]").forEach(panel => panel.classList.toggle("is-active", panel.dataset.adminPanel === tab));
        if (tab === "variant-edit") fillAdminVariantEditForm();
      }

      function markAdminDraft(message) {
        adminDraft.updatedAtMs = Date.now();
        adminDraftDirty = true;
        try { localStorage.setItem(ADMIN_DRAFT_KEY, JSON.stringify(adminDraft)); } catch (_) {}
        document.getElementById("adminDraftStatus").textContent = message;
        renderAdminHistory();
      }

      function renderAdminHistory() {
        const history = document.getElementById("adminHistory");
        if (!history) return;
        const changedArrayItems = (draftItems, publishedItems, type, titleFor) => {
          const publishedById = new Map((publishedItems || []).map((item, index) => [item.id || `${type}-${index}`, item]));
          return (draftItems || []).flatMap((item, index) => {
            const id = item.id || `${type}-${index}`;
            const published = publishedById.get(id);
            return JSON.stringify(item) !== JSON.stringify(published) ? [{ title: titleFor(item), type }] : [];
          });
        };
        const changedObjectItems = (draftObject, publishedObject, type, titleFor) => Object.entries(draftObject || {}).flatMap(([key, value]) =>
          JSON.stringify(value) !== JSON.stringify((publishedObject || {})[key]) ? [{ title: titleFor(key, value), type }] : []
        );
        const deletedArrayItems = (draftItems, publishedItems, type, titleFor) => {
          const draftIds = new Set((draftItems || []).map((item, index) => item.id || `${type}-${index}`));
          return (publishedItems || []).flatMap((item, index) => {
            const id = item.id || `${type}-${index}`;
            return draftIds.has(id) ? [] : [{ title: titleFor(item), type: `${type} supprimé` }];
          });
        };
        const deletedObjectItems = (draftObject, publishedObject, type, titleFor) => Object.keys(publishedObject || {}).flatMap(key =>
          Object.prototype.hasOwnProperty.call(draftObject || {}, key) ? [] : [{ title: titleFor(key, publishedObject[key]), type: `${type} supprimé` }]
        );
        const items = [
          ...changedArrayItems(adminDraft.additions, adminContent.additions, "Nouvel esprit", item => item.fr),
          ...changedArrayItems(adminDraft.variants, adminContent.variants, "Variante", item => `${item.fr || item.familyKey} · ${localizedVariant(item.variant)}`),
          ...changedObjectItems(adminDraft.overrides, adminContent.overrides, "Correction", id => localizedName(sprites.find(sprite => sprite.id === id) || { fr: id, en: id })),
          ...changedObjectItems(adminDraft.variantOverrides, adminContent.variantOverrides, "Type de variante", (key, override) => override.fr || localizedVariant(key)),
          ...changedArrayItems(adminDraft.patchNotes, adminContent.patchNotes, "Patch Note", item => item.title),
          ...deletedArrayItems(adminDraft.additions, adminContent.additions, "Esprit", item => item.fr),
          ...deletedArrayItems(adminDraft.variants, adminContent.variants, "Variante", item => `${item.fr || item.familyKey} · ${localizedVariant(item.variant)}`),
          ...deletedObjectItems(adminDraft.overrides, adminContent.overrides, "Correction", id => localizedName(sprites.find(sprite => sprite.id === id) || { fr: id, en: id })),
          ...deletedObjectItems(adminDraft.variantOverrides, adminContent.variantOverrides, "Type de variante", (key, override) => override.fr || localizedVariant(key)),
          ...deletedArrayItems(adminDraft.patchNotes, adminContent.patchNotes, "Patch Note", item => item.title)
        ];
        history.innerHTML = items.length ? items.slice().reverse().map(item => `<article><strong>${esc(item.title)}</strong><span>${esc(item.type)} · brouillon</span></article>`).join("") : "";
        renderAdminContentManager();
        renderAdminPatchQuickList();
        renderAdminMapQuickList();
      }

      function renderAdminContentManager() {
        const manager = document.getElementById("adminContentManager");
        if (!manager) return;
        const content = adminDraft || normalizeAdminContent();
        const group = (title, items, type) => `<section class="admin-manage-group"><h3>${esc(title)}</h3><div class="admin-manage-list">${items.length ? items.map((item, index) => {
          const keyed = type === "override" || type === "variantMeta";
          const key = keyed ? item[0] : "";
          const value = keyed ? item[1] : item;
          const label = type === "variantMeta" ? (value.fr || localizedVariant(key)) : type === "override" ? key : (value.title || value.fr || value.id || `Élément ${index + 1}`);
          const detail = type === "patch" ? (value.date || "Date non définie") : type === "variant" ? localizedVariant(value.variant) : type === "variantMeta" ? `Noms, bonus et couleur · ${value.color || baseVariantSnapshot[key]?.color || "#ffffff"}` : type === "override" ? "Correction personnalisée" : "Contenu du catalogue";
          const canEdit = type === "patch" || type === "variantMeta";
          const editButton = canEdit ? `<button type="button" data-admin-manage-action="edit" data-admin-manage-type="${type}" data-admin-manage-index="${index}"${key ? ` data-admin-manage-key="${esc(key)}"` : ""}>Modifier</button>` : "";
          return `<article class="admin-manage-row"><div><strong>${esc(label)}</strong><small>${esc(detail)}</small></div><div class="admin-manage-actions">${editButton}<button class="is-danger" type="button" data-admin-manage-action="delete" data-admin-manage-type="${type}" data-admin-manage-index="${index}"${key ? ` data-admin-manage-key="${esc(key)}"` : ""}>Supprimer</button></div></article>`;
        }).join("") : `<div class="empty-state"><strong>Aucun contenu</strong></div>`}</div></section>`;
        manager.innerHTML = [
          group("Patch Notes", content.patchNotes || [], "patch"),
          group("Esprits ajoutés", content.additions || [], "addition"),
          group("Variantes ajoutées", content.variants || [], "variant"),
          group("Types de variantes modifiés", Object.entries(content.variantOverrides || {}), "variantMeta"),
          group("Corrections personnalisées", Object.entries(content.overrides || {}), "override")
        ].join("");
      }

      function renderAdminPatchQuickList() {
        const list = document.getElementById("adminPatchQuickList");
        if (!list) return;
        const notes = adminDraft && Array.isArray(adminDraft.patchNotes) && adminDraft.patchNotes.length
          ? adminDraft.patchNotes
          : (adminContent.patchNotes || []);
        list.innerHTML = notes.length ? notes.map((note, index) => {
          const parsedDate = new Date(note.date || note.createdAtMs || Date.now());
          const dateLabel = Number.isNaN(parsedDate.getTime()) ? "Date non définie" : parsedDate.toLocaleString(APP_LOCALE, { dateStyle: "medium", timeStyle: "short" });
          const published = (adminContent.patchNotes || []).some(publishedNote => (publishedNote.id && publishedNote.id === note.id) || (publishedNote.title === note.title && publishedNote.body === note.body));
          const noteId = note.id || `patch-${index}`;
          return `<article class="admin-patch-quick-row">
            <div><strong>${esc(note.title || "Mise à jour Sprite Locker")}</strong><small>${esc(dateLabel)} · ${published ? "publié" : "brouillon à publier"}</small></div>
            <div class="admin-patch-quick-actions">
              <button type="button" data-admin-manage-action="edit" data-admin-manage-type="patch" data-admin-manage-index="${index}" data-patch-id="${esc(noteId)}"><span aria-hidden="true">✎</span>Modifier</button>
              <button class="is-danger" type="button" data-admin-manage-action="delete" data-admin-manage-type="patch" data-admin-manage-index="${index}" data-patch-id="${esc(noteId)}"><span aria-hidden="true">×</span>Supprimer</button>
            </div>
          </article>`;
        }).join("") : `<div class="empty-state"><strong>Aucun Patch Note</strong>Les Patch Notes ajoutés apparaîtront ici avec leurs boutons de gestion.</div>`;
      }

      function manageAdminContent(action, type, index, key, targetId) {
        if (!adminAccess) return;
        if (action === "edit" && type === "patch") {
          let note = null;
          if (targetId) {
            note = (adminDraft.patchNotes || []).find(n => n.id === targetId) || (adminContent.patchNotes || []).find(n => n.id === targetId);
          }
          if (!note && Number.isFinite(index)) {
            note = (adminDraft.patchNotes || [])[index] || (adminContent.patchNotes || [])[index];
          }
          if (note) openPatchNoteEditor({ kind: "patch", index, id: note.id || targetId }, note.body || "", note.title || "");
          return;
        }
        if (action === "edit" && type === "map") {
          let map = null;
          if (targetId) {
            map = (adminDraft.creativeMaps || []).find(m => m.id === targetId) || (adminContent.creativeMaps || []).find(m => m.id === targetId);
          }
          if (!map && Number.isFinite(index)) {
            map = (adminDraft.creativeMaps || [])[index] || (adminContent.creativeMaps || [])[index];
          }
          if (map) {
            activateAdminTab("map");
            const form = document.getElementById("adminMapForm");
            if (form) {
              form.elements["title"].value = map.title || "";
              form.elements["code"].value = map.code || "";
              form.elements["category"].value = map.category || "aim";
              form.elements["image"].value = map.image || "";
              form.elements["description"].value = map.description || "";
              editingMapId = map.id || targetId;
              form.scrollIntoView({ behavior: "smooth", block: "start" });
              showToast("Map chargée pour modification ✎");
            }
          }
          return;
        }
        if (action === "edit" && type === "variantMeta" && baseVariantSnapshot[key]) {
          activateAdminTab("variant-edit");
          const select = document.getElementById("adminVariantEditSelect");
          select.value = key;
          fillAdminVariantEditForm();
          document.getElementById("adminVariantEditForm").scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        if (action !== "delete" || !window.confirm("Supprimer cet élément du contenu ?")) return;
        if (type === "patch") {
          if (targetId) {
            adminDraft.patchNotes = (adminDraft.patchNotes || []).filter(n => n.id !== targetId);
          } else if (Number.isFinite(index)) {
            adminDraft.patchNotes.splice(index, 1);
          }
        }
        if (type === "map") {
          if (targetId) {
            adminDraft.creativeMaps = (adminDraft.creativeMaps || []).filter(m => m.id !== targetId);
          } else if (Number.isFinite(index)) {
            adminDraft.creativeMaps.splice(index, 1);
          }
        }
        if (type === "addition") adminDraft.additions.splice(index, 1);
        if (type === "variant") adminDraft.variants.splice(index, 1);
        if (type === "override" && key) delete adminDraft.overrides[key];
        if (type === "variantMeta" && key) delete adminDraft.variantOverrides[key];
        markAdminDraft("Suppression ajoutée au brouillon");
        showToast((type === "patch" || type === "map") ? "Élément supprimé du brouillon · clique sur Publier" : "Suppression prête à être publiée");
      }

      function slugForAdmin(value) {
        return normalizedText(String(value || ""))
          .replace(/[^a-z0-9-]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .replace(/-{2,}/g, "-")
          .slice(0, 40) || `sprite-${Date.now().toString(36)}`;
      }

      async function publishAdminContent() {
        if (!adminAccess || !firebaseUser || !firebaseSdk || !firebaseDb) {
          showToast("Compte administrateur requis");
          return;
        }
        adminDraft.updatedAtMs = Date.now();
        try {
          await firebaseSdk.setDoc(firebaseSdk.doc(firebaseDb, "spriteLockerContent", "catalog"), {
            ...adminDraft,
            updatedAt: firebaseSdk.serverTimestamp(),
            updatedAtMs: adminDraft.updatedAtMs,
            publishedBy: firebaseUser.uid
          });
          adminContent = normalizeAdminContent(adminDraft);
          adminDraft = normalizeAdminContent(adminContent);
          try {
            localStorage.setItem(ADMIN_CONTENT_KEY, JSON.stringify(adminContent));
            localStorage.removeItem(ADMIN_DRAFT_KEY);
          } catch (_) {}
          adminDraftDirty = false;
          document.getElementById("adminDraftStatus").textContent = "Aucun brouillon · publication réussie";
          applyAdminContent(adminContent);
          renderAdminHistory();
          showToast("Catalogue Sprite Locker publié");
        } catch (error) {
          showToast(friendlyFirebaseError(error));
        }
      }

      document.getElementById("guideGrid").addEventListener("click", event => {
        const scrollButton = event.target.closest("[data-guide-scroll]");
        if (scrollButton) {
          const track = document.getElementById(scrollButton.getAttribute("aria-controls"));
          if (track && typeof track._guideSlide === "function") track._guideSlide(Number(scrollButton.dataset.guideScroll) || 1);
          return;
        }
        const button = event.target.closest("[data-guide-sprite]");
        if (button) openGuideDetails(button.dataset.guideSprite);
      });

      document.getElementById("patchNoteEditor").addEventListener("click", event => {
        const button = event.target.closest("[data-patch-editor-action]");
        if (!button) return;
        if (button.dataset.patchEditorAction === "close") {
          patchEditorContext = null;
          document.getElementById("patchNoteEditor").close();
        }
        if (button.dataset.patchEditorAction === "save") {
          const publish = button.dataset.publish !== "false";
          savePatchNoteEditor({ publish });
        }
      });

      document.getElementById("accentColor").addEventListener("input", event => {
        appearanceSettings.accent = event.target.value.toLowerCase();
        saveAppearance();
      });
      document.getElementById("presetColors").addEventListener("click", event => {
        const button = event.target.closest("[data-color]");
        if (!button) return;
        appearanceSettings.accent = button.dataset.color;
        saveAppearance();
      });
      document.getElementById("backgroundPicker").addEventListener("click", event => {
        const button = event.target.closest("[data-background]");
        if (!button) return;
        appearanceSettings.background = button.dataset.background;
        saveAppearance();
      });
      document.getElementById("cardSizePicker").addEventListener("click", event => {
        const button = event.target.closest("[data-card-size]");
        if (!button) return;
        appearanceSettings.cardSize = button.dataset.cardSize;
        saveAppearance();
      });
      document.getElementById("gridDensityPicker").addEventListener("click", event => {
        const button = event.target.closest("[data-density]");
        if (!button) return;
        appearanceSettings.density = button.dataset.density;
        saveAppearance();
      });
      document.getElementById("reducedMotion").addEventListener("change", event => {
        appearanceSettings.reducedMotion = event.target.checked;
        saveAppearance();
      });
      document.getElementById("sfxEnabled")?.addEventListener("change", event => {
        appearanceSettings.sfxEnabled = event.target.checked;
        saveAppearance();
        if (event.target.checked) playSfx("click");
      });
      document.getElementById("resetAppearance").addEventListener("click", () => {
        appearanceSettings = { ...DEFAULT_APPEARANCE };
        saveAppearance();
        showToast("Apparence réinitialisée");
      });

      document.querySelector(".admin-tabs").addEventListener("click", event => {
        const button = event.target.closest("[data-admin-tab]");
        if (!button) return;
        activateAdminTab(button.dataset.adminTab);
      });

      document.getElementById("adminEditSprite").addEventListener("change", fillAdminEditForm);
      document.getElementById("adminVariantEditSelect").addEventListener("change", fillAdminVariantEditForm);
      document.getElementById("adminSpiritForm").addEventListener("submit", event => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.currentTarget));
        const familyKey = `custom-${slugForAdmin(data.fr)}-${Date.now().toString(36)}`;
        adminDraft.additions.push({ ...data, familyKey, id: `${familyKey}-${data.variant}`, createdAtMs: Date.now() });
        markAdminDraft(`Nouvel esprit : ${data.fr}`);
        event.currentTarget.reset();
        showToast("Esprit ajouté au brouillon");
      });
      document.getElementById("adminEditForm").addEventListener("submit", event => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.currentTarget));
        const id = data.spriteId;
        delete data.spriteId;
        adminDraft.overrides[id] = { ...data, updatedAtMs: Date.now() };
        markAdminDraft(`Correction enregistrée`);
        showToast("Correction ajoutée au brouillon");
      });
      document.getElementById("adminVariantForm").addEventListener("submit", event => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.currentTarget));
        const source = sprites.find(sprite => sprite.familyKey === data.familyKey);
        if (!source) return showToast("Famille d’esprit introuvable");
        const id = `${data.familyKey}-${data.variant}`;
        const allDraftIds = [...adminDraft.additions, ...adminDraft.variants].map(item => item.id);
        if (sprites.some(sprite => sprite.id === id) || allDraftIds.includes(id)) return showToast("Cette variante existe déjà");
        adminDraft.variants.push({
          ...data, id, fr: source.fr, en: `${variants[data.variant].en} ${source.en}`,
          rarity: source.rarity, effect: localizedEffect(source.effect), effectEn: source.effect.en || localizedEffect(source.effect), createdAtMs: Date.now()
        });
        markAdminDraft(`Variante ${localizedVariant(data.variant)} ajoutée`);
        event.currentTarget.reset();
        showToast("Variante ajoutée au brouillon");
      });
      document.getElementById("adminVariantEditForm").addEventListener("submit", event => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.currentTarget));
        const key = data.variantKey;
        if (!baseVariantSnapshot[key]) return showToast("Variante introuvable");
        const color = String(data.color || "").toLowerCase();
        if (!/^#[0-9a-f]{6}$/.test(color)) return showToast("La couleur de variante est invalide");
        adminDraft.variantOverrides[key] = {
          fr: String(data.fr || "").trim().slice(0, 40),
          en: String(data.en || "").trim().slice(0, 40),
          color,
          effectFr: String(data.effectFr || "").trim().slice(0, 500),
          effectEn: String(data.effectEn || "").trim().slice(0, 500),
          updatedAtMs: Date.now()
        };
        markAdminDraft(`Variante ${adminDraft.variantOverrides[key].fr} modifiée`);
        showToast("Modification de variante ajoutée au brouillon");
      });
      document.getElementById("adminPatchForm").addEventListener("submit", async event => {
        event.preventDefault();
        const submitter = event.submitter;
        const shouldPublish = submitter ? submitter.value === "publish" : true;
        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form));
        if (!data.title || !data.body) {
          return showToast("Le titre et le contenu sont requis");
        }
        const newPatch = {
          ...data,
          id: `patch-${Date.now().toString(36)}`,
          date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
          createdAtMs: Date.now(),
          updatedAtMs: Date.now()
        };

        if (shouldPublish) {
          let currentNotes = Array.isArray(adminDraft.patchNotes) && adminDraft.patchNotes.length
            ? [...adminDraft.patchNotes]
            : [...(adminContent.patchNotes || [])];
          currentNotes.unshift(newPatch);
          adminDraft = normalizeAdminContent({
            ...adminDraft,
            patchNotes: currentNotes,
            updatedAtMs: Date.now()
          });
          await publishAdminContent();
          showToast("Patch Note publié avec succès !");
        } else {
          adminDraft.patchNotes.unshift(newPatch);
          markAdminDraft(`Patch Note : ${data.title}`);
          showToast("Patch Note ajouté au brouillon");
        }
        form.reset();
        form.elements.date.value = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      });
      document.getElementById("adminMapForm")?.addEventListener("submit", async event => {
        event.preventDefault();
        if (!adminAccess) return showToast("Accès administrateur requis");
        const form = event.target;
        const formData = new FormData(form);
        const title = String(formData.get("title") || "").trim();
        const code = String(formData.get("code") || "").trim();
        const category = String(formData.get("category") || "aim").trim();
        const image = String(formData.get("image") || "").trim();
        const description = String(formData.get("description") || "").trim();

        if (!title || !code || !image) {
          return showToast("Veuillez remplir le titre, le code et l'image");
        }

        const mapObj = {
          id: editingMapId || `map-${Date.now().toString(36)}`,
          title,
          code,
          category,
          image,
          description,
          createdAtMs: Date.now()
        };

        const currentMaps = Array.isArray(adminDraft.creativeMaps) && adminDraft.creativeMaps.length
          ? [...adminDraft.creativeMaps]
          : [...(adminContent.creativeMaps || [])];

        if (editingMapId) {
          const idx = currentMaps.findIndex(m => m.id === editingMapId);
          if (idx >= 0) currentMaps[idx] = mapObj;
          else currentMaps.unshift(mapObj);
          editingMapId = null;
        } else {
          currentMaps.unshift(mapObj);
        }

        adminDraft = normalizeAdminContent({
          ...adminDraft,
          creativeMaps: currentMaps,
          updatedAtMs: Date.now()
        });
        await publishAdminContent();
        form.reset();
        showToast("Map Créative publiée avec succès ! 🚀");
        renderMaps();
        renderAdminMapQuickList();
      });
      document.getElementById("adminPreviewBtn").addEventListener("click", () => applyAdminContent(adminDraft, { announce: true }));
      document.getElementById("adminPublishBtn").addEventListener("click", publishAdminContent);
      document.getElementById("adminConnectBtn").addEventListener("click", connectGoogleAccount);
      document.getElementById("adminWorkspace").addEventListener("click", event => {
        const button = event.target.closest("[data-admin-manage-action]");
        if (button) {
          manageAdminContent(
            button.dataset.adminManageAction,
            button.dataset.adminManageType,
            button.dataset.adminManageIndex !== undefined ? Number(button.dataset.adminManageIndex) : undefined,
            button.dataset.adminManageKey || "",
            button.dataset.patchId || button.dataset.mapId || ""
          );
        }
      });
      document.getElementById("patchNotesPage").addEventListener("click", async event => {
        const button = event.target.closest("[data-patch-admin-action]");
        if (!button || !adminAccess) return;
        const patchId = button.dataset.patchId;
        const index = Number(button.dataset.patchIndex);
        let note = null;
        let noteIndex = -1;
        const currentNotes = [...(adminContent.patchNotes || [])];
        if (patchId) {
          noteIndex = currentNotes.findIndex(n => n.id === patchId);
          if (noteIndex >= 0) note = currentNotes[noteIndex];
        }
        if (!note && Number.isFinite(index) && currentNotes[index]) {
          noteIndex = index;
          note = currentNotes[index];
        }
        if (!note) return;
        if (button.dataset.patchAdminAction === "edit") {
          openPatchNoteEditor({ kind: "patch", index: noteIndex, id: note.id || patchId }, note.body || "", note.title || "");
        }
        if (button.dataset.patchAdminAction === "delete" && window.confirm("Supprimer définitivement ce Patch Note ?")) {
          const notes = currentNotes.filter((_, idx) => idx !== noteIndex);
          adminDraft = normalizeAdminContent({ ...adminContent, patchNotes: notes, updatedAtMs: Date.now() });
          adminDraftDirty = true;
          await publishAdminContent();
          showToast("Patch Note supprimé avec succès !");
        }
      });

      authToggleButton.addEventListener("click", () => {
        if (firebaseUser || (firebaseAuth && firebaseAuth.currentUser)) disconnectGoogleAccount();
        else connectGoogleAccount();
      });

      window.addEventListener("online", () => {
        if (!firebaseReady) initializeFirebaseSync();
        else if (firebaseUser) synchronizeCloud({ pull: true });
        else setSyncStatus("local", t("local"));
      });

      window.addEventListener("offline", () => {
        setSyncStatus(firebaseUser ? "pending" : "local", firebaseUser ? t("offline") : t("localOffline"));
      });

      document.addEventListener("visibilitychange", () => {
        if (!document.hidden && firebaseUser && navigator.onLine !== false) synchronizeCloud({ pull: true });
      });

      grid.addEventListener("click", event => {
        const target = event.target.closest("[data-action]");
        if (!target) return;
        if (target.dataset.action === "scroll-family") {
          const track = document.getElementById(target.getAttribute("aria-controls"));
          if (track) {
            const direction = Number(target.dataset.direction) || 1;
            track.scrollBy({ left: direction * Math.max(220, track.clientWidth * .72), behavior: "smooth" });
          }
          return;
        }
        const id = target.dataset.id;
        if (target.dataset.action === "details") {
          openDetails(id);
        } else if (target.dataset.action === "owned") {
          requestLockerChange(id);
        }
      });

      document.addEventListener("click", event => {
        const pageLink = event.target.closest("[data-page-target]");
        if (!pageLink) return;
        event.preventDefault();
        showPage(pageLink.dataset.pageTarget);
      });

      window.addEventListener("popstate", () => {
        showPage(location.hash.slice(1), { updateHash: false });
      });

      document.querySelector(".chips").addEventListener("click", event => {
        const chip = event.target.closest("[data-status]");
        if (!chip) return;
        statusFilter = chip.dataset.status;
        document.querySelectorAll("[data-status]").forEach(button => button.setAttribute("aria-selected", String(button === chip)));
        render();
      });

      searchInput.addEventListener("input", scheduleRender);
      variantFilter.addEventListener("change", render);
      rarityFilter.addEventListener("change", render);
      sortSelect.addEventListener("change", render);

      document.getElementById("toolsToggle").addEventListener("click", event => {
        const panel = document.getElementById("toolsPanel");
        const open = panel.classList.toggle("open");
        event.currentTarget.setAttribute("aria-expanded", String(open));
      });

      document.getElementById("exportBtn").addEventListener("click", () => {
        const payload = {
          app: t("exportAppName"),
          version: "v41.30",
          exportedAt: new Date().toISOString(),
          collection: state
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${t("exportFilename")}-${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showToast(t("backupExported"));
      });

      document.getElementById("importBtn").addEventListener("click", () => document.getElementById("importInput").click());
      document.getElementById("importInput").addEventListener("change", async event => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        try {
          const parsed = JSON.parse(await file.text());
          const imported = parsed.collection || parsed;
          if (!imported || typeof imported !== "object") throw new Error("Format invalide");
          const next = {};
          const importedAt = nextMutationTime();
          sprites.forEach(sprite => {
            const entry = normalizeEntry(imported[sprite.id]);
            entry.modifiedAt = importedAt;
            next[sprite.id] = entry;
          });
          state = next;
          saveState();
          render();
          showToast(t("collectionImported"));
        } catch (_) {
          showToast(t("invalidBackup"));
        } finally {
          event.target.value = "";
        }
      });

      document.getElementById("resetBtn").addEventListener("click", () => resetDialog.showModal());
      document.getElementById("cancelReset").addEventListener("click", () => closeDialog(resetDialog));
      document.getElementById("confirmReset").addEventListener("click", () => {
        const next = {};
        const resetAt = nextMutationTime();
        sprites.forEach(sprite => {
          const entry = blankEntry();
          entry.modifiedAt = resetAt;
          next[sprite.id] = entry;
        });
        state = next;
        saveState();
        closeDialog(resetDialog);
        render();
        showToast(t("collectionReset"));
      });

      document.getElementById("detailClose").addEventListener("click", () => closeDialog(detailDialog));
      detailDialog.addEventListener("click", event => {
        if (event.target === detailDialog) closeDialog(detailDialog);
      });
      document.getElementById("guideDetailClose").addEventListener("click", () => closeDialog(guideDetailDialog));
      guideDetailDialog.addEventListener("click", event => {
        if (event.target === guideDetailDialog) closeDialog(guideDetailDialog);
      });
      resetDialog.addEventListener("click", event => {
        if (event.target === resetDialog) closeDialog(resetDialog);
      });

      addSpriteNotMastered.addEventListener("click", () => setPendingMastery(false));
      addSpriteMastered.addEventListener("click", () => setPendingMastery(true));
      document.getElementById("cancelAddSprite").addEventListener("click", cancelAddSprite);
      document.getElementById("confirmAddSprite").addEventListener("click", confirmAddSprite);
      document.getElementById("cancelRemoveSprite").addEventListener("click", cancelRemoveSprite);
      document.getElementById("confirmRemoveSprite").addEventListener("click", confirmRemoveSprite);
      addSpriteDialog.addEventListener("click", event => {
        if (event.target === addSpriteDialog) cancelAddSprite();
      });
      addSpriteDialog.addEventListener("cancel", event => {
        event.preventDefault();
        cancelAddSprite();
      });
      removeSpriteDialog.addEventListener("click", event => {
        if (event.target === removeSpriteDialog) cancelRemoveSprite();
      });
      removeSpriteDialog.addEventListener("cancel", event => {
        event.preventDefault();
        cancelRemoveSprite();
      });

      document.getElementById("dialogOwned").addEventListener("click", () => {
        if (!activeDialogId) return;
        requestLockerChange(activeDialogId);
      });

      document.getElementById("dialogMastered").addEventListener("click", (event) => {
        if (!activeDialogId) return;
        const entry = state[activeDialogId] || blankEntry();
        if (!entry.owned) {
          openAddSpriteDialog(activeDialogId, { mastered: true });
        } else {
          const isNewlyMastered = !entry.mastered;
          setMastered(activeDialogId, isNewlyMastered);
          syncDialogButtons();
          refreshAfterStateChange(activeDialogId);
          if (isNewlyMastered) {
            createStarExplosion(event.clientX, event.clientY);
          }
        }
      });

      document.addEventListener("click", event => {
        const interactive = event.target.closest("button, a, input[type='checkbox'], input[type='radio'], .color-sphere, .bg-tile, .segmented-premium button, .family-variant-action, [role='button']");
        if (interactive && interactive.id !== "confirmAddSprite" && interactive.id !== "confirmRemoveSprite") {
          playSfx("click");
        }
      }, { passive: true });

      document.getElementById("dialogNote").addEventListener("input", event => {
        if (!activeDialogId) return;
        const entry = state[activeDialogId] || blankEntry();
        entry.note = event.target.value.slice(0, 500);
        state[activeDialogId] = touchEntry(entry);
        saveState();
      });

      document.getElementById("dialogNext").addEventListener("click", () => {
        if (!activeDialogId) return;
        const visible = getVisibleSprites();
        if (!visible.length) return;
        const current = visible.findIndex(sprite => sprite.id === activeDialogId);
        const next = visible[(current + 1 + visible.length) % visible.length];
        openDetails(next.id);
      });

      const topButton = document.getElementById("topBtn");
      window.addEventListener("scroll", () => {
        topButton.classList.toggle("visible", window.scrollY > 650);
      }, { passive: true });
      topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

      document.addEventListener("keydown", event => {
        if (event.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName)) {
          event.preventDefault();
          searchInput.focus();
        }
      });

      function scheduleFirebaseInitialization() {
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(() => initializeFirebaseSync(), { timeout: 650 });
        } else {
          setTimeout(() => initializeFirebaseSync(), 80);
        }
      }

      applyAppearance();
      if (!localStorage.getItem(ADMIN_DRAFT_KEY) && adminContent.updatedAtMs) adminDraft = normalizeAdminContent(adminContent);
      applyAdminContent(adminContent);
      renderAppearanceControls();
      renderGuide();
      populateAdminSelectors();
      renderAdminAccess();
      document.getElementById("adminPatchForm").elements.date.value = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      let userDetectedCountry = null;
      let userDetectedCountryCode = null;
      let reviewsUnsubscribe = null;

      const COUNTRY_FLAG_EMOJIS = {
        FR: "🇫🇷", BE: "🇧🇪", CH: "🇨🇭", CA: "🇨🇦", US: "🇺🇸", GB: "🇬🇧", DE: "🇩🇪", ES: "🇪🇸", IT: "🇮🇹",
        PT: "🇵🇹", NL: "🇳🇱", BR: "🇧🇷", JP: "🇯🇵", MA: "🇲🇦", DZ: "🇩🇿", TN: "🇹🇳", SN: "🇸🇳", CI: "🇨🇮",
        LU: "🇱🇺", RE: "🇷🇪", GP: "🇬🇵", MQ: "🇲🇶", NC: "🇳🇨", PF: "🇵🇫", MG: "🇲🇬", CM: "🇨🇲"
      };

      function getCountryFlag(code) {
        if (!code || code.length !== 2) return "🌍";
        const upper = code.toUpperCase();
        if (COUNTRY_FLAG_EMOJIS[upper]) return COUNTRY_FLAG_EMOJIS[upper];
        try {
          const codePoints = [...upper].map(c => 127397 + c.charCodeAt(0));
          return String.fromCodePoint(...codePoints);
        } catch (_) {
          return "🌍";
        }
      }

      function getCountryName(code) {
        if (!code) return "France";
        try {
          if (typeof Intl !== "undefined" && Intl.DisplayNames) {
            const dn = new Intl.DisplayNames([APP_LANGUAGE || "fr", "en"], { type: "region" });
            return dn.of(code.toUpperCase()) || code;
          }
        } catch (_) {}
        const fallback = {
          FR: "France", BE: "Belgique", CH: "Suisse", CA: "Canada", US: "États-Unis",
          GB: "Royaume-Uni", DE: "Allemagne", ES: "Espagne", IT: "Italie", PT: "Portugal",
          NL: "Pays-Bas", MA: "Maroc", DZ: "Algérie", TN: "Tunisie", SN: "Sénégal",
          CI: "Côte d'Ivoire", LU: "Luxembourg"
        };
        return fallback[code.toUpperCase()] || code;
      }

      function guessCountryFromTimezone() {
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
          if (tz.includes("Paris")) return { code: "FR", name: "France" };
          if (tz.includes("Brussels")) return { code: "BE", name: "Belgique" };
          if (tz.includes("Zurich") || tz.includes("Geneva")) return { code: "CH", name: "Suisse" };
          if (tz.includes("Montreal") || tz.includes("Toronto") || tz.includes("Vancouver")) return { code: "CA", name: "Canada" };
          if (tz.includes("London")) return { code: "GB", name: "Royaume-Uni" };
          if (tz.includes("Berlin")) return { code: "DE", name: "Allemagne" };
          if (tz.includes("Madrid")) return { code: "ES", name: "Espagne" };
          if (tz.includes("Rome")) return { code: "IT", name: "Italie" };
          if (tz.includes("Casablanca")) return { code: "MA", name: "Maroc" };
          if (tz.includes("Algiers")) return { code: "DZ", name: "Algérie" };
          if (tz.includes("Tunis")) return { code: "TN", name: "Tunisie" };
          if (tz.includes("New_York") || tz.includes("Chicago") || tz.includes("Los_Angeles")) return { code: "US", name: "États-Unis" };
          if (tz.includes("Reunion")) return { code: "RE", name: "La Réunion" };
          if (tz.includes("Guadeloupe")) return { code: "GP", name: "Guadeloupe" };
          if (tz.includes("Martinique")) return { code: "MQ", name: "Martinique" };
          if (tz.includes("Tahiti")) return { code: "PF", name: "Polynésie" };
        } catch (_) {}
        const lang = (navigator.language || "fr").toLowerCase();
        if (lang.includes("fr")) return { code: "FR", name: "France" };
        return { code: "FR", name: "France" };
      }

      async function detectUserCountry() {
        if (userDetectedCountry && userDetectedCountryCode) {
          return { country: userDetectedCountry, code: userDetectedCountryCode, flag: getCountryFlag(userDetectedCountryCode) };
        }
        const cached = localStorage.getItem("sprite-locker-user-country");
        const cachedCode = localStorage.getItem("sprite-locker-user-country-code");
        if (cached && cachedCode) {
          userDetectedCountry = cached;
          userDetectedCountryCode = cachedCode;
          return { country: cached, code: cachedCode, flag: getCountryFlag(cachedCode) };
        }

        const fallback = guessCountryFromTimezone();
        userDetectedCountry = fallback.name;
        userDetectedCountryCode = fallback.code;

        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 2000);
          const res = await fetch("https://api.country.is", { signal: controller.signal });
          clearTimeout(timer);
          if (res.ok) {
            const data = await res.json();
            if (data && data.country) {
              const code = data.country.toUpperCase();
              const name = getCountryName(code);
              userDetectedCountry = name;
              userDetectedCountryCode = code;
              localStorage.setItem("sprite-locker-user-country", name);
              localStorage.setItem("sprite-locker-user-country-code", code);
            }
          }
        } catch (_) {}

        return { country: userDetectedCountry, code: userDetectedCountryCode, flag: getCountryFlag(userDetectedCountryCode) };
      }

      function formatReviewDateTime(timestamp) {
        if (!timestamp) return "";
        let dateObj;
        if (typeof timestamp.toMillis === "function") {
          dateObj = new Date(timestamp.toMillis());
        } else if (typeof timestamp.toDate === "function") {
          dateObj = timestamp.toDate();
        } else if (typeof timestamp === "number" || typeof timestamp === "string") {
          dateObj = new Date(timestamp);
        } else {
          dateObj = new Date();
        }
        if (Number.isNaN(dateObj.getTime())) return "";

        const formattedDate = new Intl.DateTimeFormat(APP_LOCALE, {
          day: "numeric",
          month: "short",
          year: "numeric"
        }).format(dateObj);

        const formattedTime = new Intl.DateTimeFormat(APP_LOCALE, {
          hour: "2-digit",
          minute: "2-digit"
        }).format(dateObj);

        return `${formattedDate} · ${formattedTime}`;
      }

      async function updateReviewModalUserPreview() {
        const currentUser = firebaseUser || (firebaseAuth && firebaseAuth.currentUser);
        const userAvatar = document.getElementById("reviewUserAvatar");
        const userFallback = document.getElementById("reviewUserAvatarFallback");
        const userName = document.getElementById("reviewUserName");
        const countryTag = document.getElementById("reviewUserCountryTag");
        const reviewGate = document.getElementById("reviewAuthGate");
        const reviewForm = document.getElementById("reviewForm");

        if (currentUser) {
          if (reviewGate) reviewGate.hidden = true;
          if (reviewForm) reviewForm.hidden = false;
          const displayName = currentUser.displayName || (APP_LANGUAGE === "fr" ? "Joueur" : "Player");
          if (userName) userName.textContent = displayName;
          if (currentUser.photoURL) {
            if (userAvatar) {
              userAvatar.src = currentUser.photoURL;
              userAvatar.hidden = false;
              userAvatar.onerror = () => {
                userAvatar.hidden = true;
                if (userFallback) userFallback.hidden = false;
              };
            }
            if (userFallback) userFallback.hidden = true;
          } else {
            if (userAvatar) userAvatar.hidden = true;
            if (userFallback) {
              userFallback.hidden = false;
              userFallback.textContent = displayName.trim().charAt(0).toUpperCase() || "J";
            }
          }

          if (countryTag) {
            countryTag.textContent = "📍 Détection du pays...";
            const loc = await detectUserCountry();
            countryTag.textContent = `${loc.flag} ${loc.country}`;
          }
        } else {
          if (reviewGate) reviewGate.hidden = false;
          if (reviewForm) reviewForm.hidden = true;
        }
      }

      function renderReviewCardHtml(data, docId = "") {
        const id = docId || data.id || "";
        const dateTimeStr = formatReviewDateTime(data.createdAt || data.createdAtMs);
        const rating = Math.max(1, Math.min(5, Number(data.rating) || 5));
        const stars = "⭐".repeat(rating) + "☆".repeat(5 - rating);
        const safeAuthor = esc(data.displayName || (APP_LANGUAGE === "fr" ? "Joueur" : "Player"));
        const safeText = esc(data.text || "");
        const countryName = data.country ? esc(data.country) : "";
        const countryFlag = data.countryFlag || (data.countryCode ? getCountryFlag(data.countryCode) : "📍");
        const countryBadge = countryName
          ? `<span class="review-card-country" title="${countryName}">${countryFlag} ${countryName}</span>`
          : "";

        const authorPhoto = data.photoURL && typeof data.photoURL === "string" && data.photoURL.startsWith("http")
          ? `<img class="review-card-avatar" src="${esc(data.photoURL)}" alt="${safeAuthor}" onerror="this.style.display='none';this.nextElementSibling.hidden=false;"><div class="review-card-avatar-fallback" hidden>${safeAuthor.charAt(0).toUpperCase() || "J"}</div>`
          : `<div class="review-card-avatar-fallback">${safeAuthor.charAt(0).toUpperCase() || "J"}</div>`;

        const adminDeleteBtn = adminAccess && id
          ? `<button class="review-admin-delete-btn" type="button" data-review-delete-id="${esc(id)}" title="Supprimer cet avis (Admin)" aria-label="Supprimer cet avis"><span aria-hidden="true">🗑️</span> Supprimer</button>`
          : "";

        return `
          <article class="review-card" data-review-id="${esc(id)}">
            <div class="review-card-top">
              <div class="review-card-user">
                ${authorPhoto}
                <div class="review-card-user-meta">
                  <span class="review-card-name">${safeAuthor}</span>
                  ${countryBadge}
                </div>
              </div>
              <div class="review-card-header-right">
                <div class="review-card-date-time">
                  <span class="review-time-icon" aria-hidden="true">🕒</span>
                  <span>${dateTimeStr}</span>
                </div>
                ${adminDeleteBtn}
              </div>
            </div>
            <div class="review-card-stars" aria-label="${rating} étoiles sur 5">${stars}</div>
            <p class="review-card-text">${safeText}</p>
          </article>
        `;
      }

      function renderReviewsFromSnapshot(querySnapshot) {
        const listContainer = document.getElementById("reviewsList");
        const badge = document.getElementById("reviewsCountBadge");
        if (!listContainer) return;

        if (querySnapshot.empty) {
          if (badge) badge.textContent = "0 avis";
          listContainer.innerHTML = `
            <div class="empty-state" style="padding: 34px 16px; text-align: center; border: 1px dashed rgba(255,255,255,0.12); border-radius: 16px; background: rgba(255,255,255,0.02);">
              <strong style="display:block; font-size:1.1rem; margin-bottom:6px;">Soyez le premier à donner votre avis !</strong>
              <span style="color: rgba(255,255,255,0.6); font-size:0.85rem;">Cliquez sur « Donnez votre avis » ci-dessus pour laisser votre commentaire.</span>
            </div>`;
          return;
        }

        const count = querySnapshot.size;
        if (badge) badge.textContent = `${count} avis`;

        const cards = [];
        querySnapshot.forEach(doc => {
          cards.push(renderReviewCardHtml(doc.data(), doc.id));
        });
        listContainer.innerHTML = cards.join("");
      }

      async function fetchReviews() {
        const listContainer = document.getElementById("reviewsList");
        if (!listContainer) return;

        if (!firebaseReady || !firebaseDb || !firebaseSdk) {
          listContainer.innerHTML = `<p class="reviews-loading">Connexion au serveur des avis...</p>`;
          return;
        }

        try {
          const q = firebaseSdk.query(
            firebaseSdk.collection(firebaseDb, "reviews"),
            firebaseSdk.orderBy("createdAt", "desc"),
            firebaseSdk.limit(50)
          );

          if (reviewsUnsubscribe) {
            reviewsUnsubscribe();
            reviewsUnsubscribe = null;
          }

          reviewsUnsubscribe = firebaseSdk.onSnapshot(q, snapshot => {
            renderReviewsFromSnapshot(snapshot);
          }, error => {
            console.error("Erreur écoute avis", error);
            listContainer.innerHTML = `<p class="reviews-loading">Impossible de charger les avis (${friendlyFirebaseError(error)}).</p>`;
          });
        } catch (e) {
          console.error("Erreur de chargement des avis", e);
          listContainer.innerHTML = `<p class="reviews-loading">Impossible de charger les avis. Vérifiez votre connexion.</p>`;
        }
      }

      function setupReviews() {
        const openModalBtn = document.getElementById("openReviewModalBtn");
        const modalDialog = document.getElementById("reviewModalDialog");
        const closeModalBtn = document.getElementById("closeReviewModalBtn");
        const cancelModalBtn = document.getElementById("cancelReviewModalBtn");
        const connectBtn = document.getElementById("reviewConnectBtn");
        const reviewsList = document.getElementById("reviewsList");

        if (reviewsList) {
          reviewsList.addEventListener("click", async event => {
            const deleteBtn = event.target.closest("[data-review-delete-id]");
            if (!deleteBtn) return;
            const reviewId = deleteBtn.dataset.reviewDeleteId;
            if (!reviewId || !adminAccess) return;

            if (!firebaseSdk || !firebaseDb || !firebaseSdk.deleteDoc) {
              showToast("Service Firebase indisponible.");
              return;
            }

            if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cet avis ?")) {
              return;
            }

            deleteBtn.disabled = true;
            deleteBtn.textContent = "Suppression...";
            try {
              const reviewRef = firebaseSdk.doc(firebaseDb, "reviews", reviewId);
              await firebaseSdk.deleteDoc(reviewRef);
              showToast("Avis supprimé avec succès.");
              const card = deleteBtn.closest(".review-card");
              if (card) card.remove();
            } catch (error) {
              console.error("Erreur lors de la suppression de l'avis:", error);
              showToast("Erreur lors de la suppression : " + friendlyFirebaseError(error));
              deleteBtn.disabled = false;
              deleteBtn.innerHTML = `<span aria-hidden="true">🗑️</span> Supprimer`;
            }
          });
        }

        if (connectBtn) {
          connectBtn.addEventListener("click", () => {
            connectGoogleAccount();
          });
        }

        if (openModalBtn && modalDialog) {
          openModalBtn.addEventListener("click", () => {
            updateReviewModalUserPreview();
            if (typeof modalDialog.showModal === "function") {
              modalDialog.showModal();
            } else {
              modalDialog.setAttribute("open", "");
            }
          });
        }

        if (closeModalBtn && modalDialog) {
          closeModalBtn.addEventListener("click", () => modalDialog.close());
        }
        if (cancelModalBtn && modalDialog) {
          cancelModalBtn.addEventListener("click", () => modalDialog.close());
        }
        if (modalDialog) {
          modalDialog.addEventListener("click", (e) => {
            if (e.target === modalDialog) modalDialog.close();
          });
        }

        const RATING_HINTS = {
          1: "⭐☆☆☆☆ · Décevant",
          2: "⭐⭐☆☆☆ · Moyen",
          3: "⭐⭐⭐☆☆ · Bon",
          4: "⭐⭐⭐⭐☆ · Très bon",
          5: "⭐⭐⭐⭐⭐ · Excellent !"
        };

        const stars = document.querySelectorAll(".star-rating-input button");
        const submitBtn = document.getElementById("submitReviewBtn");
        const textInput = document.getElementById("reviewTextInput");
        const charCounter = document.getElementById("reviewCharCounter");
        const ratingHint = document.getElementById("reviewRatingHint");
        let currentRating = 0;

        function updateStarDisplay(rating) {
          stars.forEach(s => {
            const val = parseInt(s.dataset.val, 10);
            if (val <= rating) {
              s.classList.add("active");
            } else {
              s.classList.remove("active");
            }
          });
          if (ratingHint) {
            ratingHint.textContent = RATING_HINTS[rating] || "Cliquez sur une étoile pour attribuer votre note (1 à 5)";
          }
        }

        function validateReviewForm() {
          const hasRating = currentRating > 0;
          const hasText = Boolean(textInput && textInput.value.trim().length > 0);
          if (submitBtn) {
            submitBtn.disabled = !(hasRating && hasText);
          }
        }

        stars.forEach(star => {
          star.addEventListener("mouseenter", () => {
            const hoverVal = parseInt(star.dataset.val, 10);
            stars.forEach(s => {
              const val = parseInt(s.dataset.val, 10);
              s.classList.toggle("hover-preview", val <= hoverVal);
            });
            if (ratingHint) {
              ratingHint.textContent = RATING_HINTS[hoverVal] || "";
            }
          });

          star.addEventListener("mouseleave", () => {
            stars.forEach(s => s.classList.remove("hover-preview"));
            updateStarDisplay(currentRating);
          });

          star.addEventListener("click", () => {
            currentRating = parseInt(star.dataset.val, 10);
            updateStarDisplay(currentRating);
            validateReviewForm();
          });
        });

        if (textInput) {
          textInput.addEventListener("input", () => {
            const len = textInput.value.length;
            if (charCounter) charCounter.textContent = `${len} / 500`;
            validateReviewForm();
          });
        }

        const form = document.getElementById("reviewForm");
        if (form) {
          form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const currentUser = firebaseUser || (firebaseAuth && firebaseAuth.currentUser);
            if (!currentUser || !firebaseDb || !firebaseSdk) {
              showToast("Vous devez être connecté avec Google.");
              return;
            }
            const text = textInput ? textInput.value.trim() : "";
            if (!text) {
              showToast("Veuillez écrire un commentaire.");
              return;
            }
            if (currentRating === 0) {
              showToast("Veuillez choisir une note (1 à 5 étoiles).");
              return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = "Publication en cours...";
            try {
              const loc = await detectUserCountry();
              const reviewRef = firebaseSdk.doc(firebaseSdk.collection(firebaseDb, "reviews"));
              await firebaseSdk.setDoc(reviewRef, {
                uid: currentUser.uid,
                displayName: (currentUser.displayName || "Joueur").slice(0, 50),
                photoURL: currentUser.photoURL || "",
                rating: currentRating,
                text: text.slice(0, 500),
                country: loc.country,
                countryCode: loc.code,
                countryFlag: loc.flag,
                createdAt: firebaseSdk.serverTimestamp(),
                createdAtMs: Date.now()
              });

              if (textInput) textInput.value = "";
              if (charCounter) charCounter.textContent = "0 / 500";
              currentRating = 0;
              updateStarDisplay(0);
              if (modalDialog) modalDialog.close();
              showToast("⭐ Merci pour votre avis !");
              createStarExplosion(window.innerWidth / 2, window.innerHeight / 2);
              await fetchReviews();
            } catch (error) {
              console.error("Erreur lors de l'envoi de l'avis", error);
              showToast("Erreur lors de l'envoi de l'avis : " + friendlyFirebaseError(error));
            } finally {
              submitBtn.textContent = "Publier mon avis";
              validateReviewForm();
            }
          });
        }
      }

      applyStaticTranslations();
      setupMobileDockSwipe();
      setupReviews();
      initializePwa();
      searchInput.placeholder = APP_LANGUAGE === "fr" ? "Nom, capacité, variante, rareté, bouclier, vitesse…" : "Name, ability, variant, rarity, shield, speed…";
      showPage(location.hash.slice(1), { updateHash: false });
      updateAccountInterface(null);
      scheduleFirebaseInitialization();
      if (document.readyState === "complete") {
        startBackgroundImageWarmup();
      } else {
        window.addEventListener("load", startBackgroundImageWarmup, { once: true });
      }
    })();
  