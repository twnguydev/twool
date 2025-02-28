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

  return (
    <div className="flex flex-wrap items-center p-2 bg-white border-b border-gray-200 shadow-sm">
      {/* Section Nœuds */}
      <div className="relative mr-4">
        <button 
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={toggleNodeDropdown}
        >
          <Plus size={16} className="mr-2" />
          <span>Ajouter un nœud</span>
          <ChevronDown size={16} className="ml-2" />
        </button>
        
        {nodeDropdownOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <div className="py-1">
              <button
                className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100"
                onClick={() => {
                  onAddNode('task');
                  setNodeDropdownOpen(false);
                }}
                onDragStart={(e) => handleDragStart(e, 'task')}
                draggable
              >
                <FileText size={16} className="mr-2 text-blue-600" />
                Tâche
              </button>
              <button
                className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100"
                onClick={() => {
                  onAddNode('decision');
                  setNodeDropdownOpen(false);
                }}
                onDragStart={(e) => handleDragStart(e, 'decision')}
                draggable
              >
                <GitBranch size={16} className="mr-2 text-yellow-500" />
                Décision
              </button>
              <button
                className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100"
                onClick={() => {
                  onAddNode('event');
                  setNodeDropdownOpen(false);
                }}
                onDragStart={(e) => handleDragStart(e, 'event')}
                draggable
              >
                <Activity size={16} className="mr-2 text-green-600" />
                Événement
              </button>
              <button
                className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100"
                onClick={() => {
                  onAddNode('formula');
                  setNodeDropdownOpen(false);
                }}
                onDragStart={(e) => handleDragStart(e, 'formula')}
                draggable
              >
                <Calculator size={16} className="mr-2 text-purple-600" />
                Formule
              </button>
              <button
                className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100"
                onClick={() => {
                  onAddNode('scenario');
                  setNodeDropdownOpen(false);
                }}
                onDragStart={(e) => handleDragStart(e, 'scenario')}
                draggable
              >
                <Zap size={16} className="mr-2 text-blue-500" />
                Scénario
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Séparateur */}
      <div className="h-6 border-l border-gray-300 mx-2 hidden md:block"></div>

      {/* Section Actions principales */}
      <div className="flex space-x-2 mr-4">
        <button 
          className="flex items-center px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          onClick={onSave}
        >
          <Save size={16} className="mr-2" />
          <span className="hidden sm:inline">Enregistrer</span>
        </button>
        
        <button
          className="flex items-center px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
          onClick={onSimulate}
        >
          <Play size={16} className="mr-2" />
          <span className="hidden sm:inline">Simuler</span>
        </button>
        
        <button
          className="flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
          onClick={onOptimize}
        >
          <Sliders size={16} className="mr-2" />
          <span className="hidden sm:inline">Optimiser</span>
        </button>
      </div>

      {/* Section Actions avancées */}
      <div className="relative">
        <button 
          className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          onClick={toggleActionsDropdown}
        >
          <span>Actions avancées</span>
          <ChevronDown size={16} className="ml-2" />
        </button>
        
        {actionsDropdownOpen && (
          <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <div className="py-1">
              {executeFormulas && (
                <button
                  onClick={() => {
                    executeFormulas();
                    setActionsDropdownOpen(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-100"
                >
                  <Calculator size={16} className="mr-2 text-purple-800" />
                  Calculer les formules
                </button>
              )}
              
              {runScenarioSimulations && (
                <button
                  onClick={() => {
                    runScenarioSimulations();
                    setActionsDropdownOpen(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100"
                >
                  <Zap size={16} className="mr-2 text-blue-800" />
                  Simuler les scénarios
                </button>
              )}
              
              <button
                className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                onClick={() => setActionsDropdownOpen(false)}
              >
                <Upload size={16} className="mr-2 text-gray-700" />
                Importer
              </button>
              
              <button
                className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                onClick={() => setActionsDropdownOpen(false)}
              >
                <Download size={16} className="mr-2 text-gray-700" />
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