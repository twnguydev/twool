import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const FormulaNode = ({ data, isConnectable, selected }) => {
  const formatValue = (value) => {
    if (typeof value === 'number') {
      return value % 1 !== 0 ? value.toFixed(2) : value.toString();
    }
    return value;
  };

  return (
    <div
      className={`px-4 py-3 rounded-md bg-white ${
        selected ? 'border-2 border-gray-500' : 'border border-gray-300'
      } shadow-sm w-60`}
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
        
        {/* Afficher la formule avec formatage plus sobre */}
        {/* <div className="mb-2 text-xs bg-gray-50 p-2 rounded font-mono whitespace-pre-wrap text-gray-700">
          {data.formula || "f(x) = x"}
        </div> */}
        
        {/* Afficher les variables - style épuré */}
        {data.variables && data.variables.length > 0 && (
          <div className="flex flex-col space-y-1 mb-2">
            <p className="text-xs font-medium text-gray-600">Variables:</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {data.variables.map((variable, index) => (
                <div key={index} className="text-xs text-gray-600">
                  <span className="font-mono">{variable.name}: </span>
                  <span>{formatValue(variable.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Afficher les résultats - style épuré */}
        {data.assignedVariables && data.assignedVariables.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-600 mb-1">Résultats:</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {data.assignedVariables.map((assignedVar, index) => (
                <div key={index} className="text-xs">
                  <span className="font-mono text-gray-700">{assignedVar.name}: </span>
                  <span className="font-medium">{formatValue(assignedVar.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Afficher l'erreur s'il y en a une - plus discret */}
        {data.error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded text-xs text-red-600">
            Erreur: {data.error}
          </div>
        )}
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

export default memo(FormulaNode);