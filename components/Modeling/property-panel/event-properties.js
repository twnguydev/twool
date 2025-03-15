import React from 'react';

const EventProperties = ({ properties, updateProperties }) => {
  const handleEventTypeChange = (type) => {
    updateProperties({ eventType: type });
  };

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Type d'événement
      </label>
      <div className="flex space-x-4 mt-2">
        <button
          type="button"
          onClick={() => handleEventTypeChange('start')}
          className={`px-3 py-1 rounded-md text-sm ${properties.eventType === 'start'
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
        >
          Début
        </button>
        <button
          type="button"
          onClick={() => handleEventTypeChange('intermediate')}
          className={`px-3 py-1 rounded-md text-sm ${properties.eventType === 'intermediate'
            ? 'bg-purple-100 text-purple-800 border border-purple-300'
            : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
        >
          Intermédiaire
        </button>
        <button
          type="button"
          onClick={() => handleEventTypeChange('end')}
          className={`px-3 py-1 rounded-md text-sm ${properties.eventType === 'end'
            ? 'bg-red-100 text-red-800 border border-red-300'
            : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
        >
          Fin
        </button>
      </div>
    </div>
  );
};

export default EventProperties;