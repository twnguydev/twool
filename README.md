# Twool Labs - Plateforme de Jumeau Numérique

Twool Labs est une application de bureau permettant de modéliser, simuler et optimiser des processus métier grâce au concept de jumeau numérique et à l'intelligence artificielle.

![Logo Twool Labs](./public/images/logo.png)

## 📋 Sommaire

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Architecture technique](#architecture-technique)
- [Guide de développement](#guide-de-développement)
- [Modélisation des processus](#modélisation-des-processus)
- [API](#api)
- [Contribuer](#contribuer)
- [Licence](#licence)

## 🔭 Vue d'ensemble

Twool Labs permet aux entreprises de modéliser leurs processus métier, de tester différentes optimisations via des simulations et d'intégrer des solutions basées sur l'IA et l'automatisation, le tout dans une application de bureau performante et intuitive.

Cette plateforme offre un environnement visuel drag & drop pour créer des workflows, analyser les goulots d'étranglement et automatiser les tâches, sans nécessiter d'expertise technique.

## ✨ Fonctionnalités

### MVP
- **Modélisation des processus**
  - Interface drag & drop pour créer des workflows
  - Bibliothèque de composants : tâches, décisions, événements
  - Personnalisation des propriétés : durée, coût, assignation

- **Simulations et analyses**
  - Exécution virtuelle des processus
  - Analyse des goulots d'étranglement
  - Métriques : temps total, coût estimé

- **Optimisations IA**
  - Suggestions d'amélioration automatiques
  - Identification des tâches à automatiser
  - Analyse des chemins critiques

- **Interface utilisateur intuitive**
  - Tableau de bord avec métriques clés
  - Visualisation graphique des processus
  - Panneau de propriétés contextuel

## 🚀 Installation

### Prérequis
- Node.js (v14+)
- Python (v3.8+)
- MySQL

### Installation du projet

```bash
# Cloner le dépôt
git clone https://github.com/votre-organisation/twool-labs.git
cd twool-labs

# Installer les dépendances Node.js
npm install

# Installer les dépendances Python
cd backend
pip install -r requirements.txt
cd ..

# Configurer la base de données
# 1. Créer une base de données MySQL nommée "twool"
# 2. Modifier les informations de connexion dans backend/app/database.py

# Lancer l'application en développement
npm run dev
```

### Construction pour la production

```bash
# Construire l'application
npm run build

# L'exécutable se trouve dans le dossier "dist"
```

## 🏗️ Architecture technique

Twool Labs est construit avec les technologies suivantes :

- **Frontend**
  - Next.js (React)
  - ReactFlow pour la modélisation visuelle
  - TailwindCSS pour le design

- **Application desktop**
  - Electron pour transformer l'application web en application de bureau avec système de mises à jour automatiques

- **Backend**
  - FastAPI (Python) pour l'API
  - MySQL pour la persistance des données
  - Scikit-learn pour les algorithmes d'optimisation

- **Intégration continue**
  - GitHub Actions pour les tests et les déploiements automatisés

## 👨‍💻 Guide de développement

### Structure du projet

```
twool-labs/
├── electron/                  # Configuration Electron
│   ├── main.js                # Point d'entrée Electron
│   ├── preload.js             # Script de préchargement
│   └── menu.js                # Configuration du menu
├── pages/                     # Pages Next.js
│   ├── index.js               # Dashboard
│   ├── modeling.js            # Page de modélisation
│   └── ...
├── components/                # Composants React
│   ├── Layout/                # Mise en page principale
│   ├── Modeling/              # Composants de modélisation
│   │   ├── Nodes/             # Types de nœuds
│   │   |   ├── DecisionNode.js
│   │   |   ├── EventNode.js
│   │   |   ├── FormulaNode.js
│   │   |   ├── ScenarioNode.js
│   │   |   └── TaskNode.js
│   │   ├── Canvas.js          # Zone de dessin
│   │   └── ...
│   └── ...
├── styles/                    # Fichiers CSS
├── public/                    # Fichiers statiques
├── backend/                   # API FastAPI
│   ├── app/                   
│   │   ├── main.py            # Point d'entrée
│   │   ├── routers/           # Routes API
│   │   ├── models/            # Modèles de données
│   │   └── services/          # Services métier
│   └── ...
├── package.json               # Configuration npm
├── next.config.js             # Configuration Next.js
└── README.md                  # Documentation
```

### Conventions de code

- **JavaScript/React**: Utilisation de fonctions React et de hooks
- **Python**: Suivre les conventions PEP 8
- **Commits**: Format "type(scope): description" (ex: "feat(modeling): add decision node")

## 🔄 Modélisation des processus

### Types de nœuds

1. **Tâche (`TaskNode`)** 
   - Représente une activité à effectuer
   - Propriétés: durée, coût, assignation

2. **Décision (`DecisionNode`)**
   - Représente un point de branchement conditionnel
   - Sorties: Oui, Non, Autre

3. **Événement (`EventNode`)**
   - Représente un début, une fin ou un événement intermédiaire
   - Types: Début, Intermédiaire, Début autre workflow, Fin

4. **Formule (`FormulaNode`)**
   - Permet d'établir des paramètres ou d'effectuer n'importe quel calcul
   - Le calcul est disponible dans une variable dans tout le workflow
   - Tout type de calculs et fonctions pour effectuer des moyennes, tendances, arrondis, etc.

5. **Scénario (`ScenarioNode`)**
   - Représente un ensemble de paramètres de scénario
   - Sera utilisé lors de la simulation du workflow

### Connexions

Les connexions entre les nœuds peuvent être personnalisées:
- Étiquette descriptive
- Style (couleur, épaisseur)
- Animation de flux

### Simulation

La simulation d'un processus:
1. Parcourt le graphe de nœuds du début à la fin
2. Calcule la durée et le coût estimés
3. Identifie les goulots d'étranglement
4. Génère des métriques pour l'analyse

### Optimisations

L'optimisation pour chaque workflow est généré par l'agent IA développé par nos soins :
1. Récupère la ou les simulations
2. Identifie les éléments à corriger du workflow
3. Lance une simulation avec la correction
5. Génère des métriques pour l'analyse

## 🌐 API

L'API REST de Twool Labs est accessible en développement à l'adresse `http://127.0.0.1:8000/api`.

### Points d'entrée principaux

- `/api/processes` - Gestion des processus modélisés
- `/api/simulations` - Exécution et récupération des simulations
- `/api/optimizations` - Suggestions d'optimisation IA

Consultez la documentation Swagger UI complète à l'adresse `http://127.0.0.1:8000/docs` en mode développement.

---

Développé avec ❤️ par Tanguy Gibrat

Pour toute question ou suggestion, contactez-nous à [hello@tanguygibrat.fr](mailto:hello@tanguygibrat.fr)