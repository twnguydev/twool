import React, { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';

const ScenarioNode = ({ data, isConnectable, selected }) => {
  const [activeTab, setActiveTab] = useState('scenarios');
  const [nodeHeight, setNodeHeight] = useState('auto');
  const contentRef = useRef(null);

  const formatNumber = (value) => {
    if (typeof value === 'number') {
      return value % 1 !== 0 ? value.toFixed(2) : value.toString();
    }
    return value;
  };

  // Ajustement dynamique de la hauteur en fonction du contenu
  useEffect(() => {
    if (contentRef.current) {
      // Petit délai pour permettre au DOM de se mettre à jour
      setTimeout(() => {
        // Calculer la hauteur du contenu réel
        const contentHeight = contentRef.current.scrollHeight;
        // Définir la hauteur minimale et maximale
        const minHeight = 100; // Hauteur minimale réduite
        const maxHeight = 400; // Hauteur maximale réduite
        
        // Ajuster la hauteur en fonction du contenu, avec limites
        const adjustedHeight = Math.max(minHeight, Math.min(contentHeight, maxHeight));
        setNodeHeight(adjustedHeight);
      }, 50);
    }
  }, [data.scenarios, activeTab, data.simulationResults]);

  return (
    <div
      className={`px-4 py-3 rounded-md bg-white ${
        selected ? 'border-2 border-gray-500' : 'border border-gray-300'
      } shadow-sm w-60`}
      style={{ minHeight: '100px' }}
    >
      {/* Handles d'entrée - plus discrets */}
      <Handle
        id="target-left"
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-gray-400 border border-gray-500"
        style={{ left: -4 }}
      />
      
      <Handle
        id="target-top"
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-gray-400 border border-gray-500"
        style={{ top: -4 }}
      />
      
      <Handle
        id="target-bottom"
        type="target"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-gray-400 border border-gray-500"
        style={{ bottom: -4 }}
      />
      
      <div className="flex flex-col">
        <div className="font-medium text-gray-700 mb-2 text-sm pb-2 border-b border-gray-200">
          {data.label}
        </div>
        
        {/* Onglets simplifiés */}
        <div className="flex mb-3">
          <button
            className={`flex-1 py-1 text-xs font-medium ${
              activeTab === 'scenarios' 
                ? 'text-gray-700 border-b-2 border-gray-500' 
                : 'text-gray-500 hover:text-gray-600'
            }`}
            onClick={() => setActiveTab('scenarios')}
          >
            Scénarios
          </button>
          <button
            className={`flex-1 py-1 text-xs font-medium ${
              activeTab === 'results' 
                ? 'text-gray-700 border-b-2 border-gray-500' 
                : 'text-gray-500 hover:text-gray-600'
            }`}
            onClick={() => setActiveTab('results')}
          >
            Résultats
          </button>
        </div>

        {/* Contenu des onglets */}
        <div 
          ref={contentRef} 
          className="overflow-y-auto"
          style={{ maxHeight: nodeHeight > 400 ? '400px' : 'none' }}
        >
          {/* Onglet Scénarios - design plus sobre */}
          {activeTab === 'scenarios' && (
            <div className="space-y-2">
              {(data.scenarios || []).map((scenario, index) => (
                <div 
                  key={index} 
                  className={`p-2 rounded ${
                    scenario.active 
                      ? 'bg-gray-50 border border-gray-200' 
                      : 'bg-gray-50 border border-gray-200 opacity-75'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-xs text-gray-700">{scenario.name}</div>
                    <div 
                      className={`w-2 h-2 rounded-full ${scenario.active ? 'bg-gray-500' : 'bg-gray-300'}`}
                    ></div>
                  </div>
                  {scenario.description && (
                    <div className="text-xs text-gray-500 mt-1">{scenario.description}</div>
                  )}
                  {scenario.variables && scenario.variables.length > 0 && (
                    <div className="text-xs font-mono mt-1 text-gray-600 p-1 bg-white rounded border border-gray-100">
                      {scenario.variables.map((v, i) => (
                        <div key={i} className="flex justify-between py-0.5">
                          <span>{v.name}:</span>
                          <span>{formatNumber(v.value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {(data.scenarios || []).length === 0 && (
                <div className="text-center py-3 text-gray-500 text-xs">
                  Aucun scénario défini
                </div>
              )}
            </div>
          )}
          
          {/* Onglet Résultats - design plus sobre */}
          {activeTab === 'results' && (
            <div>
              {data.simulationResults && data.simulationResults.length > 0 ? (
                <div className="space-y-2">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-2 py-1 text-left font-medium text-gray-600 border border-gray-200">
                          Scénario
                        </th>
                        <th className="px-2 py-1 text-right font-medium text-gray-600 border border-gray-200">
                          Marge
                        </th>
                        <th className="px-2 py-1 text-center font-medium text-gray-600 border border-gray-200">
                          Résilient
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.simulationResults.map((result, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-2 py-1 text-gray-700 border border-gray-200">{result.scenario}</td>
                          <td className="px-2 py-1 text-right text-gray-700 border border-gray-200">{formatNumber(result.margin)}%</td>
                          <td className="px-2 py-1 text-center border border-gray-200">
                            <span 
                              className={result.isResilient 
                                ? 'text-green-600' 
                                : 'text-red-600'
                              }
                            >
                              {result.isResilient ? 'Oui' : 'Non'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {data.threshold && (
                    <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 mt-2">
                      Seuil de résilience: <span className="font-medium">{data.threshold}%</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-xs">
                  Exécutez la simulation pour voir les résultats
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Handles de sortie - plus discrets */}
      <Handle
        id="source-right"
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-gray-400 border border-gray-500"
        style={{ right: -4 }}
      />
      
      <Handle
        id="source-bottom"
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-gray-400 border border-gray-500"
        style={{ bottom: -4 }}
      />
      
      <Handle
        id="source-top"
        type="source"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-gray-400 border border-gray-500"
        style={{ top: -4 }}
      />
    </div>
  );
};

export default memo(ScenarioNode);