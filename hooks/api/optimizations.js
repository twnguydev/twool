/**
 * Service API pour la gestion des optimisations
 * Correspond aux routes /optimizations dans le backend
 */
const optimizationsService = (client) => {
  return {
    /**
     * Générer des suggestions d'optimisation pour un processus
     * @param {Object} optimizationData - Données pour l'optimisation
     * @param {string} optimizationData.processId - ID du processus à optimiser
     * @param {string} optimizationData.simulationId - ID de la simulation de référence (optionnel)
     * @param {Object} optimizationData.parameters - Paramètres d'optimisation (optionnel)
     * @returns {Promise<Object>} - L'optimisation créée
     */
    generateOptimizations: (optimizationData) => {
      const apiData = {
        process_id: optimizationData.processId,
        simulation_id: optimizationData.simulationId,
        parameters: optimizationData.parameters || {}
      };
      
      return client.post('/optimizations', apiData);
    },
    
    /**
     * Récupérer les résultats d'une optimisation
     * @param {string} optimizationId - ID de l'optimisation
     * @returns {Promise<Object>} - Résultats détaillés de l'optimisation
     */
    getOptimizationResults: (optimizationId) => 
      client.get(`/optimizations/${optimizationId}`),
    
    /**
     * Récupérer toutes les optimisations pour un processus
     * @param {string} processId - ID du processus
     * @param {Object} options - Options de pagination
     * @param {number} options.skip - Nombre d'éléments à ignorer
     * @param {number} options.limit - Nombre maximum d'éléments à récupérer
     * @returns {Promise<Object>} - Liste des optimisations avec pagination
     */
    getOptimizationsByProcess: (processId, options = {}) => {
      const skip = options.skip || 0;
      const limit = options.limit || 100;
      
      return client.get(`/optimizations/by-process/${processId}`, {
        params: { skip, limit }
      });
    },
    
    /**
     * Récupérer toutes les optimisations pour une simulation
     * @param {string} simulationId - ID de la simulation
     * @param {Object} options - Options de pagination
     * @param {number} options.skip - Nombre d'éléments à ignorer
     * @param {number} options.limit - Nombre maximum d'éléments à récupérer
     * @returns {Promise<Object>} - Liste des optimisations avec pagination
     */
    getOptimizationsBySimulation: (simulationId, options = {}) => {
      const skip = options.skip || 0;
      const limit = options.limit || 100;
      
      return client.get(`/optimizations/by-simulation/${simulationId}`, {
        params: { skip, limit }
      });
    },
    
    /**
     * Mettre à jour une optimisation (pour les tests principalement)
     * @param {string} optimizationId - ID de l'optimisation
     * @param {Object} updateData - Données à mettre à jour
     * @param {string} updateData.status - Statut (optionnel)
     * @param {Array} updateData.suggestions - Suggestions (optionnel)
     * @param {string} updateData.errorMessage - Message d'erreur (optionnel)
     * @returns {Promise<Object>} - L'optimisation mise à jour
     */
    updateOptimization: (optimizationId, updateData) => {
      const apiData = {};
      
      if (updateData.status !== undefined) apiData.status = updateData.status;
      if (updateData.suggestions !== undefined) apiData.suggestions = updateData.suggestions;
      if (updateData.errorMessage !== undefined) apiData.error_message = updateData.errorMessage;
      
      return client.put(`/optimizations/${optimizationId}`, apiData);
    },
    
    /**
     * Supprimer une optimisation
     * @param {string} optimizationId - ID de l'optimisation à supprimer
     * @returns {Promise<Object>} - Confirmation de suppression
     */
    deleteOptimization: (optimizationId) => 
      client.delete(`/optimizations/${optimizationId}`),
      
    /**
     * Appliquer une suggestion d'optimisation spécifique
     * @param {string} optimizationId - ID de l'optimisation
     * @param {string} suggestionId - ID de la suggestion à appliquer
     * @param {Object} options - Options d'application
     * @param {boolean} options.createNewWorkflow - Créer un nouveau workflow ou modifier l'existant
     * @returns {Promise<Object>} - Résultat de l'application (workflow mis à jour ou nouveau workflow)
     */
    applySuggestion: (optimizationId, suggestionId, options = {}) => 
      client.post(`/optimizations/${optimizationId}/apply/${suggestionId}`, {
        create_new_workflow: options.createNewWorkflow || false
      }),
      
    /**
     * Appliquer toutes les suggestions d'une optimisation
     * @param {string} optimizationId - ID de l'optimisation
     * @param {Object} options - Options d'application
     * @param {boolean} options.createNewWorkflow - Créer un nouveau workflow ou modifier l'existant
     * @returns {Promise<Object>} - Résultat de l'application (workflow mis à jour ou nouveau workflow)
     */
    applyAllSuggestions: (optimizationId, options = {}) => 
      client.post(`/optimizations/${optimizationId}/apply-all`, {
        create_new_workflow: options.createNewWorkflow || false
      }),
      
    /**
     * Comparer différentes optimisations
     * @param {Array<string>} optimizationIds - IDs des optimisations à comparer
     * @returns {Promise<Object>} - Résultats de la comparaison
     */
    compareOptimizations: (optimizationIds) => 
      client.post('/optimizations/compare', { optimization_ids: optimizationIds }),
      
    /**
     * Exporter les suggestions d'optimisation au format PDF ou Excel
     * @param {string} optimizationId - ID de l'optimisation
     * @param {string} format - Format d'export ('pdf' ou 'excel')
     * @returns {Promise<Blob>} - Fichier d'export
     */
    exportOptimizationSuggestions: (optimizationId, format = 'pdf') => 
      client.get(`/optimizations/${optimizationId}/export`, {
        params: { format },
        responseType: 'blob'
      }),
      
    /**
     * Récupérer des optimisations similaires ou recommandées
     * @param {string} optimizationId - ID de l'optimisation de référence
     * @param {number} limit - Nombre maximum de résultats
     * @returns {Promise<Array>} - Liste des optimisations similaires
     */
    getSimilarOptimizations: (optimizationId, limit = 5) => 
      client.get(`/optimizations/${optimizationId}/similar`, {
        params: { limit }
      })
  };
};

export default optimizationsService;