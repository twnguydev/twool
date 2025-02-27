#!/bin/bash
# Structure initiale du projet Twool Labs

# Initialisation du package.json global
npm init -y

# Modification du package.json pour inclure les scripts Electron
cat > package.json << 'EOF'
{
  "name": "twool-labs",
  "version": "0.1.0",
  "description": "Digital Twin Platform for Process Optimization",
  "main": "electron/main.js",
  "scripts": {
    "dev": "concurrently \"npm run dev:next\" \"npm run dev:electron\"",
    "dev:next": "next dev",
    "dev:electron": "electron .",
    "build": "next build && electron-builder",
    "start": "next start",
    "lint": "next lint"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "electron-is-dev": "^2.0.0",
    "electron-next": "^3.1.5",
    "next": "^13.4.19",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "reactflow": "^11.8.3"
  },
  "devDependencies": {
    "concurrently": "^8.2.1",
    "electron": "^26.1.0",
    "electron-builder": "^24.6.4",
    "tailwindcss": "^3.3.3",
    "postcss": "^8.4.29",
    "autoprefixer": "^10.4.15"
  },
  "build": {
    "appId": "com.twool.labs",
    "productName": "Twool Labs",
    "mac": {
      "category": "public.app-category.business"
    },
    "directories": {
      "output": "dist"
    },
    "files": [
      "package.json",
      "electron/**/*",
      ".next/**/*",
      "node_modules/**/*",
      "public/**/*"
    ]
  }
}
EOF

# Création des dossiers principaux
mkdir -p electron frontend backend public

# Configuration Electron
mkdir -p electron
cat > electron/main.js << 'EOF'
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const electronNext = require('electron-next');

// Création de la fenêtre principale
async function createWindow() {
  // Attendre que Next.js soit prêt (en mode développement)
  await electronNext({
    dir: path.join(__dirname, '../')
  });
  
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const url = isDev
    ? 'http://localhost:3000' // Serveur de développement Next.js
    : `file://${path.join(__dirname, '../.next/out/index.html')}`;
  
  mainWindow.loadURL(url);
  
  // Ouvrir les DevTools en mode développement
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Communication IPC (Inter-Process Communication)
ipcMain.handle('api-request', async (event, { endpoint, method, data }) => {
  // Ici, nous utiliserons cette méthode pour communiquer avec l'API FastAPI
  console.log(`API Request: ${method} ${endpoint}`);
  return { success: true, message: 'API mock response' };
});
EOF

cat > electron/preload.js << 'EOF'
const { contextBridge, ipcRenderer } = require('electron');

// Expose une API sécurisée aux processus de rendu
contextBridge.exposeInMainWorld('electron', {
  // API pour communiquer avec le backend FastAPI via Electron
  apiRequest: (options) => ipcRenderer.invoke('api-request', options),
  
  // Version de l'application
  appVersion: process.env.npm_package_version
});
EOF

# Configuration Next.js
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configuration pour Electron
  images: {
    unoptimized: true
  },
  // Indiquer à Next.js de traiter les fichiers à la racine du projet
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ignorer les modules spécifiques à Node.js
      config.resolve.fallback = {
        fs: false,
        path: false,
        module: false,
      };
    }
    return config;
  }
};

module.exports = nextConfig;
EOF

# Création du dossier frontend avec la structure Next.js
mkdir -p frontend/pages frontend/components frontend/hooks frontend/context frontend/styles public
# Page principale
cat > frontend/pages/index.js << 'EOF'
import React from 'react';
import Layout from '../components/Layout/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Twool Labs Dashboard</h1>
        <p className="mt-4">Welcome to Twool Labs, your Digital Twin Platform for Process Optimization.</p>
      </div>
    </Layout>
  );
}
EOF

# Pages principales
cat > frontend/pages/_app.js << 'EOF'
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
EOF

cat > frontend/pages/modeling.js << 'EOF'
import React from 'react';
import Layout from '../components/Layout/Layout';
import ProcessCanvas from '../components/Modeling/Canvas';

export default function Modeling() {
  return (
    <Layout>
      <div className="h-full flex flex-col">
        <h1 className="text-2xl font-bold p-4">Process Modeling</h1>
        <div className="flex-1">
          <ProcessCanvas />
        </div>
      </div>
    </Layout>
  );
}
EOF

# Structure de base des composants
mkdir -p frontend/components/Layout frontend/components/Modeling/Nodes frontend/components/UI

# Composant Layout
cat > frontend/components/Layout/Layout.js << 'EOF'
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
EOF

cat > frontend/components/Layout/Sidebar.js << 'EOF'
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();
  
  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Process Modeling', path: '/modeling' },
    { name: 'Simulations', path: '/simulations' },
    { name: 'IA Optimizations', path: '/optimizations' },
    { name: 'API Connections', path: '/connections' },
    { name: 'Settings', path: '/settings' }
  ];
  
  return (
    <aside className="w-64 bg-gray-800 text-white">
      <div className="p-4 text-xl font-bold">
        Twool Labs
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link href={item.path} key={item.path}>
            <div className={`p-4 hover:bg-gray-700 cursor-pointer ${
              router.pathname === item.path ? 'bg-blue-600' : ''
            }`}>
              {item.name}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
EOF

cat > frontend/components/Layout/Header.js << 'EOF'
import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow h-16 flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        <div className="text-lg font-semibold">
          Digital Twin Platform
        </div>
        <div className="flex items-center">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md mr-4">
            New Project
          </button>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm">👤</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
EOF

# Fichiers CSS
cat > frontend/styles/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}

html, body, #__next {
  height: 100%;
}
EOF

# Fichier de configuration Tailwind
cat > tailwind.config.js << 'EOF'
module.exports = {
  content: [
    "./frontend/pages/**/*.{js,ts,jsx,tsx}",
    "./frontend/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Configuration Backend FastAPI
mkdir -p backend/app/routers backend/app/models backend/app/services backend/app/utils

# Fichier principal FastAPI
cat > backend/app/main.py << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import processes, simulations, optimizations

app = FastAPI(title="Twool Labs API", description="API for Twool Labs Digital Twin Platform")

# Configuration CORS
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routeurs
app.include_router(processes.router, prefix="/api/processes", tags=["processes"])
app.include_router(simulations.router, prefix="/api/simulations", tags=["simulations"])
app.include_router(optimizations.router, prefix="/api/optimizations", tags=["optimizations"])

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
EOF

# Création des fichiers de routage
cat > backend/app/routers/processes.py << 'EOF'
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter()

# Modèles de données
class ProcessNode(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

class ProcessEdge(BaseModel):
    id: str
    source: str
    target: str
    type: str = None
    animated: bool = False
    data: Dict[str, Any] = None

class ProcessModel(BaseModel):
    name: str
    nodes: List[ProcessNode]
    edges: List[ProcessEdge]

# Endpoints
@router.get("/")
async def get_all_processes():
    """Récupère tous les processus"""
    # Note: Dans un vrai MVP, ceci lirait de la base de données
    return {"processes": []}

@router.post("/")
async def create_process(process: ProcessModel):
    """Crée un nouveau processus"""
    # Note: Dans un vrai MVP, ceci sauvegarderait dans la base de données
    return {"id": "new-process-id", "name": process.name}

@router.get("/{process_id}")
async def get_process(process_id: str):
    """Récupère un processus spécifique"""
    # Note: Dans un vrai MVP, ceci lirait de la base de données
    if process_id != "test-process":
        raise HTTPException(status_code=404, detail="Process not found")
    return {"id": process_id, "name": "Test Process"}

@router.put("/{process_id}")
async def update_process(process_id: str, process: ProcessModel):
    """Met à jour un processus existant"""
    # Note: Dans un vrai MVP, ceci mettrait à jour la base de données
    return {"id": process_id, "name": process.name}

@router.delete("/{process_id}")
async def delete_process(process_id: str):
    """Supprime un processus"""
    # Note: Dans un vrai MVP, ceci supprimerait de la base de données
    return {"status": "success"}
EOF

cat > backend/app/routers/simulations.py << 'EOF'
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter()

# Modèles de données
class SimulationRequest(BaseModel):
    process_id: str
    parameters: Dict[str, Any] = {}

class SimulationResult(BaseModel):
    id: str
    process_id: str
    metrics: Dict[str, Any]
    details: List[Dict[str, Any]]

# Endpoints
@router.post("/")
async def run_simulation(simulation: SimulationRequest):
    """Lance une nouvelle simulation"""
    # Note: Dans un vrai MVP, ceci lancerait une tâche de simulation
    return {
        "id": "sim-123",
        "status": "started",
        "process_id": simulation.process_id
    }

@router.get("/{simulation_id}")
async def get_simulation_results(simulation_id: str):
    """Récupère les résultats d'une simulation"""
    # Note: Dans un vrai MVP, ceci lirait de la base de données
    return {
        "id": simulation_id,
        "process_id": "test-process",
        "status": "completed",
        "metrics": {
            "total_time": 120,
            "total_cost": 500,
            "bottlenecks": ["task-3"]
        },
        "details": [
            {"node_id": "node-1", "execution_time": 10, "cost": 50},
            {"node_id": "node-2", "execution_time": 30, "cost": 150},
            {"node_id": "node-3", "execution_time": 80, "cost": 300}
        ]
    }
EOF

cat > backend/app/routers/optimizations.py << 'EOF'
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter()

# Modèles de données
class OptimizationRequest(BaseModel):
    process_id: str
    simulation_id: str = None
    parameters: Dict[str, Any] = {}

class OptimizationSuggestion(BaseModel):
    id: str
    type: str
    node_id: str = None
    description: str
    impact: Dict[str, float]
    details: Dict[str, Any] = {}

# Endpoints
@router.post("/")
async def generate_optimizations(request: OptimizationRequest):
    """Génère des suggestions d'optimisation pour un processus"""
    # Note: Dans un vrai MVP, ceci utiliserait un algorithme d'optimisation simple
    return {
        "id": "opt-123",
        "status": "processing",
        "process_id": request.process_id
    }

@router.get("/{optimization_id}")
async def get_optimization_results(optimization_id: str):
    """Récupère les résultats d'une optimisation"""
    # Note: Dans un vrai MVP, ceci lirait de la base de données
    return {
        "id": optimization_id,
        "process_id": "test-process",
        "status": "completed",
        "suggestions": [
            {
                "id": "sug-1",
                "type": "automation",
                "node_id": "node-2",
                "description": "Cette tâche manuelle pourrait être automatisée",
                "impact": {"time_reduction": 20, "cost_reduction": 100}
            },
            {
                "id": "sug-2",
                "type": "parallel",
                "node_id": "node-3",
                "description": "Ces tâches pourraient être exécutées en parallèle",
                "impact": {"time_reduction": 30, "cost_reduction": 0}
            }
        ]
    }
EOF

# Fichier d'initialisation Python
cat > backend/app/__init__.py << 'EOF'
# Init package
EOF

# Fichier de configuration MySQL
cat > backend/app/database.py << 'EOF'
import mysql.connector
from mysql.connector import Error

class Database:
    def __init__(self, host="localhost", database="twool", user="root", password=""):
        self.host = host
        self.database = database
        self.user = user
        self.password = password
        self.connection = None
    
    def connect(self):
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                database=self.database,
                user=self.user,
                password=self.password
            )
            if self.connection.is_connected():
                return True
        except Error as e:
            print(f"Error while connecting to MySQL: {e}")
            return False
    
    def disconnect(self):
        if self.connection and self.connection.is_connected():
            self.connection.close()
    
    def execute_query(self, query, params=None):
        try:
            if not self.connection or not self.connection.is_connected():
                self.connect()
            
            cursor = self.connection.cursor(dictionary=True)
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            
            if query.lower().startswith("select"):
                result = cursor.fetchall()
                cursor.close()
                return result
            else:
                self.connection.commit()
                affected_rows = cursor.rowcount
                cursor.close()
                return affected_rows
        except Error as e:
            print(f"Error executing query: {e}")
            return None
EOF

# Fichier requirements pour Python
cat > backend/requirements.txt << 'EOF'
fastapi==0.103.1
uvicorn==0.23.2
mysql-connector-python==8.1.0
pydantic==2.3.0
python-multipart==0.0.6
python-dotenv==1.0.0
scikit-learn==1.3.0
pandas==2.1.0
EOF

# Création d'un fichier README
cat > README.md << 'EOF'
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
EOF

# Fichier .gitignore
cat > .gitignore << 'EOF'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build
/dist

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env.local
.env.development.local
.env.test.local
.env.production.local

# vercel
.vercel

# python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
*.egg-info/
.installed.cfg
*.egg

# virtual env
venv/
ENV/

# IDE
.idea/
.vscode/
*.swp
*.swo
EOF

echo "Projet Twool Labs initialisé avec succès !"
echo "Pour lancer le projet :"
echo "1. Installer les dépendances : npm install"
echo "2. Lancer le backend : cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000"
echo "3. Lancer le frontend+electron : npm run dev"