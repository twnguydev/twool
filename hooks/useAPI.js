import { useAuth } from '../context/auth-context';

// URL de base de l'API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

// Détection d'Electron
const isElectron = () => {
  return window && window.electron;
};

// Client API avec hooks React
export const useApi = () => {
  const { token, logout } = useAuth();

  // Options par défaut pour fetch
  const getDefaultOptions = () => {
    const options = {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
  
    return options;
  };

  // Fonction pour gérer les erreurs d'API
  const handleApiError = async (response) => {
    // Si status est 401 Unauthorized, déconnecter l'utilisateur
    if (response && response.status === 401) {
      logout();
      throw new Error('Session expirée, veuillez vous reconnecter');
    }

    // Récupérer le message d'erreur
    let errorMessage;
    try {
      if (response) {
        const data = await response.json();
        errorMessage = data.detail || 'Une erreur est survenue';
      } else {
        errorMessage = 'Une erreur est survenue';
      }
    } catch (e) {
      errorMessage = 'Une erreur est survenue';
    }

    throw new Error(errorMessage);
  };

  // Fonction de base pour faire des requêtes API (via Electron ou fetch)
  const apiRequest = async (endpoint, method = 'GET', data = null, customOptions = {}) => {
    try {
      let response;
      
      // Si nous sommes dans Electron, utiliser l'API exposée par preload.js
      if (isElectron()) {
        // Ajouter le token au data pour Electron
        const requestData = { endpoint, method, data };
        if (token) {
          requestData.token = token;
        }
        
        try {
          response = await window.electron.apiRequest(requestData);
          
          // Vérifier si la réponse contient une erreur 401
          if (response && response.status === 401) {
            logout();
            throw new Error('Session expirée, veuillez vous reconnecter');
          }
          
          return response;
        } catch (err) {
          throw err;
        }
      } 
      // Sinon, utiliser fetch standard
      else {
        const url = `${API_URL}${endpoint}`;
        const defaultOptions = getDefaultOptions();
        
        const options = {
          method,
          ...defaultOptions,
          ...customOptions
        };
        
        if (data && (method !== 'GET')) {
          options.body = JSON.stringify(data);
        }
        
        const fetchResponse = await fetch(url, options);
        
        if (!fetchResponse.ok) {
          return handleApiError(fetchResponse);
        }
        
        response = await fetchResponse.json();
        return response;
      }
    } catch (err) {
      throw err;
    }
  };

  // Méthodes HTTP
  const client = {
    // GET
    get: async (endpoint, options = {}) => {
      return apiRequest(endpoint, 'GET', null, options);
    },

    // POST
    post: async (endpoint, data, options = {}) => {
      return apiRequest(endpoint, 'POST', data, options);
    },

    // PUT
    put: async (endpoint, data, options = {}) => {
      return apiRequest(endpoint, 'PUT', data, options);
    },

    // DELETE
    delete: async (endpoint, options = {}) => {
      return apiRequest(endpoint, 'DELETE', null, options);
    },

    setDefaultHeaders: (key, value) => {
      getDefaultOptions().headers[key] = value;
    }
  };

  // Importer tous les services API
  const auth = require('./api/auth').default(client);
  const users = require('./api/users').default(client);
  const licenses = require('./api/licenses').default(client);
  const subscriptions = require('./api/subscriptions').default(client);
  const companies = require('./api/companies').default(client);
  const workflows = require('./api/workflows').default(client);
  const simulations = require('./api/simulations').default(client);
  const optimizations = require('./api/optimizations').default(client);
  const flowAnalysis = require('./api/flowAnalysis').default(client);

  // Retourner tous les services API
  return {
    client,
    apiRequest,
    auth,
    users,
    licenses,
    subscriptions,
    companies,
    workflows,
    simulations,
    optimizations,
    flowAnalysis
  };
};

export default useApi;