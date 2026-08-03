# Sprite Locker — mise en ligne PWA

Ce dossier forme une seule application. Publie **tous les fichiers et le dossier `icons` ensemble**, à la racine actuelle de ton site GitHub Pages, sans changer leurs chemins.

## Fichiers indispensables

- `index.html`
- `manifest.webmanifest`
- `service-worker.js`
- `share-card.jpg`
- le dossier `icons`

## Fonctionnement

- Lors de la première visite avec Internet, l’interface s’affiche immédiatement puis les 109 images d’esprits et les ressources de l’application sont téléchargées en arrière-plan.
- La progression apparaît dans la bannière d’installation. Le message **Mode hors connexion prêt** confirme que la copie locale est terminée.
- Aux ouvertures suivantes, l’interface et les images sont servies depuis l’appareil. Firebase se resynchronise automatiquement au retour de la connexion.
- La bannière d’installation revient à chaque nouvelle ouverture tant que l’application n’a pas été installée sur cet appareil. Le bouton **Plus tard** ne la masque que pour l’ouverture courante.
- Après installation, l’état est mémorisé localement et la bannière ne réapparaît plus sur cet appareil. Un autre appareil conserve son propre état.

## Condition importante

Le mode PWA et le Service Worker exigent une adresse HTTPS. GitHub Pages fournit automatiquement HTTPS. Ils ne peuvent pas fonctionner si `index.html` est ouvert directement comme un fichier local avec une adresse commençant par `file://`.
