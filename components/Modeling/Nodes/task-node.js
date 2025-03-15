import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const TaskNode = ({ data, isConnectable, selected }) => {
  return (
    <div
      className={`px-3 py-2 rounded-md bg-white ${
        selected ? 'border-2 border-gray-500' : 'border border-gray-300'
      } shadow-sm w-48`}
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

      <Handle
        id="target-right"
        type="target"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-gray-400 border border-gray-500"
        style={{ right: -4, opacity: 0 }}
      />

      <div className="flex flex-col">
        <div className="font-medium text-gray-700 mb-2 text-sm pb-1 border-b border-gray-200">
          {data.label}
        </div>

        <div className="grid grid-cols-2 gap-1">
          <div className="text-xs text-gray-600">
            <span className="text-gray-500">Durée:</span> {data.duration || 0} min
          </div>
          <div className="text-xs text-gray-600">
            <span className="text-gray-500">Coût:</span> {data.cost || 0}€
          </div>
        </div>

        {data.assignedTo && data.assignedTo !== 'Non assigné' && (
          <div className="mt-1 text-xs text-gray-600">
            <span className="text-gray-500">Assigné à:</span> {data.assignedTo}
          </div>
        )}

        {data.description && (
          <div className="mt-2 text-xs text-gray-500 border-t border-gray-200 pt-1">
            {data.description.length > 50 ? data.description.substring(0, 50) + '...' : data.description}
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

      <Handle
        id="source-left"
        type="source"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-gray-400 border border-gray-500"
        style={{ left: -4, opacity: 0 }}
      />
    </div>
  );
};

export default memo(TaskNode);