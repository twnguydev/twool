import React from 'react';
import ScenarioVariables from './scenario-variables';

const ScenarioItem = ({ scenario, onUpdate, onRemove, index }) => {
  const handleChange = (field, value) => {
    onUpdate({
      ...scenario,
      [field]: value
    });
  };

  return (
    <div className="border border-gray-200 rounded-md p-3 bg-gray-50 relative">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
        aria-label="Supprimer le scénario"
      >
        ✕
      </button>

      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Nom
        </label>
        <input
          type="text"
          value={scenario.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          value={scenario.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-2 flex items-center">
        <input
          type="checkbox"
          id={`scenario-active-${index}`}
          checked={scenario.active !== false}
          onChange={(e) => handleChange('active', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-sm"
        />
        <label htmlFor={`scenario-active-${index}`} className="ml-2 block text-sm text-gray-700">
          Actif
        </label>
      </div>

      {/* Composant pour gérer les variables du scénario */}
      <ScenarioVariables 
        variables={scenario.variables || []} 
        onChange={(newVariables) => handleChange('variables', newVariables)} 
      />
    </div>
  );
};

export default ScenarioItem;