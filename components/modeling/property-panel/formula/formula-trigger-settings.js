import React from 'react';

const FormulaTriggerSettings = ({ properties, handleChange }) => {
  return (
    <>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Condition de déclenchement
        </label>
        <select
          name="triggerType"
          value={properties.triggerType || 'manual'}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="manual">Manuel</option>
          <option value="onChange">À chaque changement de variable</option>
          <option value="onProcess">Lors de l'exécution du processus</option>
          <option value="scheduled">Planifié</option>
        </select>
      </div>

      {properties.triggerType === 'scheduled' && (
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fréquence (minutes)
          </label>
          <input
            type="number"
            name="frequency"
            value={properties.frequency || 5}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      )}
    </>
  );
};

export default FormulaTriggerSettings;