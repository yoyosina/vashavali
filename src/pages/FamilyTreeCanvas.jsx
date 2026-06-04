import React, { useCallback, useMemo, useEffect, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import MemberNode from '../components/MemberNode';
import UnionNode from '../components/UnionNode';
import { supabase } from '../lib/supabaseClient';
import { useTheme } from '../context/ThemeContext';

const nodeWidth = 200;
const nodeHeight = 220;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, nodesep: 150, ranksep: 100 });

  nodes.forEach((node) => {
    if (node.type === 'unionNode') {
      dagreGraph.setNode(node.id, { width: 15, height: 15 });
    } else {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    }
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target, { 
      weight: edge.target.startsWith('union_') ? 100 : 1 
    });
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const width = node.type === 'unionNode' ? 15 : nodeWidth;
    const height = node.type === 'unionNode' ? 15 : nodeHeight;
    return {
      ...node,
      targetPosition: 'top',
      sourcePosition: 'bottom',
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
    };
  });

  // Post-processing to enforce spouse adjacency
  const spousePairs = [];
  const unionMap = {};
  edges.forEach(edge => {
    if (edge.target.startsWith('union_')) {
      if (!unionMap[edge.target]) unionMap[edge.target] = [];
      unionMap[edge.target].push(edge.source);
    }
  });

  Object.keys(unionMap).forEach(unionId => {
    if (unionMap[unionId].length === 2) {
      spousePairs.push({ unionId, spouses: unionMap[unionId] });
    }
  });

  const ranks = {};
  layoutedNodes.forEach(n => {
    if (n.type === 'unionNode') return;
    const yRank = Math.round(n.position.y);
    if (!ranks[yRank]) ranks[yRank] = [];
    ranks[yRank].push(n);
  });

  Object.keys(ranks).forEach(y => {
    let rowNodes = ranks[y].sort((a, b) => a.position.x - b.position.x);
    const originalX = rowNodes.map(n => n.position.x);

    spousePairs.forEach(pair => {
      const [s1, s2] = pair.spouses;
      const idx1 = rowNodes.findIndex(n => n.id === s1);
      const idx2 = rowNodes.findIndex(n => n.id === s2);
      
      if (idx1 !== -1 && idx2 !== -1 && Math.abs(idx1 - idx2) > 1) {
        const node2 = rowNodes.splice(idx2, 1)[0];
        const newIdx1 = rowNodes.findIndex(n => n.id === s1);
        rowNodes.splice(newIdx1 + 1, 0, node2);
      }
    });

    rowNodes.forEach((n, i) => {
      n.position.x = originalX[i];
    });
  });

  spousePairs.forEach(pair => {
    const unionNode = layoutedNodes.find(n => n.id === pair.unionId);
    const s1Node = layoutedNodes.find(n => n.id === pair.spouses[0]);
    const s2Node = layoutedNodes.find(n => n.id === pair.spouses[1]);
    
    if (unionNode && s1Node && s2Node) {
      const s1Center = s1Node.position.x + (nodeWidth / 2);
      const s2Center = s2Node.position.x + (nodeWidth / 2);
      const midPoint = (s1Center + s2Center) / 2;
      unionNode.position.x = midPoint - 7.5;
    }
  });

  return { nodes: layoutedNodes, edges };
};

import { useParams } from 'react-router-dom';

const FamilyTreeCanvas = () => {
  const { familyCode } = useParams();
  const { theme } = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);

  const nodeTypes = useMemo(() => ({ memberNode: MemberNode, unionNode: UnionNode }), []);

  const fetchData = async () => {
    setLoading(true);

    const { data: familyData } = await supabase.from('families').select('id').eq('code', familyCode.toLowerCase()).single();
    if (!familyData) return;

    const [membersResponse, relationshipsResponse] = await Promise.all([
      supabase.from('members').select('*').eq('family_id', familyData.id),
      supabase.from('relationships').select('*').eq('family_id', familyData.id)
    ]);

    if (membersResponse.data && relationshipsResponse.data) {
      const baseNodes = membersResponse.data.map(member => ({
        id: member.id,
        type: 'memberNode',
        data: {
          id: member.id,
          firstName: member.first_name,
          lastName: member.last_name,
          birthYear: member.birth_date ? member.birth_date.split('-')[0] : 'Unknown',
          deathYear: member.death_date ? member.death_date.split('-')[0] : null,
          imageUrl: member.image_url || `https://ui-avatars.com/api/?name=${member.first_name}+${member.last_name}&background=random`,
          bio: member.bio,
          milestones: [],
          gallery: []
        },
        position: { x: 0, y: 0 } 
      }));

      const spouseRels = relationshipsResponse.data.filter(r => r.type === 'spouse');
      const childRels = relationshipsResponse.data.filter(r => r.type === 'child');

      const unionNodes = [];
      const newEdges = [];
      const parentToUnionMap = new Map();

      // Setup Marriage Unions
      spouseRels.forEach(rel => {
        const unionId = `union_${rel.source_id}_${rel.target_id}`;
        unionNodes.push({
          id: unionId,
          type: 'unionNode',
          data: {},
          position: { x: 0, y: 0 }
        });
        
        parentToUnionMap.set(rel.source_id, unionId);
        parentToUnionMap.set(rel.target_id, unionId);

        // V-shape edges from spouses into the union
        newEdges.push({
          id: `e_${rel.source_id}_${unionId}`,
          source: rel.source_id,
          target: unionId,
          type: 'smoothstep',
          style: { stroke: 'var(--color-border)', strokeWidth: 2 }
        });
        newEdges.push({
          id: `e_${rel.target_id}_${unionId}`,
          source: rel.target_id,
          target: unionId,
          type: 'smoothstep',
          style: { stroke: 'var(--color-border)', strokeWidth: 2 }
        });
      });

      // Setup Children Branching
      childRels.forEach(rel => {
        const unionId = parentToUnionMap.get(rel.source_id);
        if (unionId) {
          // Parent is married, branch child from the union dot
          const existing = newEdges.find(e => e.source === unionId && e.target === rel.target_id);
          if (!existing) {
             newEdges.push({
               id: `e_${unionId}_${rel.target_id}`,
               source: unionId,
               target: rel.target_id,
               type: 'smoothstep',
               animated: true,
               style: { stroke: 'var(--color-accent-gold)', strokeWidth: 2 }
             });
          }
        } else {
          // Single parent
          newEdges.push({
            id: rel.id,
            source: rel.source_id,
            target: rel.target_id,
            type: 'smoothstep',
            animated: true,
            style: { stroke: 'var(--color-accent-gold)', strokeWidth: 2 }
          });
        }
      });

      if (baseNodes.length > 0) {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements([...baseNodes, ...unionNodes], newEdges);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      } else {
        setNodes([]);
        setEdges([]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="canvas-container">
      {loading ? (
        <div className="placeholder-page">Loading family tree...</div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          minZoom={0.1}
          colorMode={theme === 'light' ? 'light' : 'dark'}
        >
          <Background color="var(--color-border)" gap={30} size={1} />
          <Controls />
          <Panel position="bottom-center" className="glass-panel" style={{ padding: '8px 16px', marginBottom: '20px' }}>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              Scroll to zoom, drag to pan. Click a member for details.
            </p>
          </Panel>
        </ReactFlow>
      )}
    </div>
  );
};

export default FamilyTreeCanvas;
