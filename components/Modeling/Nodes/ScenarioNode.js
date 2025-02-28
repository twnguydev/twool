// components/Modeling/Nodes/ScenarioNode.js
import React, { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';

const ScenarioNode = ({ data, isConnectable, selected }) => {
  const [activeTab, setActiveTab] = useState('scenarios');
  const [nodeHeight, setNodeHeight] = useState('auto');
  const contentRef = useRef(null);

  // Format utility function
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
        const minHeight = 120; // Hauteur minimale pour les nœuds avec peu de contenu
        const maxHeight = 600; // Hauteur maximale raisonnable
        
        // Ajuster la hauteur en fonction du contenu, avec limites
        const adjustedHeight = Math.max(minHeight, Math.min(contentHeight, maxHeight));
        setNodeHeight(adjustedHeight);
      }, 50);
    }
  }, [data.scenarios, activeTab, data.simulationResults]);

  return (
    <div
      className={`px-5 py-3 rounded-lg bg-white border-2 ${
        selected ? 'border-blue-500' : 'border-blue-400'
      } shadow-lg w-72`}
      style={{ minHeight: '120px' }}
    >
      {/* Handles d'entrée sur tous les côtés */}
      <Handle
        id="target-left"
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-400 border-2 border-blue-500"
        style={{ left: -9 }}
      />
      
      <Handle
        id="target-top"
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-400 border-2 border-blue-500"
        style={{ top: -9 }}
      />
      
      <Handle
        id="target-bottom"
        type="target"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-400 border-2 border-blue-500"
        style={{ bottom: -9 }}
      />
      
      <div className="flex flex-col">
        <div className="font-semibold text-center mb-2 text-gray-800 pb-1 border-b border-gray-100 flex items-center justify-center">
          <svg className="w-5 h-5 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {data.label}
        </div>
        
        {/* Onglets */}
        <div className="flex border-b border-gray-200 mb-3">
          <button
            className={`flex-1 py-2 text-xs font-medium ${
              activeTab === 'scenarios' 
                ? 'text-blue-600 border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('scenarios')}
          >
            Scénarios
          </button>
          <button
            className={`flex-1 py-2 text-xs font-medium ${
              activeTab === 'results' 
                ? 'text-blue-600 border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('results')}
          >
            Résultats
          </button>
        </div>

        {/* Contenu des onglets - sans hauteur maximale fixe */}
        <div 
          ref={contentRef} 
          className="overflow-y-auto"
          style={{ maxHeight: nodeHeight > 600 ? '600px' : 'none' }}
        >
          {/* Onglet Scénarios */}
          {activeTab === 'scenarios' && (
            <div className="space-y-3">
              {(data.scenarios || []).map((scenario, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-md ${
                    scenario.active 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-sm text-gray-800">{scenario.name}</div>
                    <div 
                      className={`w-3 h-3 rounded-full ${scenario.active ? 'bg-blue-500' : 'bg-gray-300'}`}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">{scenario.description}</div>
                  <div className="text-xs font-mono mt-2 text-gray-700 bg-white p-2 rounded border border-gray-100">
                    {scenario.variables.map((v, i) => (
                      <div key={i} className="flex justify-between py-0.5">
                        <span className="font-semibold">{v.name}:</span>
                        <span>{formatNumber(v.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {(data.scenarios || []).length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm flex flex-col items-center">
                  <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Aucun scénario défini
                  <button className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline focus:outline-none">
                    Ajouter un scénario
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Onglet Résultats */}
          {activeTab === 'results' && (
            <div>
              {data.simulationResults ? (
                <div className="space-y-3">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Scénario
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Marge
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Résilient
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.simulationResults.map((result, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-2 text-xs text-gray-900">{result.scenario}</td>
                          <td className="px-3 py-2 text-xs text-gray-900">{formatNumber(result.margin)}%</td>
                          <td className="px-3 py-2">
                            <span 
                              className={`px-2 py-1 text-xs rounded-full ${
                                result.isResilient 
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
                  
                  {data.threshold && (
                    <div className="bg-blue-50 p-2 rounded-md text-xs text-blue-800 mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Seuil de résilience: <span className="font-bold ml-1">{data.threshold}%</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm flex flex-col items-center">
                  <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Exécutez la simulation pour voir les résultats
                  <button className="mt-3 px-3 py-1 text-xs text-white bg-blue-500 hover:bg-blue-600 rounded-md focus:outline-none flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Lancer la simulation
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Handles de sortie sur tous les côtés */}
      <Handle
        id="source-right"
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-400 border-2 border-blue-500"
        style={{ right: -9 }}
      />
      
      <Handle
        id="source-bottom"
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-400 border-2 border-blue-500"
        style={{ bottom: -9 }}
      />
      
      <Handle
        id="source-top"
        type="source"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-400 border-2 border-blue-500"
        style={{ top: -9 }}
      />
    </div>
  );
};

export default memo(ScenarioNode);