#!/bin/bash
# Mise à jour des configurations pour la structure plate

# 1. Mise à jour du package.json
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
    "build": "next build && next export && electron-builder",
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
      "out/**/*",
      "node_modules/**/*",
      "public/**/*"
    ]
  }
}
EOF

# 2. Mise à jour du fichier next.config.js
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Pour permettre l'exportation statique (nécessaire pour Electron)
  output: 'export',
  // Empêche l'optimisation des images qui pose problème avec l'exportation statique
  images: {
    unoptimized: true
  },
  // Important: Désactive le code côté serveur pour Electron
  experimental: {
    // Pour les versions plus récentes de Next
    isrMemoryCacheSize: 0,
  },
  // Configuration webpack pour Electron
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ignorer les modules spécifiques à Node.js dans le build client
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

# 3. Mise à jour du fichier electron/main.js
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
    : `file://${path.join(__dirname, '../out/index.html')}`; // Chemin vers le build exporté
  
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
  // Ici nous utiliserons cette méthode pour communiquer avec l'API FastAPI
  console.log(`API Request: ${method} ${endpoint}`);
  return { success: true, message: 'API mock response' };
});
EOF

# 4. Configuration d'un hook API pour communiquer avec le backend FastAPI
mkdir -p hooks
cat > hooks/useAPI.js << 'EOF'
import { useState, useCallback } from 'react';

// Hook personnalisé pour les appels API
export default function useAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Détermine si nous utilisons Electron ou un navigateur web
  const isElectron = () => {
    return window && window.electron;
  };

  // Fonction pour faire des requêtes API (via Electron ou fetch)
  const apiRequest = useCallback(async (endpoint, method = 'GET', data = null) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      // Si nous sommes dans Electron, utiliser l'API exposée par preload.js
      if (isElectron()) {
        response = await window.electron.apiRequest({
          endpoint,
          method,
          data
        });
      } 
      // Sinon, utiliser fetch standard
      else {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const url = `${baseURL}${endpoint}`;
        
        const options = {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: data ? JSON.stringify(data) : undefined,
        };
        
        const fetchResponse = await fetch(url, options);
        response = await fetchResponse.json();
      }
      
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    apiRequest,
    loading,
    error
  };
}
EOF

# 5. Mise à jour du Layout pour refléter la nouvelle structure
cat > components/Layout/Layout.js << 'EOF'
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

# 6. Correction du chemin d'import dans les fichiers pages
# pages/index.js
cat > pages/index.js << 'EOF'
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

# pages/modeling.js (si ce fichier existe)
if [ -f "pages/modeling.js" ]; then
cat > pages/modeling.js << 'EOF'
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
fi

# 7. Mise à jour du fichier de préchargement Electron pour inclure la communication avec l'API
cat > electron/preload.js << 'EOF'
const { contextBridge, ipcRenderer } = require('electron');
const { net } = require('electron');

// Expose une API sécurisée aux processus de rendu
contextBridge.exposeInMainWorld('electron', {
  // API pour communiquer avec le backend FastAPI
  apiRequest: async (options) => {
    const { endpoint, method, data } = options;
    
    // Utilisation du module net d'Electron pour les requêtes HTTP
    // C'est une alternative à ipcRenderer.invoke qui permet de communiquer directement
    // avec FastAPI depuis le processus de rendu
    const baseURL = 'http://localhost:8000/api';
    const url = `${baseURL}${endpoint}`;
    
    return new Promise((resolve, reject) => {
      const request = net.request({
        method,
        url,
        protocol: 'http:',
      });
      
      // Ajouter les headers
      request.setHeader('Content-Type', 'application/json');
      
      request.on('response', (response) => {
        let responseData = '';
        
        response.on('data', (chunk) => {
          responseData += chunk.toString();
        });
        
        response.on('end', () => {
          try {
            const parsedData = JSON.parse(responseData);
            resolve(parsedData);
          } catch (error) {
            resolve(responseData);
          }
        });
      });
      
      request.on('error', (error) => {
        reject(error);
      });
      
      // Envoyer les données si nécessaire
      if (data && (method === 'POST' || method === 'PUT')) {
        request.write(JSON.stringify(data));
      }
      
      request.end();
    });
  },
  
  // Version de l'application
  appVersion: process.env.npm_package_version
});
EOF

echo "Configurations mises à jour pour la structure plate !"
echo "Vous pouvez maintenant relancer avec: npm run dev"