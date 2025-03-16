// components/Modeling/Toolbar.js
import React, { useState } from 'react';
import { Save, Play, Sliders, Plus, ChevronDown, Upload, Download, Calculator, Zap, Activity, FileText, GitBranch } from 'lucide-react';

const Toolbar = ({ onSave, onSimulate, onOptimize, onAddNode, executeFormulas, runScenarioSimulations }) => {
  const [nodeDropdownOpen, setNodeDropdownOpen] = useState(false);
  const [actionsDropdownOpen, setActionsDropdownOpen] = useState(false);
  
  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const toggleNodeDropdown = () => setNodeDropdownOpen(!nodeDropdownOpen);
  const toggleActionsDropdown = () => setActionsDropdownOpen(!actionsDropdownOpen);

  // Fonction pour fermer les dropdowns lorsqu'on clique en dehors
  const handleClickOutside = (e) => {
    if (!e.target.closest('.dropdown-container')) {
      setNodeDropdownOpen(false);
      setActionsDropdownOpen(false);
    }
  };

  // Ajouter l'événement au montage et le nettoyer au démontage
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center p-2 bg-white border-b border-gray-200 shadow-sm">
      {/* Section Nœuds */}
      <div className="relative mr-4 dropdown-container">
        <button 
          className="flex items-center px-3 py-2 border border-indigo-600 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 hover:border-indigo-700 transition-colors"
          onClick={toggleNodeDropdown}
        >
          <Plus size={16} className="mr-2" />
          <span>Ajouter un nœud</span>
          <ChevronDown size={16} className="ml-2" />
        </button>
        
        {nodeDropdownOpen && (
          <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-sm z-10 border border-gray-200">
            <div className="py-1">
              <button
                className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  onAddNode('task');
                  setNodeDropdownOpen(false);
                }}
                onDragStart={(e) => handleDragStart(e, 'task')}
                draggable
              >
                <FileText size={16} className="mr-2 text-gray-600" />
                Tâche
              </button>
              <button
                className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  onAddNode('decision');
                  setNodeDropdownOpen(false);
                }}
                onDragStart={(e) => handleDragStart(e, 'decision')}
                draggable
              >
                <GitBranch size={16} className="mr-2 text-gray-600" />
                Décision
              </button>
              <button
                className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  onAddNode('event');
                  setNodeDropdownOpen(false);
                }}
                onDragStart={(e) => handleDragStart(e, 'event')}
                draggable
              >
                <Activity size={16} className="mr-2 text-gray-600" />
                Événement
              </button>
              <button
                className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  onAddNode('formula');
                  setNodeDropdownOpen(false);
                }}
                onDragStart={(e) => handleDragStart(e, 'formula')}
                draggable
              >
                <Calculator size={16} className="mr-2 text-gray-600" />
                Formule
              </button>
              <button
                className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  onAddNode('scenario');
                  setNodeDropdownOpen(false);
                }}
                onDragStart={(e) => handleDragStart(e, 'scenario')}
                draggable
              >
                <Zap size={16} className="mr-2 text-gray-600" />
                Scénario
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Séparateur */}
      <div className="h-6 border-l border-gray-200 mx-2 hidden md:block"></div>

      {/* Section Actions principales */}
      <div className="flex space-x-2 mr-4">
        <button 
          className="flex items-center px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          onClick={onSave}
          title="Enregistrer le workflow"
        >
          <Save size={16} className="mr-1" />
          <span className="hidden sm:inline">Enregistrer</span>
        </button>
        
        <button
          className="flex items-center px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          onClick={onSimulate}
          title="Lancer une simulation"
        >
          <Play size={16} className="mr-1" />
          <span className="hidden sm:inline">Simuler</span>
        </button>
        
        <button
          className="flex items-center px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          onClick={onOptimize}
          title="Optimiser le workflow"
        >
          <Sliders size={16} className="mr-1" />
          <span className="hidden sm:inline">Optimiser</span>
        </button>
      </div>

      {/* Section Actions avancées */}
      <div className="relative dropdown-container">
        <button 
          className="flex items-center px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          onClick={toggleActionsDropdown}
        >
          <span>Actions</span>
          <ChevronDown size={16} className="ml-2" />
        </button>
        
        {actionsDropdownOpen && (
          <div className="absolute left-0 mt-1 w-56 bg-white rounded-md shadow-sm z-10 border border-gray-200">
            <div className="py-1">
              {executeFormulas && (
                <button
                  onClick={() => {
                    executeFormulas();
                    setActionsDropdownOpen(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <Calculator size={16} className="mr-2 text-gray-600" />
                  Calculer les formules
                </button>
              )}
              
              {runScenarioSimulations && (
                <button
                  onClick={() => {
                    runScenarioSimulations();
                    setActionsDropdownOpen(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <Zap size={16} className="mr-2 text-gray-600" />
                  Simuler les scénarios
                </button>
              )}
              
              <div className="border-t border-gray-200 my-1"></div>
              
              <button
                className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setActionsDropdownOpen(false)}
              >
                <Upload size={16} className="mr-2 text-gray-600" />
                Importer
              </button>
              
              <button
                className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setActionsDropdownOpen(false)}
              >
                <Download size={16} className="mr-2 text-gray-600" />
                Exporter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar;