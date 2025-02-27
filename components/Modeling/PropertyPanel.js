// components/Modeling/PropertyPanel.js
import React, { useState, useEffect } from 'react';

const PropertyPanel = ({ element, onUpdateProperties }) => {
  const [properties, setProperties] = useState({});
  
  // Initialiser les propriétés lorsque l'élément sélectionné change
  useEffect(() => {
    if (element && element.type === 'node') {
      // Pour les nœuds, copier toutes les propriétés data
      setProperties({ ...element.data.data });
    } else if (element && element.type === 'edge') {
      // Pour les arêtes, initialiser avec les propriétés existantes ou des valeurs par défaut
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
  
  // Détermine la couleur par défaut en fonction de la source de l'arête
  const getEdgeColorFromSource = (sourceHandle) => {
    if (sourceHandle === 'yes') return '#10b981';
    if (sourceHandle === 'no') return '#ef4444';
    if (sourceHandle === 'alt') return '#3b82f6';
    if (sourceHandle === 'back') return '#8b5cf6';
    return '#6366f1';
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    // Gestion spéciale pour les propriétés imbriquées comme style.strokeWidth
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
  
  // Fonction pour gérer le changement de type d'événement
  const handleEventTypeChange = (type) => {
    setProperties(prev => ({
      ...prev,
      eventType: type
    }));
  };
  
  // Fonction pour changer la couleur de l'arête
  const handleColorChange = (color) => {
    setProperties(prev => ({
      ...prev,
      style: {
        ...prev.style,
        stroke: color
      }
    }));
  };
  
  if (!element) return null;
  
  // Déterminer si l'élément est une connexion de décision (oui/non/autre)
  const isDecisionEdge = element.type === 'edge' && 
    (element.data.sourceHandle === 'yes' || element.data.sourceHandle === 'no' || element.data.sourceHandle === 'alt');
  
  return (
    <div className="w-64 bg-gray-50 p-4 border-l border-gray-200 overflow-y-auto">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {element.type === 'node' ? 'Propriétés du nœud' : 'Propriétés de la connexion'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        {/* Propriétés communes à tous les types de nœuds */}
        {element.type === 'node' && (
          <>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Étiquette
              </label>
              <input
                type="text"
                name="label"
                value={properties.label || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}
        
        {/* Propriétés spécifiques aux tâches */}
        {element.type === 'node' && element.data.type === 'task' && (
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}
        
        {/* Propriétés spécifiques aux événements */}
        {element.type === 'node' && element.data.type === 'event' && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type d'événement
            </label>
            <div className="flex space-x-4 mt-2">
              <button
                type="button"
                onClick={() => handleEventTypeChange('start')}
                className={`px-3 py-1 rounded-md text-sm ${
                  properties.eventType === 'start' 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                }`}
              >
                Début
              </button>
              <button
                type="button"
                onClick={() => handleEventTypeChange('intermediate')}
                className={`px-3 py-1 rounded-md text-sm ${
                  properties.eventType === 'intermediate' 
                    ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                }`}
              >
                Intermédiaire
              </button>
              <button
                type="button"
                onClick={() => handleEventTypeChange('end')}
                className={`px-3 py-1 rounded-md text-sm ${
                  properties.eventType === 'end' 
                    ? 'bg-red-100 text-red-800 border border-red-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                }`}
              >
                Fin
              </button>
            </div>
          </div>
        )}
        
        {/* Propriétés des connexions (arêtes) */}
        {element.type === 'edge' && (
          <>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Étiquette
              </label>
              <input
                type="text"
                name="label"
                value={properties.label || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="mb-3 flex items-center">
              <input
                type="checkbox"
                id="animated"
                name="animated"
                checked={properties.animated || false}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="animated" className="ml-2 block text-sm text-gray-700">
                Animation du flux
              </label>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Épaisseur du trait
              </label>
              <select
                name="style.strokeWidth"
                value={properties.style?.strokeWidth || 2}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>Fin</option>
                <option value={2}>Normal</option>
                <option value={3}>Épais</option>
                <option value={4}>Très épais</option>
              </select>
            </div>
            
            {/* Couleurs prédéfinies pour les arêtes */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Couleur
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {/* Couleurs de base */}
                <button
                  type="button"
                  onClick={() => handleColorChange('#6366f1')} // Indigo
                  className="w-6 h-6 rounded-full bg-indigo-500 hover:ring-2 hover:ring-offset-1 hover:ring-indigo-500"
                  style={{ border: properties.style?.stroke === '#6366f1' ? '2px solid black' : 'none' }}
                />
                <button
                  type="button"
                  onClick={() => handleColorChange('#10b981')} // Vert (Oui)
                  className="w-6 h-6 rounded-full bg-green-500 hover:ring-2 hover:ring-offset-1 hover:ring-green-500"
                  style={{ border: properties.style?.stroke === '#10b981' ? '2px solid black' : 'none' }}
                />
                <button
                  type="button"
                  onClick={() => handleColorChange('#ef4444')} // Rouge (Non)
                  className="w-6 h-6 rounded-full bg-red-500 hover:ring-2 hover:ring-offset-1 hover:ring-red-500"
                  style={{ border: properties.style?.stroke === '#ef4444' ? '2px solid black' : 'none' }}
                />
                <button
                  type="button"
                  onClick={() => handleColorChange('#3b82f6')} // Bleu (Autre)
                  className="w-6 h-6 rounded-full bg-blue-500 hover:ring-2 hover:ring-offset-1 hover:ring-blue-500"
                  style={{ border: properties.style?.stroke === '#3b82f6' ? '2px solid black' : 'none' }}
                />
                <button
                  type="button"
                  onClick={() => handleColorChange('#8b5cf6')} // Violet
                  className="w-6 h-6 rounded-full bg-purple-500 hover:ring-2 hover:ring-offset-1 hover:ring-purple-500"
                  style={{ border: properties.style?.stroke === '#8b5cf6' ? '2px solid black' : 'none' }}
                />
                <button
                  type="button"
                  onClick={() => handleColorChange('#f59e0b')} // Orange
                  className="w-6 h-6 rounded-full bg-amber-500 hover:ring-2 hover:ring-offset-1 hover:ring-amber-500"
                  style={{ border: properties.style?.stroke === '#f59e0b' ? '2px solid black' : 'none' }}
                />
                <button
                  type="button"
                  onClick={() => handleColorChange('#64748b')} // Gris
                  className="w-6 h-6 rounded-full bg-slate-500 hover:ring-2 hover:ring-offset-1 hover:ring-slate-500"
                  style={{ border: properties.style?.stroke === '#64748b' ? '2px solid black' : 'none' }}
                />
                <button
                  type="button"
                  onClick={() => handleColorChange('#000000')} // Noir
                  className="w-6 h-6 rounded-full bg-black hover:ring-2 hover:ring-offset-1 hover:ring-black"
                  style={{ border: properties.style?.stroke === '#000000' ? '2px solid white' : 'none' }}
                />
              </div>
            </div>
          </>
        )}
        
        {/* Description pour tous les éléments */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={properties.description || ''}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Information sur le type de connexion pour les arêtes de décision */}
        {isDecisionEdge && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-100 rounded-md">
            <p className="text-xs text-blue-800">
              Cette connexion est de type <strong>{element.data.sourceHandle === 'yes' ? 'Oui' : element.data.sourceHandle === 'no' ? 'Non' : 'Autre'}</strong> depuis un nœud de décision.
            </p>
          </div>
        )}
        
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Appliquer les modifications
        </button>
      </form>
    </div>
  );
};

export default PropertyPanel;