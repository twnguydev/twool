export const getHandlePosition = (rotation, handleId) => {
  if (!handleId) return null;
  
  // For target handles, position is fixed regardless of rotation
  if (handleId.startsWith('target-')) {
    return handleId.substring(7); // Extract position part (top, right, bottom, left)
  }
  
  // For source handles, position changes with rotation
  const sourceHandleMap = {
    0: {
      yes: 'bottom',
      no: 'right',
      alt: 'top',
      back: 'left'
    },
    90: {
      yes: 'left',
      no: 'bottom',
      alt: 'right',
      back: 'top'
    },
    180: {
      yes: 'top',
      no: 'left',
      alt: 'bottom',
      back: 'right'
    },
    270: {
      yes: 'right',
      no: 'top',
      alt: 'left',
      back: 'bottom'
    }
  };
  
  // Return the mapped position or null if not found
  return sourceHandleMap[rotation]?.[handleId] || null;
};