/**
 * Service API pour la gestion des workflows
 * Correspond aux routes /workflows dans le backend
 */
const workflowsService = (client) => {
  return {
    /**
     * Créer un nouveau workflow
     * @param {Object} workflowData - Données du workflow
     * @param {string} workflowData.name - Nom du workflow
     * @param {string} workflowData.description - Description (optionnel)
     * @param {Array} workflowData.nodes - Noeuds du workflow (optionnel)
     * @param {Array} workflowData.edges - Connexions du workflow (optionnel)
     * @param {boolean} workflowData.isShared - Si le workflow est partagé (optionnel)
     * @param {boolean} workflowData.isTemplate - Si le workflow est un modèle (optionnel)
     * @returns {Promise<Object>} - Le workflow créé
     */
    createWorkflow: (workflowData) => {
      const apiData = {
        name: workflowData.name,
        description: workflowData.description,
        nodes: workflowData.nodes || [],
        edges: workflowData.edges || [],
        is_shared: workflowData.isShared || false,
        is_template: workflowData.isTemplate || false
      };
      
      if (workflowData.createdAt) {
        apiData.createdAt = workflowData.createdAt;
      }
      
      return client.post('/workflows/create', apiData);
    },
    
    /**
     * Récupérer les workflows d'un utilisateur
     * @param {string} userId - ID de l'utilisateur
     * @param {Object} options - Options de pagination
     * @param {number} options.skip - Nombre d'éléments à ignorer
     * @param {number} options.limit - Nombre maximum d'éléments à récupérer
     * @returns {Promise<Array>} - Liste des workflows de l'utilisateur
     */
    getUserWorkflows: (userId, options = {}) => {
      const skip = options.skip || 0;
      const limit = options.limit || 100;
      
      return client.get(`/workflows/${userId}`, {
        params: { skip, limit }
      });
    },
    
    /**
     * Récupérer les workflows partagés d'une entreprise
     * @param {string} companyId - ID de l'entreprise
     * @param {Object} options - Options de pagination
     * @param {number} options.skip - Nombre d'éléments à ignorer
     * @param {number} options.limit - Nombre maximum d'éléments à récupérer
     * @returns {Promise<Array>} - Liste des workflows partagés de l'entreprise
     */
    getCompanyWorkflows: (companyId, options = {}) => {
      const skip = options.skip || 0;
      const limit = options.limit || 100;
      
      return client.get(`/workflows/company/${companyId}`, {
        params: { skip, limit }
      });
    },
    
    /**
     * Récupérer les détails d'un workflow
     * @param {string} workflowId - ID du workflow
     * @returns {Promise<Object>} - Détails du workflow
     */
    getWorkflowDetail: (workflowId) => 
      client.get(`/workflows/detail/${workflowId}`),
    
    /**
     * Mettre à jour un workflow
     * @param {string} workflowId - ID du workflow
     * @param {Object} workflowData - Données à mettre à jour
     * @param {string} workflowData.name - Nom (optionnel)
     * @param {string} workflowData.description - Description (optionnel)
     * @param {Array} workflowData.nodes - Noeuds (optionnel)
     * @param {Array} workflowData.edges - Connexions (optionnel)
     * @param {boolean} workflowData.isShared - Si le workflow est partagé (optionnel)
     * @param {boolean} workflowData.isTemplate - Si le workflow est un modèle (optionnel)
     * @returns {Promise<Object>} - Le workflow mis à jour
     */
    updateWorkflow: (workflowId, workflowData) => {
      const apiData = {};
      
      if (workflowData.name !== undefined) apiData.name = workflowData.name;
      if (workflowData.description !== undefined) apiData.description = workflowData.description;
      if (workflowData.nodes !== undefined) apiData.nodes = workflowData.nodes;
      if (workflowData.edges !== undefined) apiData.edges = workflowData.edges;
      if (workflowData.isShared !== undefined) apiData.is_shared = workflowData.isShared;
      if (workflowData.isTemplate !== undefined) apiData.is_template = workflowData.isTemplate;
      
      return client.put(`/workflows/update/${workflowId}`, apiData);
    },
    
    /**
     * Supprimer un workflow
     * @param {string} workflowId - ID du workflow à supprimer
     * @returns {Promise<Object>} - Confirmation de suppression
     */
    deleteWorkflow: (workflowId) => 
      client.delete(`/workflows/delete/${workflowId}`),
      
    /**
     * Dupliquer un workflow existant
     * @param {string} workflowId - ID du workflow à dupliquer
     * @param {Object} options - Options de duplication
     * @param {string} options.newName - Nouveau nom (optionnel)
     * @returns {Promise<Object>} - Le nouveau workflow créé
     */
    duplicateWorkflow: (workflowId, options = {}) => 
      client.post(`/workflows/duplicate/${workflowId}`, options),
      
    /**
     * Exporter un workflow au format JSON
     * @param {string} workflowId - ID du workflow à exporter
     * @returns {Promise<Object>} - Données du workflow au format JSON
     */
    exportWorkflow: (workflowId) => 
      client.get(`/workflows/export/${workflowId}`),
      
    /**
     * Importer un workflow depuis un fichier JSON
     * @param {Object} workflowData - Données du workflow à importer
     * @returns {Promise<Object>} - Le workflow importé
     */
    importWorkflow: (workflowData) => 
      client.post('/workflows/import', workflowData)
  };
};

export default workflowsService;