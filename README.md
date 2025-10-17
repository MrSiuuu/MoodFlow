# MoodFlow - Journal d'Humeur Intelligent

**Version** : 1.0.0  
**Date** : Octobre 2025  
**Équipe** : 4 personnes (Dev Full-Stack, Data Engineer, DevOps, Security Engineer)  
**Contexte** : Projet développé dans le cadre d'un hackathon pour promouvoir le bien-être mental

---

## Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture Technique](#architecture-technique)
3. [Stack Technologique](#stack-technologique)
4. [Choix UX et Design](#choix-ux-et-design)
5. [Fonctionnalités Implémentées](#fonctionnalités-implémentées)
6. [Sécurité](#sécurité)
7. [Flux de Données](#flux-de-données)
8. [Gestion des Rôles](#gestion-des-rôles)
9. [Contributions de l'Équipe](#contributions-de-léquipe)
10. [Installation et Déploiement](#installation-et-déploiement)
11. [Documentation Technique](#documentation-technique)

---

## Vue d'Ensemble

MoodFlow est une application web moderne permettant aux utilisateurs de suivre leur humeur quotidienne, d'analyser leurs tendances émotionnelles et de recevoir des insights personnalisés grâce à l'intelligence artificielle. L'application adopte une approche mobile-first avec une séparation stricte entre utilisateurs standards et administrateurs.

### Objectifs Principaux

- Permettre un suivi quotidien simple et intuitif de l'humeur
- Fournir des analyses statistiques personnalisées
- Garantir une sécurité maximale des données personnelles
- Offrir une expérience utilisateur fluide et réactive
- Respecter les standards RGPD et de confidentialité

---

## Architecture Technique

### Schéma Global

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│  Vue 3 + Vite + Tailwind CSS + daisyUI + Chart.js          │
│  - Pages : 14 vues complètes                                │
│  - Components : Navbar, Footer, Forms, Cards, Charts        │
│  - Stores : Auth, Moods, Insights, Theme (Pinia)           │
│  - Router : Guards basés sur rôles                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS
                         │ Authorization: Bearer JWT
                         │
┌────────────────────────▼────────────────────────────────────┐
│                         BACKEND                              │
│  Node.js 20 + Express + Zod + Pino                          │
│  - Middlewares : Auth JWT, Rate Limiting, Helmet            │
│  - Routes : /moods, /insights, /ai                          │
│  - Validation : Zod schemas strictes                        │
│  - Logging : Pino (sans PII)                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Supabase Client
                         │ RLS Applied
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    SUPABASE (PostgreSQL)                     │
│  - Auth : JWT tokens, session management                    │
│  - Database : PostgreSQL avec RLS strict                    │
│  - Tables : profiles, mood_entries, ai_sessions, etc.       │
│  - Functions : get_user_stats, calculate_global_stats       │
│  - Triggers : Auto-création profils, updated_at             │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ OpenAI API
                         │
┌────────────────────────▼────────────────────────────────────┐
│                      SERVICES EXTERNES                       │
│  - OpenAI GPT : Conseils personnalisés IA                   │
│  - (Futur) Email : Notifications Supabase Edge Functions    │
└─────────────────────────────────────────────────────────────┘
```

### Architecture de Déploiement

```
┌─────────────────────────────────────────────────────────────┐
│                      VPS HOSTINGER                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                     COOLIFY                           │   │
│  │  ┌────────────────────┐  ┌──────────────────────┐   │   │
│  │  │  Frontend Service  │  │   Backend Service    │   │   │
│  │  │  (Nginx + Static)  │  │   (Node.js + PM2)    │   │   │
│  │  │  Port: 80/443      │  │   Port: 8080         │   │   │
│  │  │  Domain: app.xxx   │  │   Domain: api.xxx    │   │   │
│  │  └────────────────────┘  └──────────────────────┘   │   │
│  │                                                       │   │
│  │  Docker Compose + Health Checks + Auto-restart       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
              Supabase Cloud (externe)
```

---

## Stack Technologique

### Frontend

| Technologie | Version | Rôle | Justification |
|-------------|---------|------|---------------|
| **Vue 3** | 3.3.8 | Framework JavaScript | Composition API, réactivité fine, performance |
| **Vite** | 5.0.0 | Build tool | HMR rapide, builds optimisés, modern ES modules |
| **Tailwind CSS** | 3.3.6 | Framework CSS | Utility-first, responsive design, customisation |
| **daisyUI** | 4.4.19 | Components UI | Composants Tailwind prêts, cohérence visuelle |
| **Chart.js** | 4.4.0 | Visualisations | Graphiques interactifs, responsive, léger |
| **Pinia** | 2.1.7 | State management | Store réactif, dev tools, TypeScript ready |
| **Vue Router** | 4.2.5 | Routing | Navigation guards, lazy loading, transitions |
| **Axios** | 1.6.2 | HTTP client | Intercepteurs, retry logic, timeout handling |
| **date-fns** | 2.30.0 | Gestion dates | Léger, tree-shakeable, i18n français |

### Backend

| Technologie | Version | Rôle | Justification |
|-------------|---------|------|---------------|
| **Node.js** | 20 LTS | Runtime | Performance, stabilité, large écosystème |
| **Express** | 4.18.2 | Web framework | Minimaliste, middlewares, large communauté |
| **cors** | 2.8.5 | CORS handling | Whitelist origins, credentials support |
| **Supabase JS** | 2.38.4 | DB client | RLS support, auth integration |
| **OpenAI** | 4.20.1 | IA API | GPT pour conseils personnalisés |

### Base de Données

| Composant | Technologie | Détails |
|-----------|-------------|---------|
| **SGBD** | PostgreSQL 15 | Via Supabase Cloud |
| **Auth** | Supabase Auth | JWT tokens, session management |
| **RLS** | Row Level Security | Isolation stricte par user_id |
| **Functions** | PL/pgSQL | Calculs côté serveur (get_user_stats) |
| **Triggers** | PostgreSQL | Auto-création profils, updated_at |

### Infrastructure

| Outil | Rôle |
|-------|------|
| **Docker** | Conteneurisation frontend + backend |
| **Docker Compose** | Orchestration locale et production |
| **Nginx** | Serveur web pour fichiers statiques frontend |
| **Coolify** | Plateforme de déploiement self-hosted |
| **VPS Hostinger** | Hébergement serveur Linux |

---

## Choix UX et Design

### Principes de Design

#### 1. Mobile-First Approach

**Justification** : La majorité des utilisateurs accèdent à l'application via smartphone pour enregistrer rapidement leur humeur quotidienne.

**Implémentation** :
- Design de base pour écrans 375px (iPhone SE)
- Touch targets minimum 44x44px (standard Apple/Google)
- Navigation thumb-friendly (éléments importants en bas)
- Modal fullscreen sur mobile pour les formulaires
- Grilles adaptatives : 1 colonne mobile, 2-4 colonnes desktop

#### 2. Progressive Disclosure

**Justification** : Éviter la surcharge cognitive, montrer ce qui est pertinent au bon moment.

**Implémentation** :
- Formulaire principal : Seulement humeur visible
- Sections "Contexte" et "Bien-être" repliables
- Auto-expansion si données existantes en mode édition
- Affichage conditionnel des widgets selon données disponibles

#### 3. Optimistic UI

**Justification** : Feedback immédiat = meilleure expérience, perception de rapidité.

**Implémentation** :
- Ajout d'humeur : carte apparaît instantanément
- Modification : changements visibles avant confirmation serveur
- Suppression : élément disparaît immédiatement
- Rollback automatique si erreur backend

#### 4. Feedback Visuel Constant

**Implémentation** :
- Toasts pour chaque action (succès/erreur)
- Loading states contextuels (spinners, skeletons)
- Animations fluides (transitions Vue Router)
- Indicateurs de progression (barres, badges)
- States visuels clairs (hover, active, disabled)

### Palette de Couleurs et Thèmes

**Système dual-theme** :
- Mode clair : Base100, Primary (violet), Secondary (rose)
- Mode sombre : Base100 dark, contraste augmenté
- Détection auto du thème système (prefers-color-scheme)
- Toggle manuel dans navbar (persiste en localStorage)
- Transition smooth entre thèmes (200ms)

**Signification des couleurs** :
- Rouge (score 1-2) : Humeur négative
- Jaune (score 3) : Humeur neutre
- Vert (score 4-5) : Humeur positive
- Primary (violet) : Actions principales, navigation
- Error (rouge) : Actions destructives, alertes

---

## Fonctionnalités Implémentées

### MVP (Minimum Viable Product)

#### 1. Authentification et Profils

**Features** :
- Inscription par email/mot de passe
- Connexion sécurisée avec JWT
- Séparation stricte admin/utilisateur (2 pages de login)
- Gestion de profil (nom, email, préférences)
- Changement de mot de passe
- Persistance de session avec Supabase Auth

**Sécurité** :
- Mots de passe hachés (bcrypt via Supabase)
- Tokens JWT avec expiration
- Refresh token automatique
- Déconnexion smooth sans rechargement brutal

#### 2. Dashboard Utilisateur (Semaine)

**Features** :
- Vue hebdomadaire (7 cartes, lundi à dimanche)
- Affichage emoji selon score d'humeur
- Label et note personnalisés
- Badges : météo, tags, activités, sommeil, énergie, stress
- Indicateur visuel pour "aujourd'hui"
- Actions : Édition, suppression avec confirmation

**Design** :
- Grille responsive : 1 col mobile → 4 cols desktop
- Cartes compactes : 120px mobile, 150px desktop
- Hover effects : boutons édition/suppression apparaissent
- Touch feedback : scale au tap sur mobile

#### 3. CRUD Humeur Complet

**Champs collectés** :
- **Obligatoires** : Score (1-5), Date
- **Optionnels** : Label (100 car), Note (2000 car)
- **Contexte** : Météo, Tags, Activités
- **Bien-être** : Sommeil (0-12h), Énergie (1-5), Stress (1-5)

**Calculs automatiques côté backend** :
- Category (tres_triste, triste, neutre, content, tres_content)
- Basé sur le score (1→tres_triste, 5→tres_content)

**Optimistic UI** :
- Ajout : carte visible en 0ms (puis confirmation backend)
- Modification : changements instantanés
- Suppression : disparition immédiate
- Rollback automatique en cas d'erreur réseau

#### 4. Visualisations et Analytics

**Dashboard** :
- Graphique Chart.js (barres) : évolution semaine
- Stats temps réel : moyenne, min/max, tendance
- Citation du jour personnalisée selon humeur
- Résumé automatique de la semaine

**Page Analytics** :
- Graphique Donut : répartition 5 humeurs
- Graphique Ligne : évolution temporelle
- Graphique Barres : distribution détaillée
- Sélecteur période : semaine/mois
- Insights : meilleurs moments, moments difficiles
- Patterns : meilleur jour, activité top, sommeil moyen

**Page Calendar** :
- Vue calendrier mensuelle complète
- Navigation mois précédent/suivant
- Emoji sur chaque jour avec humeur
- Modal détails au clic
- Stats du mois : moyenne, régularité, jours enregistrés

#### 5. Persistance et Synchronisation

**Mécanisme** :
- Données stockées dans PostgreSQL (Supabase)
- Requêtes via backend API (BFF pattern)
- State management Pinia côté frontend
- Synchronisation automatique toutes les actions
- Reconnexion automatique si token valide

### Fonctionnalités Bonus Implémentées

#### 1. Thème Sombre/Clair Automatique

**Implémentation** :
- Détection automatique via media query (prefers-color-scheme)
- Toggle manuel dans navbar (store Pinia réactif)
- Sauvegarde préférence dans localStorage
- Changement instantané sans rechargement
- Transition CSS smooth (200ms)

#### 2. Citation du Jour Personnalisée

**Logique** :
- Basée sur moyenne d'humeur hebdomadaire
- 5 citations adaptées aux 5 niveaux d'humeur
- Calcul : Math.round(average_score)
- Mise à jour temps réel quand nouvelle humeur ajoutée

#### 3. Résumé Automatique de la Semaine

**Génération** :
- Phrase construite selon nombre d'humeurs et moyenne
- Exemple : "Cette semaine, tu as enregistré 5 humeurs. Tu as été globalement de bonne humeur. Ta moyenne est de 4.2/5 (min: 3, max: 5)."
- Affiché dans Dashboard si données disponibles

#### 4. Champs Enrichis (Tags, Activités, Bien-être)

**Tags** :
- Ajout/suppression dynamique
- Maximum 10 tags par humeur
- Badge count sur cartes

**Activités** :
- 12 activités prédéfinies (Sport, Travail, Famille, etc.)
- Sélection multiple
- Badge count sur cartes

**Bien-être** :
- Sommeil : Slider 0-12h
- Énergie : Échelle 1-5
- Stress : Échelle 1-5
- Badges colorés selon niveau

#### 5. Sécurité Renforcée

**Mesures implémentées** :
- Headers Helmet (CSP, HSTS, X-Frame-Options)
- Rate limiting : 100 requêtes/15min par IP
- CORS whitelist stricte
- Validation Zod sur tous les inputs
- RLS PostgreSQL niveau row
- Pas de PII dans les logs
- Séparation admin/user totale

---

## Sécurité

### Architecture de Sécurité Multi-Couches

#### Couche 1 : Frontend

**Validation côté client** :
- Validation formulaires avec feedback immédiat
- Regex email, longueur mot de passe (min 6 caractères)
- Compteurs de caractères (label 100, note 2000)
- Désactivation inputs pendant requêtes

**Stockage sécurisé** :
- Tokens JWT dans localStorage Supabase (httpOnly impossible en SPA)
- Clé Supabase Anon (publique, safe)
- Pas de clé Service Role côté client
- Pas de données sensibles en clair

**Protection XSS** :
- Vue.js échappe automatiquement le contenu
- Pas de v-html sur contenu utilisateur
- CSP headers via backend

#### Couche 2 : Backend (BFF)

**Authentification** :
```javascript
// Middleware auth (backend/src/middlewares/auth.js)
1. Extrait token du header Authorization: Bearer <token>
2. Vérifie token avec Supabase Auth
3. Récupère user.id du token décodé
4. Ajoute req.user et req.authToken à la requête
5. Si invalide → 401 Unauthorized
```

**Rate Limiting** :
```javascript
// 100 requêtes par 15 minutes par IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes, réessayez plus tard'
})

```

#### Couche 3 : Base de Données (RLS)

**Row Level Security (RLS)** :

Chaque table a des politiques strictes :

```sql
-- Politique pour mood_entries
CREATE POLICY "moods_select_own" 
ON public.mood_entries 
FOR SELECT 
USING (user_id = auth.uid());

-- Signifie :
-- User A (uuid-AAA) ne peut SELECT que les rows où user_id = 'uuid-AAA'
-- User B (uuid-BBB) ne voit JAMAIS les rows de User A
-- Même avec Service Role Key, backend doit filtrer explicitement
```

**Politiques par table** :
- `profiles` : SELECT/UPDATE own, INSERT self
- `mood_entries` : SELECT/INSERT/UPDATE/DELETE own
- `ai_sessions` : ALL own
- `ai_messages` : ALL own

**Avantages RLS** :
- Protection au niveau DB (dernière ligne de défense)
- Impossible de contourner même avec injection SQL
- Fonctionne avec tous les clients (backend, direct, edge functions)

### Sécurité des Formulaires

#### Protection CSRF

**Méthode SameSite Cookie** :
- Tokens JWT envoyés via header (pas cookie)
- Pas de CSRF possible car pas de cookie automatique
- Requêtes cross-origin bloquées par CORS

#### Protection XSS

**Échappement automatique** :
- Vue.js échappe {{ }} par défaut
- Zod valide longueur et format
- Pas de dangerouslySetInnerHTML équivalent utilisé

#### Validation Double

**Client + Serveur** :
```
User input
  ↓
Frontend validation (UX, feedback immédiat)
  ↓
Backend validation Zod (sécurité, autorité)
  ↓
Database constraints (dernière protection)
```

### Gestion des Tokens

**Cycle de vie JWT** :

```
1. Login → Supabase Auth génère JWT + Refresh Token
2. Frontend stocke dans localStorage (via Supabase Client)
3. Chaque requête API :
   - Intercepteur Axios récupère token
   - Ajoute header : Authorization: Bearer <token>
4. Backend vérifie token avec Supabase
5. Si expiré (1h) :
   - Intercepteur Axios détecte 401
   - Appelle supabase.auth.refreshSession()
   - Retry requête avec nouveau token
6. Si refresh échoue :
   - Déconnexion automatique
   - Redirect vers /login
```

**Stockage** :
- localStorage key : `moodflow-auth`
- Format : Objet Supabase (session, user, expires_at)
- Pas de token en clair dans code source
- Clé Service Role JAMAIS côté frontend

---

## Flux de Données

### Flux Principal : Ajout d'Humeur

```
┌──────────────────────────────────────────────────────────┐
│ 1. USER : Saisit humeur (score, label, note, tags...)   │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 2. FRONTEND : MoodForm validation côté client            │
│    - Score requis (1-5)                                  │
│    - Label max 100 caractères                            │
│    - Note max 2000 caractères                            │
│    - Tags max 10                                         │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 3. STORE (Pinia) : Optimistic UI                        │
│    - Crée humeur temporaire (id: temp-xxx)              │
│    - Ajoute immédiatement à moods[]                     │
│    - MAJ UI en 0ms                                       │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 4. API CLIENT (Axios) : HTTP POST                       │
│    - Intercepteur ajoute JWT token                      │
│    - POST /api/moods                                     │
│    - Body: { score, label, note, weather, tags, ... }   │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 5. BACKEND : Middleware Auth                            │
│    - Extrait token : req.headers.authorization          │
│    - Vérifie avec Supabase : getUser(token)             │
│    - Extrait user.id du token                           │
│    - Si invalide → 401                                   │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 6. BACKEND : Route /moods                               │
│    - Validation Zod stricte                             │
│    - Calcule category automatiquement                   │
│    - Prépare insertData avec user_id                    │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 7. SUPABASE CLIENT : Insert                             │
│    - Utilise token user (pas Service Role)              │
│    - supabase.from('mood_entries').insert(data)         │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 8. POSTGRESQL : RLS Check                               │
│    - Vérifie policy : user_id = auth.uid()              │
│    - auth.uid() vient du JWT token                      │
│    - Si mismatch → Erreur                               │
│    - Si OK → INSERT INTO mood_entries                   │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 9. RESPONSE : Données confirmées                        │
│    - Backend retourne : { id, score, category, ... }    │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 10. STORE : Confirmation                                │
│     - Remplace temp-xxx par vraies données              │
│     - MAJ weeklyStats                                    │
│     - Toast "Humeur enregistrée"                        │
└──────────────────────────────────────────────────────────┘
```

**Temps total** : ~500ms backend, mais UI réactive en 0ms (Optimistic)

### Flux Sécurisé : Isolation des Données

**Scénario** : User A ne doit jamais voir les données de User B

```
User A (uuid-AAA) tente de récupérer ses humeurs
  ↓
1. Frontend : GET /api/moods?from=2025-10-13&to=2025-10-19
   Header: Authorization: Bearer <token-user-A>
  ↓
2. Backend : Vérifie token
   Token décodé → user.id = "uuid-AAA"
  ↓
3. Backend : Force filtre
   .eq('user_id', req.user.id)  // ← Toujours l'ID du token
  ↓
4. Supabase : Applique RLS
   WHERE user_id = 'uuid-AAA' AND user_id = auth.uid()
   (double vérification)
  ↓
5. Résultat : UNIQUEMENT les humeurs de User A

IMPOSSIBLE de voir les données de User B, même avec :
- Modification token (détecté par Supabase)
- Injection SQL (paramètres préparés)
- Bypass frontend (backend vérifie)
- Requête directe DB (RLS appliqué)
```

---

## Gestion des Rôles

### Système de Rôles Dual

**Deux rôles définis** :
- `user` : Utilisateurs standards
- `admin` : Administrateurs

**Stockage** :
```sql
-- Table profiles
role user_role NOT NULL DEFAULT 'user'

-- Type enum
CREATE TYPE user_role AS ENUM ('user', 'admin');
```

### Séparation Stricte

#### 1. Pages de Connexion Distinctes

**Utilisateur** :
- URL : `/login`
- Composant : `Login.vue`
- Vérification : Si admin détecté → rejeté + redirect `/admin/login`
- Redirection après login : `/dashboard`

**Administrateur** :
- URL : `/admin/login`
- Composant : `AdminLogin.vue`
- Vérification : Si user standard → erreur "Pas les droits admin"
- Redirection après login : `/admin`

#### 2. Routes Protégées par Rôle

**Metadata des routes** :
```javascript
// Route utilisateur uniquement
{
  path: '/dashboard',
  meta: { requiresAuth: true, userOnly: true }
}

// Route admin uniquement
{
  path: '/admin',
  meta: { requiresAuth: true, requiresAdmin: true }
}

// Route mixte (profile)
{
  path: '/profile',
  meta: { requiresAuth: true }
}
```

**Navigation Guard** :
```javascript
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Attend initialisation auth si nécessaire
  if (!authStore.initialized) {
    await authStore.initialize()
  }
  
  // Bloque admin si route userOnly
  if (to.meta.userOnly && authStore.isAdmin) {
    next('/admin')
    return
  }
  
  // Bloque user si route requiresAdmin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/dashboard')
    return
  }
  
  next()
})
```

#### 3. Menu Adapté au Rôle

**Utilisateur voit** :
- Dashboard
- Analytics
- Calendar
- Chat IA
- Profile

**Admin voit** :
- Administration
- Profile

**Résultat** : Pas de liens inutilisables, UX claire

#### 4. Backend : Pas de vérification rôle nécessaire

**Pour les routes user** :
- RLS suffit : user_id = auth.uid()
- Pas besoin de vérifier le rôle
- Chaque user voit uniquement ses données

**Pour les routes admin** :
- Utilisation Service Role Key
- Requêtes sur global_stats, toutes les profiles
- Jamais exposée côté frontend

### Accès Discret Admin

**Problématique** : Ne pas afficher "Admin" partout (sécurité + UX)

**Solution** :
- Lien dans footer : point "·" quasi invisible (opacity: 20%)
- URL directe : `/admin/login` (bookmark recommandé)
- Aucune mention dans navbar utilisateur
- Séparation totale des flows

---

## Contributions de l'Équipe

### 1. Développement Full-Stack

**Responsable** : Développeur Full-Stack Lead

**Réalisations** :
- Architecture monorepo (frontend + backend)
- Intégration Vue 3 + Express
- Système de routing avec guards
- Composants réutilisables (MoodForm, MoodDayCard, WeekChart)
- State management Pinia (4 stores : auth, moods, insights, theme)
- Optimistic UI avec rollback automatique
- API REST complète (moods, insights, ai, health)
- Middlewares sécurité (auth, errorHandler)
- Validation Zod complète
- Gestion erreurs et logging structuré

**Fichiers clés** :
- `frontend/src/App.vue` - Layout principal
- `frontend/src/router/index.js` - Navigation et guards
- `frontend/src/stores/*.js` - Gestion d'état
- `frontend/src/components/*.vue` - Composants UI
- `frontend/src/views/*.vue` - 14 pages complètes
- `backend/src/app.js` - Configuration serveur
- `backend/src/routes/*.js` - Endpoints API
- `backend/src/middlewares/*.js` - Sécurité

### 2. Data Engineering

**Responsable** : Data Engineer

**Réalisations** :

**Modélisation Base de Données** :
- Schéma PostgreSQL complet (6 tables)
- Types ENUM (user_role, mood_category, notification_type, notification_status)
- Contraintes d'intégrité (CHECK, UNIQUE, FOREIGN KEY)
- Indexes optimisés pour performance :
  - `idx_mood_entries_user_date` (requêtes fréquentes)
  - `idx_mood_entries_score` (analytics)
  - `idx_ai_messages_session` (chat historique)

**Row Level Security** :
- Politiques RLS sur toutes les tables
- Fonction `current_user_role()` pour vérification
- Isolation complète des données par utilisateur
- Tests de sécurité (user A ne voit jamais user B)

**Triggers et Fonctions** :
- `handle_new_user()` : Création auto profil à l'inscription
- `update_updated_at_column()` : Timestamps automatiques
- `get_user_stats(uuid, start, end)` : Stats utilisateur période
- `calculate_global_stats(date)` : Agrégats pour admins

**Gestion Authentification** :
- Intégration Supabase Auth
- Configuration JWT audience
- Session persistence
- Refresh token automatique

**Analytics et Visualisations** :
- Backend : Calculs stats (avg, min, max, histogram, trend)
- Frontend : Intégration Chart.js (3 types de graphiques)
- Insights : Citation personnalisée, résumé semaine
- Corrélations préparées (fonctions SQL prêtes)

**Fichiers clés** :
- `docs/setup-database.sql` - Schema complet avec RLS
- `backend/src/lib/supabase.js` - Clients Supabase
- `backend/src/routes/insights.js` - Calculs statistiques
- `frontend/src/stores/insights.js` - Store analytics

### 3. Infrastructure & DevOps

**Responsable** : DevOps Engineer

**Réalisations** :

**Dockerisation** :
- `backend/Dockerfile` : 
  - Multi-stage build
  - Image Node 20 Alpine (lightweight)
  - User non-root pour sécurité
  - Healthcheck configuré
- `frontend/Dockerfile` :
  - Build stage (Vite build)
  - Production stage (Nginx Alpine)
  - Configuration Nginx custom
  - Healthcheck wget

**Orchestration** :
- `docker-compose.dev.yml` : Développement local
  - Hot reload frontend + backend
  - Volumes montés pour développement
  - Variables d'environnement
  - Network isolation
- `docker-compose.yml` : Production (à créer)

**Configuration VPS** :
- Guide déploiement Coolify complet
- Configuration domaines et SSL
- Variables d'environnement sécurisées
- Monitoring et logs
- Backup strategy

**CI/CD (préparé)** :
- Structure prête pour GitHub Actions
- Build automatique Docker images
- Tests avant déploiement
- Déploiement Coolify via webhook

**Fichiers clés** :
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `docker-compose.dev.yml`
- `docs/deployment.md`
- `docs/architecture.md`

### 4. Sécurité

**Responsable** : Security Engineer

**Réalisations** :

**Backend Security** :
- Helmet middleware : Headers sécurité (CSP, HSTS, X-Frame-Options)
- CORS stricte : Whitelist origins uniquement
- Rate limiting : 100 req/15min par IP
- Validation Zod : Tous les inputs validés
- Logging sans PII : Aucune donnée personnelle dans logs
- Error handling : Messages génériques en production

**Database Security** :
- RLS activé sur toutes les tables
- Politiques granulaires (SELECT/INSERT/UPDATE/DELETE)
- Service Role Key isolée backend uniquement
- Anon Key exposée frontend (safe, RLS appliqué)
- Pas de requêtes SQL brutes (ORM Supabase)

**Frontend Security** :
- Validation inputs côté client
- Pas de clés sensibles exposées
- Content Security Policy respectée
- Pas de eval() ou innerHTML dangereux
- Sanitization automatique Vue.js

**Auth Security** :
- JWT avec expiration (1h)
- Refresh token automatique
- Déconnexion si token invalide
- Session timeout après inactivité
- Pas de token en URL (header uniquement)

**Transmission Données** :
```
Frontend → Backend → Database : Sécurisé à chaque étape

Frontend:
- HTTPS en production
- Token dans header Authorization
- Validation avant envoi

Backend:
- Vérifie token avec Supabase
- Valide avec Zod
- Force user_id du token (pas de l'input)
- Log sans PII

Database:
- RLS vérifie user_id = auth.uid()
- Contraintes CHECK sur valeurs
- Encryption at rest (Supabase)
```

**Tests Sécurité Effectués** :
- User A ne peut pas voir données User B : PASS
- Admin ne peut pas modifier données user via RLS : PASS
- Injection SQL dans label/note : Bloqué (prepared statements)
- XSS dans note : Échappé automatiquement
- CSRF : Non applicable (pas de cookies auth)
- Rate limit : Testable (100 req en 1min → bloqué)

**Fichiers clés** :
- `backend/src/middlewares/auth.js`
- `backend/src/middlewares/errorHandler.js`
- `docs/security.md`
- `docs/authentication-system.md`

---

## Installation et Déploiement

### Prérequis

- Node.js 20 LTS ou supérieur
- npm 9 ou supérieur
- Compte Supabase (gratuit)
- Clé API OpenAI (pour fonctionnalité IA)
- Docker et Docker Compose (pour déploiement)

### Installation Locale

#### 1. Cloner le Repository

```bash
git clone https://github.com/MrSiuuu/MoodFlow.git
cd MoodFlow
```

#### 2. Configuration Backend

```bash
cd backend
npm install
```

Créer `backend/.env` :
```env
PORT=8080
NODE_ENV=development
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
OPENAI_API_KEY=votre_openai_key
CORS_ORIGIN=http://localhost:5173
```

#### 3. Configuration Frontend

```bash
cd frontend
npm install
```

Créer `frontend/.env` :
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key
```

#### 4. Configuration Base de Données

1. Créer un projet Supabase sur https://supabase.com
2. Aller dans SQL Editor
3. Copier-coller le contenu de `docs/setup-database.sql`
4. Exécuter le script complet
5. Vérifier que toutes les tables sont créées
6. Optionnel : Promouvoir un utilisateur en admin
   ```sql
   UPDATE public.profiles SET role = 'admin' 
   WHERE email = 'votre-email@example.com';
   ```

#### 5. Lancer l'Application

**Terminal 1 - Backend** :
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend** :
```bash
cd frontend
npm run dev
```

**Accès** :
- Frontend : http://localhost:5173
- Backend API : http://localhost:8080
- Healthcheck : http://localhost:8080/api/health

### Déploiement Production (Coolify + VPS)

#### Prérequis VPS

- VPS avec Docker installé (Ubuntu 22.04 recommandé)
- Coolify installé et configuré
- Domaines configurés (app.example.com, api.example.com)

#### Étapes Coolify

1. **Créer Nouveau Projet**
   - Type : Docker Compose
   - Repository : GitHub (lien auto-deploy)

2. **Variables d'Environnement Backend**
   ```
   NODE_ENV=production
   PORT=8080
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   OPENAI_API_KEY=...
   CORS_ORIGIN=https://app.example.com
   ```

3. **Variables d'Environnement Frontend**
   ```
   VITE_API_BASE_URL=https://api.example.com
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```

4. **Déployer**
   - Push sur main → Auto-deploy via Coolify
   - Vérifier healthchecks
   - Configurer SSL automatique (Let's Encrypt)

---

## Documentation Technique

### Structure du Projet

```
moodflow/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Point d'entrée serveur
│   │   ├── lib/
│   │   │   ├── logger.js          # Pino configuration
│   │   │   └── supabase.js        # Clients Supabase
│   │   ├── middlewares/
│   │   │   ├── auth.js            # Vérification JWT
│   │   │   └── errorHandler.js   # Gestion erreurs
│   │   └── routes/
│   │       ├── moods.js           # CRUD humeurs
│   │       ├── insights.js        # Stats et analytics
│   │       ├── ai.js              # Chat IA
│   │       └── health.js          # Healthcheck
│   ├── Dockerfile                 # Image Docker backend
│   ├── package.json
│   └── .env.example              # Template variables
│
├── frontend/
│   ├── src/
│   │   ├── main.js                # Point d'entrée Vue
│   │   ├── App.vue                # Composant racine
│   │   ├── components/
│   │   │   ├── Navbar.vue         # Navigation sticky
│   │   │   ├── Footer.vue         # Footer
│   │   │   ├── MoodForm.vue       # Formulaire humeur
│   │   │   ├── MoodDayCard.vue    # Carte jour
│   │   │   ├── WeekChart.vue      # Graphique Chart.js
│   │   │   └── ThemeToggle.vue    # Toggle dark/light
│   │   ├── views/
│   │   │   ├── Home.vue           # Page accueil
│   │   │   ├── Login.vue          # Connexion user
│   │   │   ├── Register.vue       # Inscription
│   │   │   ├── AdminLogin.vue     # Connexion admin
│   │   │   ├── Dashboard.vue      # Dashboard user
│   │   │   ├── Analytics.vue      # Analytics graphiques
│   │   │   ├── Calendar.vue       # Vue mensuelle
│   │   │   ├── Chat.vue           # Chat IA
│   │   │   ├── Profile.vue        # Profil
│   │   │   ├── AdminDashboard.vue # Dashboard admin
│   │   │   ├── About.vue          # À propos
│   │   │   ├── Help.vue           # FAQ
│   │   │   ├── Contact.vue        # Contact
│   │   │   ├── Privacy.vue        # RGPD
│   │   │   ├── Terms.vue          # CGU
│   │   │   └── NotFound.vue       # 404
│   │   ├── stores/
│   │   │   ├── auth.js            # Authentification
│   │   │   ├── moods.js           # Humeurs + Optimistic UI
│   │   │   ├── insights.js        # Stats et analytics
│   │   │   └── theme.js           # Thème dark/light
│   │   ├── lib/
│   │   │   ├── api.js             # Client Axios + intercepteurs
│   │   │   ├── supabase.js        # Client Supabase frontend
│   │   │   └── utils.js           # Fonctions utilitaires
│   │   └── router/
│   │       └── index.js           # Routes + guards
│   ├── Dockerfile                 # Image Docker frontend
│   ├── nginx.conf                 # Config Nginx production
│   ├── package.json
│   └── .env.example              # Template variables
│
├── docs/
│   ├── setup-database.sql         # Migrations SQL complètes
│   ├── api.md                     # Documentation API
│   ├── architecture.md            # Schémas architecture
│   ├── security.md                # Sécurité et RLS
│   ├── deployment.md              # Guide déploiement
│   ├── authentication-system.md   # Système auth dual
│   ├── DASHBOARD-IMPLEMENTATION.md
│   ├── CORRECTIONS-APPLIQUÉES.md
│   └── AMELIORATIONS-DASHBOARD-USER.md
│
├── docker-compose.dev.yml         # Dev local
├── .gitignore                     # Fichiers ignorés Git
├── package.json                   # Scripts root
└── README.md                      # Ce fichier
```

### API Endpoints

#### Authentication (Supabase)

- `POST /auth/signup` - Inscription
- `POST /auth/login` - Connexion
- `POST /auth/logout` - Déconnexion
- `POST /auth/refresh` - Refresh token

#### Moods

- `GET /api/moods?from=YYYY-MM-DD&to=YYYY-MM-DD` - Liste humeurs période
- `POST /api/moods` - Créer humeur
- `PATCH /api/moods/:id` - Modifier humeur
- `DELETE /api/moods/:id` - Supprimer humeur

#### Insights

- `GET /api/insights/week` - Stats semaine courante
- `GET /api/insights/month` - Stats mois courant

#### IA

- `POST /api/ai/query` - Envoyer message IA
- `GET /api/ai/sessions` - Liste sessions
- `GET /api/ai/sessions/:id/messages` - Historique session

#### Health

- `GET /api/health` - Status serveur

### Modèle de Données

#### Table: profiles

```sql
id               UUID PRIMARY KEY
email            TEXT NOT NULL
display_name     TEXT
avatar_url       TEXT
role             user_role NOT NULL DEFAULT 'user'
timezone         TEXT DEFAULT 'Europe/Paris'
notification_preferences JSONB
created_at       TIMESTAMPTZ
updated_at       TIMESTAMPTZ
```

#### Table: mood_entries

```sql
id               BIGSERIAL PRIMARY KEY
user_id          UUID NOT NULL (FK profiles)
mood_date        DATE NOT NULL
score            INT NOT NULL CHECK (1-5)
category         mood_category NOT NULL
label            TEXT
note             TEXT CHECK (length <= 2000)
tags             TEXT[]
weather          JSONB
location         JSONB
activities       TEXT[]
sleep_hours      DECIMAL(3,1)
energy_level     INT CHECK (1-5)
stress_level     INT CHECK (1-5)
created_at       TIMESTAMPTZ
updated_at       TIMESTAMPTZ
UNIQUE (user_id, mood_date)
```

#### Table: ai_sessions

```sql
id               UUID PRIMARY KEY
user_id          UUID NOT NULL (FK profiles)
title            TEXT NOT NULL
context_data     JSONB
created_at       TIMESTAMPTZ
updated_at       TIMESTAMPTZ
```

#### Table: ai_messages

```sql
id               BIGSERIAL PRIMARY KEY
session_id       UUID NOT NULL (FK ai_sessions)
user_id          UUID NOT NULL (FK profiles)
role             TEXT NOT NULL CHECK ('user', 'assistant', 'system')
content          TEXT NOT NULL
metadata         JSONB
created_at       TIMESTAMPTZ
```

#### Table: notifications

```sql
id               BIGSERIAL PRIMARY KEY
user_id          UUID NOT NULL (FK profiles)
type             notification_type NOT NULL
title            TEXT NOT NULL
message          TEXT NOT NULL
data             JSONB
status           notification_status DEFAULT 'pending'
scheduled_for    TIMESTAMPTZ
sent_at          TIMESTAMPTZ
read_at          TIMESTAMPTZ
created_at       TIMESTAMPTZ
```

---

## Performance et Optimisations

### Frontend

- **Code splitting** : Lazy loading des routes Vue Router
- **Tree shaking** : Vite élimine code non utilisé
- **Minification** : CSS et JS minifiés en production
- **Compression** : Gzip via Nginx
- **Caching** : Assets statiques avec cache headers
- **Optimistic UI** : Perception de rapidité (0ms feedback)

### Backend

- **Compression** : gzip/deflate via Express
- **Connection pooling** : Supabase gère automatiquement
- **Indexes DB** : Toutes requêtes fréquentes indexées
- **Rate limiting** : Protection ressources
- **Logging asynchrone** : Pino non-bloquant

### Base de Données

- **Indexes optimisés** : (user_id, mood_date), (score), (created_at)
- **Fonctions SQL** : Agrégations côté DB (pas en JS)
- **RLS performant** : Politiques simples, pas de récursion
- **Queries optimisées** : SELECT uniquement colonnes nécessaires

---

## Tests et Qualité

### Scénarios de Test Validés

1. **Inscription** : Créer compte → Profil auto-créé → Redirect dashboard
2. **Connexion** : Login user → Dashboard / Login admin → Admin panel
3. **Isolation** : User A ne voit jamais données User B
4. **CRUD Humeur** : Ajout/Modification/Suppression avec Optimistic UI
5. **Persistance** : Refresh page → Données conservées
6. **Thème** : Toggle dark/light sans rechargement
7. **Responsive** : Mobile (375px) → Desktop (1920px)
8. **Erreurs** : Gestion 401, 409, 500 avec messages clairs

### Standards Qualité

- **Validation** : Double validation (client + serveur)
- **Error Handling** : Try/catch partout, messages utilisateur clairs
- **Logging** : Structured logs Pino, pas de PII
- **Code Style** : ESLint Vue recommended
- **Git** : Commits conventionnels, branches protégées

---

## Roadmap Futur

### Version 1.1 (Court terme)

- Streak counter (série de jours consécutifs)
- Corrélations sommeil/humeur
- Activités impact ranking
- Achievements system (gamification)
- Comparaisons temporelles

### Version 1.2 (Moyen terme)

- Notifications email (rappels quotidiens, résumés hebdo)
- Export données (PDF, CSV)
- Insights IA avancés (GPT-4)
- Objectifs personnels mesurables
- Heatmap annuelle

### Version 2.0 (Long terme)

- Application mobile native (React Native)
- Intégrations wearables (Apple Health, Google Fit)
- Analyse prédictive (ML)
- Partage anonyme et comparaisons
- API publique pour développeurs tiers

---

## Licence et Contact

### Licence

MIT License - Voir fichier LICENSE

### Contact

- Email : contact@moodflow.app
- GitHub : https://github.com/MrSiuuu/MoodFlow
- Documentation : Dossier `/docs`

### Contribution

Les contributions sont bienvenues. Voir CONTRIBUTING.md pour guidelines.

---

## Remerciements

Projet développé avec passion pour promouvoir le bien-être mental et l'accessibilité des outils de suivi psychologique. Merci à la communauté open-source pour les technologies utilisées.

**MoodFlow** - Ton journal d'humeur intelligent, sécurisé et connecté.
