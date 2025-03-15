import React from 'react';

const SimulationResults = ({ results }) => {
  if (!results || results.length === 0) return null;

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Résultats de simulation
      </label>
      <div className="bg-gray-50 p-3 rounded-md border border-gray-200 max-h-60 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200 text-xs">
          <thead>
            <tr>
              <th className="text-left text-gray-500">Scénario</th>
              <th className="text-right text-gray-500">Marge</th>
              <th className="text-center text-gray-500">Résilient</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {results.map((result, index) => (
              <tr key={index} className={index % 2 === 0 ? '' : 'bg-gray-100'}>
                <td className="py-1 text-gray-900">{result.scenario}</td>
                <td className="py-1 text-right text-gray-900">
                  {typeof result.margin === 'number'
                    ? (result.margin % 1 !== 0 ? result.margin.toFixed(2) : result.margin)
                    : result.margin}%
                </td>
                <td className="py-1 text-center">
                  <span
                    className={`px-1 text-xs rounded ${result.isResilient
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {result.isResilient ? 'Oui' : 'Non'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SimulationResults;