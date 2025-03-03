/**
 * Service API pour l'analyse de workflow par IA
 * Correspond aux routes /flow-ia dans le backend
 */
const flowAnalysisService = (client) => {
  return {
    /**
     * Analyser un workflow avec l'IA
     * @param {Object} analysisData - Données pour l'analyse
     * @param {string} analysisData.processId - ID du processus à analyser
     * @param {Object} analysisData.workflowData - Données du workflow à analyser
     * @returns {Promise<Object>} - Résultats de l'analyse
     */
    analyzeWorkflow: (analysisData) => {
      const apiData = {
        process_id: analysisData.processId,
        workflow_data: analysisData.workflowData
      };
      
      return client.post('/flow-ia/analyze', apiData);
    },
    
    /**
     * Récupérer les résultats d'une analyse précédente
     * @param {string} analysisId - ID de l'analyse
     * @returns {Promise<Object>} - Résultats détaillés de l'analyse
     */
    getAnalysisResults: (analysisId) => 
      client.get(`/flow-ia/${analysisId}`),
    
    /**
     * Récupérer toutes les analyses associées à un processus
     * @param {string} processId - ID du processus
     * @param {Object} options - Options de pagination
     * @param {number} options.skip - Nombre d'éléments à ignorer
     * @param {number} options.limit - Nombre maximum d'éléments à récupérer
     * @returns {Promise<Array>} - Liste des analyses
     */
    getAnalysesByProcess: (processId, options = {}) => {
      const skip = options.skip || 0;
      const limit = options.limit || 100;
      
      return client.get(`/flow-ia/by-process/${processId}`, {
        params: { skip, limit }
      });
    },
    
    /**
     * Supprimer une analyse
     * @param {string} analysisId - ID de l'analyse à supprimer
     * @returns {Promise<Object>} - Confirmation de suppression
     */
    deleteAnalysis: (analysisId) => 
      client.delete(`/flow-ia/${analysisId}`),
      
    /**
     * Comparer différentes analyses de workflow
     * @param {Array<string>} analysisIds - IDs des analyses à comparer
     * @returns {Promise<Object>} - Résultats de la comparaison
     */
    compareAnalyses: (analysisIds) => 
      client.post('/flow-ia/compare', { analysis_ids: analysisIds }),
      
    /**
     * Exporter les résultats d'analyse au format PDF
     * @param {string} analysisId - ID de l'analyse
     * @returns {Promise<Blob>} - Fichier PDF d'export
     */
    exportAnalysisReport: (analysisId) => 
      client.get(`/flow-ia/${analysisId}/export`, {
        responseType: 'blob'
      }),
      
    /**
     * Générer des visualisations alternatives pour un workflow
     * @param {string} analysisId - ID de l'analyse
     * @returns {Promise<Object>} - Suggestions de visualisations
     */
    generateVisualizationSuggestions: (analysisId) => 
      client.get(`/flow-ia/${analysisId}/visualizations`),
      
    /**
     * Identifier les variables critiques dans un workflow
     * @param {string} analysisId - ID de l'analyse
     * @returns {Promise<Array>} - Liste des variables critiques avec leur impact
     */
    identifyCriticalVariables: (analysisId) => 
      client.get(`/flow-ia/${analysisId}/critical-variables`),
      
    /**
     * Identifier les goulots d'étranglement dans un workflow
     * @param {string} analysisId - ID de l'analyse
     * @returns {Promise<Array>} - Liste des goulots d'étranglement avec leur impact
     */
    identifyBottlenecks: (analysisId) => 
      client.get(`/flow-ia/${analysisId}/bottlenecks`),
      
    /**
     * Générer des scénarios alternatifs pour un workflow
     * @param {string} analysisId - ID de l'analyse
     * @param {number} numberOfScenarios - Nombre de scénarios à générer
     * @returns {Promise<Array>} - Liste des scénarios alternatifs
     */
    generateAlternativeScenarios: (analysisId, numberOfScenarios = 3) => 
      client.get(`/flow-ia/${analysisId}/alternative-scenarios`, {
        params: { count: numberOfScenarios }
      })
  };
};

export default flowAnalysisService;