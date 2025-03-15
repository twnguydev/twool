import React from 'react';
import { Handle, Position } from 'reactflow';
import { handleStyles, borderStyles } from './node-styles';

/**
 * Composant de base pour les nœuds avec des fonctionnalités partagées
 * Fournit une structure commune et des points de connexion (handles)
 */
const BaseNode = ({ 
  children, 
  isConnectable, 
  selected, 
  hideHandles = {}, 
  customHandles = {},
  nodeType = 'default'
}) => {
  // Styles par défaut pour ce type de nœud
  const getNodeBorderStyle = () => {
    return selected ? borderStyles.selected : borderStyles.normal;
  };

  // Construction des handles standard avec possibilité de personnalisation
  const renderHandles = () => {
    // Configuration de base pour les handles
    const baseHandleProps = {
      isConnectable,
      className: `w-2 h-2 bg-gray-400 border border-gray-500`,
      style: { width: '6px', height: '6px' }
    };

    // Position des handles standards
    const standardPositions = [
      { id: 'target-left', type: 'target', position: Position.Left, style: { left: -3 } },
      { id: 'target-top', type: 'target', position: Position.Top, style: { top: -3 } },
      { id: 'target-right', type: 'target', position: Position.Right, style: { right: -3 } },
      { id: 'target-bottom', type: 'target', position: Position.Bottom, style: { bottom: -3 } },
      { id: 'source-left', type: 'source', position: Position.Left, style: { left: -3 } },
      { id: 'source-top', type: 'source', position: Position.Top, style: { top: -3 } },
      { id: 'source-right', type: 'source', position: Position.Right, style: { right: -3 } },
      { id: 'source-bottom', type: 'source', position: Position.Bottom, style: { bottom: -3 } }
    ];

    return standardPositions.map(handle => {
      // Vérifier si ce handle doit être masqué
      if (hideHandles[handle.id]) return null;

      // Appliquer des personnalisations si elles existent pour ce handle
      const customProps = customHandles[handle.id] || {};

      return (
        <Handle
          key={handle.id}
          id={handle.id}
          type={handle.type}
          position={handle.position}
          {...baseHandleProps}
          {...customProps}
          style={{ 
            ...baseHandleProps.style, 
            ...handle.style, 
            ...(customProps.style || {})
          }}
        />
      );
    });
  };

  return (
    <div className="relative">
      {renderHandles()}
      {children}
    </div>
  );
};

export default BaseNode;