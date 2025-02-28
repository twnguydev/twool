// components/Modeling/Nodes/EventNode.js
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const EventNode = ({ data, isConnectable, selected }) => {
  // Déterminer s'il s'agit d'un nœud de début ou de fin
  const isStart = data.eventType === 'start';
  const isEnd = data.eventType === 'end';
  
  // Déterminer les couleurs en fonction du type
  let bgColor, borderColor, textColor;
  
  if (isStart) {
    bgColor = selected ? 'bg-green-100' : 'bg-green-50';
    borderColor = selected ? 'border-green-600' : 'border-green-500';
    textColor = 'text-green-700';
  } else if (isEnd) {
    bgColor = selected ? 'bg-red-100' : 'bg-red-50';
    borderColor = selected ? 'border-red-600' : 'border-red-500';
    textColor = 'text-red-700';
  } else {
    bgColor = selected ? 'bg-purple-100' : 'bg-purple-50';
    borderColor = selected ? 'border-purple-600' : 'border-purple-500';
    textColor = 'text-purple-700';
  }
  
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Handle target sur les différents côtés avec des IDs spécifiques */}
      <Handle
        id="target-left"
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 border-2 border-gray-500"
        style={{ left: -9 }}
      />
      
      <Handle
        id="target-top"
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 border-2 border-gray-500"
        style={{ top: -9 }}
      />
      
      <Handle
        id="target-bottom"
        type="target"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 border-2 border-gray-500"
        style={{ bottom: -9 }}
      />
      
      <Handle
        id="target-right"
        type="target"
        position={Position.Right}
        isConnectable={isConnectable && !isStart}
        className={`w-3 h-3 ${isStart ? 'bg-transparent border-0' : 'bg-gray-400 border-2 border-gray-500'}`}
        style={{ right: -9, opacity: isStart ? 0 : 1 }}
      />
      
      <div 
        className={`w-28 h-28 rounded-full ${bgColor} border-2 ${borderColor} shadow-lg flex flex-col items-center justify-center p-2`}
      >
        <div className={`font-semibold ${textColor} text-sm mt-1 text-center`}>
          {data.label}
        </div>
      </div>
      
      {/* Handles source sur les différents côtés avec des IDs spécifiques */}
      <Handle
        id="source-right"
        type="source"
        position={Position.Right}
        isConnectable={isConnectable && !isEnd}
        className={`w-3 h-3 ${isEnd ? 'bg-transparent border-0' : 'bg-gray-400 border-2 border-gray-500'}`}
        style={{ right: -9, opacity: isEnd ? 0 : 1 }}
      />
      
      <Handle
        id="source-bottom"
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable && !isEnd}
        className={`w-3 h-3 ${isEnd ? 'bg-transparent border-0' : 'bg-gray-400 border-2 border-gray-500'}`}
        style={{ bottom: -9, opacity: isEnd ? 0 : 1 }}
      />
      
      <Handle
        id="source-top"
        type="source"
        position={Position.Top}
        isConnectable={isConnectable && !isEnd}
        className={`w-3 h-3 ${isEnd ? 'bg-transparent border-0' : 'bg-gray-400 border-2 border-gray-500'}`}
        style={{ top: -9, opacity: isEnd ? 0 : 1 }}
      />
      
      <Handle
        id="source-left"
        type="source"
        position={Position.Left}
        isConnectable={isConnectable && !isEnd && !isStart}
        className={`w-3 h-3 ${isEnd || isStart ? 'bg-transparent border-0' : 'bg-gray-400 border-2 border-gray-500'}`}
        style={{ left: -9, opacity: isEnd || isStart ? 0 : 1 }}
      />
    </div>
  );
};

export default memo(EventNode);