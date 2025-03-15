import React, { useEffect, useState } from 'react';

const UpdateNotifier = () => {
  const [updateStatus, setUpdateStatus] = useState('idle'); // idle, checking, available, not-available, downloading, downloaded, error
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState('');
  const [isClient, setIsClient] = useState(false);

  // S'assurer que le code s'exécute uniquement côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Ne s'exécute que côté client après le premier rendu
    if (isClient) {
      // Vérifier si window.electron existe
      if (typeof window !== 'undefined' && window.electron) {
        setVersion(window.electron.appVersion || 'N/A');
      }

      // Configurer les écouteurs d'événements uniquement côté client
      if (typeof window !== 'undefined' && window.electron && window.electron.updates) {
        const removeListeners = [
          window.electron.updates.onUpdateChecking(() => {
            setUpdateStatus('checking');
          }),
          
          window.electron.updates.onUpdateAvailable((info) => {
            setUpdateStatus('available');
            setVersion(info?.version || 'N/A');
          }),
          
          window.electron.updates.onUpdateNotAvailable(() => {
            setUpdateStatus('not-available');
          }),
          
          window.electron.updates.onUpdateDownloading(() => {
            setUpdateStatus('downloading');
          }),
          
          window.electron.updates.onUpdateDownloadProgress((progressObj) => {
            setProgress(progressObj?.percent || 0);
          }),
          
          window.electron.updates.onUpdateDownloaded(() => {
            setUpdateStatus('downloaded');
          }),
          
          window.electron.updates.onUpdateError((errorMessage) => {
            setUpdateStatus('error');
            setError(errorMessage);
          })
        ];

        return () => {
          removeListeners.forEach(remove => remove && remove());
        };
      }
    }
  }, [isClient]); // Dépendance à isClient pour s'assurer que ce code s'exécute uniquement côté client

  const checkForUpdates = () => {
    if (typeof window !== 'undefined' && window.electron && window.electron.updates) {
      window.electron.updates.checkForUpdates();
    }
  };

  const downloadUpdate = () => {
    if (typeof window !== 'undefined' && window.electron && window.electron.updates) {
      window.electron.updates.downloadUpdate();
      setUpdateStatus('downloading');
    }
  };

  // Ne rien afficher pendant le rendu côté serveur ou en développement
  if (!isClient) {
    return null; // Retourne null pendant le rendu côté serveur
  }

  // Vérification côté client si electron est disponible
  if (typeof window === 'undefined' || !window.electron || 
     (typeof process !== 'undefined' && process.env.NODE_ENV === 'development')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm z-50">
      <div className="text-sm text-gray-600 mb-2">
        Version actuelle: {version}
      </div>
      
      {updateStatus === 'idle' && (
        <button 
          onClick={checkForUpdates}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          Vérifier les mises à jour
        </button>
      )}
      
      {updateStatus === 'checking' && (
        <div className="text-blue-500">Vérification des mises à jour...</div>
      )}
      
      {updateStatus === 'available' && (
        <div>
          <div className="text-green-500 mb-2">Une mise à jour est disponible!</div>
          <button 
            onClick={downloadUpdate}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
          >
            Télécharger la mise à jour
          </button>
        </div>
      )}
      
      {updateStatus === 'not-available' && (
        <div className="text-gray-500">
          Votre application est à jour.
          <button 
            onClick={checkForUpdates}
            className="ml-2 underline text-blue-500 text-sm"
          >
            Vérifier à nouveau
          </button>
        </div>
      )}
      
      {updateStatus === 'downloading' && (
        <div>
          <div className="text-blue-500 mb-2">Téléchargement en cours...</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-right mt-1">{Math.round(progress)}%</div>
        </div>
      )}
      
      {updateStatus === 'downloaded' && (
        <div className="text-green-500">
          Mise à jour téléchargée. L'application va redémarrer pour l'installer.
        </div>
      )}
      
      {updateStatus === 'error' && (
        <div>
          <div className="text-red-500 mb-2">Erreur: {error}</div>
          <button 
            onClick={checkForUpdates}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateNotifier;