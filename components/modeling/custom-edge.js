import React, { useEffect, useState } from 'react';
import { getBezierPath } from 'reactflow';
import { getEdgeStyle } from './utils/flow';

const CustomEdge = (props) => {
  const [edgePath, setEdgePath] = useState(null);
  const [labelX, setLabelX] = useState(0);
  const [labelY, setLabelY] = useState(0);
  
  useEffect(() => {
    // Recalculate path whenever props change
    // or when "rotationUpdateTimestamp" is present in data
    updatePath();
  }, [
    props.sourceX,
    props.sourceY,
    props.targetX,
    props.targetY,
    props.sourcePosition,
    props.targetPosition,
    props.data?.rotationUpdateTimestamp
  ]);
  
  const updatePath = () => {
    const [path, labelPosX, labelPosY] = getBezierPath({
      sourceX: props.sourceX,
      sourceY: props.sourceY,
      sourcePosition: props.sourcePosition,
      targetX: props.targetX,
      targetY: props.targetY,
      targetPosition: props.targetPosition,
    });
    
    setEdgePath(path);
    setLabelX(labelPosX);
    setLabelY(labelPosY);
  };
  
  // Get styles based on data
  const edgeStyle = getEdgeStyle?.(props.data) || { 
    stroke: '#b1b1b7', 
    strokeWidth: 2 
  };
  
  return (
    <>
      <path
        id={props.id}
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          ...edgeStyle,
          ...(props.selected && {
            strokeWidth: (edgeStyle.strokeWidth || 2) + 1,
            stroke: '#3b82f6'
          }),
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

export default CustomEdge;