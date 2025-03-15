import React from 'react';
import ScenarioList from './scenario-list';
import SimulationResults from './simulation-results';

const ScenarioProperties = ({ element, properties, handleChange, updateProperties }) => {
  return (
    <>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Seuil de résilience (%)
        </label>
        <input
          type="number"
          name="threshold"
          value={properties.threshold || 15}
          onChange={handleChange}
          min="0"
          max="100"
          step="0.1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Valeur minimale de la marge pour considérer le modèle comme résilient.
        </p>
      </div>

      {/* Liste des scénarios */}
      <ScenarioList 
        scenarios={properties.scenarios || []} 
        onChange={(newScenarios) => updateProperties({ scenarios: newScenarios })} 
      />

      {/* Résultats de simulation (lecture seule) */}
      {element.data.data.simulationResults && element.data.data.simulationResults.length > 0 && (
        <SimulationResults results={element.data.data.simulationResults} />
      )}

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Variable de référence
        </label>
        <input
          type="text"
          name="referenceVariable"
          value={properties.referenceVariable || 'tauxMarge'}
          onChange={handleChange}
          placeholder="ex: tauxMarge"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Nom de la variable utilisée pour évaluer la résilience.
        </p>
      </div>

      <div className="p-2 bg-blue-50 border border-blue-100 rounded-md mb-3">
        <p className="text-xs text-blue-800 mb-1 font-medium">Comment utiliser les scénarios :</p>
        <ol className="text-xs text-blue-700 list-decimal pl-4 space-y-1">
          <li>Définissez les scénarios avec les variations de variables</li>
          <li>Configurez le seuil de résilience et la variable à mesurer</li>
          <li>Cliquez sur "Simuler les scénarios" dans la barre d'outils</li>
          <li>Consultez les résultats dans l'onglet "Résultats"</li>
        </ol>
      </div>
    </>
  );
};

export default ScenarioProperties;