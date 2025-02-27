// components/Modeling/Nodes/DecisionNode.js
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const DecisionNode = ({ data, isConnectable, selected }) => {
  // Définir les dimensions du losange
  const width = 150;
  const height = 150;
  
  return (
    <div className="relative flex items-center justify-center">
      {/* Container principal pour centrer le losange */}
      <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
        {/* Handles d'entrée sur les côtés du losange */}
        <Handle
          id="target-left"
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-yellow-400 border-2 border-yellow-500"
          style={{ left: -9, top: '50%' }}
        />
        
        <Handle
          id="target-top"
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-yellow-400 border-2 border-yellow-500"
          style={{ top: -9, left: '50%' }}
        />
        
        <Handle
          id="target-right"
          type="target"
          position={Position.Right}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-yellow-400 border-2 border-yellow-500"
          style={{ right: -9, top: '50%', opacity: 0 }} // Invisible mais toujours fonctionnel
        />
        
        <Handle
          id="target-bottom"
          type="target"
          position={Position.Bottom}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-yellow-400 border-2 border-yellow-500"
          style={{ bottom: -9, left: '50%', opacity: 0 }} // Invisible mais toujours fonctionnel
        />
        
        {/* Forme en losange centrée */}
        <div 
          className={`absolute top-0 left-0 right-0 bottom-0 bg-white border-2 ${
            selected ? 'border-yellow-500' : 'border-yellow-400'
          } shadow-lg flex items-center justify-center`}
          style={{ transformOrigin: 'center' }}
        >
          <div className="w-32 text-center">
            <div className="font-semibold text-gray-800 mb-2">
              {data.label}
            </div>
            <div className="text-xs text-gray-600">
              {data.description && (data.description.length > 30 
                ? data.description.substring(0, 30) + '...' 
                : data.description)}
            </div>
          </div>
        </div>
        
        {/* Handles de sortie avec labels ajustés */}
        {/* Label OUI avec positionnement ajusté */}
        <div className="pointer-events-none absolute" 
             style={{ bottom: '-35px', left: '50%', transform: 'translateX(-50%)' }}>
          <div className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full shadow-sm">
            Oui
          </div>
        </div>
        <Handle
          id="yes"
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-green-400 border-2 border-green-500"
          style={{ bottom: -9, left: '50%' }}
        />
        
        {/* Label NON avec positionnement ajusté */}
        <div className="pointer-events-none absolute" 
             style={{ right: '-50px', top: '50%', transform: 'translateY(-50%)' }}>
          <div className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-full shadow-sm">
            Non
          </div>
        </div>
        <Handle
          id="no"
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-red-400 border-2 border-red-500"
          style={{ right: -9, top: '50%' }}
        />
        
        {/* Label AUTRE avec positionnement ajusté */}
        <div className="pointer-events-none absolute" 
             style={{ top: '-35px', left: '50%', transform: 'translateX(-50%)' }}>
          <div className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full shadow-sm">
            Autre
          </div>
        </div>
        <Handle
          id="alt"
          type="source"
          position={Position.Top}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-blue-400 border-2 border-blue-500"
          style={{ top: -9, left: '50%' }}
        />
        
        {/* Handle RETOUR avec positionnement ajusté */}
        <div className="pointer-events-none absolute" 
             style={{ left: '-30px', top: '50%', transform: 'translateY(-50%)' }}>
          <div className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded-full shadow-sm opacity-0">
            Retour
          </div>
        </div>
        <Handle
          id="back"
          type="source"
          position={Position.Left}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-purple-400 border-2 border-purple-500"
          style={{ left: -9, top: '50%', opacity: 0.7 }}
        />
      </div>
    </div>
  );
};

export default memo(DecisionNode);