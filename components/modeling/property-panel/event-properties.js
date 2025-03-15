import React, { useState, useEffect } from 'react';
import { useAuthContext } from '/context/auth-context';
import { useApi } from '/hooks/useApi';

const EventProperties = ({ properties, updateProperties }) => {
  const { user } = useAuthContext();
  const api = useApi();
  const [workflows, setWorkflows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEventTypeChange = (type) => {
    updateProperties({ eventType: type });
  };

  const handleWorkflowRefChange = (e) => {
    updateProperties({ workflowRef: e.target.value });
  };

  useEffect(() => {
    const fetchWorkflows = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        // 1. Récupérer les workflows de façon sécurisée
        let workflowsData = [];
        try {
          if (user?.company_id) {
            try {
              const companyWorkflows = await api.workflows.getCompanyWorkflows(user.company_id, { limit: 5 });
              workflowsData = Array.isArray(companyWorkflows) ? companyWorkflows : [];
            } catch (err) {
              console.error("Erreur lors de la récupération des workflows d'entreprise:", err);
              workflowsData = [];
            }
          } else {
            try {
              const result = await api.workflows.getUserWorkflows(user.id, { limit: 5 });
              workflowsData = Array.isArray(result) ? result : [];
            } catch (err) {
              console.error("Erreur lors de la récupération des workflows:", err);
              workflowsData = [];
            }
          }
        } catch (err) {
          console.error("Erreur générale lors du chargement des workflows:", err);
          workflowsData = [];
        }

        setWorkflows(workflowsData);
      } catch (error) {
        console.error('Erreur lors du chargement des workflows:', error);
        setError('Impossible de charger les workflows. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    };

    if (properties.eventType === 'intermediate') {
      fetchWorkflows();
    }
  }, [user, properties.eventType]);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type d'événement
        </label>
        <div className="flex space-x-2 mt-2">
          <button
            type="button"
            onClick={() => handleEventTypeChange('start')}
            className={`px-3 py-1 rounded-md text-sm ${properties.eventType === 'start'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
          >
            Début
          </button>
          <button
            type="button"
            onClick={() => handleEventTypeChange('intermediate')}
            className={`px-3 py-1 rounded-md text-sm ${properties.eventType === 'intermediate'
              ? 'bg-gray-100 text-gray-800 border border-gray-300'
              : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
          >
            Intermédiaire
          </button>
          <button
            type="button"
            onClick={() => handleEventTypeChange('end')}
            className={`px-3 py-1 rounded-md text-sm ${properties.eventType === 'end'
              ? 'bg-red-100 text-red-800 border border-red-300'
              : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
          >
            Fin
          </button>
        </div>
      </div>

      {properties.eventType === 'end' && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de fin
          </label>
          <div className="flex space-x-2 mt-2">
            <button
              type="button"
              onClick={() => updateProperties({ endType: 'positive' })}
              className={`px-3 py-1 rounded-md text-sm ${properties.endType === 'positive'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300'
                }`}
            >
              Succès
            </button>
            <button
              type="button"
              onClick={() => updateProperties({ endType: null })}
              className={`px-3 py-1 rounded-md text-sm ${properties.endType === null || properties.endType === undefined
                ? 'bg-orange-100 text-orange-800 border border-orange-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300'
                }`}
            >
              Neutre
            </button>
            <button
              type="button"
              onClick={() => updateProperties({ endType: 'negative' })}
              className={`px-3 py-1 rounded-md text-sm ${properties.endType === 'negative'
                ? 'bg-red-100 text-red-800 border border-red-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300'
                }`}
            >
              Échec
            </button>
          </div>
        </div>
      )}

      {/* Sélecteur de workflow pour les événements intermédiaires */}
      {properties.eventType === 'intermediate' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Référence de workflow
          </label>

          {isLoading ? (
            <div className="py-2 text-sm text-gray-500">Chargement des workflows...</div>
          ) : error ? (
            <div className="py-2 text-sm text-red-500">{error}</div>
          ) : (
            <>
              <select
                value={properties.workflowRef || ''}
                onChange={handleWorkflowRefChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Sélectionner un workflow</option>
                {workflows.map((workflow) => (
                  <option key={workflow.id} value={workflow.id}>
                    {workflow.name || `Workflow ${workflow.id}`}
                  </option>
                ))}
              </select>

              {workflows.length === 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  Aucun workflow disponible. Veuillez en créer un nouveau.
                </p>
              )}

              {properties.workflowRef && !workflows.some(w => w.id === properties.workflowRef) && (
                <p className="mt-1 text-xs text-yellow-600">
                  ID de référence personnalisé (non présent dans votre liste)
                </p>
              )}

              <div className="mt-2 flex items-center text-sm">
                <input
                  type="text"
                  value={properties.workflowRef || ''}
                  onChange={handleWorkflowRefChange}
                  placeholder="Ou entrez un ID manuellement"
                  className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          <p className="mt-1 text-xs text-gray-500">
            Sélectionnez ou entrez l'identifiant du workflow à référencer.
          </p>
        </div>
      )}

      {/* Description supplémentaire selon le type d'événement */}
      <div className="p-2 rounded border bg-gray-50">
        {properties.eventType === 'start' && (
          <p className="text-xs text-gray-600">
            Un événement de début indique le point d'entrée du processus.
          </p>
        )}
        {properties.eventType === 'intermediate' && (
          <p className="text-xs text-gray-600">
            Un événement intermédiaire représente un état ou une action qui se produit pendant l'exécution du processus.
            {properties.workflowRef && ' Il fait référence à un autre workflow qui sera exécuté à ce point.'}
          </p>
        )}
        {properties.eventType === 'end' && (
          <p className="text-xs text-gray-600">
            Un événement de fin indique la conclusion d'un chemin ou de l'ensemble du processus.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventProperties;