# MoodFlow 🌈

**Journal d'humeur intelligent, sécurisé et connecté**

## 🎯 Description

MoodFlow est une application web moderne pour suivre votre humeur quotidienne, analyser les tendances et obtenir des insights personnalisés grâce à l'IA.

## 🛠️ Stack Technique

- **Frontend**: Vue 3 + Vite + Tailwind CSS + daisyUI + Chart.js
- **Backend**: Node.js 20 + Express + Zod
- **Base de données**: Supabase (Postgres + Auth + RLS)
- **IA**: OpenAI GPT API
- **Déploiement**: Docker + Coolify

## 🚀 Installation Rapide

### Prérequis
- Node.js 20+
- Docker & Docker Compose
- Compte Supabase
- Clé API OpenAI

### 1. Cloner et installer
```bash
git clone <repo>
cd moodflow
npm install
```

### 2. Configuration Backend
```bash
cd backend
cp .env.example .env
# Éditer .env avec vos clés Supabase et OpenAI
```

### 3. Configuration Frontend
```bash
cd frontend
cp .env.example .env
# Éditer .env avec vos clés Supabase
```

### 4. Base de données
Exécuter les migrations SQL dans Supabase (voir `/docs/security.md`)

### 5. Lancer en développement
```bash
npm run dev
```

## 📁 Structure du Projet

```
moodflow/
├── frontend/          # Vue 3 + Tailwind + daisyUI
├── backend/           # Express + Supabase + IA
├── docs/              # Documentation technique
├── docker-compose.yml # Production
└── docker-compose.dev.yml # Développement
```

## 🔧 Scripts Disponibles

- `npm run dev` - Développement (frontend + backend)
- `npm run build` - Build production
- `npm run docker:dev` - Docker développement
- `npm run docker:prod` - Docker production

## 🔒 Sécurité

- RLS (Row Level Security) strict
- Validation Zod complète
- Headers sécurité (helmet)
- Rate limiting
- Aucune clé sensible côté frontend

## 📊 Fonctionnalités

### MVP
- ✅ Dashboard semaine avec humeurs
- ✅ CRUD humeur avec UI optimiste
- ✅ Visualisations (graphiques)
- ✅ Auth sécurisée

### Bonus
- ✅ Thème sombre/clair auto
- ✅ Citation du jour selon humeur
- ✅ Vue calendrier mensuelle
- ✅ Chat IA personnalisé
- ✅ Notifications email

## 🚀 Déploiement

### Coolify + VPS Hostinger
1. Configurer les variables d'environnement
2. Déployer via Coolify
3. Configurer le domaine

Voir `/docs/deployment.md` pour plus de détails.

## 📝 API

Voir `/docs/api.md` pour la documentation complète de l'API.

## 🏗️ Architecture

Voir `/docs/architecture.md` pour le schéma d'architecture détaillé.
