import React from 'react';

// Composant pour sélectionner les couleurs prédéfinies
const ColorSelector = ({ currentColor, onChange }) => {
  const colorOptions = [
    { value: '#6366f1', label: 'Indigo', bgClass: 'bg-indigo-500' },
    { value: '#10b981', label: 'Vert (Oui)', bgClass: 'bg-green-500' },
    { value: '#ef4444', label: 'Rouge (Non)', bgClass: 'bg-red-500' },
    { value: '#3b82f6', label: 'Bleu (Autre)', bgClass: 'bg-blue-500' },
    { value: '#8b5cf6', label: 'Violet', bgClass: 'bg-purple-500' },
    { value: '#f59e0b', label: 'Orange', bgClass: 'bg-amber-500' },
    { value: '#64748b', label: 'Gris', bgClass: 'bg-slate-500' },
    { value: '#000000', label: 'Noir', bgClass: 'bg-black' }
  ];

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Couleur
      </label>
      <div className="flex flex-wrap gap-2 mt-1">
        {colorOptions.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            className={`w-6 h-6 rounded-full ${color.bgClass} hover:ring-2 hover:ring-offset-1 hover:ring-${color.bgClass.replace('bg-', '')}`}
            style={{ 
              border: currentColor === color.value 
                ? (color.value === '#000000' ? '2px solid white' : '2px solid black') 
                : 'none' 
            }}
            title={color.label}
            aria-label={`Sélectionner la couleur ${color.label}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;