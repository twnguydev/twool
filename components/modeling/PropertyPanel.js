import React, { useState, useEffect } from 'react';
import FormulaSelector from './FormulaSelector';

const PropertyPanel = ({ element, onUpdateProperties }) => {
  const [properties, setProperties] = useState({});
  const [showFormulaSelector, setShowFormulaSelector] = useState(false);

  // Initialiser les propriétés lorsque l'élément sélectionné change
  useEffect(() => {
    if (element && element.type === 'node') {
      // Pour les nœuds, copier toutes les propriétés data
      setProperties({ ...element.data.data });
    } else if (element && element.type === 'edge') {
      // Pour les arêtes, initialiser avec les propriétés existantes ou des valeurs par défaut
      const edgeData = element.data.data || {};
      setProperties({
        label: edgeData.label || element.data.label || '',
        description: edgeData.description || '',
        animated: edgeData.animated || false,
        style: edgeData.style || {
          strokeWidth: 2,
          stroke: getEdgeColorFromSource(element.data.sourceHandle)
        }
      });
    }
  }, [element]);

  // Détermine la couleur par défaut en fonction de la source de l'arête
  const getEdgeColorFromSource = (sourceHandle) => {
    if (sourceHandle === 'yes') return '#10b981';
    if (sourceHandle === 'no') return '#ef4444';
    if (sourceHandle === 'alt') return '#3b82f6';
    if (sourceHandle === 'back') return '#8b5cf6';
    return '#6366f1';
  };

  const handleFormulaSelect = (selectedFormula) => {
    setProperties({
      ...properties,
      formula: selectedFormula.formula,
      variables: selectedFormula.variables,
      description: properties.description || selectedFormula.description
    });
    setShowFormulaSelector(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    // Gestion spéciale pour les propriétés imbriquées comme style.strokeWidth
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProperties(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? parseInt(value) : value
        }
      }));
    } else {
      setProperties(prev => ({
        ...prev,
        [name]: newValue
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (element && element.type === 'node') {
      onUpdateProperties(element.data.id, properties);
    } else if (element && element.type === 'edge') {
      onUpdateProperties(element.data.id, properties);
    }
  };

  // Fonction pour gérer le changement de type d'événement
  const handleEventTypeChange = (type) => {
    setProperties(prev => ({
      ...prev,
      eventType: type
    }));
  };

  // Fonction pour changer la couleur de l'arête
  const handleColorChange = (color) => {
    setProperties(prev => ({
      ...prev,
      style: {
        ...prev.style,
        stroke: color
      }
    }));
  };

  if (!element) return null;

  // Déterminer si l'élément est une connexion de décision (oui/non/autre)
  const isDecisionEdge = element.type === 'edge' &&
    (element.data.sourceHandle === 'yes' || element.data.sourceHandle === 'no' || element.data.sourceHandle === 'alt');

  return (
    <div className="w-96 bg-gray-50 border-l border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {element.type === 'node' ? 'Propriétés du nœud' : 'Propriétés de la connexion'}
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Propriétés communes à tous les types de nœuds */}
          {element.type === 'node' && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Étiquette
                </label>
                <input
                  type="text"
                  name="label"
                  value={properties.label || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          {/* Propriétés spécifiques aux tâches */}
          {element.type === 'node' && element.data.type === 'task' && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée (min)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={properties.duration || 0}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coût (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="cost"
                  value={properties.cost || 0}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigné à
                </label>
                <input
                  type="text"
                  name="assignedTo"
                  value={properties.assignedTo || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          {/* Propriétés spécifiques aux événements */}
          {element.type === 'node' && element.data.type === 'event' && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type d'événement
              </label>
              <div className="flex space-x-4 mt-2">
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
                    ? 'bg-purple-100 text-purple-800 border border-purple-300'
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
          )}

          {/* Propriétés spécifiques aux formules */}
          {element.type === 'node' && element.data.type === 'formula' && (
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

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                  <span>Variables</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newVariables = [...(properties.variables || []), { name: '', value: 0 }];
                      setProperties(prev => ({ ...prev, variables: newVariables }));
                    }}
                    className="text-xs text-purple-600 hover:text-purple-800"
                  >
                    + Ajouter
                  </button>
                </label>

                {/* Variables existantes (entrées par l'utilisateur) */}
                {(properties.variables || []).map((variable, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={variable.name}
                      onChange={(e) => {
                        const newVariables = [...properties.variables];
                        newVariables[index].name = e.target.value;
                        setProperties(prev => ({ ...prev, variables: newVariables }));
                      }}
                      placeholder="Nom"
                      className="w-1/2 px-2 py-1 text-sm border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      value={variable.value}
                      onChange={(e) => {
                        const newVariables = [...properties.variables];
                        newVariables[index].value = e.target.value;
                        setProperties(prev => ({ ...prev, variables: newVariables }));
                      }}
                      placeholder="Valeur"
                      className="w-1/2 px-2 py-1 text-sm border border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newVariables = [...properties.variables];
                        newVariables.splice(index, 1);
                        setProperties(prev => ({ ...prev, variables: newVariables }));
                      }}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

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

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition de déclenchement
                </label>
                <select
                  name="triggerType"
                  value={properties.triggerType || 'manual'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="manual">Manuel</option>
                  <option value="onChange">À chaque changement de variable</option>
                  <option value="onProcess">Lors de l'exécution du processus</option>
                  <option value="scheduled">Planifié</option>
                </select>
              </div>

              {properties.triggerType === 'scheduled' && (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fréquence (minutes)
                  </label>
                  <input
                    type="number"
                    name="frequency"
                    value={properties.frequency || 5}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              )}

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
          )}

          {/* Propriétés des connexions (arêtes) */}
          {element.type === 'edge' && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Étiquette
                </label>
                <input
                  type="text"
                  name="label"
                  value={properties.label || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-3 flex items-center">
                <input
                  type="checkbox"
                  id="animated"
                  name="animated"
                  checked={properties.animated || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-sm"
                />
                <label htmlFor="animated" className="ml-2 block text-sm text-gray-700">
                  Animation du flux
                </label>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Épaisseur du trait
                </label>
                <select
                  name="style.strokeWidth"
                  value={properties.style?.strokeWidth || 2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1}>Fin</option>
                  <option value={2}>Normal</option>
                  <option value={3}>Épais</option>
                  <option value={4}>Très épais</option>
                </select>
              </div>

              {/* Couleurs prédéfinies pour les arêtes */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Couleur
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {/* Couleurs de base */}
                  <button
                    type="button"
                    onClick={() => handleColorChange('#6366f1')} // Indigo
                    className="w-6 h-6 rounded-full bg-indigo-500 hover:ring-2 hover:ring-offset-1 hover:ring-indigo-500"
                    style={{ border: properties.style?.stroke === '#6366f1' ? '2px solid black' : 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleColorChange('#10b981')} // Vert (Oui)
                    className="w-6 h-6 rounded-full bg-green-500 hover:ring-2 hover:ring-offset-1 hover:ring-green-500"
                    style={{ border: properties.style?.stroke === '#10b981' ? '2px solid black' : 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleColorChange('#ef4444')} // Rouge (Non)
                    className="w-6 h-6 rounded-full bg-red-500 hover:ring-2 hover:ring-offset-1 hover:ring-red-500"
                    style={{ border: properties.style?.stroke === '#ef4444' ? '2px solid black' : 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleColorChange('#3b82f6')} // Bleu (Autre)
                    className="w-6 h-6 rounded-full bg-blue-500 hover:ring-2 hover:ring-offset-1 hover:ring-blue-500"
                    style={{ border: properties.style?.stroke === '#3b82f6' ? '2px solid black' : 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleColorChange('#8b5cf6')} // Violet
                    className="w-6 h-6 rounded-full bg-purple-500 hover:ring-2 hover:ring-offset-1 hover:ring-purple-500"
                    style={{ border: properties.style?.stroke === '#8b5cf6' ? '2px solid black' : 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleColorChange('#f59e0b')} // Orange
                    className="w-6 h-6 rounded-full bg-amber-500 hover:ring-2 hover:ring-offset-1 hover:ring-amber-500"
                    style={{ border: properties.style?.stroke === '#f59e0b' ? '2px solid black' : 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleColorChange('#64748b')} // Gris
                    className="w-6 h-6 rounded-full bg-slate-500 hover:ring-2 hover:ring-offset-1 hover:ring-slate-500"
                    style={{ border: properties.style?.stroke === '#64748b' ? '2px solid black' : 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleColorChange('#000000')} // Noir
                    className="w-6 h-6 rounded-full bg-black hover:ring-2 hover:ring-offset-1 hover:ring-black"
                    style={{ border: properties.style?.stroke === '#000000' ? '2px solid white' : 'none' }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Propriétés spécifiques aux scénarios */}
          {element.type === 'node' && element.data.type === 'scenario' && (
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

              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Scénarios
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newScenarios = [...(properties.scenarios || []), {
                        name: `Scénario ${(properties.scenarios || []).length + 1}`,
                        description: "Nouveau scénario",
                        active: true,
                        variables: [{ name: '', value: 0 }]
                      }];
                      setProperties(prev => ({ ...prev, scenarios: newScenarios }));
                    }}
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
                  {(properties.scenarios || []).map((scenario, scIndex) => (
                    <div
                      key={scIndex}
                      className="border border-gray-200 rounded-md p-3 bg-gray-50 relative"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const newScenarios = [...properties.scenarios];
                          newScenarios.splice(scIndex, 1);
                          setProperties(prev => ({ ...prev, scenarios: newScenarios }));
                        }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
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
                          onChange={(e) => {
                            const newScenarios = [...properties.scenarios];
                            newScenarios[scIndex].name = e.target.value;
                            setProperties(prev => ({ ...prev, scenarios: newScenarios }));
                          }}
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
                          onChange={(e) => {
                            const newScenarios = [...properties.scenarios];
                            newScenarios[scIndex].description = e.target.value;
                            setProperties(prev => ({ ...prev, scenarios: newScenarios }));
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="mb-2 flex items-center">
                        <input
                          type="checkbox"
                          id={`scenario-active-${scIndex}`}
                          checked={scenario.active !== false}
                          onChange={(e) => {
                            const newScenarios = [...properties.scenarios];
                            newScenarios[scIndex].active = e.target.checked;
                            setProperties(prev => ({ ...prev, scenarios: newScenarios }));
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-sm"
                        />
                        <label htmlFor={`scenario-active-${scIndex}`} className="ml-2 block text-sm text-gray-700">
                          Actif
                        </label>
                      </div>

                      <div className="mb-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1 flex justify-between">
                          <span>Variables modifiées</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newScenarios = [...properties.scenarios];
                              newScenarios[scIndex].variables = [
                                ...(newScenarios[scIndex].variables || []),
                                { name: '', value: 0 }
                              ];
                              setProperties(prev => ({ ...prev, scenarios: newScenarios }));
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            + Ajouter
                          </button>
                        </label>

                        {/* Liste des variables du scénario */}
                        {(scenario.variables || []).map((variable, varIndex) => (
                          <div key={varIndex} className="flex space-x-2 mb-2">
                            <input
                              type="text"
                              value={variable.name}
                              onChange={(e) => {
                                const newScenarios = [...properties.scenarios];
                                newScenarios[scIndex].variables[varIndex].name = e.target.value;
                                setProperties(prev => ({ ...prev, scenarios: newScenarios }));
                              }}
                              placeholder="Nom"
                              className="w-1/2 px-2 py-1 text-xs border border-gray-300 rounded-md"
                            />
                            <input
                              type="text"
                              value={variable.value}
                              onChange={(e) => {
                                const newScenarios = [...properties.scenarios];
                                newScenarios[scIndex].variables[varIndex].value = e.target.value;
                                setProperties(prev => ({ ...prev, scenarios: newScenarios }));
                              }}
                              placeholder="Valeur"
                              className="w-1/2 px-2 py-1 text-xs border border-gray-300 rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newScenarios = [...properties.scenarios];
                                newScenarios[scIndex].variables.splice(varIndex, 1);
                                setProperties(prev => ({ ...prev, scenarios: newScenarios }));
                              }}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Résultats de simulation (lecture seule) */}
              {element.data.data.simulationResults && element.data.data.simulationResults.length > 0 && (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Résultats de simulation
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs">
                      <thead>
                        <tr>
                          <th className="text-left text-gray-500">Scénario</th>
                          <th className="text-right text-gray-500">Marge</th>
                          <th className="text-center text-gray-500">Résilient</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {element.data.data.simulationResults.map((result, index) => (
                          <tr key={index} className={index % 2 === 0 ? '' : 'bg-gray-100'}>
                            <td className="py-1 text-gray-900">{result.scenario}</td>
                            <td className="py-1 text-right text-gray-900">
                              {typeof result.margin === 'number'
                                ? (result.margin % 1 !== 0 ? result.margin.toFixed(2) : result.margin)
                                : result.margin}%
                            </td>
                            <td className="py-1 text-center">
                              <span
                                className={`px-1 text-xs rounded ${result.isResilient
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                  }`}
                              >
                                {result.isResilient ? 'Oui' : 'Non'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
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
          )}

          {/* Description pour tous les éléments */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={properties.description || ''}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Information sur le type de connexion pour les arêtes de décision */}
          {isDecisionEdge && (
            <div className="mb-3 p-2 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-xs text-blue-800">
                Cette connexion est de type <strong>{element.data.sourceHandle === 'yes' ? 'Oui' : element.data.sourceHandle === 'no' ? 'Non' : 'Autre'}</strong> depuis un nœud de décision.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-xs text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Appliquer les modifications
          </button>
        </form>
      </div>
    </div>
  );
};

export default PropertyPanel;