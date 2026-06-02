import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Check, X, AlertTriangle, ArrowRight, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import './Approvals.css';

const Approvals = () => {
  const { familyCode } = useParams();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [currentUserMember, setCurrentUserMember] = useState(null);
  const [family, setFamily] = useState(null);
  const [viewingProfile, setViewingProfile] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    
    // 1. Get Family
    const { data: familyData } = await supabase
      .from('families')
      .select('*')
      .eq('code', familyCode.toLowerCase())
      .single();
      
    if (!familyData) {
      setLoading(false);
      return;
    }
    setFamily(familyData);

    // 2. Get Requests for this family
    const { data: reqData } = await supabase
      .from('join_requests')
      .select('*')
      .eq('family_id', familyData.id)
      .eq('status', 'pending');
      
    if (reqData) setRequests(reqData);

    // 3. Get Current User's Member Profile in this family (for permissions)
    if (user) {
      const { data: memberData } = await supabase
        .from('members')
        .select('*')
        .eq('auth_id', user.id)
        .eq('family_id', familyData.id)
        .single();
      if (memberData) setCurrentUserMember(memberData);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (familyCode) {
      fetchData();
    }
  }, [familyCode, user]);

  const handleApprove = async (request) => {
    if (processingId) return;
    setProcessingId(request.id);
    
    const { data: currentReq } = await supabase.from('join_requests').select('status').eq('id', request.id).single();
    if (currentReq?.status !== 'pending') {
      alert('This request has already been processed.');
      setProcessingId(null);
      fetchData();
      return;
    }

    const { request_data } = request;
    const type = request_data.requestType || 'ADD';

    if (type === 'VIEW_ACCESS') {
      // Grant Access only
      await supabase.from('family_access')
        .update({ status: 'APPROVED' })
        .eq('family_id', family.id)
        .eq('user_id', request.submitted_by);
        
      // MOCK EMAIL NOTIFICATION
      console.log(`%c[MOCK EMAIL SENT]`, `color: green; font-weight: bold;`, `Your request to view ${family.name} has been approved!`);


    } else if (type === 'ADD') {
      const { data: newMember, error: memberError } = await supabase
        .from('members')
        .insert([{
          family_id: family.id,
          first_name: request_data.firstName,
          last_name: request_data.lastName,
          birth_date: request_data.birthDate || null,
          image_url: request_data.imageUrl || `https://ui-avatars.com/api/?name=${request_data.firstName}+${request_data.lastName}&background=random`
        }])
        .select()
        .single();

      if (!memberError && request_data.relativeId) {
        let source_id = newMember.id;
        let target_id = request_data.relativeId;
        if (request_data.relationship === 'parent') { source_id = newMember.id; target_id = request_data.relativeId; }
        else if (request_data.relationship === 'child') { source_id = request_data.relativeId; target_id = newMember.id; }
        else if (request_data.relationship === 'spouse') { source_id = request_data.relativeId; target_id = newMember.id; }

        await supabase.from('relationships').insert([{
          family_id: family.id,
          source_id, target_id,
          type: request_data.relationship === 'spouse' ? 'spouse' : 'child'
        }]);
      }
    } else if (type === 'EDIT') {
      const updatePayload = {
        first_name: request_data.changes.firstName,
        last_name: request_data.changes.lastName,
        bio: request_data.changes.bio,
        image_url: request_data.changes.imageUrl
      };
      
      if (request_data.changes.newMediaItems?.length > 0) {
        const { data: currentMem } = await supabase.from('members').select('gallery').eq('id', request_data.targetMemberId).single();
        const currentGallery = currentMem?.gallery || [];
        updatePayload.gallery = [...currentGallery, ...request_data.changes.newMediaItems];
      }

      if (request_data.changes.milestones !== undefined) updatePayload.milestones = request_data.changes.milestones;

      await supabase.from('members').update(updatePayload).eq('id', request_data.targetMemberId);

      // Handle removed relationships
      if (request_data.changes.removedRelationships?.length > 0) {
        for (let relId of request_data.changes.removedRelationships) await supabase.from('relationships').delete().eq('id', relId);
      }

      // Handle new relationship
      const newRel = request_data.changes.newRelationship;
      if (newRel && newRel.relativeId && newRel.type) {
        let source_id = request_data.targetMemberId;
        let target_id = newRel.relativeId;
        if (newRel.type === 'parent') { source_id = request_data.targetMemberId; target_id = newRel.relativeId; }
        else if (newRel.type === 'child') { source_id = newRel.relativeId; target_id = request_data.targetMemberId; }
        else if (newRel.type === 'spouse') { source_id = newRel.relativeId; target_id = request_data.targetMemberId; }
        
        await supabase.from('relationships').insert([{ family_id: family.id, source_id, target_id, type: newRel.type === 'spouse' ? 'spouse' : 'child' }]);
      }
    } else if (type === 'DELETE') {
      const { data: parents } = await supabase.from('relationships').select('source_id').eq('target_id', request_data.targetMemberId);
      const { data: children } = await supabase.from('relationships').select('target_id').eq('source_id', request_data.targetMemberId).eq('type', 'child');
      
      if (parents?.length > 0 && children?.length > 0) {
        for (let parent of parents) {
          for (let child of children) {
            await supabase.from('relationships').insert([{ family_id: family.id, source_id: parent.source_id, target_id: child.target_id, type: 'child' }]);
          }
        }
      }
      
      await supabase.from('relationships').delete().or(`source_id.eq.${request_data.targetMemberId},target_id.eq.${request_data.targetMemberId}`);
      await supabase.from('members').delete().eq('id', request_data.targetMemberId);
    }

    await supabase.from('join_requests').update({ status: 'approved' }).eq('id', request.id);
    setProcessingId(null);
    fetchData();
  };

  const handleReject = async (id) => {
    if (processingId) return;
    setProcessingId(id);
    
    // If it was a VIEW_AND_JOIN request, we should also reject the family_access
    const req = requests.find(r => r.id === id);
    if (req && req.request_data?.requestType === 'VIEW_ACCESS') {
      await supabase.from('family_access')
        .update({ status: 'REJECTED' })
        .eq('family_id', family.id)
        .eq('user_id', req.submitted_by);
    }

    await supabase.from('join_requests').update({ status: 'rejected' }).eq('id', id);
    setProcessingId(null);
    fetchData();
  };

  const renderActions = (req) => {
    const data = req.request_data;
    const type = data.requestType || 'ADD';
    let canApprove = true;
    let permissionMessage = "You do not have permission to approve this request.";
    
    const isRoot = family?.super_user_id === user?.id;

    if (type === 'EDIT' && data.targetMemberId !== currentUserMember?.id && !isRoot) {
      canApprove = false;
      permissionMessage = "You do not have permission to approve edits to this profile.";
    }

    if (type === 'DELETE' && !isRoot) {
      canApprove = false;
      permissionMessage = "Only the Super User can approve member deletion requests.";
    }
    
    if (type === 'VIEW_ACCESS' && !isRoot) {
      canApprove = false;
      permissionMessage = "Only the Super User can approve access requests.";
    }

    if (!canApprove) {
      return (
        <div style={{color: '#ef4444', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <AlertTriangle size={16} /> {permissionMessage}
        </div>
      );
    }

    return (
      <div className="req-actions">
        <button className="btn-reject" onClick={() => handleReject(req.id)} disabled={processingId !== null}>
          <X size={18} /> {processingId === req.id ? 'Processing...' : 'Reject'}
        </button>
        <button className="btn-approve" onClick={() => handleApprove(req)} disabled={processingId !== null}>
          <Check size={18} /> {processingId === req.id ? 'Processing...' : 'Approve'}
        </button>
      </div>
    );
  };

  if (loading) return <div style={{color:'white', padding: '2rem'}}>Loading requests...</div>;

  return (
    <div className="approvals-container">
      <h2 className="text-gradient">Pending Approvals for {family?.name}</h2>
      {requests.length === 0 ? (
        <p className="text-muted">No pending requests at the moment.</p>
      ) : (
        <div className="requests-list">
          {requests.map(req => {
            const data = req.request_data;
            const type = data.requestType || 'ADD';

            return (
              <div key={req.id} className="request-card glass-panel">
                <div className="req-header">
                  <h3>
                    {type === 'ADD' && '[ADD NEW MEMBER]'}
                    {type === 'EDIT' && `[EDIT] ${data.originalData.firstName} ${data.originalData.lastName}`}
                    {type === 'DELETE' && `[DELETE] ${data.targetMemberName}`}
                    {type === 'VIEW_ACCESS' && `[ACCESS REQUEST] `}
                    {type === 'VIEW_ACCESS' && (
                      <span 
                        style={{textDecoration: 'underline', cursor: 'pointer', color: 'var(--color-accent-gold)'}}
                        onClick={() => setViewingProfile(data.profileData)}
                      >
                        {data.profileData.first_name} {data.profileData.last_name}
                      </span>
                    )}
                  </h3>
                  <span className="req-date">{new Date(req.created_at).toLocaleDateString()}</span>
                </div>

                {type === 'VIEW_ACCESS' && (
                  <div className="req-body">
                    <p style={{marginBottom: '0.5rem'}}>{data.profileData.first_name} {data.profileData.last_name} has requested to view {family?.name}.</p>
                    <p style={{fontSize: '0.85rem', color: '#4ade80', marginTop: '1rem'}}>
                      <UserPlus size={14} style={{verticalAlign: 'middle', marginRight: '0.3rem'}}/>
                      Approving this will grant them view access. They will need to manually join the tree later.
                    </p>
                  </div>
                )}

                {/* Keeping other types unchanged mostly... */}
                {type === 'ADD' && (
                  <div className="req-body">
                     <p><strong>Name:</strong> {data.firstName} {data.lastName}</p>
                     <p><strong>Relative:</strong> {data.relativeName ? `${data.relativeName} (${data.relationship})` : 'None (Root Node)'}</p>
                  </div>
                )}

                {type === 'DELETE' && (
                  <div className="req-body">
                     <p style={{color: '#ef4444'}}>Request to permanently remove {data.targetMemberName}.</p>
                  </div>
                )}
                
                {/* Simplified Edit View for brevity here */}
                {type === 'EDIT' && (
                  <div className="req-body">
                    <p>Edit requested. See changes.</p>
                  </div>
                )}

                <div className="req-footer">
                  {renderActions(req)}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {viewingProfile && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{maxWidth: '500px'}}>
            <button className="close-btn" onClick={() => setViewingProfile(null)}><X size={24} /></button>
            <h2 className="text-gradient">Global Profile</h2>
            <div style={{display: 'flex', gap: '1.5rem', marginTop: '1.5rem'}}>
              {viewingProfile.image_url ? (
                <img src={viewingProfile.image_url} alt="Profile" style={{width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover'}} />
              ) : (
                <div style={{width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)'}}></div>
              )}
              <div>
                <h3 style={{margin: '0 0 0.5rem 0'}}>{viewingProfile.first_name} {viewingProfile.last_name}</h3>
                {viewingProfile.birth_date && <p style={{margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem'}}>Born: {viewingProfile.birth_date}</p>}
                <p style={{marginTop: '1rem', fontStyle: 'italic', color: 'var(--color-text-muted)'}}>
                  "{viewingProfile.bio || 'No biography provided.'}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvals;
