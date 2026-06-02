import React from 'react';
import { Handle, Position } from '@xyflow/react';

const UnionNode = () => {
  return (
    <div style={{ width: 12, height: 12, background: 'var(--color-accent-gold)', borderRadius: '50%', border: '2px solid var(--color-bg-panel)', boxShadow: '0 0 0 2px var(--color-border)' }}>
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </div>
  );
};

export default UnionNode;
