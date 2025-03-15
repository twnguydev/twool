import React from 'react';

const TaskProperties = ({ properties, handleChange }) => {
  return (
    <>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Durée (min)
        </label>
        <input
          type="number"
          name="duration"
          value={properties.duration || 0}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Coût (€)
        </label>
        <input
          type="number"
          step="0.01"
          name="cost"
          value={properties.cost || 0}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assigné à
        </label>
        <input
          type="text"
          name="assignedTo"
          value={properties.assignedTo || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </>
  );
};

export default TaskProperties;