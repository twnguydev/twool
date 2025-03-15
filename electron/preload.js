const { contextBridge, ipcRenderer } = require('electron');

// Expose une API sécurisée aux processus de rendu
contextBridge.exposeInMainWorld('electron', {
  // API pour communiquer avec le backend FastAPI
  apiRequest: async (options) => {
    try {
      const { endpoint, method, data } = options;
      
      // Utiliser le canal IPC pour faire des requêtes API via le processus principal
      return await ipcRenderer.invoke('api-request', { endpoint, method, data });
    } catch (error) {
      console.error('Erreur lors de la requête API:', error);
      throw error;
    }
  },
  
  // Version de l'application
  appVersion: process.env.npm_package_version,
  
  // API pour les mises à jour
  updates: {
    // Vérifier les mises à jour disponibles
    checkForUpdates: async () => {
      try {
        return await ipcRenderer.invoke('check-for-updates');
      } catch (error) {
        console.error('Erreur lors de la vérification des mises à jour:', error);
        throw error;
      }
    },
    
    // Télécharger la mise à jour
    downloadUpdate: async () => {
      try {
        return await ipcRenderer.invoke('download-update');
      } catch (error) {
        console.error('Erreur lors du téléchargement de la mise à jour:', error);
        throw error;
      }
    },
    
    // Écouter les événements de mise à jour
    onUpdateChecking: (callback) => {
      const eventHandler = () => callback();
      ipcRenderer.on('update-checking', eventHandler);
      return () => ipcRenderer.removeListener('update-checking', eventHandler);
    },
    
    onUpdateAvailable: (callback) => {
      const eventHandler = (_, info) => callback(info);
      ipcRenderer.on('update-available', eventHandler);
      return () => ipcRenderer.removeListener('update-available', eventHandler);
    },
    
    onUpdateNotAvailable: (callback) => {
      const eventHandler = (_, info) => callback(info);
      ipcRenderer.on('update-not-available', eventHandler);
      return () => ipcRenderer.removeListener('update-not-available', eventHandler);
    },
    
    onUpdateDownloading: (callback) => {
      const eventHandler = () => callback();
      ipcRenderer.on('update-downloading', eventHandler);
      return () => ipcRenderer.removeListener('update-downloading', eventHandler);
    },
    
    onUpdateDownloadProgress: (callback) => {
      const eventHandler = (_, progressObj) => callback(progressObj);
      ipcRenderer.on('update-download-progress', eventHandler);
      return () => ipcRenderer.removeListener('update-download-progress', eventHandler);
    },
    
    onUpdateDownloaded: (callback) => {
      const eventHandler = (_, info) => callback(info);
      ipcRenderer.on('update-downloaded', eventHandler);
      return () => ipcRenderer.removeListener('update-downloaded', eventHandler);
    },
    
    onUpdateError: (callback) => {
      const eventHandler = (_, error) => callback(error);
      ipcRenderer.on('update-error', eventHandler);
      return () => ipcRenderer.removeListener('update-error', eventHandler);
    }
  }
});