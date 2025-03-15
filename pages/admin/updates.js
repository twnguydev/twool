import React, { useState, useRef } from 'react';
import { useUpdatesApi } from '../../hooks/api/updates';
import { useAuthContext, withAdmin } from '../../context/auth-context';

const AdminUpdates = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    version: '',
    platform: 'win',
    releaseNotes: '',
    app_name: 'TwoolLabs'
  });
  
  const fileInputRef = useRef(null);
  const { user } = useAuthContext();
  const updatesApi = useUpdatesApi();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const validateForm = () => {
    if (!formData.version) {
      setError('Veuillez spécifier un numéro de version');
      return false;
    }
    
    if (!formData.platform) {
      setError('Veuillez sélectionner une plateforme');
      return false;
    }
    
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier d\'installation');
      return false;
    }
    
    // Vérifier le format de version (x.y.z)
    const versionPattern = /^\d+\.\d+\.\d+$/;
    if (!versionPattern.test(formData.version)) {
      setError('Le format de version doit être x.y.z (ex: 1.0.0)');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Créer un FormData pour envoyer le fichier
      const submitData = new FormData();
      submitData.append('file', selectedFile);
      submitData.append('version', formData.version);
      submitData.append('platform', formData.platform);
      submitData.append('releaseNotes', formData.releaseNotes);
      submitData.append('app_name', formData.app_name);
      
      const response = await updatesApi.publishNewVersion(submitData);
      
      setMessage(`Version ${response.version} publiée avec succès pour la plateforme ${response.platform}`);
      
      // Réinitialiser le formulaire
      setFormData({
        version: '',
        platform: 'win',
        releaseNotes: '',
        app_name: 'TwoolLabs'
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(`Erreur lors de la publication: ${err.message || 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Administration des mises à jour</h1>
      
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Publier une nouvelle version</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="version">
              Numéro de version (x.y.z)
            </label>
            <input
              type="text"
              id="version"
              name="version"
              value={formData.version}
              onChange={handleInputChange}
              placeholder="1.0.0"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="platform">
              Plateforme
            </label>
            <select
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="win">Windows</option>
              <option value="mac">macOS</option>
              <option value="linux">Linux</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="app_name">
              Nom de l'application
            </label>
            <input
              type="text"
              id="app_name"
              name="app_name"
              value={formData.app_name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="releaseNotes">
              Notes de version
            </label>
            <textarea
              id="releaseNotes"
              name="releaseNotes"
              value={formData.releaseNotes}
              onChange={handleInputChange}
              rows="4"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Décrivez les changements apportés dans cette version..."
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="installFile">
              Fichier d'installation
            </label>
            <input
              type="file"
              id="installFile"
              name="installFile"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            <p className="text-gray-600 text-xs mt-1">
              Sélectionnez le fichier d'installation (.exe, .dmg, .AppImage, etc.)
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Publication en cours...' : 'Publier la version'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Export avec HOC pour protéger la route admin
export default withAdmin(AdminUpdates);