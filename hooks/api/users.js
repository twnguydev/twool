/**
 * Service API pour la gestion des utilisateurs
 * Correspond aux routes /users dans le backend
 */
const usersService = (client) => {
  return {
    /**
     * Récupérer le profil de l'utilisateur connecté
     * @returns {Promise<Object>} - Le profil de l'utilisateur
     */
    getProfile: () => 
      client.get('/users/profile'),
    
    /**
     * Mettre à jour le profil de l'utilisateur
     * @param {Object} userData - Données à mettre à jour
     * @param {string} userData.firstName - Prénom (optionnel)
     * @param {string} userData.lastName - Nom (optionnel)
     * @returns {Promise<Object>} - Le profil mis à jour
     */
    updateProfile: (userData) => {
      // Conversion des noms de propriétés camelCase vers snake_case pour l'API
      const apiData = {};
      
      if (userData.firstName !== undefined) {
        apiData.first_name = userData.firstName;
      }
      
      if (userData.lastName !== undefined) {
        apiData.last_name = userData.lastName;
      }
      
      return client.put('/users/update', apiData);
    },
    
    /**
     * Supprimer le compte de l'utilisateur connecté
     * @returns {Promise<void>}
     */
    deleteAccount: () => 
      client.delete('/users/delete'),
    
    /**
     * Liste des utilisateurs (admin uniquement)
     * @param {Object} options - Options de pagination
     * @param {number} options.page - Numéro de la page (commence à 1)
     * @param {number} options.size - Nombre d'éléments par page
     * @returns {Promise<Object>} - Liste paginée des utilisateurs
     */
    listUsers: (options = {}) => {
      const page = options.page || 1;
      const size = options.size || 20;
      const skip = (page - 1) * size;
      
      return client.get('/users', {
        params: { skip, limit: size }
      });
    },
    
    /**
     * Récupérer un utilisateur par son ID (admin uniquement, ou soi-même)
     * @param {string} userId - ID de l'utilisateur
     * @returns {Promise<Object>} - Les informations de l'utilisateur
     */
    getUserById: (userId) => 
      client.get(`/users/${userId}`)
  };
};

export default usersService;