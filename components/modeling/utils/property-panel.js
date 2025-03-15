export const getEdgeColorFromSource = (sourceHandle) => {
  if (sourceHandle === 'yes') return '#10b981';
  if (sourceHandle === 'no') return '#ef4444';
  if (sourceHandle === 'alt') return '#3b82f6';
  if (sourceHandle === 'back') return '#8b5cf6';
  return '#6366f1';
};