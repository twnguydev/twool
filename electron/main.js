const { app, BrowserWindow, ipcMain, dialog, net } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const electronNext = require('electron-next');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// Configuration des logs
log.transports.file.level = 'info';
log.info('Application démarrant...');

// Configuration de l'auto-updater
autoUpdater.logger = log;
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// URL du serveur API
const API_BASE_URL = isDev 
  ? 'http://localhost:8000' 
  : 'https://api.twool.fr';

// Configuration pour chaque plateforme
if (process.platform === 'darwin') {
  // macOS
  autoUpdater.setFeedURL({
    provider: 'generic',
    url: `${API_BASE_URL}/api/updates`,
    channel: 'latest'
  });
} else if (process.platform === 'win32') {
  // Windows
  autoUpdater.setFeedURL({
    provider: 'generic',
    url: `${API_BASE_URL}/api/updates`,
    channel: 'latest'
  });
} else {
  // Linux
  autoUpdater.setFeedURL({
    provider: 'generic',
    url: `${API_BASE_URL}/api/updates`,
    channel: 'latest'
  });
}

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

  mainWindow.setTitle('Twool Labs by JLC Consulting');

  const baseUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../out')}`;

  const loginUrl = isDev
    ? `${baseUrl}/auth/login`
    : `${baseUrl}/auth/login.html`;
  
  mainWindow.loadURL(loginUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  if (!isDev) {
    setTimeout(() => {
      checkForUpdatesWithApi(mainWindow);
    }, 3000);
  }

  return mainWindow;
}

// Gestion des mises à jour via electron-updater
function checkForUpdates(mainWindow) {
  log.info('Vérification des mises à jour avec electron-updater...');
  
  // Notifier le renderer lorsque la vérification commence
  mainWindow.webContents.send('update-checking');
  
  autoUpdater.checkForUpdates().catch(err => {
    log.error('Erreur lors de la vérification des mises à jour:', err);
    mainWindow.webContents.send('update-error', err.message);
  });
}

// Gestion des mises à jour via notre API
async function checkForUpdatesWithApi(mainWindow) {
  try {
    log.info('Vérification des mises à jour avec l\'API personnalisée...');
    mainWindow.webContents.send('update-checking');
    
    // Déterminer la plateforme et la version actuelle
    const currentVersion = app.getVersion();
    const platform = process.platform === 'win32' 
      ? 'win' 
      : (process.platform === 'darwin' ? 'mac' : 'linux');
    
    // Utiliser l'API net d'Electron pour contacter notre API FastAPI
    const request = net.request({
      method: 'GET',
      url: `${API_BASE_URL}/api/updates?platform=${platform}&current_version=${currentVersion}`
    });
    
    request.on('response', (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk.toString();
      });
      
      response.on('end', () => {
        try {
          const updateInfo = JSON.parse(data);
          
          if (updateInfo.update_available) {
            // Informer l'utilisateur qu'une mise à jour est disponible
            log.info(`Mise à jour disponible: ${updateInfo.version}`);
            mainWindow.webContents.send('update-available', updateInfo);
            
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Mise à jour disponible',
              message: `La version ${updateInfo.version} est disponible. Voulez-vous la télécharger maintenant ?`,
              buttons: ['Télécharger', 'Plus tard']
            }).then(result => {
              if (result.response === 0) {
                mainWindow.webContents.send('update-downloading');
                
                // Configurer l'URL du téléchargement
                const downloadUrl = updateInfo.download_url || `${API_BASE_URL}${updateInfo.download_url}`;
                log.info(`URL de téléchargement: ${downloadUrl}`);
                
                // Utiliser autoUpdater pour le téléchargement
                autoUpdater.downloadUpdate().catch(err => {
                  log.error('Erreur lors du téléchargement de la mise à jour:', err);
                  mainWindow.webContents.send('update-error', err.message);
                });
              }
            });
          } else {
            log.info('Aucune mise à jour disponible');
            mainWindow.webContents.send('update-not-available');
          }
        } catch (error) {
          log.error('Erreur lors du parsing de la réponse:', error);
          mainWindow.webContents.send('update-error', error.message);
        }
      });
    });
    
    request.on('error', (error) => {
      log.error('Erreur de requête API:', error);
      mainWindow.webContents.send('update-error', error.message);
    });
    
    request.end();
  } catch (error) {
    log.error('Erreur lors de la vérification des mises à jour:', error);
    mainWindow.webContents.send('update-error', error.message);
  }
}

// Événements de l'autoUpdater
autoUpdater.on('checking-for-update', () => {
  log.info('Vérification des mises à jour en cours...');
});

autoUpdater.on('update-available', (info) => {
  log.info('Mise à jour disponible:', info);
  const windows = BrowserWindow.getAllWindows();
  if (windows.length > 0) {
    windows[0].webContents.send('update-available', {
      version: info.version,
      releaseNotes: info.releaseNotes
    });
  }
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Aucune mise à jour disponible');
  const windows = BrowserWindow.getAllWindows();
  if (windows.length > 0) {
    windows[0].webContents.send('update-not-available');
  }
});

autoUpdater.on('download-progress', (progressObj) => {
  const windows = BrowserWindow.getAllWindows();
  if (windows.length > 0) {
    windows[0].webContents.send('update-download-progress', progressObj);
  }
  log.info(`Téléchargement: ${progressObj.percent}%`);
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Mise à jour téléchargée');
  const windows = BrowserWindow.getAllWindows();
  if (windows.length > 0) {
    windows[0].webContents.send('update-downloaded');
    
    // Proposer l'installation immédiate
    dialog.showMessageBox(windows[0], {
      type: 'info',
      title: 'Installation de la mise à jour',
      message: 'La mise à jour a été téléchargée. L\'application va redémarrer pour l\'installer.',
      buttons: ['Installer maintenant', 'Installer plus tard']
    }).then(result => {
      if (result.response === 0) {
        // Installer et redémarrer
        autoUpdater.quitAndInstall(false, true);
      }
    });
  }
});

autoUpdater.on('error', (err) => {
  log.error('Erreur avec l\'auto-updater:', err);
  const windows = BrowserWindow.getAllWindows();
  if (windows.length > 0) {
    windows[0].webContents.send('update-error', err.message);
  }
});

// Gestion des événements IPC pour les mises à jour
ipcMain.handle('check-for-updates', async () => {
  const mainWindow = BrowserWindow.getAllWindows()[0];
  if (mainWindow) {
    checkForUpdatesWithApi(mainWindow);
  }
  return { success: true };
});

ipcMain.handle('download-update', async () => {
  autoUpdater.downloadUpdate().catch(err => {
    log.error('Erreur lors du téléchargement de la mise à jour:', err);
    return { success: false, error: err.message };
  });
  return { success: true };
});

// Démarrage de l'application
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

// Communication IPC (Inter-Process Communication) pour l'API
ipcMain.handle('api-request', async (event, { endpoint, method, data }) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    log.info(`API Request: ${method} ${url}`);
    
    return new Promise((resolve, reject) => {
      const request = net.request({
        method,
        url,
      });
      
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
        log.error(`API Request Error: ${error.message}`);
        reject(error);
      });
      
      if (data && (method === 'POST' || method === 'PUT')) {
        request.write(JSON.stringify(data));
      }
      
      request.end();
    });
  } catch (error) {
    log.error(`API Request Failed: ${error.message}`);
    return { success: false, error: error.message };
  }
});