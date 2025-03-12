// components/Modeling/Nodes/FormulaNode.js
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const FormulaNode = ({ data, isConnectable, selected }) => {
  // Fonction pour formater correctement la valeur d'un résultat
  const formatValue = (value) => {
    if (typeof value === 'number') {
      // Si le nombre a des décimales, limiter à 2 chiffres après la virgule
      return value % 1 !== 0 ? value.toFixed(2) : value.toString();
    }
    return value;
  };

  return (
    <div
      className={`px-5 py-3 rounded-lg bg-white border-2 ${
        selected ? 'border-purple-500' : 'border-purple-400'
      } shadow-lg w-72 h-auto`}
    >
      {/* Handles d'entrée sur tous les côtés */}
      <Handle
        id="target-left"
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-400 border-2 border-purple-500"
        style={{ left: -9 }}
      />
      
      <Handle
        id="target-top"
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-400 border-2 border-purple-500"
        style={{ top: -9 }}
      />
      
      <Handle
        id="target-bottom"
        type="target"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-400 border-2 border-purple-500"
        style={{ bottom: -9 }}
      />
      
      <div className="flex flex-col">
        <div className="font-semibold text-center mb-2 text-gray-800 pb-1 border-b border-gray-100 flex items-center justify-center">
          <svg className="w-5 h-5 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {data.label}
        </div>
        
        {/* Afficher la formule avec formatage */}
        <div className="mb-2 text-xs bg-purple-50 p-2 rounded-md font-mono whitespace-pre-wrap">
          {data.formula || "f(x) = x"}
        </div>
        
        {/* Afficher les variables */}
        {data.variables && data.variables.length > 0 && (
          <div className="flex flex-col space-y-1 mb-2">
            <p className="text-xs font-medium text-gray-700">Variables:</p>
            <div className="grid grid-cols-1 gap-1">
              {data.variables.map((variable, index) => (
                <div key={index} className="text-xs text-gray-600 flex justify-between">
                  <span className="font-mono font-semibold">{variable.name}:</span>
                  <span>{formatValue(variable.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Afficher les résultats */}
        {data.results && data.results.length > 0 ? (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-700 mb-1">Résultats:</p>
            {data.assignedVariables && data.assignedVariables.map((assignedVar, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm font-mono text-purple-700">{assignedVar.name}:</span>
                <span className="text-sm font-bold">{formatValue(assignedVar.value)}</span>
              </div>
            ))}
            {!data.assignedVariables && data.result !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-purple-700">Résultat:</span>
                <span className="text-sm font-bold">{formatValue(data.result)}</span>
              </div>
            )}
          </div>
        ) : data.result !== undefined && (
          <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm font-medium text-purple-700">Résultat:</span>
            <span className="text-sm font-bold">{formatValue(data.result)}</span>
          </div>
        )}
        
        {/* Afficher l'erreur s'il y en a une */}
        {data.error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-sm text-xs text-red-600">
            Erreur: {data.error}
          </div>
        )}
      </div>
      
      {/* Handles de sortie sur tous les côtés */}
      <Handle
        id="source-right"
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-400 border-2 border-purple-500"
        style={{ right: -9 }}
      />
      
      <Handle
        id="source-bottom"
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-400 border-2 border-purple-500"
        style={{ bottom: -9 }}
      />
      
      <Handle
        id="source-top"
        type="source"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-400 border-2 border-purple-500"
        style={{ top: -9 }}
      />
    </div>
  );
};

export default memo(FormulaNode);