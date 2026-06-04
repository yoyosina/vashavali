import React, { useState, useEffect, useMemo } from 'react';
import { X, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import './AddMemberModal.css';

const EditMemberModal = ({ isOpen, onClose, member }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: member?.firstName || '',
    lastName: member?.lastName || '',
    birthDate: member?.birthDate || '',
    deathDate: member?.deathDate || '',
    bio: member?.bio || ''
  });
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Relationship State
  const [initialNodes, setInitialNodes] = useState([]);
  const [initialRels, setInitialRels] = useState([]);
  const [removedRels, setRemovedRels] = useState([]);
  
  const [newRelSearch, setNewRelSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [newRel, setNewRel] = useState({ type: '', relativeId: '', relativeName: '' });

  useEffect(() => {
    if (isOpen && member) {
      setFormData({
        firstName: member.firstName || '',
        lastName: member.lastName || '',
        birthDate: member.birthDate || '',
        deathDate: member.deathDate || '',
        bio: member.bio || ''
      });
      setRemovedRels([]);
      setNewRel({ type: '', relativeId: '', relativeName: '' });
      setNewRelSearch('');

      supabase.from('members').select('*').then(({ data }) => {
        if (data) setInitialNodes(data);
      });
      
      supabase.from('relationships').select('*').then(({ data }) => {
        if (data) {
          setInitialRels(data.filter(r => r.source_id === member.id || r.target_id === member.id));
        }
      });
    }
  }, [isOpen, member]);

  const suggestions = useMemo(() => {
    if (!newRelSearch.trim()) return [];
    const query = newRelSearch.toLowerCase();
    return initialNodes.filter(node => {
      if (node.id === member?.id) return false; // cant relate to self
      const fullName = `${node.first_name} ${node.last_name}`.toLowerCase();
      return fullName.includes(query);
    });
  }, [newRelSearch, initialNodes, member]);

  if (!isOpen || !member) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSelectRelative = (node) => {
    setNewRelSearch(`${node.first_name} ${node.last_name}`);
    setNewRel({ ...newRel, relativeId: node.id, relativeName: `${node.first_name} ${node.last_name}` });
    setShowSuggestions(false);
  };

  const getRelString = (rel) => {
    const isSource = rel.source_id === member.id;
    const otherId = isSource ? rel.target_id : rel.source_id;
    const otherNode = initialNodes.find(n => n.id === otherId);
    const otherName = otherNode ? `${otherNode.first_name} ${otherNode.last_name}` : 'Unknown';
    
    if (rel.type === 'child') {
       return isSource ? `Parent of ${otherName}` : `Child of ${otherName}`;
    } else if (rel.type === 'spouse') {
       return `Spouse of ${otherName}`;
    }
    return `${rel.type} - ${otherName}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to propose edits.");

    setLoading(true);
    
    let imageUrl = member.imageUrl;
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
        
      if (!uploadError && data) {
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
        imageUrl = publicUrl;
      }
    }

    const requestData = {
      requestType: 'EDIT',
      targetMemberId: member.id,
      originalData: {
        firstName: member.firstName,
        lastName: member.lastName,
        birthDate: member.birthDate,
        deathDate: member.deathDate,
        bio: member.bio,
        imageUrl: member.imageUrl
      },
      changes: {
        ...formData,
        imageUrl,
        removedRelationships: removedRels,
        newRelationship: newRel.relativeId ? newRel : null
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
        <h2 className="text-gradient">Edit Profile</h2>
        <p className="text-muted">Propose changes to {member.firstName}'s profile.</p>
        
        <form onSubmit={handleSubmit} className="add-member-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" value={formData.firstName} required onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} required onChange={handleChange} />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Birth Date (optional)</label>
              <input type="date" name="birthDate" value={formData.birthDate || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Death Date (optional)</label>
              <input type="date" name="deathDate" value={formData.deathDate || ''} onChange={handleChange} />
            </div>
          </div>
          
          <div className="form-group">
            <label>Biography</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" />
          </div>

          <div className="form-group">
            <label>New Profile Photo (optional)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{padding: '0.5rem'}} />
          </div>

          <hr style={{borderColor: 'var(--color-border)', margin: '1rem 0'}} />
          
          <h3 style={{fontSize: '1.1rem', marginBottom: '0.5rem'}}>Relationships</h3>
          
          {initialRels.length > 0 && (
            <div className="current-rels" style={{marginBottom: '1rem'}}>
              <label style={{fontSize: '0.85rem', color: 'var(--color-text-muted)'}}>Current Relationships (Click to remove)</label>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem'}}>
                {initialRels.map(rel => {
                  const isRemoved = removedRels.includes(rel.id);
                  return (
                    <div key={rel.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px', opacity: isRemoved ? 0.5 : 1 }}>
                      <span style={{textDecoration: isRemoved ? 'line-through' : 'none'}}>{getRelString(rel)}</span>
                      <button type="button" onClick={() => {
                        if (isRemoved) setRemovedRels(removedRels.filter(id => id !== rel.id));
                        else setRemovedRels([...removedRels, rel.id]);
                      }} style={{background: 'none', border: 'none', color: isRemoved ? '#4ade80' : '#ef4444', cursor: 'pointer'}}>
                        {isRemoved ? 'Restore' : <Trash2 size={16} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Add New Relationship (optional)</label>
            <div style={{display: 'flex', gap: '1rem'}}>
              <select value={newRel.type} onChange={e => setNewRel({...newRel, type: e.target.value})} style={{flex: 1}}>
                <option value="">Select Type</option>
                <option value="child">Child of</option>
                <option value="parent">Parent of</option>
                <option value="spouse">Spouse of</option>
              </select>
              <div className="autocomplete-group" style={{flex: 2}}>
                <input 
                  type="text" 
                  placeholder="Search relative..." 
                  value={newRelSearch}
                  onChange={e => {
                    setNewRelSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="suggestions-list glass-panel">
                    {suggestions.map(node => (
                      <li 
                        key={node.id} 
                        className="suggestion-item"
                        onClick={() => handleSelectRelative(node)}
                      >
                        {node.image_url && <img src={node.image_url} alt="" className="suggestion-avatar" />}
                        <span>{node.first_name} {node.last_name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          
          <div className="form-actions" style={{marginTop: '2rem'}}>
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

export default EditMemberModal;
