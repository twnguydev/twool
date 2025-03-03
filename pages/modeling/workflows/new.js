import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout/Layout';
import Link from 'next/link';

export default function CreateWorkflow() {
  const router = useRouter();
  
  // États pour le formulaire
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Gestion des erreurs
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Données de démonstration pour les templates
  const templates = [
    { 
      id: 't1', 
      name: 'Processus client', 
      description: 'Template pour modéliser un parcours client type',
      nodes: 8,
      complexity: 'Moyenne',
      category: 'client',
      image: '/templates/customer-journey.png'
    },
    { 
      id: 't2', 
      name: 'Chaîne logistique', 
      description: 'Modèle de supply chain avec gestion des stocks',
      nodes: 12,
      complexity: 'Avancée',
      category: 'supply',
      image: '/templates/supply-chain.png'
    },
    { 
      id: 't3', 
      name: 'Processus de recrutement', 
      description: 'Workflow complet pour le recrutement de nouveaux employés',
      nodes: 10,
      complexity: 'Standard',
      category: 'hr',
      image: '/templates/recruitment.png'
    },
    { 
      id: 't4', 
      name: 'Workflow vide', 
      description: 'Commencez avec une page blanche',
      nodes: 0,
      complexity: 'Personnalisée',
      category: 'blank',
      image: '/templates/blank.png'
    }
  ];
  
  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    if (!workflowName.trim()) {
      newErrors.name = "Le nom du workflow est requis";
    } else if (workflowName.length < 3) {
      newErrors.name = "Le nom doit contenir au moins 3 caractères";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Dans une vraie application, ceci enverrait les données à l'API
      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        is_shared: isShared,
        template_id: selectedTemplate,
        client_created_at: new Date().toISOString(),
        // Ces valeurs seraient définies côté serveur:
        // owner_id: userId,
        // company_id: companyId,
        
        // Pour un nouveau workflow basé sur un template, on copierait les nodes et edges
        // Si c'est un workflow vide, ces valeurs seraient des tableaux vides
        nodes: [],
        edges: []
      };
      
      console.log('Création du workflow:', workflowData);
      
      // Simulation d'un délai API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirection vers l'éditeur de workflow
      // Dans une vraie application, on récupérerait l'ID du workflow créé
      router.push('/modeling?new=true');
    } catch (error) {
      console.error('Erreur lors de la création du workflow:', error);
      setErrors({ submit: "Une erreur est survenue lors de la création du workflow." });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout title="Créer un workflow">
      <div className="p-6">
        {/* En-tête */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-end">
          <div className="mt-4 md:mt-0">
            <Link href="/workflows">
              <div className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                <svg className="mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour
              </div>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Formulaire principal */}
          <div className="md:col-span-2">
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-indigo-100">
                <h3 className="text-lg font-medium text-indigo-800">Informations générales</h3>
                <p className="mt-1 text-sm text-indigo-600">
                  Ces informations seront utilisées pour identifier et organiser votre workflow
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit}>
                  {/* Champ Nom */}
                  <div className="mb-6">
                    <label htmlFor="workflowName" className="block text-sm font-medium text-gray-700">
                      Nom du workflow <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="workflowName"
                        name="workflowName"
                        value={workflowName}
                        onChange={(e) => setWorkflowName(e.target.value)}
                        className={`block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Ex: Processus d'Onboarding Client"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Champ Description */}
                  <div className="mb-6">
                    <label htmlFor="workflowDescription" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="workflowDescription"
                        name="workflowDescription"
                        rows="4"
                        value={workflowDescription}
                        onChange={(e) => setWorkflowDescription(e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Décrivez l'objectif et les particularités de ce workflow..."
                      ></textarea>
                    </div>
                  </div>
                  
                  {/* Option de partage */}
                  <div className="mb-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="isShared"
                          name="isShared"
                          type="checkbox"
                          checked={isShared}
                          onChange={(e) => setIsShared(e.target.checked)}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="isShared" className="font-medium text-gray-700">Partager avec mon équipe</label>
                        <p className="text-gray-500">Autoriser les membres de votre entreprise à consulter et éditer ce workflow</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Message d'erreur général */}
                  {errors.submit && (
                    <div className="mb-6 rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>{errors.submit}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Boutons d'action */}
                  <div className="pt-5 flex justify-end">
                    <Link href="/workflows">
                      <div className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                        Annuler
                      </div>
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Création en cours...
                        </>
                      ) : (
                        'Créer et continuer'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Sélection de template */}
          <div className="md:col-span-1">
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-indigo-100">
                <h3 className="text-lg font-medium text-indigo-800">Templates disponibles</h3>
                <p className="mt-1 text-sm text-indigo-600">
                  Commencez avec une base prédéfinie (optionnel)
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div 
                      key={template.id}
                      className={`p-4 border rounded-lg cursor-pointer transition ${selectedTemplate === template.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                      onClick={() => setSelectedTemplate(template.id === selectedTemplate ? null : template.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-md flex items-center justify-center">
                          {template.category === 'blank' ? (
                            <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          ) : template.category === 'client' ? (
                            <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          ) : template.category === 'supply' ? (
                            <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                          ) : (
                            <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                          <p className="mt-1 text-xs text-gray-500">{template.description}</p>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <span className="mr-2">{template.nodes} nœuds</span>
                            <span>|</span>
                            <span className="mx-2">Complexité: {template.complexity}</span>
                          </div>
                        </div>
                        {selectedTemplate === template.id && (
                          <div className="ml-auto">
                            <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Message d'aide */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 md:flex md:items-center md:justify-between">
            <div className="max-w-xl md:max-w-2xl">
              <h2 className="text-xl font-bold text-white">Conseils pour un workflow efficace</h2>
              <p className="mt-2 text-indigo-100">
                Un bon workflow est structuré avec des étapes claires et des connexions logiques. 
                Commencez par identifier vos points de départ et d'arrivée, puis détaillez les étapes intermédiaires.
              </p>
              <ul className="mt-4 text-indigo-100 list-disc list-inside space-y-1">
                <li>Utilisez des noms clairs et descriptifs</li>
                <li>Identifiez les décisions et points d'embranchement</li>
                <li>Documentez les conditions et dépendances</li>
                <li>Pensez aux métriques que vous souhaitez mesurer</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}