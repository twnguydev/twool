/**
 * Service API pour la gestion des abonnements
 * Correspond aux routes /subscriptions dans le backend
 */
const subscriptionsService = (client) => {
  return {
    /**
     * Créer un nouvel abonnement
     * @param {Object} subscriptionData - Données de l'abonnement
     * @param {string} subscriptionData.type - Type d'abonnement (monthly/annual)
     * @param {string} subscriptionData.tier - Niveau d'abonnement (solo/business/enterprise)
     * @param {string} subscriptionData.paymentProvider - Fournisseur de paiement (optionnel)
     * @param {string} subscriptionData.paymentId - ID de paiement (optionnel)
     * @param {number} subscriptionData.amount - Montant
     * @param {string} subscriptionData.currency - Devise (défaut: EUR)
     * @returns {Promise<Object>} - L'abonnement créé
     */
    createSubscription: (subscriptionData) => {
      const apiData = {
        type: subscriptionData.type,
        tier: subscriptionData.tier,
        payment_provider: subscriptionData.paymentProvider,
        payment_id: subscriptionData.paymentId,
        amount: subscriptionData.amount,
        currency: subscriptionData.currency || 'EUR'
      };
      
      return client.post('/subscriptions/create', apiData);
    },
    
    /**
     * Récupérer l'abonnement d'un utilisateur
     * @param {string} userId - ID de l'utilisateur
     * @returns {Promise<Object>} - L'abonnement de l'utilisateur
     */
    getUserSubscription: (userId) => 
      client.get(`/subscriptions/${userId}`),
    
    /**
     * Annuler un abonnement
     * @returns {Promise<Object>} - Confirmation de l'annulation
     */
    cancelSubscription: () => 
      client.post('/subscriptions/cancel'),
    
    /**
     * Récupérer les plans d'abonnement disponibles
     * @returns {Promise<Array>} - Liste des plans d'abonnement
     */
    getPlans: () => 
      client.get('/subscriptions/plans'),
    
    /**
     * Récupérer l'abonnement actuel de l'utilisateur connecté
     * @returns {Promise<Object>} - Les informations de l'abonnement
     */
    getCurrentSubscription: () => 
      client.get('/subscriptions/current'),
    
    /**
     * Créer une session de paiement pour un abonnement
     * @param {string} planId - Identifiant du plan d'abonnement
     * @param {string} interval - Intervalle (monthly ou annual)
     * @returns {Promise<Object>} - Les informations de la session de paiement
     */
    createCheckoutSession: (planId, interval) => 
      client.post('/subscriptions/checkout', { 
        plan_id: planId, 
        interval 
      }),
    
    /**
     * Réactiver un abonnement annulé
     * @returns {Promise<Object>} - Les informations de l'abonnement mis à jour
     */
    reactivateSubscription: () => 
      client.post('/subscriptions/reactivate'),
    
    /**
     * Changer le plan d'abonnement
     * @param {string} newPlanId - Identifiant du nouveau plan
     * @param {string} newInterval - Nouvel intervalle (monthly ou annual)
     * @returns {Promise<Object>} - Les informations de l'abonnement mis à jour
     */
    changePlan: (newPlanId, newInterval) => 
      client.post('/subscriptions/change-plan', {
        plan_id: newPlanId,
        interval: newInterval
      }),
    
    /**
     * Récupérer l'historique des paiements
     * @param {Object} options - Options de pagination
     * @param {number} options.page - Numéro de la page (commence à 1)
     * @param {number} options.size - Nombre d'éléments par page
     * @returns {Promise<Object>} - Liste paginée des paiements
     */
    getPaymentHistory: (options = {}) => {
      const page = options.page || 1;
      const size = options.size || 20;
      const skip = (page - 1) * size;
      
      return client.get('/subscriptions/payment-history', {
        params: { skip, limit: size }
      });
    },
    
    /**
     * Mettre à jour les informations de facturation
     * @param {Object} billingInfo - Informations de facturation
     * @returns {Promise<Object>} - Les informations de facturation mises à jour
     */
    updateBillingInfo: (billingInfo) => 
      client.put('/subscriptions/billing-info', billingInfo)
  };
};

export default subscriptionsService;