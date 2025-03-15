import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const DecisionNode = ({ data, isConnectable, selected }) => {
  // Dimensions du losange plus modérées
  const width = 120;
  const height = 120;
  
  return (
    <div className="relative">
      {/* Conteneur principal */}
      <div style={{ width: `${width}px`, height: `${height}px` }}>
        {/* Forme en losange avec des styles plus sobres */}
        <div 
          className={`absolute inset-0 bg-white ${
            selected ? 'border-2 border-gray-500' : 'border border-gray-400'
          } shadow-sm rotate-45 flex items-center justify-center`}
          style={{ transformOrigin: 'center' }}
        />
        
        {/* Conteneur pour le contenu (non pivoté) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-28 text-center -rotate-0">
            <div className="font-medium text-gray-700 mb-1 text-sm">
              {data.label}
            </div>
            {data.description && (
              <div className="text-xs text-gray-500">
                {data.description.length > 25 
                  ? data.description.substring(0, 25) + '...' 
                  : data.description}
              </div>
            )}
          </div>
        </div>
        
        {/* Handles - moins visibles mais toujours fonctionnels */}
        {/* Handles d'entrée */}
        <Handle
          id="target-left"
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          className="w-2 h-2 bg-gray-400 border border-gray-500"
          style={{ left: -4, top: '50%' }}
        />
        
        <Handle
          id="target-top"
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          className="w-2 h-2 bg-gray-400 border border-gray-500"
          style={{ top: -4, left: '50%' }}
        />
        
        <Handle
          id="target-right"
          type="target"
          position={Position.Right}
          isConnectable={isConnectable}
          className="w-2 h-2 bg-gray-400 border border-gray-500"
          style={{ right: -4, top: '50%', opacity: 0 }}
        />
        
        <Handle
          id="target-bottom"
          type="target"
          position={Position.Bottom}
          isConnectable={isConnectable}
          className="w-2 h-2 bg-gray-400 border border-gray-500"
          style={{ bottom: -4, left: '50%', opacity: 0 }}
        />
        
        {/* Handles de sortie avec étiquettes discrètes */}
        {/* Handle Oui */}
        <div className="absolute pointer-events-none" 
             style={{ bottom: '-25px', left: '50%', transform: 'translateX(-50%)' }}>
          <div className="text-xs font-medium text-green-600">
            Oui
          </div>
        </div>
        <Handle
          id="yes"
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          className="w-2 h-2 bg-green-500 border border-green-600"
          style={{ bottom: -4, left: '50%' }}
        />
        
        {/* Handle Non */}
        <div className="absolute pointer-events-none" 
             style={{ right: '-25px', top: '50%', transform: 'translateY(-50%)' }}>
          <div className="text-xs font-medium text-red-600">
            Non
          </div>
        </div>
        <Handle
          id="no"
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="w-2 h-2 bg-red-500 border border-red-600"
          style={{ right: -4, top: '50%' }}
        />
        
        {/* Handle Autre */}
        <div className="absolute pointer-events-none" 
             style={{ top: '-25px', left: '50%', transform: 'translateX(-50%)' }}>
          <div className="text-xs font-medium text-blue-600">
            Autre
          </div>
        </div>
        <Handle
          id="alt"
          type="source"
          position={Position.Top}
          isConnectable={isConnectable}
          className="w-2 h-2 bg-blue-500 border border-blue-600"
          style={{ top: -4, left: '50%' }}
        />
        
        {/* Handle Retour - plus discret */}
        <Handle
          id="back"
          type="source"
          position={Position.Left}
          isConnectable={isConnectable}
          className="w-2 h-2 bg-gray-400 border border-gray-500"
          style={{ left: -4, top: '50%', opacity: 0.7 }}
        />
      </div>
    </div>
  );
};

export default memo(DecisionNode);