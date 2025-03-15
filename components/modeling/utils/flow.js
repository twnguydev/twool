// Générer un ID unique pour les nœuds
export const generateNodeId = (nodeType) => {
  return `${nodeType}-${Date.now()}`;
};

// Obtenir le label par défaut pour un nouveau nœud
export const getDefaultNodeLabel = (type, counter) => {
  const labels = {
    task: `Tâche ${counter}`,
    decision: `Décision ${counter}`,
    event: `Événement ${counter}`,
    formula: `Formule ${counter}`,
    scenario: `Scénario ${counter}`
  };
  
  return labels[type] || `Nœud ${counter}`;
};

// Obtenir le style de ligne de connexion
export const getConnectionLineStyle = () => {
  return {
    strokeWidth: 2,
    stroke: '#9ca3af', // gray-400 pour une esthétique plus sobre
  };
};

// Obtenir le style d'une arête en fonction de ses données
export const getEdgeStyle = (data) => {
  // Style par défaut
  const defaultStyle = {
    strokeWidth: data?.style?.strokeWidth || 2,
    stroke: data?.style?.stroke || '#9ca3af', // gray-400 par défaut
  };

  // Si l'arête est animée, ajouter la propriété d'animation
  if (data?.animated) {
    defaultStyle.animationDuration = '5s';
  }

  // Si l'arête a une source spécifique (yes, no, alt), définir sa couleur
  if (data?.sourceHandle) {
    switch (data.sourceHandle) {
      case 'yes':
        defaultStyle.stroke = data?.style?.stroke || '#10b981'; // green-500
        break;
      case 'no':
        defaultStyle.stroke = data?.style?.stroke || '#ef4444'; // red-500
        break;
      case 'alt':
        defaultStyle.stroke = data?.style?.stroke || '#3b82f6'; // blue-500
        break;
      case 'back':
        defaultStyle.stroke = data?.style?.stroke || '#8b5cf6'; // purple-500
        break;
      default:
        // Utiliser la couleur personnalisée si elle existe, sinon la couleur par défaut
        defaultStyle.stroke = data?.style?.stroke || defaultStyle.stroke;
    }
  }

  return defaultStyle;
};

// Obtenir les paramètres de connexion pour un type de nœud
export const getConnectionParams = (nodeType, sourceHandle) => {
  // Paramètres par défaut
  const defaultParams = {
    type: 'smoothstep',
    style: {
      strokeWidth: 2,
      stroke: '#9ca3af', // gray-400
    },
  };

  // Personnaliser les paramètres selon le type de nœud et la poignée source
  if (nodeType === 'decision' && sourceHandle) {
    switch (sourceHandle) {
      case 'yes':
        defaultParams.style.stroke = '#10b981'; // green-500
        break;
      case 'no':
        defaultParams.style.stroke = '#ef4444'; // red-500
        break;
      case 'alt':
        defaultParams.style.stroke = '#3b82f6'; // blue-500
        break;
    }
  }

  return defaultParams;
};

// Calculer les métriques d'un processus
export const getProcessMetrics = (nodes, edges) => {
  // Comptage des différents types de nœuds
  const totalTasks = nodes.filter(node => node.type === 'task').length;
  const totalDecisions = nodes.filter(node => node.type === 'decision').length;
  const totalEvents = nodes.filter(node => node.type === 'event').length;
  const totalFormulas = nodes.filter(node => node.type === 'formula').length;
  const totalScenarios = nodes.filter(node => node.type === 'scenario').length;
  const totalConnections = edges.length;

  // Calcul de la durée estimée (somme des durées des tâches)
  const estimatedDuration = nodes
    .filter(node => node.type === 'task')
    .reduce((sum, node) => sum + (node.data.duration || 0), 0);

  // Calcul du coût estimé (somme des coûts des tâches)
  const estimatedCost = nodes
    .filter(node => node.type === 'task')
    .reduce((sum, node) => sum + (node.data.cost || 0), 0);

  return {
    totalNodes: nodes.length,
    totalTasks,
    totalDecisions,
    totalEvents,
    totalFormulas,
    totalScenarios,
    totalConnections,
    estimatedDuration,
    estimatedCost
  };
};