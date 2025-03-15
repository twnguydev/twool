import React, { useState, useEffect } from 'react';
import NodeProperties from './node-properties';
import EdgeProperties from './edge-properties';
import { getEdgeColorFromSource } from '../utils/property-panel';

const PropertyPanel = ({ element, onUpdateProperties }) => {
  const [properties, setProperties] = useState({});

  useEffect(() => {
    if (element && element.type === 'node') {
      setProperties({ ...element.data.data });
    } else if (element && element.type === 'edge') {
      const edgeData = element.data.data || {};
      setProperties({
        label: edgeData.label || element.data.label || '',
        description: edgeData.description || '',
        animated: edgeData.animated || false,
        style: edgeData.style || {
          strokeWidth: 2,
          stroke: getEdgeColorFromSource(element.data.sourceHandle)
        }
      });
    }
  }, [element]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProperties(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? parseInt(value) : value
        }
      }));
    } else {
      setProperties(prev => ({
        ...prev,
        [name]: newValue
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (element && element.type === 'node') {
      onUpdateProperties(element.data.id, properties);
    } else if (element && element.type === 'edge') {
      onUpdateProperties(element.data.id, properties);
    }
  };

  const updateProperties = (newProps) => {
    setProperties(prev => ({
      ...prev,
      ...newProps
    }));
  };

  if (!element) return null;

  return (
    <div className="w-96 bg-gray-50 border-l border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {element.type === 'node' ? 'Propriétés du nœud' : 'Propriétés de la connexion'}
        </h3>

        <form onSubmit={handleSubmit}>
          {element.type === 'node' ? (
            <NodeProperties 
              element={element} 
              properties={properties} 
              handleChange={handleChange} 
              updateProperties={updateProperties}
            />
          ) : (
            <EdgeProperties 
              element={element} 
              properties={properties} 
              handleChange={handleChange} 
              updateProperties={updateProperties}
            />
          )}
          
          {/* Description commune à tous les éléments */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={properties.description || ''}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-xs text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Appliquer les modifications
          </button>
        </form>
      </div>
    </div>
  );
};

export default PropertyPanel;