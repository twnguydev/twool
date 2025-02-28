// components/Modeling/utils/flowUtils.js
import { MarkerType } from 'reactflow';

// Configuration des connexions intelligentes
export const getConnectionLineStyle = () => {
  return {
    strokeWidth: 2,
    stroke: '#b1b1b7',
    strokeDasharray: '5 5',
  };
};

// Configuration des arêtes en fonction de leur source et de leurs propriétés
export const getEdgeStyle = (data) => {
  // Valeurs par défaut
  const style = {
    strokeWidth: data?.style?.strokeWidth || 2,
  };

  // Si l'arête est liée à un handle spécifique, on adapte le style
  if (data?.sourceHandle) {
    // Connexions depuis un nœud de décision
    if (data.sourceHandle === 'yes') {
      style.stroke = '#10b981'; // Vert
      style.markerEnd = {
        type: MarkerType.ArrowClosed,
        color: '#10b981'
      };
    } else if (data.sourceHandle === 'no') {
      style.stroke = '#ef4444'; // Rouge
      style.markerEnd = {
        type: MarkerType.ArrowClosed,
        color: '#ef4444'
      };
    } else if (data.sourceHandle === 'alt') {
      style.stroke = '#3b82f6'; // Bleu
      style.markerEnd = {
        type: MarkerType.ArrowClosed,
        color: '#3b82f6'
      };
    } else if (data.sourceHandle === 'back') {
      style.stroke = '#8b5cf6'; // Violet
      style.markerEnd = {
        type: MarkerType.ArrowClosed,
        color: '#8b5cf6'
      };
    } else if (data.sourceHandle.startsWith('source-')) {
      style.stroke = '#6366f1'; // Indigo
      style.markerEnd = {
        type: MarkerType.ArrowClosed,
        color: '#6366f1'
      };
    }
  } else {
    // Style par défaut pour les autres connexions
    style.stroke = '#6366f1'; // Indigo
    style.markerEnd = {
      type: MarkerType.ArrowClosed,
      color: '#6366f1'
    };
  }

  // Appliquer l'animation si elle est définie
  if (data?.animated) {
    style.animated = true;
  }

  // Appliquer l'épaisseur de ligne personnalisée si définie
  if (data?.style?.strokeWidth) {
    style.strokeWidth = data.style.strokeWidth;
  }

  // Appliquer la couleur personnalisée si définie
  if (data?.style?.stroke) {
    style.stroke = data.style.stroke;
    if (style.markerEnd) {
      style.markerEnd.color = data.style.stroke;
    }
  }

  return style;
};

// Configuration par défaut des paramètres des connexions
export const getConnectionParams = () => {
  return {
    type: 'smoothstep',    // Type de courbe de connexion
    animated: false,        // Animation par défaut
    style: {
      strokeWidth: 2,
      stroke: '#6366f1',
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#6366f1'
    }
  };
};

// Génère un ID unique pour les nœuds
export const generateNodeId = (type) => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `${type}-${timestamp}-${random}`;
};

// Génère une étiquette par défaut pour un nouveau nœud
export const getDefaultNodeLabel = (type, count) => {
  switch (type) {
    case 'task':
      return `Tâche ${count}`;
    case 'decision':
      return `Décision ${count}`;
    case 'event':
      return `Événement ${count}`;
    case 'formula':
      return `Formule ${count}`;
    default:
      return `Nœud ${count}`;
  }
};


export const getProcessMetrics = (nodes, edges) => {
  const metrics = {
    totalTasks: 0,
    totalDecisions: 0, 
    totalEvents: 0,
    totalFormulas: 0,
    estimatedDuration: 0,
    estimatedCost: 0,
    totalConnections: edges.length,
    formulaResults: {},
    criticalPath: [],
  };
  
  // Calcul des métriques de base
  nodes.forEach(node => {
    switch (node.type) {
      case 'task':
        metrics.totalTasks++;
        metrics.estimatedDuration += parseInt(node.data.duration || 0);
        metrics.estimatedCost += parseFloat(node.data.cost || 0);
        break;
      case 'decision':
        metrics.totalDecisions++;
        break;
      case 'event':
        metrics.totalEvents++;
        break;
      case 'formula':
        metrics.totalFormulas++;
        // Stocker le résultat de la formule si disponible
        if (node.data.result !== undefined) {
          metrics.formulaResults[node.id] = {
            label: node.data.label,
            formula: node.data.formula,
            result: node.data.result
          };
        }
        break;
    }
  });
  
  return metrics;
};