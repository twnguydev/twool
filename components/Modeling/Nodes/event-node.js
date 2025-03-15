import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const EventNode = ({ data, isConnectable, selected }) => {
  const isStart = data.eventType === 'start';
  const isEnd = data.eventType === 'end';
  const isIntermediate = data.eventType === 'intermediate';

  let borderStyle;
  
  if (isStart) {
    borderStyle = selected ? 'border-2 border-green-600' : 'border-2 border-green-500';
  } else if (isEnd) {
    borderStyle = selected ? 'border-2 border-red-600' : 'border-2 border-red-500';
  } else {
    borderStyle = selected ? 'border-2 border-gray-600' : 'border-2 border-gray-500';
  }
  
  // Taille réduite pour un design plus sobre
  const size = 80;
  
  return (
    <div className="flex items-center justify-center">
      {/* Handles d'entrée - plus discrets */}
      {!isStart && (
        <>
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
            id="target-right"
            type="target"
            position={Position.Right}
            isConnectable={isConnectable}
            className="w-2 h-2 bg-gray-400 border border-gray-500"
            style={{ right: -4 }}
          />
          
          <Handle
            id="target-bottom"
            type="target"
            position={Position.Bottom}
            isConnectable={isConnectable}
            className="w-2 h-2 bg-gray-400 border border-gray-500"
            style={{ bottom: -4 }}
          />
        </>
      )}
      
      <div 
        className={`rounded-full bg-white ${borderStyle} shadow-sm flex items-center justify-center`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <div className="text-center px-1">
          <div className="font-medium text-gray-700 text-sm">
            {data.label}
          </div>
          {data.description && (
            <div className="text-xs text-gray-500 mt-1">
              {data.description.length > 20
                ? data.description.substring(0, 20) + '...'
                : data.description}
            </div>
          )}
        </div>
      </div>
      
      {/* Handles de sortie - plus discrets */}
      {!isEnd && (
        <>
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
          
          <Handle
            id="source-left"
            type="source"
            position={Position.Left}
            isConnectable={isConnectable}
            className="w-2 h-2 bg-gray-400 border border-gray-500"
            style={{ left: -4 }}
          />
        </>
      )}
    </div>
  );
};

export default memo(EventNode);