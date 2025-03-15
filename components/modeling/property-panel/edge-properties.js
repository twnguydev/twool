import React from 'react';
import TaskProperties from './task-properties';
import EventProperties from './event-properties';
import FormulaProperties from './formula/formula-properties';
import ScenarioProperties from './scenario/scenario-properties';

const NodeProperties = ({ element, properties, handleChange, updateProperties }) => {
  if (!element || element.type !== 'node') return null;

  return (
    <>
      {/* Propriétés communes à tous les types de nœuds */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Étiquette
        </label>
        <input
          type="text"
          name="label"
          value={properties.label || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Propriétés spécifiques par type de nœud */}
      {element.data.type === 'task' && (
        <TaskProperties 
          properties={properties} 
          handleChange={handleChange} 
        />
      )}

      {element.data.type === 'event' && (
        <EventProperties 
          properties={properties} 
          updateProperties={updateProperties} 
        />
      )}

      {element.data.type === 'formula' && (
        <FormulaProperties 
          element={element} 
          properties={properties} 
          handleChange={handleChange}
          updateProperties={updateProperties}
        />
      )}

      {element.data.type === 'scenario' && (
        <ScenarioProperties 
          element={element} 
          properties={properties} 
          handleChange={handleChange}
          updateProperties={updateProperties}
        />
      )}
    </>
  );
};

export default NodeProperties;