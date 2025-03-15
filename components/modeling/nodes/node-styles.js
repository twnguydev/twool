/**
 * Styles communs pour les nœuds du diagramme
 * Ce fichier centralise les styles pour assurer la cohérence visuelle
 */

// Styles pour les handles (points de connexion)
export const handleStyles = {
  standard: {
    width: '8px', 
    height: '8px',
    backgroundColor: '#9CA3AF', // gray-400
    borderColor: '#6B7280', // gray-500
    borderWidth: '1px',
    opacity: 1
  },
  // Taille plus petite pour un design sobre
  small: {
    width: '6px',
    height: '6px',
    borderWidth: '1px',
    top: 'calc(50% - 3px)',
    left: 'calc(50% - 3px)'
  },
  // Style pour les handles spécifiques de décision
  decision: {
    yes: {
      backgroundColor: '#10B981', // green-500
      borderColor: '#059669' // green-600
    },
    no: {
      backgroundColor: '#EF4444', // red-500
      borderColor: '#DC2626' // red-600
    },
    alt: {
      backgroundColor: '#3B82F6', // blue-500
      borderColor: '#2563EB' // blue-600
    }
  }
};

// Styles pour les bordures
export const borderStyles = {
  normal: 'border border-gray-300',
  selected: 'border-2 border-gray-500',
  // Styles spécifiques par type de nœud
  event: {
    start: {
      normal: 'border-2 border-green-500',
      selected: 'border-2 border-green-600'
    },
    end: {
      normal: 'border-2 border-red-500',
      selected: 'border-2 border-red-600'
    },
    intermediate: {
      normal: 'border-2 border-gray-500',
      selected: 'border-2 border-gray-600'
    }
  }
};

// Fonction utilitaire pour tronquer le texte
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength 
    ? text.substring(0, maxLength) + '...' 
    : text;
};

// Fonction pour formater les valeurs numériques
export const formatNumber = (value) => {
  if (typeof value === 'number') {
    return value % 1 !== 0 ? value.toFixed(2) : value.toString();
  }
  return value;
};

// Dimensions standard des nœuds
export const nodeDimensions = {
  task: {
    width: 180,
    height: 'auto'
  },
  formula: {
    width: 240,
    height: 'auto'
  },
  decision: {
    width: 120,
    height: 120
  },
  event: {
    size: 80 // diamètre du cercle
  },
  scenario: {
    width: 240,
    height: 'auto',
    maxHeight: 400
  }
};