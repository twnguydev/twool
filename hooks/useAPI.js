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
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
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
