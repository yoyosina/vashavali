import React, { useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Edit2 } from 'lucide-react';
import { ReactFlow, Background, Controls, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import MemberNode from '../components/MemberNode';
import UnionNode from '../components/UnionNode';
import EditMemberModal from '../components/EditMemberModal';
import EditMilestonesModal from '../components/EditMilestonesModal';
import Lightbox from '../components/Lightbox';
import './PersonalProfile.css';
import dagre from 'dagre';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const getMiniTreeLayout = (centerNodeId, nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 150, ranksep: 100 });
  
  nodes.forEach((node) => {
    if (node.type === 'unionNode') {
      dagreGraph.setNode(node.id, { width: 15, height: 15 });
    } else {
      dagreGraph.setNode(node.id, { width: 200, height: 220 });
    }
  });
  
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  
  dagre.layout(dagreGraph);
  
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const width = node.type === 'unionNode' ? 15 : 200;
    const height = node.type === 'unionNode' ? 15 : 220;
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
  
  return { nodes: layoutedNodes, edges };
};

const PersonalProfile = () => {
  const { id, familyCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [member, setMember] = useState(null);
  const [miniNodes, setMiniNodes, onNodesChange] = useNodesState([]);
  const [miniEdges, setMiniEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  
  // Gallery States
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const nodeTypes = useMemo(() => ({ memberNode: MemberNode, unionNode: UnionNode }), []);

  const handleAddMedia = async (e) => {
    if (!user) return alert("You must be logged in to add media.");
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (!window.confirm(`Propose adding ${files.length} image(s) to ${member.firstName}'s gallery? It will be sent for approval.`)) {
      e.target.value = null;
      return;
    }

    setUploadingMedia(true);
    const uploadedUrls = [];

    try {
      await Promise.all(files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `gallery_${Date.now()}_${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
        uploadedUrls.push(publicUrl);
      }));
    } catch (err) {
      setUploadingMedia(false);
      e.target.value = null;
      return alert('Error uploading images: ' + err.message);
    }

    const requestData = {
      requestType: 'EDIT',
      targetMemberId: member.id,
      originalData: member,
      changes: {
        firstName: member.firstName,
        lastName: member.lastName,
        bio: member.bio,
        imageUrl: member.imageUrl,
        newMediaItems: uploadedUrls
      }
    };

    const { error } = await supabase.from('join_requests').insert([{
      submitted_by: user.id,
      request_data: requestData
    }]);

    setUploadingMedia(false);
    e.target.value = null;
    
    if (error) {
      alert('Error submitting request: ' + error.message);
    } else {
      alert('Media addition proposed! It will appear once approved.');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      
      const { data: familyData } = await supabase.from('families').select('id').eq('code', familyCode.toLowerCase()).single();
      if (!familyData) return;

      const [memberRes, allMembersRes, allRelsRes] = await Promise.all([
        supabase.from('members').select('*').eq('id', id).single(),
        supabase.from('members').select('*').eq('family_id', familyData.id),
        supabase.from('relationships').select('*').eq('family_id', familyData.id)
      ]);

      if (memberRes.data) {
        setMember({
          id: memberRes.data.id,
          firstName: memberRes.data.first_name,
          lastName: memberRes.data.last_name,
          birthYear: memberRes.data.birth_date ? memberRes.data.birth_date.split('-')[0] : 'Unknown',
          deathYear: memberRes.data.death_date ? memberRes.data.death_date.split('-')[0] : null,
          birthDate: memberRes.data.birth_date,
          deathDate: memberRes.data.death_date,
          imageUrl: memberRes.data.image_url || `https://ui-avatars.com/api/?name=${memberRes.data.first_name}+${memberRes.data.last_name}&background=random`,
          bio: memberRes.data.bio || 'No biography provided yet.',
          milestones: memberRes.data.milestones || [],
          gallery: memberRes.data.gallery || []
        });

        if (allMembersRes.data && allRelsRes.data) {
          const baseNodes = allMembersRes.data.map(m => ({
            id: m.id,
            type: 'memberNode',
            data: {
              id: m.id,
              firstName: m.first_name,
              lastName: m.last_name,
              birthYear: m.birth_date ? m.birth_date.split('-')[0] : 'Unknown',
              deathYear: m.death_date ? m.death_date.split('-')[0] : null,
              imageUrl: m.image_url || `https://ui-avatars.com/api/?name=${m.first_name}+${m.last_name}&background=random`,
              isHighlighted: m.id === id
            },
            position: { x: 0, y: 0 }
          }));

          const spouseRels = allRelsRes.data.filter(r => r.type === 'spouse');
          const childRels = allRelsRes.data.filter(r => r.type === 'child');

          const unionNodes = [];
          const newEdges = [];
          const parentToUnionMap = new Map();

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

          childRels.forEach(rel => {
            const unionId = parentToUnionMap.get(rel.source_id);
            if (unionId) {
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

          const relevantMemberIds = new Set([id]);
          const relevantUnionIds = new Set();

          // 1. Spouses
          spouseRels.forEach(rel => {
            if (rel.source_id === id) {
              relevantMemberIds.add(rel.target_id);
              relevantUnionIds.add(`union_${rel.source_id}_${rel.target_id}`);
            } else if (rel.target_id === id) {
              relevantMemberIds.add(rel.source_id);
              relevantUnionIds.add(`union_${rel.source_id}_${rel.target_id}`);
            }
          });

          // 2. Parents
          childRels.forEach(rel => {
            if (rel.target_id === id) {
               relevantMemberIds.add(rel.source_id);
               const unionId = parentToUnionMap.get(rel.source_id);
               if (unionId) {
                  relevantUnionIds.add(unionId);
                  spouseRels.forEach(sRel => {
                     if (`union_${sRel.source_id}_${sRel.target_id}` === unionId) {
                        relevantMemberIds.add(sRel.source_id);
                        relevantMemberIds.add(sRel.target_id);
                     }
                  });
               }
            }
          });

          // 3. Children
          childRels.forEach(rel => {
            if (rel.source_id === id) {
               relevantMemberIds.add(rel.target_id);
               const unionId = parentToUnionMap.get(rel.source_id);
               if (unionId) relevantUnionIds.add(unionId);
            }
          });

          const finalNodes = [
             ...baseNodes.filter(n => relevantMemberIds.has(n.id)),
             ...unionNodes.filter(n => relevantUnionIds.has(n.id))
          ];

          const finalNodeIds = new Set(finalNodes.map(n => n.id));
          const finalEdges = newEdges.filter(e => finalNodeIds.has(e.source) && finalNodeIds.has(e.target));

          const { nodes: layoutedN, edges: layoutedE } = getMiniTreeLayout(id, finalNodes, finalEdges);
          setMiniNodes(layoutedN);
          setMiniEdges(layoutedE);
        }
      }
      setLoading(false);
    };

    if (id) fetchProfile();
  }, [id]);

  const handleDeleteRequest = async () => {
    if (!user) return alert("You must be logged in to request deletion.");
    if (!window.confirm(`Are you sure you want to request the deletion of ${member.firstName} ${member.lastName}?`)) return;
    
    const requestData = {
      requestType: 'DELETE',
      targetMemberId: member.id,
      memberName: `${member.firstName} ${member.lastName}`
    };

    const { error } = await supabase.from('join_requests').insert([{
      submitted_by: user.id,
      request_data: requestData
    }]);

    if (error) {
      alert('Error submitting delete request: ' + error.message);
    } else {
      alert('Deletion request submitted for approval!');
    }
  };

  if (loading) {
    return <div className="placeholder-page">Loading profile...</div>;
  }

  if (!member) {
    return <div className="placeholder-page">Member not found</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-actions-bar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <button className="back-button glass-panel" onClick={() => navigate(`/${familyCode}`)}>
          <ArrowLeft size={20} /> Back to Tree
        </button>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" onClick={() => !user ? navigate('/auth') : setIsEditModalOpen(true)}>Edit Profile</button>
          <button className="btn-secondary" onClick={() => !user ? navigate('/auth') : setIsMilestoneModalOpen(true)}>Add Milestone</button>
          <button className="btn-reject" onClick={handleDeleteRequest} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)' }}>
            <Trash2 size={16} /> Request Deletion
          </button>
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-header glass-panel">
          <div className="profile-hero-image">
            <img src={member.imageUrl} alt={member.firstName} />
          </div>
          <div className="profile-info">
            <h1 className="text-gradient">{member.firstName} {member.lastName}</h1>
            <p className="life-dates">{member.birthYear} - {member.deathYear || 'Present'}</p>
            <div className="bio-section">
              <h3>Biography</h3>
              <p>{member.bio}</p>
            </div>
          </div>
        </div>
        
        <div className="profile-gallery glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Media Gallery</h3>
            {uploadingMedia && <span className="text-muted" style={{fontSize: '0.9rem'}}>Uploading...</span>}
          </div>
          
          <div className={showAllGallery ? "gallery-grid" : "gallery-carousel"}>
            <div className="gallery-add-tile" onClick={() => {
              if (!user) { navigate('/auth'); return; }
              if (!uploadingMedia) document.getElementById('media-upload').click();
            }}>
              <input 
                type="file" 
                id="media-upload" 
                accept="image/*" 
                multiple
                style={{ display: 'none' }} 
                onChange={handleAddMedia} 
                onClick={(e) => e.stopPropagation()}
                disabled={uploadingMedia}
              />
              <div className="add-icon">+</div>
            </div>

            {member.gallery && member.gallery
              .slice(0, showAllGallery ? undefined : 8)
              .map((img, idx) => (
                <div 
                  key={idx} 
                  className="gallery-item" 
                  onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                >
                  <img src={img} alt={`Gallery item ${idx + 1}`} />
                </div>
            ))}

            {!showAllGallery && member.gallery && member.gallery.length > 8 && (
              <div className="gallery-show-all-tile" onClick={() => setShowAllGallery(true)}>
                <div className="add-icon">+</div>
                <span>Show All</span>
              </div>
            )}
          </div>
          
          {showAllGallery && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button className="btn-secondary" onClick={() => setShowAllGallery(false)}>Show Less</button>
            </div>
          )}
        </div>

        <div className="profile-timeline glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Education & Milestones</h3>
            {user && (
              <button 
                className="btn-secondary" 
                onClick={() => setIsMilestoneModalOpen(true)}
                style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                title="Edit Milestones"
              >
                <Edit2 size={14} /> Edit
              </button>
            )}
          </div>
          <div className="timeline">
            {member.milestones && member.milestones.length > 0 ? (
              member.milestones.map((m, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-year">{m.year}</div>
                  <div className="timeline-event">{m.event}</div>
                </div>
              ))
            ) : (
              <p className="text-muted">No milestones recorded.</p>
            )}
          </div>
        </div>
        
        <div className="profile-minitree glass-panel">
          <h3>Immediate Connections</h3>
          <div className="minitree-wrapper">
            {miniNodes.length > 0 ? (
              <ReactFlow 
                nodes={miniNodes} 
                edges={miniEdges} 
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                colorMode="dark"
              >
                <Background color="var(--color-border)" gap={20} size={1} />
                <Controls />
              </ReactFlow>
            ) : (
              <p style={{padding: '2rem'}} className="text-muted">No immediate connections found.</p>
            )}
          </div>
        </div>
      </div>

      <EditMemberModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        member={member} 
      />

      <EditMilestonesModal 
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        member={member}
      />

      {lightboxOpen && (
        <Lightbox 
          images={member.gallery}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(dir) => {
            let newIdx = lightboxIndex + dir;
            if (newIdx < 0) newIdx = member.gallery.length - 1;
            if (newIdx >= member.gallery.length) newIdx = 0;
            setLightboxIndex(newIdx);
          }}
        />
      )}
    </div>
  );
};

export default PersonalProfile;
