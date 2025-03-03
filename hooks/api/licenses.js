/**
 * Service API pour la gestion des licences
 * Correspond aux routes /licenses dans le backend
 */
const licensesService = (client) => {
  return {
    /**
     * Vérifier la validité d'une clé de licence
     * @param {string} licenseKey - Clé de licence à vérifier
     * @returns {Promise<Object>} - Les informations de la licence
     */
    verify: (licenseKey) => 
      client.post('/licenses/verify', { 
        license_key: licenseKey 
      }),
    
    /**
     * Lister les licences associées à un abonnement (admin uniquement)
     * @param {string} subscriptionId - ID de l'abonnement
     * @param {Object} options - Options de pagination
     * @param {number} options.page - Numéro de la page (commence à 1)
     * @param {number} options.size - Nombre d'éléments par page
     * @returns {Promise<Object>} - Liste paginée des licences
     */
    getSubscriptionLicenses: (subscriptionId, options = {}) => {
      const page = options.page || 1;
      const size = options.size || 20;
      const skip = (page - 1) * size;
      
      return client.get(`/licenses/subscription/${subscriptionId}`, {
        params: { skip, limit: size }
      });
    },
    
    /**
     * Récupérer les détails d'une licence par son ID
     * @param {string} licenseId - ID de la licence
     * @returns {Promise<Object>} - Les informations détaillées de la licence
     */
    getLicenseDetails: (licenseId) => 
      client.get(`/licenses/${licenseId}`),
    
    /**
     * Révoquer une licence (admin uniquement)
     * @param {string} licenseId - ID de la licence à révoquer
     * @returns {Promise<Object>} - Les informations de la licence mise à jour
     */
    revokeLicense: (licenseId) => 
      client.post(`/licenses/${licenseId}/revoke`),
    
    /**
     * Générer une nouvelle licence pour un abonnement existant (admin uniquement)
     * @param {string} subscriptionId - ID de l'abonnement
     * @param {Object} licenseData - Données de la licence
     * @param {boolean} licenseData.isAdmin - Si la licence est pour un admin
     * @returns {Promise<Object>} - La nouvelle licence créée
     */
    generateLicense: (subscriptionId, licenseData = {}) => 
      client.post(`/licenses/generate`, {
        subscription_id: subscriptionId,
        is_admin: licenseData.isAdmin || false
      })
  };
};

export default licensesService;