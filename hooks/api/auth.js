/**
 * Service API pour l'authentification
 * Correspond aux routes /auth dans le backend
 */
const authService = (client) => {
  return {
    setAuthToken: (token) => {
      client.setDefaultHeaders({
        'Authorization': `Bearer ${token}`
      });
    },

    /**
     * Connexion avec token uniquement
     * @param {string} email - Email de l'utilisateur
     * @param {string} password - Mot de passe
     * @returns {Promise<Object>} - Le token d'authentification
     */
    getToken: (email, password) => 
      client.post('/auth/token', { 
        username: email,
        password 
      }),
    
    /**
     * Connexion de l'utilisateur
     * @param {string} email - Email de l'utilisateur
     * @param {string} password - Mot de passe
     * @returns {Promise<Object>} - Les informations utilisateur et le token
     */
    login: (email, password) => 
      client.post('/auth/login', { 
        username: email,
        password 
      }),
    
    /**
     * Inscription d'un nouvel utilisateur
     * @param {Object} userData - Données d'inscription
     * @param {string} userData.email - Email
     * @param {string} userData.password - Mot de passe
     * @param {string} userData.firstName - Prénom
     * @param {string} userData.lastName - Nom
     * @returns {Promise<Object>} - Les informations de l'utilisateur créé
     */
    register: (userData) => {
      return client.post('/auth/register', {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName
      });
    },
    
    /**
     * Inscription avec abonnement
     * @param {Object} userData - Données utilisateur
     * @param {Object} subscriptionData - Données d'abonnement
     * @returns {Promise<Object>} - Les informations de l'utilisateur créé
     */
    registerWithSubscription: (userData, subscriptionData) => {
      // Conversion des noms de propriétés camelCase vers snake_case pour l'API
      const apiUserData = {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName
      };
      
      const apiSubscriptionData = {
        type: subscriptionData.type,
        tier: subscriptionData.tier,
        payment_provider: subscriptionData.paymentProvider,
        payment_id: subscriptionData.paymentId
      };
      
      return client.post('/auth/register/subscription', apiUserData, {
        params: apiSubscriptionData
      });
    },
    
    /**
     * Inscription avec licence
     * @param {Object} requestData - Données utilisateur et clé de licence
     * @returns {Promise<Object>} - Les informations de l'utilisateur créé
     */
    registerWithLicense: (requestData) => {
      return client.post('/auth/register/license', requestData);
    },

    verifyEmail: (token) => {
      return client.get(`/auth/verify-email?token=${token}`);
    },

    resendVerificationEmail: (email) => {
      return client.post('/auth/resend-verification-email', { email });
    },
    
    /**
     * Activer une licence pour un utilisateur existant
     * @param {string} licenseKey - Clé de licence
     * @returns {Promise<Object>} - Les informations de l'utilisateur mises à jour
     */
    activateLicense: (licenseData) => {
      return client.post('/auth/activate-license', licenseData, {
        headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
      });
    },
    
    /**
     * Récupérer les informations de l'utilisateur connecté
     * @returns {Promise<Object>} - Les informations de l'utilisateur
     */
    getCurrentUser: () => 
      client.get('/auth/me'),
    
    /**
     * Changer le mot de passe de l'utilisateur
     * @param {string} oldPassword - Ancien mot de passe
     * @param {string} newPassword - Nouveau mot de passe
     * @returns {Promise<Object>} - Les informations de l'utilisateur mises à jour
     */
    changePassword: (oldPassword, newPassword) => 
      client.post('/auth/change-password', {
        old_password: oldPassword,
        new_password: newPassword
      })
  };
};

export default authService;