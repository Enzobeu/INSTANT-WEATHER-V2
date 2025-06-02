# 🌤️ Instant Weather V2

## Description

Application météorologique interactive permettant de consulter les prévisions météorologiques françaises de 1 à 7 jours. L'application propose une recherche par code postal, une visualisation sur carte interactive et de nombreuses options personnalisables pour un affichage optimal des données météo.

**Fonctionnalités principales :**
- Interface responsive adaptée à tous les écrans
- Mode sombre/clair avec transition fluide
- Cartes météo avec dégradés adaptatifs selon les conditions
- Géolocalisation précise avec marqueurs interactifs
- Données météo complètes : températures, ensoleillement, probabilité de pluie
- Gestion des erreurs et validation des saisies utilisateur

## Technologies mobilisées

- **HTML5** : Structure sémantique de l'application
- **CSS3** : Mise en forme responsive avec mode sombre/clair
- **JavaScript ES6** : Logique applicative et manipulation du DOM
- **API Météo Concept** : Récupération des données météorologiques
- **API Geo Gouv** : Géolocalisation des communes françaises
- **Leaflet** : Bibliothèque de cartographie interactive
- **OpenStreetMap** : Fournisseur de tuiles cartographiques

## Mode d'emploi

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Connexion internet active
- JavaScript activé

### Utilisation
1. **Saisir** un code postal français dans le champ dédié (ex: 75001, 69000, 13000)
2. **Ajuster** le nombre de jours souhaité avec le slider (1 à 7 jours)
3. **Cocher** les informations supplémentaires désirées :
   - Latitude et longitude de la commune
   - Cumul de pluie journalier (en mm)
   - Vitesse du vent moyen à 10m (en km/h)
   - Direction du vent (en degrés)
4. **Cliquer** sur le bouton "Rechercher"
5. **Sélectionner** la commune désirée dans la liste proposée
6. **Consulter** les prévisions affichées sous forme de cartes météo colorées
7. **Utiliser** la carte interactive pour visualiser la localisation précise
8. **Basculer** en mode sombre si souhaité avec le bouton en haut à droite
9. **Effectuer** une nouvelle recherche avec le bouton "Nouvelle recherche"

### Codes postaux supportés
L'application fonctionne avec tous les codes postaux français métropolitains et d'outre-mer.

## Auteur

**Leconte Enzo**  
Étudiant en BUT réseau et télécommunication
enzo.leconte@etu.unicaen.fr

---

## Informations complémentaires

**🔗 Démo en ligne :** [Accéder à l'application](https://enzobeu.github.io/INSTANT-WEATHER-V2/)

**📝 Contexte :** Projet réalisé dans le cadre de la SAÉ 2.03 - Développement d'une application avec API

**🌐 Compatibilité :** Testé sur Chrome, Firefox, Safari et Edge (versions récentes)

**📱 Responsive :** Optimisé pour desktop, tablette et mobile

**⚠️ Limitations :**
- Données météo limitées à la France métropolitaine et DOM-TOM
- Prévisions maximales de 7 jours
- Nécessite une connexion internet pour fonctionner

**🔧 Installation locale :**
```bash
git clone https://github.com/enzobeu/instant-weather-v2.git
cd instant-weather-v2
# Ouvrir index.html ou utiliser un serveur local
python -m http.server 8000
```
