import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

// Création du contexte d'authentification
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  loading: true,
  isAdmin: false
});

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuthContext = () => useContext(AuthContext);

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
          const parsedData = JSON.parse(authData);
          // Supporter à la fois les anciens formats et les nouveaux
          const userObj = parsedData.user || parsedData;
          const tokenValue = parsedData.access_token || parsedData.token;
          
          setUser(userObj);
          setToken(tokenValue);
          
          // Vérifier la validité du token en production
          // Cette étape peut être ajoutée ultérieurement
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
      access_token: tokenValue,
      user: userData
    }));
  };

  // Fonction de déconnexion
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('twool_auth');
    router.push('/auth/login');
  };

  // Vérifier si l'utilisateur est administrateur
  const isAdmin = user?.role === 'SUPER_ADMIN'

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        token,
        login,
        logout,
        loading,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// HOC pour les routes protégées
export const withAuth = (Component) => {
  const AuthenticatedComponent = (props) => {
    const { isAuthenticated, loading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.replace('/auth/login');
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

// HOC pour les routes réservées aux administrateurs
export const withAdmin = (Component) => {
  const AdminComponent = (props) => {
    const { isAuthenticated, isAdmin, loading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          router.replace('/auth/login');
        } else if (!isAdmin) {
          router.replace('/dashboard');
        }
      }
    }, [isAuthenticated, isAdmin, loading, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    return (isAuthenticated && isAdmin) ? <Component {...props} /> : null;
  };

  return AdminComponent;
};