// components/Modeling/Nodes/TaskNode.js
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const TaskNode = ({ data, isConnectable, selected }) => {
  return (
    <div
      className={`px-5 py-3 rounded-lg bg-white border-2 ${selected ? 'border-blue-500' : 'border-blue-400'
        } shadow-lg w-52 h-auto`}
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

      <Handle
        id="target-right"
        type="target"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-400 border-2 border-blue-500"
        style={{ right: -9, opacity: 0 }} // Invisible mais toujours fonctionnel
      />

      <div className="flex flex-col">
        <div className="font-semibold text-center mb-2 text-gray-800 pb-1 border-b border-gray-100">
          {data.label}
        </div>

        <div className="flex justify-between items-center py-1">
          <div className="flex items-center text-xs text-gray-600">
            <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{data.duration} min</span>
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{data.cost}€</span>
          </div>
        </div>

        {data.assignedTo && data.assignedTo !== 'Non assigné' && (
          <div className="mt-1 text-xs text-gray-600 flex items-center">
            <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{data.assignedTo}</span>
          </div>
        )}

        {data.description && (
          <div className="mt-2 text-xs text-gray-500 italic text-center border-t border-gray-100 pt-1 truncate">
            {data.description.length > 40 ? data.description.substring(0, 40) + '...' : data.description}
          </div>
        )}
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

      <Handle
        id="source-left"
        type="source"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-400 border-2 border-blue-500"
        style={{ left: -9, opacity: 0 }} // Invisible mais toujours fonctionnel
      />
    </div>
  );
};

export default memo(TaskNode);