import React from 'react';

const ScenarioVariables = ({ variables, onChange }) => {
  const addVariable = () => {
    const newVariables = [...variables, { name: '', value: 0 }];
    onChange(newVariables);
  };

  const updateVariable = (index, field, value) => {
    const newVariables = [...variables];
    newVariables[index][field] = value;
    onChange(newVariables);
  };

  const removeVariable = (index) => {
    const newVariables = [...variables];
    newVariables.splice(index, 1);
    onChange(newVariables);
  };

  return (
    <div className="mb-2">
      <label className="block text-xs font-medium text-gray-700 mb-1 flex justify-between">
        <span>Variables modifiées</span>
        <button
          type="button"
          onClick={addVariable}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          + Ajouter
        </button>
      </label>

      {/* Liste des variables du scénario */}
      {variables.map((variable, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          <input
            type="text"
            value={variable.name}
            onChange={(e) => updateVariable(index, 'name', e.target.value)}
            placeholder="Nom"
            className="w-1/2 px-2 py-1 text-xs border border-gray-300 rounded-md"
          />
          <input
            type="text"
            value={variable.value}
            onChange={(e) => updateVariable(index, 'value', e.target.value)}
            placeholder="Valeur"
            className="w-1/2 px-2 py-1 text-xs border border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={() => removeVariable(index)}
            className="text-xs text-red-600 hover:text-red-800"
            aria-label="Supprimer la variable"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default ScenarioVariables;