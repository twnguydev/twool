import { useApi } from '../useAPI';

export const useUpdatesApi = () => {
  const api = useApi();
  
  return {
    /**
     * Vérifie si une mise à jour est disponible
     * @param {string} platform - Plateforme (win, mac, linux)
     * @param {string} currentVersion - Version actuelle de l'application
     * @returns {Promise<Object>} - Informations sur la mise à jour disponible
     */
    checkForUpdates: async (platform, currentVersion) => {
      try {
        const response = await api.get(`/updates?platform=${platform}&current_version=${currentVersion}`);
        return response;
      } catch (error) {
        console.error('Erreur lors de la vérification des mises à jour:', error);
        throw error;
      }
    },

    /**
     * Récupère l'URL de téléchargement pour une mise à jour
     * @param {string} platform - Plateforme (win, mac, linux)
     * @param {string} version - Version à télécharger
     * @returns {string} - URL de téléchargement
     */
    getDownloadUrl: (platform, version) => {
      return `${api.getBaseUrl()}/updates/download/${platform}/${version}`;
    },

    /**
     * Récupère l'URL du manifeste de mise à jour pour electron-updater
     * @param {string} platform - Plateforme (win, mac, linux)
     * @returns {string} - URL du manifeste
     */
    getUpdateManifestUrl: (platform) => {
      return `${api.getBaseUrl()}/updates/latest-${platform}.yml`;
    },

    /**
     * Publie une nouvelle version (réservé aux administrateurs)
     * @param {Object} data - Données de la nouvelle version
     * @returns {Promise<Object>} - Résultat de la publication
     */
    publishNewVersion: async (data) => {
      try {
        const response = await api.post('/updates/admin/publish', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response;
      } catch (error) {
        console.error('Erreur lors de la publication de la mise à jour:', error);
        throw error;
      }
    }
  };
};