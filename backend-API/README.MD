# API_Jeu

API_Jeu est un projet d’API pour la gestion d’un jeu, construit principalement en JavaScript et TypeScript. Ce projet adopte une architecture modulaire avec des dossiers dédiés aux contrôleurs, modèles, middlewares, et un tableau de bord d’administration.

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Technologies utilisées](#technologies-utilisées)
- [Contribuer](#contribuer)
- [Auteur](#auteur)

## Fonctionnalités

- Gestion des routes pour le jeu
- Contrôleurs dédiés à la logique métier
- Modèles pour la gestion des données
- Middlewares pour la sécurité et la validation
- Tableau de bord admin (admin-dashboard)
- Documentation et notes disponibles dans `note.txt`

## Structure du projet

```
.
├── admin-dashboard/      # Tableau de bord d’administration
├── controllers/          # Logique métier / contrôleurs de l’API
├── middlewares/          # Middlewares pour la gestion des requêtes
├── models/               # Modèles de données
├── routes/               # Définition des routes de l’API
├── index.js              # Point d’entrée principal de l’application
├── package.json          # Dépendances et scripts npm
├── package-lock.json     # Verrouillage des dépendances
├── .gitignore            # Fichiers à ignorer par git
├── note.txt              # Notes et documentation additionnelle
```

## Installation

1. Clone le dépôt :
   ```bash
   git clone https://github.com/Tidragon-coder/API_Jeu.git
   cd API_Jeu
   ```

2. Installe les dépendances :
   ```bash
   npm install
   ```

## Utilisation

Lance le serveur avec Node.js :
```bash
node index.js
```
Ou, si tu utilises un gestionnaire de processus comme `nodemon` :
```bash
nodemon index.js
```

## Technologies utilisées

- **JavaScript** (53.7%)
- **TypeScript** (43.5%)
- **CSS** (1.8%)
- **HTML** (1%)

## Contribuer

Les contributions sont les bienvenues ! N’hésite pas à ouvrir des issues ou à proposer des pull requests.

## Auteur

- [Tidragon-coder](https://github.com/Tidragon-coder)
