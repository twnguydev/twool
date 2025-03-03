import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

// Création du contexte d'authentification
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  loading: true
});

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Provider du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Vérifier si l'utilisateur est déjà authentifié au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = localStorage.getItem('twool_auth');
        
        if (authData) {
          const { token, user } = JSON.parse(authData);
          setUser(user);
          setToken(token);
          
          // Vérifier la validité du token (en production)
          // Exemple : appeler une API pour valider le token
          // const response = await fetch('/api/auth/validate', {
          //   headers: {
          //     'Authorization': `Bearer ${token}`
          //   }
          // });
          //
          // if (!response.ok) {
          //   throw new Error('Token invalide');
          // }
        }
      } catch (error) {
        console.error('Erreur d\'authentification:', error);
        localStorage.removeItem('twool_auth');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fonction de connexion
  const login = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    
    // Stocker les données d'authentification
    localStorage.setItem('twool_auth', JSON.stringify({
      token: tokenValue,
      user: userData
    }));
  };

  // Fonction de déconnexion
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('twool_auth');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        token,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// HOC pour les routes protégées
export const withAuth = (Component) => {
  const AuthenticatedComponent = (props) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.replace('/login');
      }
    }, [isAuthenticated, loading, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };

  return AuthenticatedComponent;
};