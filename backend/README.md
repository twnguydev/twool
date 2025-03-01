# Twool Labs API

API pour la plateforme Twool Labs Digital Twin avec gestion des workflows, simulations, IA et abonnements.

## Structure du projet

```
.
├── app
│   ├── __init__.py
│   ├── database.py
│   ├── main.py
│   ├── models
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── simulation.py
│   │   ├── optimization.py
│   │   ├── flow_ia_analysis.py
│   │   ├── user.py
│   │   ├── company.py
│   │   ├── workflow.py        # Modèle principal pour les workflows
│   │   ├── subscription.py
│   │   └── license.py
│   ├── routers
│   │   ├── __init__.py
│   │   ├── simulations.py
│   │   ├── optimizations.py
│   │   ├── flow_ia.py
│   │   ├── users.py
│   │   ├── companies.py
│   │   ├── subscriptions.py
│   │   └── workflows.py       # Point d'entrée principal pour les workflows
│   ├── services
│   │   ├── __init__.py
│   │   ├── database.py
│   │   ├── simulation_service.py
│   │   ├── optimization_service.py
│   │   ├── flow_ia_service.py
│   │   ├── user_service.py
│   │   ├── company_service.py
│   │   ├── subscription_service.py
│   │   ├── workflow_service.py
│   │   └── prompts
│   │       ├── system-prompt-gpt4o.md
│   │       └── user-prompt-gpt4o.md
│   └── utils
├── migrations
│   ├── README
│   ├── env.py
│   ├── script.py.mako
│   └── versions
│       ├── 20250301_initial.py
│       ├── 20250301_accounts.py
│       └── 20250301_workflow_refactor.py
├── alembic.ini
├── requirements.txt
└── .env
```

## Technologies utilisées

- FastAPI - Framework API moderne et performant
- SQLAlchemy - ORM (Object-Relational Mapping)
- Alembic - Gestion des migrations de base de données
- MySQL - Base de données relationnelle
- GPT-4o via OpenAI API - Analyse IA des workflows
- JWT - Authentification et autorisation

## Installation

1. Cloner le dépôt :
   ```
   git clone https://github.com/votre-username/twool-labs-api.git
   cd twool-labs-api
   ```

2. Créer un environnement virtuel :
   ```
   python -m venv venv
   source venv/bin/activate  # Pour Linux/MacOS
   venv\Scripts\activate     # Pour Windows
   ```

3. Installer les dépendances :
   ```
   pip install -r requirements.txt
   ```

4. Configurer les variables d'environnement :
   ```
   cp .env.example .env
   # Éditer le fichier .env avec vos configurations
   ```

5. Initialiser la base de données :
   ```
   alembic upgrade head
   ```

## Démarrage du serveur

```
uvicorn app.main:app --reload
```

L'API sera disponible à l'adresse : http://localhost:8000

Documentation API : http://localhost:8000/docs

## Architecture simplifiée

Le modèle **Workflow** est maintenant au centre de l'architecture. Il contient directement :
- Les données complètes du workflow (nœuds et arêtes)
- Les métadonnées (nom, description, propriétaire)
- Des relations avec simulations, optimisations et analyses IA

Cette architecture simplifiée offre plusieurs avantages :
- Réduction de la complexité (plus besoin de tables séparées pour Process)
- Meilleure cohérence des données
- Simplification des requêtes et des opérations

## Fonctionnalités principales

### 1. Gestion des workflows et simulations
- Création et édition de workflows complets
- Simulations et tests de stress
- Optimisation automatique
- Analyse par IA (FlowIA)

### 2. Gestion des comptes et authentification
- Inscription et connexion des utilisateurs
- Gestion des profils
- Authentification JWT
- Gestion des rôles (Solo, Admin, Manager, Consultant)

### 3. Gestion des entreprises
- Création d'entreprises
- Ajout/suppression d'utilisateurs
- Gestion des droits

### 4. Gestion des abonnements
- Abonnements Solo et Entreprise
- Paiements mensuels ou annuels
- Gestion des licences
- Limites selon les types d'abonnements

## Points d'API

### Gestion des workflows
- `POST /api/workflows/create` - Créer un nouveau workflow
- `GET /api/workflows/{user_id}` - Récupérer les workflows d'un utilisateur
- `GET /api/workflows/company/{company_id}` - Récupérer les workflows d'une entreprise
- `GET /api/workflows/detail/{workflow_id}` - Récupérer un workflow spécifique
- `PUT /api/workflows/update/{workflow_id}` - Mettre à jour un workflow
- `DELETE /api/workflows/delete/{workflow_id}` - Supprimer un workflow

### Simulations
- `POST /api/simulations/` - Lancer une nouvelle simulation
- `GET /api/simulations/{simulation_id}` - Récupérer les résultats d'une simulation
- `GET /api/simulations/by-workflow/{workflow_id}` - Récupérer les simulations d'un workflow
- `PUT /api/simulations/{simulation_id}` - Mettre à jour une simulation
- `DELETE /api/simulations/{simulation_id}` - Supprimer une simulation

### Optimisations
- `POST /api/optimizations/` - Générer des optimisations
- `GET /api/optimizations/{optimization_id}` - Récupérer les résultats d'une optimisation
- `GET /api/optimizations/by-workflow/{workflow_id}` - Récupérer les optimisations d'un workflow
- `GET /api/optimizations/by-simulation/{simulation_id}` - Récupérer les optimisations d'une simulation
- `PUT /api/optimizations/{optimization_id}` - Mettre à jour une optimisation
- `DELETE /api/optimizations/{optimization_id}` - Supprimer une optimisation

### FlowIA
- `POST /api/flow-ia/analyze` - Analyser un workflow avec l'IA
- `GET /api/flow-ia/{analysis_id}` - Récupérer une analyse spécifique
- `GET /api/flow-ia/by-workflow/{workflow_id}` - Récupérer les analyses d'un workflow
- `DELETE /api/flow-ia/{analysis_id}` - Supprimer une analyse

### Utilisateurs
- `POST /api/users/register` - Créer un compte utilisateur
- `POST /api/users/login` - Se connecter
- `GET /api/users/profile` - Récupérer le profil utilisateur
- `PUT /api/users/update` - Mettre à jour le profil
- `DELETE /api/users/delete` - Supprimer le compte

### Entreprises
- `POST /api/companies/create` - Créer une entreprise
- `GET /api/companies/{company_id}` - Récupérer les informations d'une entreprise
- `POST /api/companies/add-user` - Ajouter un utilisateur à une entreprise
- `DELETE /api/companies/remove-user/{user_id}` - Retirer un utilisateur d'une entreprise
- `GET /api/companies/users/{company_id}` - Récupérer les utilisateurs d'une entreprise

### Abonnements
- `POST /api/subscriptions/create` - Créer un abonnement
- `GET /api/subscriptions/{user_id}` - Récupérer l'abonnement d'un utilisateur
- `POST /api/subscriptions/cancel` - Annuler un abonnement
- `POST /api/subscriptions/renew` - Renouveler un abonnement
- `POST /api/subscriptions/license/validate` - Valider une licence

## Types d'abonnements

### Compte Solo
- Limité à 3 workflows sauvegardés
- Stockage limité à 500 Mo
- Abonnement mensuel ou annuel

### Compte Entreprise
- Workflows illimités
- Multi-utilisateurs avec rôles (Admin, Manager, Consultant)
- Stockage étendu (5 Go)
- Abonnement mensuel ou annuel

## Format des données de workflow

Le workflow suit un format JSON contenant des nœuds (nodes) et des arêtes (edges) :

```json
{
  "name": "Nom du workflow",
  "description": "Description du workflow",
  "nodes": [
    {
      "id": "node-1",
      "type": "event",
      "position": { "x": 100, "y": 100 },
      "data": { /* données spécifiques au nœud */ }
    },
    // Autres nœuds...
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2",
      "sourceHandle": "source-bottom",
      "targetHandle": "target-top"
    },
    // Autres arêtes...
  ],
  "createdAt": "2025-03-01T08:07:08.741Z"
}
```

## Architecture du code

L'API suit une architecture en couches :

1. **Couche Modèle** (`app/models/`) - Définit la structure des données et leur mapping vers la base de données
2. **Couche Service** (`app/services/`) - Contient la logique métier et les interactions avec les modèles
3. **Couche Router** (`app/routers/`) - Gère les points d'entrée de l'API et la validation des données
4. **Couche Base de données** (`app/database.py`) - Fournit l'accès à la base de données

## Gestion des migrations

- Créer une nouvelle migration après modification des modèles :
  ```
  alembic revision --autogenerate -m "Description de la migration"
  ```

- Appliquer les migrations :
  ```
  alembic upgrade head
  ```

- Revenir à une version spécifique :
  ```
  alembic downgrade <revision_id>
  ```

## Développement

### Bonnes pratiques
- Utilisez toujours les services pour interagir avec les modèles
- Créez des migrations pour chaque modification de modèle
- Suivez les conventions de nommage existantes
- Documentez les nouveaux endpoints et services

### Ajout d'une nouvelle fonctionnalité
1. Définissez les modèles de données nécessaires dans `app/models/`
2. Créez ou mettez à jour les services dans `app/services/`
3. Définissez les endpoints dans les routeurs `app/routers/`
4. Générez une migration avec Alembic si nécessaire
5. Testez les nouveaux endpoints

## Sécurité

- Authentification JWT pour tous les endpoints (sauf login/register)
- Hachage des mots de passe avec bcrypt
- Vérification des permissions basée sur les rôles
- Validation des licences

## Déploiement

### Pour le développement
```
uvicorn app.main:app --reload
```

### Pour la production
```
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Avec Docker
```
docker build -t twool-labs-api .
docker run -d -p 8000:8000 twool-labs-api
```

## Licence

Copyright © 2025 Twool Labs. Tous droits réservés.