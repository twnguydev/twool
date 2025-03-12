// components/Modeling/FormulaSelector.js
import React, { useState } from 'react';
import businessFormulaExamples from './utils/businessFormulaExamples';

/**
 * Composant qui permet de sélectionner des formules prédéfinies
 * pour les ajouter au nœud de formule
 */
const FormulaSelector = ({ onSelectFormula, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState(businessFormulaExamples[0].category);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrer les formules en fonction de la recherche
  const filteredFormulas = searchTerm
    ? businessFormulaExamples
        .flatMap(category => category.formulas.map(formula => ({
          ...formula,
          category: category.category
        })))
        .filter(formula => 
          formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          formula.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : businessFormulaExamples
        .find(category => category.category === selectedCategory)?.formulas || [];
  
  // Formater les formules pour l'affichage dans un tableau
  const formulasToDisplay = searchTerm
    ? filteredFormulas
    : filteredFormulas.map(formula => ({
        ...formula,
        category: selectedCategory
      }));
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-auto max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Sélectionnez une formule</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Rechercher une formule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Catégories (masquées en mode recherche) */}
          {!searchTerm && (
            <div className="w-64 border-r overflow-y-auto">
              <div className="p-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Catégories</h3>
                <ul>
                  {businessFormulaExamples.map(category => (
                    <li 
                      key={category.category}
                      className={`px-3 py-2 rounded-md cursor-pointer ${
                        selectedCategory === category.category
                          ? 'bg-purple-100 text-purple-700'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedCategory(category.category)}
                    >
                      {category.category}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Liste des formules */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="space-y-4">
                {formulasToDisplay.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucune formule trouvée
                  </div>
                ) : (
                  formulasToDisplay.map((formula, index) => (
                    <div 
                      key={index}
                      className="border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors"
                      onClick={() => onSelectFormula(formula)}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-800">{formula.name}</h3>
                          {searchTerm && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {formula.category}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{formula.description}</p>
                        <div className="mt-2 bg-gray-50 p-2 rounded-md">
                          <code className="text-sm font-mono text-purple-700">{formula.formula}</code>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          <span className="font-medium">Variables:</span>{' '}
                          {formula.variables.map(v => v.name).join(', ')}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormulaSelector;