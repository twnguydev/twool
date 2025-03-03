/**
 * Service API pour la gestion des simulations
 * Correspond aux routes /simulations dans le backend
 */
const simulationsService = (client) => {
  return {
    /**
     * Lancer une nouvelle simulation
     * @param {Object} simulationData - Données de la simulation
     * @param {string} simulationData.workflowId - ID du workflow à simuler
     * @param {Object} simulationData.parameters - Paramètres de la simulation (optionnel)
     * @returns {Promise<Object>} - La simulation créée
     */
    runSimulation: (simulationData) => {
      const apiData = {
        workflow_id: simulationData.workflowId,
        parameters: simulationData.parameters || {}
      };
      
      return client.post('/simulations', apiData);
    },
    
    /**
     * Récupérer les résultats d'une simulation
     * @param {string} simulationId - ID de la simulation
     * @returns {Promise<Object>} - Résultats détaillés de la simulation
     */
    getSimulationResults: (simulationId) => 
      client.get(`/simulations/${simulationId}`),
    
    /**
     * Récupérer toutes les simulations d'un workflow
     * @param {string} workflowId - ID du workflow
     * @param {Object} options - Options de pagination
     * @param {number} options.skip - Nombre d'éléments à ignorer
     * @param {number} options.limit - Nombre maximum d'éléments à récupérer
     * @returns {Promise<Object>} - Liste des simulations avec pagination
     */
    getSimulationsByWorkflow: (workflowId, options = {}) => {
      const skip = options.skip || 0;
      const limit = options.limit || 100;
      
      return client.get(`/simulations/by-workflow/${workflowId}`, {
        params: { skip, limit }
      });
    },
    
    /**
     * Mettre à jour une simulation (pour les tests principalement)
     * @param {string} simulationId - ID de la simulation
     * @param {Object} updateData - Données à mettre à jour
     * @param {string} updateData.status - Statut (optionnel)
     * @param {Object} updateData.metrics - Métriques (optionnel)
     * @param {Array} updateData.details - Détails (optionnel)
     * @param {string} updateData.errorMessage - Message d'erreur (optionnel)
     * @returns {Promise<Object>} - La simulation mise à jour
     */
    updateSimulation: (simulationId, updateData) => {
      const apiData = {};
      
      if (updateData.status !== undefined) apiData.status = updateData.status;
      if (updateData.metrics !== undefined) apiData.metrics = updateData.metrics;
      if (updateData.details !== undefined) apiData.details = updateData.details;
      if (updateData.errorMessage !== undefined) apiData.error_message = updateData.errorMessage;
      
      return client.put(`/simulations/${simulationId}`, apiData);
    },
    
    /**
     * Supprimer une simulation
     * @param {string} simulationId - ID de la simulation à supprimer
     * @returns {Promise<Object>} - Confirmation de suppression
     */
    deleteSimulation: (simulationId) => 
      client.delete(`/simulations/${simulationId}`),
      
    /**
     * Comparer plusieurs simulations
     * @param {Array<string>} simulationIds - IDs des simulations à comparer
     * @returns {Promise<Object>} - Résultats de la comparaison
     */
    compareSimulations: (simulationIds) => 
      client.post('/simulations/compare', { simulation_ids: simulationIds }),
      
    /**
     * Exporter les résultats d'une simulation au format CSV
     * @param {string} simulationId - ID de la simulation
     * @returns {Promise<Blob>} - Fichier CSV des résultats
     */
    exportSimulationResults: (simulationId) => 
      client.get(`/simulations/${simulationId}/export`, {
        responseType: 'blob'
      }),
      
    /**
     * Arrêter une simulation en cours
     * @param {string} simulationId - ID de la simulation à arrêter
     * @returns {Promise<Object>} - Confirmation de l'arrêt
     */
    stopSimulation: (simulationId) => 
      client.post(`/simulations/${simulationId}/stop`)
  };
};

export default simulationsService;