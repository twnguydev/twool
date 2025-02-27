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
  getBezierPath,
} from 'reactflow';
import 'reactflow/dist/style.css';

import TaskNode from './Nodes/TaskNode';
import DecisionNode from './Nodes/DecisionNode';
import EventNode from './Nodes/EventNode';
import PropertyPanel from './PropertyPanel';
import Toolbar from './Toolbar';
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
};

// Composant edge personnalisé pour gérer les styles et l'affichage du label
const CustomEdge = ({ id, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, selected, markerEnd, style }) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Récupérer les styles en fonction des données
  const edgeStyle = getEdgeStyle(data);

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          ...edgeStyle,
          ...(selected && { strokeWidth: edgeStyle.strokeWidth + 1, stroke: '#3b82f6' }),
        }}
        markerEnd={markerEnd}
      />
      {data?.label && (
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
          {data.label}
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
      const connectionParams = getConnectionParams();
      const newEdge = {
        ...params,
        type: 'custom',
        data: {
          sourceHandle: params.sourceHandle,
          targetHandle: params.targetHandle,
          label: '',
          animated: connectionParams.animated,
          style: {
            strokeWidth: connectionParams.style.strokeWidth,
            stroke: connectionParams.style.stroke,
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

  // Mettre à jour les propriétés d'un nœud
  const updateNodeProperties = useCallback((id, properties) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...properties,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Mettre à jour les propriétés d'une arête
  const updateEdgeProperties = useCallback((id, properties) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          // Construire le nouvel objet de données avec les propriétés mises à jour
          const updatedData = {
            ...edge.data,
            ...properties,
          };
          
          // Retourner l'arête mise à jour avec le label et les données
          return {
            ...edge,
            // Mettre à jour le label visible directement sur l'arête
            label: properties.label !== undefined ? properties.label : edge.label,
            // Mettre à jour l'objet data avec toutes les propriétés
            data: updatedData,
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
    }

    setNodes((nds) => nds.concat(newNode));
    setNodeIdCounter(nodeIdCounter + 1);
  }, [reactFlowInstance, nodeIdCounter, setNodes]);

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
    const processData = {
      nodes,
      edges
    };

    console.log('Lancement de simulation pour:', processData);
    // Ici, nous ajouterions l'appel API pour exécuter la simulation
    // api.runSimulation(processData);

    alert('Simulation lancée ! Consultez l\'onglet Simulations pour les résultats.');
  }, [nodes, edges]);

  // Obtenir des optimisations IA
  const getOptimizations = useCallback(() => {
    const processData = {
      nodes,
      edges
    };

    console.log('Demande d\'optimisations pour:', processData);
    // Ici, nous ajouterions l'appel API pour obtenir des optimisations
    // api.getOptimizations(processData);

    alert('Analyse d\'optimisation lancée ! Consultez l\'onglet Optimisations pour les résultats.');
  }, [nodes, edges]);

  return (
    <div className="flex flex-col h-full">
      <Toolbar
        onSave={saveProcess}
        onSimulate={runSimulation}
        onOptimize={getOptimizations}
        onAddNode={addNode}
      />
      <div className="flex flex-1 h-full">
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlowProvider>
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
              fitView
              snapToGrid
              snapGrid={[15, 15]}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            >
              <Controls />
              {/* <MiniMap /> */}
              <Background gap={16} size={1} />
              
              {/* Métriques du processus */}
              {metrics && (
                <Panel position="top-right" className="bg-white p-2 rounded shadow-md text-xs">
                  <div className="font-semibold mb-1">Métriques du processus</div>
                  <div>Tâches: {metrics.totalTasks}</div>
                  <div>Décisions: {metrics.totalDecisions}</div>
                  <div>Événements: {metrics.totalEvents}</div>
                  <div>Connexions: {metrics.totalConnections}</div>
                  <div>Durée estimée: {metrics.estimatedDuration} min</div>
                  <div>Coût estimé: {metrics.estimatedCost}€</div>
                </Panel>
              )}
            </ReactFlow>
          </ReactFlowProvider>
        </div>
        {selectedElement && (
          <PropertyPanel
            element={selectedElement}
            onUpdateProperties={(id, properties) => 
              updateElementProperties(id, properties, selectedElement.type)
            }
          />
        )}
      </div>
    </div>
  );
};

export default ProcessCanvas;