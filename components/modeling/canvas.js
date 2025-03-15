// components/Modeling/Canvas.js
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
  getBezierPath
} from 'reactflow';
import 'reactflow/dist/style.css';

// Importer les nouveaux composants de nœuds redessinés
import TaskNode from './nodes/task-node';
import DecisionNode from './nodes/decision-node';
import EventNode from './nodes/event-node';
import FormulaNode from './nodes/formula-node';
import ScenarioNode from './nodes/scenario-node';

import ScenarioSimulator from './utils/scenario-simulator';
import PropertyPanel from './property-panel/index';
import Toolbar from './toolbar';
import FormulaCalculator from './utils/formula-calculator';
import {
  getConnectionLineStyle,
  getEdgeStyle,
  getConnectionParams,
  generateNodeId,
  getDefaultNodeLabel,
  getProcessMetrics
} from './utils/flow';

// Définition des types de nœuds personnalisés
const nodeTypes = {
  task: TaskNode,
  decision: DecisionNode,
  event: EventNode,
  formula: FormulaNode,
  scenario: ScenarioNode
};

// Composant edge personnalisé pour gérer les styles
const CustomEdge = (props) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  });

  // Récupérer les styles en fonction des données
  const edgeStyle = getEdgeStyle(props.data);

  return (
    <>
      <path
        id={props.id}
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          ...edgeStyle,
          ...(props.selected && { strokeWidth: (edgeStyle.strokeWidth || 2) + 1, stroke: '#3b82f6' }),
        }}
        markerEnd={props.markerEnd}
      />
      {props.data?.label && (
        <text
          x={labelX}
          y={labelY}
          className="react-flow__edge-text"
          style={{
            fontSize: '12px',
            fill: '#64748b',
            stroke: 'white',
            strokeWidth: '2px',
            paintOrder: 'stroke',
            textAnchor: 'middle',
            dominantBaseline: 'middle',
          }}
        >
          {props.data.label}
        </text>
      )}
    </>
  );
};

const edgeTypes = {
  custom: CustomEdge,
};

const ProcessCanvas = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);
  const [metrics, setMetrics] = useState(null);

  // Recalculer les métriques lorsque le processus change
  useEffect(() => {
    if (nodes.length > 0) {
      setMetrics(getProcessMetrics(nodes, edges));
    }
  }, [nodes, edges]);

  // Gestionnaire de connexion de deux nœuds avec les paramètres améliorés
  const onConnect = useCallback(
    (params) => {
      // Utilisez les paramètres de connexion des utils
      const newEdge = {
        ...params,
        type: 'custom',
        data: {
          sourceHandle: params.sourceHandle,
          targetHandle: params.targetHandle,
          label: '',
          animated: false,
          style: {
            strokeWidth: 2,
            stroke: null // Sera défini automatiquement par getEdgeStyle
          }
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Ajouter un nouveau nœud au canvas
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // Vérifier si le type est valide
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Générer un ID unique pour le nœud
      const nodeId = generateNodeId(type);

      let newNode = {
        id: nodeId,
        type,
        position,
        data: {
          label: getDefaultNodeLabel(type, nodeIdCounter),
          duration: 15,
          cost: 10,
          assignedTo: 'Non assigné',
          description: ''
        },
      };

      // Ajouter des propriétés spécifiques selon le type de nœud
      if (type === 'decision') {
        newNode.data.conditions = [
          { id: 'yes', label: 'Oui', targetId: null },
          { id: 'no', label: 'Non', targetId: null },
          { id: 'alt', label: 'Autre', targetId: null }
        ];
      } else if (type === 'event') {
        newNode.data.eventType = 'start';
      } else if (type === 'formula') {
        newNode.data = {
          ...newNode.data,
          formula: 'result = x + y',
          variables: [
            { name: 'x', value: 10 },
            { name: 'y', value: 5 }
          ],
          result: 15,
          triggerType: 'manual'
        };
      } else if (type === 'scenario') {
        const defaultScenarioNode = ScenarioSimulator.createDefaultEsnScenarioNode();
        newNode.data = {
          ...newNode.data,
          ...defaultScenarioNode.data
        };
      }

      setNodes((nds) => nds.concat(newNode));
      setNodeIdCounter(nodeIdCounter + 1);
    },
    [nodeIdCounter, reactFlowInstance, setNodes]
  );

  // Gérer la sélection d'un élément
  const onSelectionChange = useCallback(({ nodes, edges }) => {
    if (nodes.length > 0) {
      setSelectedElement({
        type: 'node',
        data: nodes[0]
      });
    } else if (edges.length > 0) {
      setSelectedElement({
        type: 'edge',
        data: edges[0]
      });
    } else {
      setSelectedElement(null);
    }
  }, []);

  // Mettre à jour les propriétés d'un nœud avec recalcul des formules
  const updateNodeProperties = useCallback((id, properties) => {
    setNodes((nds) => {
      const updatedNodes = nds.map((node) => {
        if (node.id === id) {
          // Mettre à jour le nœud avec les nouvelles propriétés
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              ...properties,
            },
          };

          // Si c'est une formule, recalculer le résultat
          if (node.type === 'formula' && (properties.formula || properties.variables)) {
            const processContext = {
              nodes: nds.map(n => ({
                id: n.id,
                type: n.type,
                data: n.data
              }))
            };

            return FormulaCalculator.executeFormulaNode(updatedNode, processContext);
          }

          return updatedNode;
        }
        return node;
      });

      // Si une propriété a été mise à jour et qu'il existe des formules
      // qui se déclenchent sur les changements, les recalculer
      const automaticFormulas = updatedNodes.filter(
        node => node.type === 'formula' && node.data.triggerType === 'onChange'
      );

      if (automaticFormulas.length > 0) {
        const processContext = {
          nodes: updatedNodes.map(node => ({
            id: node.id,
            type: node.type,
            data: node.data
          }))
        };

        // Recalculer ces formules
        automaticFormulas.forEach(formulaNode => {
          const updatedFormula = FormulaCalculator.executeFormulaNode(formulaNode, processContext);
          const nodeIndex = updatedNodes.findIndex(node => node.id === formulaNode.id);
          if (nodeIndex !== -1) {
            updatedNodes[nodeIndex] = updatedFormula;
          }
        });
      }

      return updatedNodes;
    });
  }, []);

  // Mettre à jour les propriétés d'une arête
  const updateEdgeProperties = useCallback((id, properties) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          // Mettre à jour l'arête avec les nouvelles propriétés
          return {
            ...edge,
            data: {
              ...edge.data,
              ...properties,
            },
            // Si le label est défini, l'ajouter aussi directement à l'edge
            ...(properties.label !== undefined ? { label: properties.label } : {})
          };
        }
        return edge;
      })
    );
  }, [setEdges]);

  // Fonction combinée pour mettre à jour les propriétés
  const updateElementProperties = useCallback((id, properties, type) => {
    if (type === 'node') {
      updateNodeProperties(id, properties);
    } else if (type === 'edge') {
      updateEdgeProperties(id, properties);
    }
  }, [updateNodeProperties, updateEdgeProperties]);

  // Ajouter des nœuds en cliquant sur les boutons de la toolbar
  const addNode = useCallback((type) => {
    if (!reactFlowInstance) return;

    // Calculer une position au centre de la vue actuelle
    const { x, y, zoom } = reactFlowInstance.getViewport();
    const position = {
      x: -x / zoom + 200,
      y: -y / zoom + 200,
    };

    // Générer un ID unique pour le nœud
    const nodeId = generateNodeId(type);

    let newNode = {
      id: nodeId,
      type,
      position,
      data: {
        label: getDefaultNodeLabel(type, nodeIdCounter),
        duration: 15,
        cost: 10,
        assignedTo: 'Non assigné',
        description: ''
      },
    };

    // Propriétés spécifiques au type de nœud
    if (type === 'decision') {
      newNode.data.conditions = [
        { id: 'yes', label: 'Oui', targetId: null },
        { id: 'no', label: 'Non', targetId: null },
        { id: 'alt', label: 'Autre', targetId: null }
      ];
    } else if (type === 'event') {
      newNode.data.eventType = 'start';
    } else if (type === 'formula') {
      newNode.data = {
        ...newNode.data,
        formula: 'result = x + y',
        variables: [
          { name: 'x', value: 10 },
          { name: 'y', value: 5 }
        ],
        result: 15,
        triggerType: 'manual'
      };
    } else if (type === 'scenario') {
      const defaultScenarioNode = ScenarioSimulator.createDefaultEsnScenarioNode();
      newNode.data = {
        ...newNode.data,
        ...defaultScenarioNode.data
      };
    }

    setNodes((nds) => nds.concat(newNode));
    setNodeIdCounter(nodeIdCounter + 1);
  }, [reactFlowInstance, nodeIdCounter, setNodes]);

  // Fonction pour exécuter toutes les formules du processus
  const executeFormulas = useCallback(() => {
    // Préparer le contexte du processus (tous les nœuds et leurs données)
    const processContext = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        data: node.data
      }))
    };

    // Identifier tous les nœuds de formule
    const formulaNodes = nodes.filter(node => node.type === 'formula');

    // Exécuter chaque formule et mettre à jour les nœuds correspondants
    const updatedNodes = [...nodes];

    formulaNodes.forEach(formulaNode => {
      const updatedNode = FormulaCalculator.executeFormulaNode(formulaNode, processContext);

      // Mettre à jour le nœud dans la liste
      const nodeIndex = updatedNodes.findIndex(node => node.id === formulaNode.id);
      if (nodeIndex !== -1) {
        updatedNodes[nodeIndex] = updatedNode;
      }
    });

    // Mettre à jour tous les nœuds
    setNodes(updatedNodes);
  }, [nodes, setNodes]);

  // Sauvegarder le processus
  const saveProcess = useCallback(() => {
    const processData = {
      nodes,
      edges,
      name: "Nouveau Processus",
      createdAt: new Date().toISOString()
    };

    console.log('Processus sauvegardé:', processData);
    // Ici, nous ajouterions l'appel API pour sauvegarder le processus
    // api.saveProcess(processData);

    alert('Processus sauvegardé avec succès !');
  }, [nodes, edges]);

  // Exécuter la simulation
  const runSimulation = useCallback(() => {
    // Avant de simuler, exécutons d'abord toutes les formules
    executeFormulas();

    const processData = {
      nodes,
      edges
    };

    console.log('Lancement de simulation pour:', processData);
    // Ici, nous ajouterions l'appel API pour exécuter la simulation
    // api.runSimulation(processData);

    alert('Simulation lancée ! Consultez l\'onglet Simulations pour les résultats.');
  }, [nodes, edges, executeFormulas]);

  const runScenarioSimulations = useCallback(() => {
    // Identifier tous les nœuds de scénario
    const scenarioNodes = nodes.filter(node => node.type === 'scenario');

    if (scenarioNodes.length === 0) {
      alert('Aucun nœud de scénario trouvé dans le processus.');
      return;
    }

    // Exécuter d'abord toutes les formules pour avoir des valeurs à jour
    executeFormulas();

    // Ensuite, exécuter les simulations pour chaque nœud de scénario
    const updatedNodes = [...nodes];

    scenarioNodes.forEach(scenarioNode => {
      const updatedScenarioNode = ScenarioSimulator.runSimulation(
        scenarioNode,
        nodes,
        edges,
        {
          threshold: scenarioNode.data.threshold || 15,
          referenceVariable: scenarioNode.data.referenceVariable || 'tauxMarge'
        }
      );

      // Mettre à jour le nœud dans la liste
      const nodeIndex = updatedNodes.findIndex(node => node.id === scenarioNode.id);
      if (nodeIndex !== -1) {
        updatedNodes[nodeIndex] = updatedScenarioNode;
      }
    });

    // Mettre à jour tous les nœuds
    setNodes(updatedNodes);

    alert(`Simulation terminée pour ${scenarioNodes.length} scénario(s).`);
  }, [nodes, edges, executeFormulas, setNodes]);

  // Obtenir des optimisations IA
  const getOptimizations = useCallback(() => {
    // Avant d'optimiser, exécutons d'abord toutes les formules
    executeFormulas();

    const processData = {
      nodes,
      edges
    };

    console.log('Demande d\'optimisations pour:', processData);
    // Ici, nous ajouterions l'appel API pour obtenir des optimisations
    // api.getOptimizations(processData);

    alert('Analyse d\'optimisation lancée ! Consultez l\'onglet Optimisations pour les résultats.');
  }, [nodes, edges, executeFormulas]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Toolbar
        onSave={saveProcess}
        onSimulate={runSimulation}
        onOptimize={getOptimizations}
        onAddNode={addNode}
        executeFormulas={executeFormulas}
        runScenarioSimulations={runScenarioSimulations}
      />
      <div className="flex flex-1 h-full overflow-hidden">
        <div className="flex-1 h-full overflow-hidden" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onSelectionChange={onSelectionChange}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              connectionLineStyle={getConnectionLineStyle()}
              defaultEdgeOptions={{
                type: 'custom',
              }}
              snapGrid={[15, 15]}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              proOptions={{
                hideAttribution: true,
                zoomOnDoubleClick: false
              }}
            >
              <Controls />
              {/* <MiniMap /> */}
              <Background gap={16} size={1} />

              {/* Métriques du processus */}
              {metrics && (
                <Panel position="top-right" className="bg-white p-2 rounded-sm shadow-md text-xs">
                  <div className="font-semibold mb-1">Métriques du processus</div>
                  <div>Tâches: {metrics.totalTasks}</div>
                  <div>Décisions: {metrics.totalDecisions}</div>
                  <div>Événements: {metrics.totalEvents}</div>
                  <div>Formules: {metrics.totalFormulas || 0}</div>
                  <div>Connexions: {metrics.totalConnections}</div>
                  <div>Durée estimée: {metrics.estimatedDuration} min</div>
                  <div>Coût estimé: {metrics.estimatedCost}€</div>
                </Panel>
              )}
            </ReactFlow>
        </div>
        {selectedElement && (
          <div className="h-full overflow-hidden shrink-0">
            <PropertyPanel
              element={selectedElement}
              onUpdateProperties={(id, properties) =>
                updateElementProperties(id, properties, selectedElement.type)
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessCanvas;