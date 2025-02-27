# Twool Labs

Digital Twin Platform for Process Optimization

## Structure du projet

Le projet est organisé en trois parties principales :

- **frontend**: Application Next.js pour l'interface utilisateur
- **backend**: API FastAPI pour la logique métier
- **electron**: Configuration Electron pour transformer l'application web en application de bureau

## Démarrage rapide

### Installation des dépendances

```bash
# Installer les dépendances Node.js
npm install

# Installer les dépendances Python
cd backend
pip install -r requirements.txt
cd ..
```

### Lancement en mode développement

```bash
# Dans un premier terminal - Lancer le backend FastAPI
cd backend
uvicorn app.main:app --reload --port 8000

# Dans un deuxième terminal - Lancer l'application Electron+Next.js
npm run dev
```

### Construction pour la production

```bash
# Construire l'application
npm run build
```

## Fonctionnalités MVP

- Modélisation des processus avec interface drag & drop
- Simulation des processus pour identifier les goulots d'étranglement
- Suggestions d'optimisation basées sur l'IA
- Connexions API simples pour l'intégration avec d'autres systèmes

## Technologies utilisées

- **Frontend**: Next.js, ReactFlow, TailwindCSS
- **Backend**: FastAPI, MySQL
- **Application**: Electron
