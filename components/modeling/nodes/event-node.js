// components/Modeling/Nodes/EventNode.js
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const EventNode = ({ data, isConnectable, selected }) => {
  const isStart = data.eventType === 'start';
  const isEndPositive = data.eventType === 'end' && data.endType === 'positive';
  const isEndNegative = data.eventType === 'end' && data.endType === 'negative';
  const isEndNeutral = data.eventType === 'end' && !data.endType;
  const isIntermediate = data.eventType === 'intermediate';

  let borderStyle, badgeStyle, badgeText;

  if (isStart) {
    borderStyle = selected ? 'border-2 border-blue-600' : 'border-2 border-blue-500';
    badgeStyle = 'bg-blue-100 text-blue-700';
    badgeText = 'Début';
  } else if (isEndPositive) {
    borderStyle = selected ? 'border-2 border-green-600' : 'border-2 border-green-500';
    badgeStyle = 'bg-green-100 text-green-700';
    badgeText = 'Fin (succès)';
  } else if (isEndNegative) {
    borderStyle = selected ? 'border-2 border-red-600' : 'border-2 border-red-500';
    badgeStyle = 'bg-red-100 text-red-700';
    badgeText = 'Fin (échec)';
  } else if (isEndNeutral) {
    borderStyle = selected ? 'border-2 border-orange-600' : 'border-2 border-orange-500';
    badgeStyle = 'bg-orange-100 text-orange-700';
    badgeText = 'Fin';
  } else {
    borderStyle = selected ? 'border-2 border-gray-600' : 'border-2 border-gray-500';
    badgeStyle = 'bg-gray-100 text-gray-700';
    badgeText = 'Intermédiaire';
  }

  // Taille réduite pour un design plus sobre
  const size = 80;

  return (
    <div className="flex items-center justify-center">
      {/* Badge indiquant le type d'événement */}
      <div className={`absolute ${data.workflowRef ? '-top-10' : '-top-6'}
        left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded text-xs font-medium ${badgeStyle}`}>
        {badgeText}
      </div>

      {/* Référence de workflow pour les événements intermédiaires */}
      {isIntermediate && data.workflowRef && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 rounded-md text-xs font-medium shadow-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
          REF: {data.workflowRef}
        </div>
      )}

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
      {!isEndNeutral || !isEndNegative || !isEndPositive && (
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