# Basket Training 🏀

Web-app mobile de suivi d'entraînement : 7 séances par semaine, progression cumulée, divisions de Rookie IV à Immortal (365 séances) et récompenses personnalisables.

## Mise en ligne avec GitHub Pages

1. Crée un dépôt GitHub public nommé `basket-training`.
2. Ajoute tous les fichiers de ce dossier à la racine du dépôt.
3. Dans le dépôt : **Settings → Pages**.
4. Dans **Build and deployment**, choisis **Deploy from a branch**.
5. Sélectionne la branche **main**, dossier **/(root)**, puis **Save**.
6. Une fois le déploiement terminé, l'app sera disponible via GitHub Pages.

Les données sont stockées dans `localStorage` : elles restent sur le navigateur/appareil utilisé. Elles ne sont pas synchronisées entre appareils.

## Fichiers
- `index.html` : interface
- `style.css` : design mobile
- `app.js` : séances, progression, rangs, récompenses et sauvegarde
- `manifest.json` + `sw.js` : installation type PWA et cache hors-ligne
