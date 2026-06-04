import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import './AddMemberModal.css';

const EditMilestonesModal = ({ isOpen, onClose, member }) => {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && member) {
      // Clone the array so we don't accidentally mutate the prop directly
      setMilestones(member.milestones ? JSON.parse(JSON.stringify(member.milestones)) : []);
    }
  }, [isOpen, member]);

  if (!isOpen || !member) return null;

  const handleAddMilestone = () => {
    setMilestones([...milestones, { year: '', event: '' }]);
  };

  const handleRemoveMilestone = (index) => {
    const newMilestones = [...milestones];
    newMilestones.splice(index, 1);
    setMilestones(newMilestones);
  };

  const handleChange = (index, field, value) => {
    const newMilestones = [...milestones];
    newMilestones[index][field] = value;
    setMilestones(newMilestones);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to propose edits.");

    setLoading(true);

    const requestData = {
      requestType: 'EDIT',
      targetMemberId: member.id,
      originalData: {
        firstName: member.firstName,
        lastName: member.lastName,
        bio: member.bio,
        imageUrl: member.imageUrl,
        milestones: member.milestones
      },
      changes: {
        firstName: member.firstName,
        lastName: member.lastName,
        bio: member.bio,
        imageUrl: member.imageUrl,
        milestones: milestones
      }
    };

    const { error } = await supabase.from('join_requests').insert([{
      family_id: member.familyId,
      submitted_by: user.id,
      request_data: requestData
    }]);

    setLoading(false);
    
    if (error) {
      alert('Error submitting request: ' + error.message);
    } else {
      alert('Edit request submitted for approval!');
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{maxHeight: '90vh', overflowY: 'auto'}}>
        <button className="close-btn" onClick={onClose}><X size={24} /></button>
        <h2 className="text-gradient">Edit Milestones</h2>
        <p className="text-muted">Propose changes to {member.firstName}'s timeline.</p>
        
        <form onSubmit={handleSubmit} className="add-member-form">
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1rem 0'}}>
            {milestones.length === 0 && (
              <p className="text-muted" style={{textAlign: 'center', padding: '2rem 0'}}>No milestones currently exist.</p>
            )}
            {milestones.map((ms, index) => (
              <div key={index} style={{display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)'}}>
                <div className="form-group" style={{flex: 1, marginBottom: 0}}>
                  <label>Year</label>
                  <input type="text" value={ms.year} onChange={(e) => handleChange(index, 'year', e.target.value)} required placeholder="e.g. 2023" />
                </div>
                <div className="form-group" style={{flex: 3, marginBottom: 0}}>
                  <label>Event Description</label>
                  <input type="text" value={ms.event} onChange={(e) => handleChange(index, 'event', e.target.value)} required placeholder="e.g. Graduated University" />
                </div>
                <button type="button" onClick={() => handleRemoveMilestone(index)} style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', marginTop: '1.8rem'}} title="Remove Milestone">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <button type="button" className="btn-secondary" onClick={handleAddMilestone} style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem'}}>
            <Plus size={18} /> Add Milestone
          </button>
          
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMilestonesModal;
