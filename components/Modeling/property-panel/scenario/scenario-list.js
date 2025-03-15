import React from 'react';
import ScenarioItem from './scenario-item';

const ScenarioList = ({ scenarios, onChange }) => {
  const addScenario = () => {
    const newScenarios = [
      ...scenarios, 
      {
        name: `Scénario ${scenarios.length + 1}`,
        description: "Nouveau scénario",
        active: true,
        variables: [{ name: '', value: 0 }]
      }
    ];
    onChange(newScenarios);
  };

  const updateScenario = (index, updatedScenario) => {
    const newScenarios = [...scenarios];
    newScenarios[index] = updatedScenario;
    onChange(newScenarios);
  };

  const removeScenario = (index) => {
    const newScenarios = [...scenarios];
    newScenarios.splice(index, 1);
    onChange(newScenarios);
  };

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium text-gray-700">
          Scénarios
        </label>
        <button
          type="button"
          onClick={addScenario}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Ajouter un scénario
        </button>
      </div>

      {/* Liste des scénarios */}
      <div className="space-y-4 max-h-60 overflow-y-auto">
        {scenarios.map((scenario, index) => (
          <ScenarioItem
            key={index}
            scenario={scenario}
            onUpdate={(updatedScenario) => updateScenario(index, updatedScenario)}
            onRemove={() => removeScenario(index)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ScenarioList;