// utils/platform.js

/**
 * Détecte si l'application s'exécute dans un environnement Electron
 * @returns {boolean} true si dans Electron, false sinon
 */
export const isElectron = () => {
  if (typeof window === 'undefined') {
    return false; // SSR (Server-Side Rendering)
  }
  
  // Vérifier si window.electron existe (défini par votre preload.js)
  if (window.electron) {
    return true;
  }
  
  // Méthode alternative : vérifier l'user agent
  if (window.navigator.userAgent.toLowerCase().indexOf('electron') > -1) {
    return true;
  }
  
  // Rechercher d'autres indices qu'on est dans Electron
  if (window.process && window.process.type) {
    return true;
  }
  
  return false;
};

/**
 * Détecte si l'application est en cours d'exécution en mode développement
 * @returns {boolean} true si en développement, false sinon
 */
export const isDevelopment = () => {
  if (typeof process === 'undefined') {
    return false;
  }
  
  return process.env.NODE_ENV === 'development';
};

/**
 * Vérifie si nous sommes sur la landing page
 * @param {string} pathname - Le chemin actuel (ex: router.pathname)
 * @returns {boolean} true si c'est la landing page
 */
export const isLandingPage = (pathname) => {
  return pathname === '/';
};