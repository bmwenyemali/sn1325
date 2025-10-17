# Application SN1325 RDC - Monitoring de la Résolution 1325

## Description

Application de monitoring et de suivi de la mise en œuvre de la Résolution 1325 du Conseil de Sécurité des Nations Unies sur "Femmes, Paix et Sécurité" en République Démocratique du Congo.

## Fonctionnalités

### 🏠 Page d'accueil publique

- Présentation de la mission SN1325
- Affichage des 5 axes stratégiques avec animations
- Statistiques en temps réel
- Interface de connexion intégrée
- Design responsive avec les couleurs officielles RDC

### 🔐 Authentification et autorisation

- Système de rôles (Admin, Éditeur, Consultant)
- Gestion des privilèges par utilisateur
- Sessions sécurisées

### 📊 Dashboard administrateur

- Vue d'ensemble avec métriques clés
- Navigation par sidebar avec sous-menus
- Actions rapides et activités récentes
- État du système en temps réel

### 🗂️ Gestion des référentiels

- **Axes stratégiques** : CRUD complet avec codes couleur
- **Indicateurs** : Gestion quantitative et qualitative
- **Provinces** : 26 provinces de la RDC
- Filtrage et recherche avancée

### 📝 Saisie des données

- Processus en 3 étapes guidées
- Sélection progressive (Province → Axe → Période)
- Validation des données en temps réel
- Support multi-périodes (mensuel, trimestriel, semestriel, annuel)

### 📈 Rapports et statistiques

- Graphiques interactifs (barres, secteurs, lignes)
- Comparaisons provinciales
- Évolution temporelle
- Export de rapports
- Filtrage dynamique par axe, province et période

## Stack technique

- **Framework** : Next.js 14 avec App Router
- **Langage** : TypeScript
- **Styling** : Tailwind CSS avec couleurs officielles RDC
- **Base de données** : MongoDB avec Mongoose ODM
- **Authentification** : NextAuth.js (structure prête)
- **Graphiques** : Recharts
- **Animations** : Framer Motion
- **Icônes** : Lucide React

## Installation

1. **Cloner le repository**

```bash
git clone https://github.com/bmwenyemali/sn1325.git
cd sn1325
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configuration environnement**
   Créer un fichier `.env.local` avec :

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sn1325?retryWrites=true&w=majority
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

4. **Lancer l'application**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts disponibles

- `npm run dev` - Lancement en mode développement
- `npm run build` - Build de production
- `npm run start` - Serveur de production
- `npm run lint` - Vérification ESLint

## Modèle de données

### Axes stratégiques (5 axes)

1. **Participation** - Participation des femmes aux processus de paix
2. **Protection** - Protection des droits des femmes
3. **Prévention** - Prévention des violences et conflits
4. **Relèvement** - Relèvement et reconstruction post-conflit
5. **Coordination** - Coordination et mise en œuvre

### Couverture géographique

26 provinces de la RDC avec données administratives complètes

### Types d'indicateurs

- **Quantitatifs** : Métriques numériques avec unités de mesure
- **Qualitatifs** : Évaluations descriptives et appréciations

## Couleurs officielles RDC

- **Bleu** : #002B7F (couleur principale)
- **Jaune** : #FCD116 (accents)
- **Rouge** : #CE1126 (alertes)

## Déploiement

L'application est configurée pour les plateformes :

- **Vercel** (recommandé pour Next.js)
- **Netlify**
- **Serveur VPS** avec PM2

## Licence

Ce projet est développé pour le suivi de la Résolution 1325 en RDC.
