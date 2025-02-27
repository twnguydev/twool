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
