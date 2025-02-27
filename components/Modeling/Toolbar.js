// components/Modeling/Toolbar.js
import React from 'react';

const Toolbar = ({ onSave, onSimulate, onOptimize, onAddNode }) => {
  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex items-center p-2 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex space-x-2 mr-4">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => onAddNode('task')}
          onDragStart={(e) => handleDragStart(e, 'task')}
          draggable
        >
          Tâche
        </button>
        <button
          className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
          onClick={() => onAddNode('decision')}
          onDragStart={(e) => handleDragStart(e, 'decision')}
          draggable
        >
          Décision
        </button>
        <button
          className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          onClick={() => onAddNode('event')}
          onDragStart={(e) => handleDragStart(e, 'event')}
          draggable
        >
          Événement
        </button>
      </div>

      <div className="h-6 border-l border-gray-300 mx-4"></div>

      <div className="flex space-x-2">
        <button 
          className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          onClick={onSave}
        >
          Enregistrer
        </button>
        <button
          className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
          onClick={onSimulate}
        >
          Simuler
        </button>
        <button
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
          onClick={onOptimize}
        >
          Optimiser
        </button>
      </div>

      <div className="flex-grow"></div>

      <div className="flex space-x-2">
        <button
          className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
        >
          Importer
        </button>
        <button
          className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
        >
          Exporter
        </button>
      </div>
    </div>
  );
};

export default Toolbar;