/**
 * Service API pour la gestion des entreprises
 * Correspond aux routes /companies dans le backend
 */
const companiesService = (client) => {
  return {
    /**
     * Créer une nouvelle entreprise
     * @param {Object} companyData - Données de l'entreprise
     * @param {string} companyData.name - Nom de l'entreprise
     * @param {string} companyData.description - Description (optionnel)
     * @param {string} companyData.address - Adresse (optionnel)
     * @param {string} companyData.phone - Téléphone (optionnel)
     * @param {string} companyData.website - Site web (optionnel)
     * @returns {Promise<Object>} - L'entreprise créée
     */
    createCompany: (companyData) => 
      client.post('/companies/create', companyData),
    
    /**
     * Récupérer les détails d'une entreprise
     * @param {string} companyId - ID de l'entreprise
     * @returns {Promise<Object>} - Détails de l'entreprise
     */
    getCompany: (companyId) => 
      client.get(`/companies/${companyId}`),
    
    /**
     * Mettre à jour une entreprise
     * @param {string} companyId - ID de l'entreprise
     * @param {Object} companyData - Données à mettre à jour
     * @param {string} companyData.name - Nom (optionnel)
     * @param {string} companyData.description - Description (optionnel)
     * @param {string} companyData.address - Adresse (optionnel)
     * @param {string} companyData.phone - Téléphone (optionnel)
     * @param {string} companyData.website - Site web (optionnel)
     * @returns {Promise<Object>} - L'entreprise mise à jour
     */
    updateCompany: (companyId, companyData) => 
      client.put(`/companies/${companyId}`, companyData),
    
    /**
     * Ajouter un utilisateur à une entreprise
     * @param {Object} userData - Données de l'utilisateur à ajouter
     * @param {string} userData.userId - ID de l'utilisateur
     * @param {string} userData.role - Rôle dans l'entreprise (default: consultant)
     * @returns {Promise<Object>} - L'utilisateur ajouté
     */
    addUserToCompany: (userData) => {
      const apiData = {
        user_id: userData.userId,
        role: userData.role || 'consultant'
      };
      
      return client.post('/companies/add-user', apiData);
    },
    
    /**
     * Retirer un utilisateur d'une entreprise
     * @param {string} userId - ID de l'utilisateur à retirer
     * @returns {Promise<Object>} - Confirmation de suppression
     */
    removeUserFromCompany: (userId) => 
      client.delete(`/companies/remove-user/${userId}`),
    
    /**
     * Récupérer tous les utilisateurs d'une entreprise
     * @param {string} companyId - ID de l'entreprise
     * @param {Object} options - Options de pagination
     * @param {number} options.skip - Nombre d'éléments à ignorer
     * @param {number} options.limit - Nombre maximum d'éléments à récupérer
     * @returns {Promise<Array>} - Liste des utilisateurs de l'entreprise
     */
    getCompanyUsers: (companyId, options = {}) => {
      const skip = options.skip || 0;
      const limit = options.limit || 100;
      
      return client.get(`/companies/users/${companyId}`, {
        params: { skip, limit }
      });
    },

    /**
     * Mettre à jour le rôle d'un utilisateur dans l'entreprise
     * @param {string} userId - ID de l'utilisateur
     * @param {string} role - Nouveau rôle
     * @returns {Promise<Object>} - L'utilisateur mis à jour
     */
    updateUserRole: (userId, role) => 
      client.put(`/companies/user-role/${userId}`, { role }),
      
    /**
     * Inviter un utilisateur à rejoindre l'entreprise par email
     * @param {string} email - Email de l'utilisateur à inviter
     * @param {string} role - Rôle proposé (default: consultant)
     * @returns {Promise<Object>} - Confirmation de l'invitation
     */
    inviteUserByEmail: (email, role = 'consultant') => 
      client.post('/companies/invite', { email, role })
  };
};

export default companiesService;