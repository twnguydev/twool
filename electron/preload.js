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
