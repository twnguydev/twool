import React, { useState } from 'react';
import FormulaSelector from './formula-selector';
import FormulaTriggerSettings from './formula-trigger-settings';
import VariablesList from './variables-list';

const FormulaProperties = ({ element, properties, handleChange, updateProperties }) => {
  const [showFormulaSelector, setShowFormulaSelector] = useState(false);

  const handleFormulaSelect = (selectedFormula) => {
    updateProperties({
      formula: selectedFormula.formula,
      variables: selectedFormula.variables,
      description: properties.description || selectedFormula.description
    });
    setShowFormulaSelector(false);
  };

  return (
    <>
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Formule(s)
          </label>
          <button
            type="button"
            onClick={() => setShowFormulaSelector(true)}
            className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Formules prédéfinies
          </button>
        </div>
        <textarea
          name="formula"
          value={properties.formula || ''}
          onChange={handleChange}
          rows="4"
          placeholder="ex: profit = revenue - cost
tauxMarge = (profit / revenue) * 100"
          className="w-full px-3 py-2 font-mono text-sm border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-purple-500 focus:border-purple-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Entrez plusieurs formules en les séparant par des sauts de ligne.
          Les résultats seront automatiquement disponibles comme variables.
        </p>
      </div>

      {/* Composant pour gérer la liste des variables */}
      <VariablesList
        variables={properties.variables || []}
        onChange={(newVariables) => updateProperties({ variables: newVariables })}
      />

      {/* Affichage des variables calculées (lecture seule) */}
      {element.data.data.assignedVariables && element.data.data.assignedVariables.length > 0 && (
        <div className="mb-3 p-2 bg-purple-50 rounded-md border border-purple-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Variables calculées
          </label>
          <div className="grid grid-cols-2 gap-2">
            {element.data.data.assignedVariables.map((variable, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-xs font-mono font-medium text-purple-800">{variable.name}:</span>
                <span className="text-xs">
                  {typeof variable.value === 'number'
                    ? (variable.value % 1 !== 0 ? variable.value.toFixed(2) : variable.value)
                    : variable.value}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-purple-700">
            Ces variables sont automatiquement disponibles pour les autres nœuds de formule.
          </p>
        </div>
      )}

      {/* Composant pour les paramètres de déclenchement */}
      <FormulaTriggerSettings 
        properties={properties} 
        handleChange={handleChange} 
      />

      <div className="mb-4 p-2 bg-gray-50 rounded-md border border-gray-200">
        <p className="text-xs text-gray-700 mb-1 font-medium">Fonctions disponibles :</p>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div>• sum()</div>
          <div>• avg()</div>
          <div>• min()</div>
          <div>• max()</div>
          <div>• round()</div>
          <div>• roi()</div>
        </div>
      </div>

      <div className="p-2 bg-purple-50 border border-purple-100 rounded-md mb-3">
        <p className="text-xs text-purple-700 font-semibold">Exemples de formules multiples :</p>
        <p className="text-xs font-mono text-purple-600 mt-1">marge = revenu - cout</p>
        <p className="text-xs font-mono text-purple-600">tauxMarge = (marge / revenu) * 100</p>
      </div>

      {/* Composant de sélection de formules */}
      {showFormulaSelector && (
        <FormulaSelector
          onSelectFormula={handleFormulaSelect}
          onClose={() => setShowFormulaSelector(false)}
        />
      )}
    </>
  );
};

export default FormulaProperties;