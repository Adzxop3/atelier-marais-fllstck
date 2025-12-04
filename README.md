# L'Atelier Marais

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=stripe&logoColor=white)

Plateforme E-commerce full-stack développée pour la marque de streetwear minimaliste "L'Atelier Marais". Ce projet met en œuvre une architecture MERN (MongoDB, Express, React, Node.js) complète avec une intégration de paiement Stripe robuste et des fonctionnalités de sécurité modernes.

L'esthétique est volontairement épurée et monochrome, inspirée par la culture streetwear contemporaine, pour offrir une expérience utilisateur immersive et centrée sur le produit.

## Captures d'écran

Un aperçu de l'application (placeholders).

| Page d'accueil | Page Produit | Panier (Drawer) |
| :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/87a37445-5d16-469d-a1c6-83c30ab30426" width="400" alt="Homepage"> | <img src="https://github.com/user-attachments/assets/fffdcda1-ae48-434c-ac99-dc2c37af3a58" width="400" alt="Page Produit"> | <img src="https://github.com/user-attachments/assets/36737091-ade5-43e3-82ae-fca1c26e1303" width="400" alt="Panier"> |

## Fonctionnalités

### Expérience Utilisateur & Vente
- **Catalogue Produit :** Grille de produits avec chargement optimisé.
- **Page Détail :** Description complète, carrousel d'images, et sélection de la taille/quantité.
- **Filtres :** Navigation par catégories pour affiner la recherche.
- **Panier en Tiroir (Drawer) :** Gestion du panier non-intrusive, accessible depuis n'importe quelle page.
- **Recherche Instantanée :** Barre de recherche pour trouver des produits en temps réel.
- **Notifications :** Feedbacks utilisateurs stylisés (ajout au panier, erreurs...) via React Hot Toast.
- **Wishlist (Favoris) :** Possibilité pour les utilisateurs connectés de sauvegarder leurs articles préférés.

### Paiement & Sécurité
- **Intégration Stripe :** Processus de paiement sécurisé et personnalisé avec l'API PaymentIntent.
- **Authentification JWT :** Inscription et connexion sécurisées avec JSON Web Tokens.
- **Protection des Routes :** Middlewares pour la gestion des accès (utilisateurs authentifiés, administrateurs).
- **Sécurité Backend :** Utilisation de `Helmet` pour la protection contre les vulnérabilités web courantes et `bcryptjs` pour le hachage des mots de passe.

### Gestion & Administration
- **Dashboard Admin :** Interface protégée pour la gestion du site.
- **Gestion des Produits :** Ajout, modification et suppression de produits directement depuis le panel admin.
- **Visualisation des Commandes :** Accès à l'historique de toutes les commandes passées par les clients.

## Stack Technique

| Domaine         | Technologies                                                                 |
| --------------- | ---------------------------------------------------------------------------- |
| **Frontend**    | React (Vite), Tailwind CSS, Context API                                      |
| **UI & Icônes** | Lucide React, React Hot Toast                                                  |
| **Backend**     | Node.js, Express.js                                                          |
| **Base de Données** | MongoDB Atlas (avec Mongoose pour la modélisation des données)             |
| **Paiement**    | Stripe API (PaymentIntents)                                                  |
| **Sécurité**    | JWT (jsonwebtoken), bcryptjs, Helmet                                         |
| **Middlewares** | Middlewares custom pour l'authentification (`auth.js`) et les droits admin (`admin.js`) |

## Guide d'Installation

Suivez ces étapes pour lancer le projet en local.

### Pré-requis
- [Node.js](https://nodejs.org/) (version 18.x ou supérieure)
- Un URI de connexion MongoDB Atlas
- Une clé secrète et une clé publique Stripe

### 1. Configuration du Serveur (Backend)

```bash
# 1. Se placer dans le dossier du serveur
cd server

# 2. Installer les dépendances
npm install

# 3. Créer un fichier .env à la racine de /server et le configurer
# (voir la section "Variables d'environnement" ci-dessous)

# 4. (Optionnel) Alimenter la base de données avec des données de test
node seed.js

# 5. Lancer le serveur de développement (avec nodemon)
npm run dev
```
Le serveur devrait être accessible sur `http://localhost:votre_port`.

### 2. Configuration du Client (Frontend)

```bash
# 1. Depuis la racine du projet, se placer dans le dossier client
cd client

# 2. Installer les dépendances
npm install

# 3. Créer un fichier .env à la racine de /client et y ajouter votre clé publique Stripe
# VITE_STRIPE_PUBLIC_KEY=pk_test_...

# 4. Lancer le client
npm run dev
```
L'application React sera accessible sur `http://localhost:5173`.

## Variables d'environnement

### Serveur (`/server/.env`)
```env
# Port d'écoute du serveur
PORT=8000

# URI de connexion à votre cluster MongoDB
MONGO_URI=mongodb+srv://...

# Clé secrète pour signer les tokens JWT (doit être longue et complexe)
JWT_SECRET=jwt_secret

# Clé secrète Stripe (disponible dans votre dashboard développeur Stripe)
STRIPE_SECRET_KEY=sk_test_...
```

### Client (`/client/.env`)
```env
# Clé publique Stripe (disponible dans votre dashboard développeur Stripe)
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```
