import React, { useState, useMemo, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import './AddMemberModal.css';

const AddMemberModal = ({ isOpen, onClose, isJoining, globalProfile, familyCode }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    relationship: 'child',
    relativeId: ''
  });
  
  const [file, setFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [initialNodes, setInitialNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [familyId, setFamilyId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (isJoining && globalProfile) {
        setFormData({
          firstName: globalProfile.first_name || '',
          lastName: globalProfile.last_name || '',
          birthDate: globalProfile.birth_date || '',
          relationship: 'child',
          relativeId: ''
        });
      } else {
        setFormData({
          firstName: '',
          lastName: '',
          birthDate: '',
          relationship: 'child',
          relativeId: ''
        });
      }
      setSearchQuery('');
      setFile(null);
      
      supabase.from('families').select('id').eq('code', familyCode).single().then(({data}) => {
        if (data) {
          setFamilyId(data.id);
          supabase.from('members').select('*').eq('family_id', data.id).then((res) => {
            if (res.data) setInitialNodes(res.data);
          });
        }
      });
    }
  }, [isOpen, isJoining, globalProfile, familyCode]);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return initialNodes.filter(node => {
      const fullName = `${node.first_name} ${node.last_name}`.toLowerCase();
      return fullName.includes(query);
    });
  }, [searchQuery, initialNodes]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
    setFormData({ ...formData, relativeId: '' });
  };

  const handleSelectRelative = (node) => {
    setSearchQuery(`${node.first_name} ${node.last_name}`);
    setFormData({ ...formData, relativeId: node.id });
    setShowSuggestions(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    let imageUrl = null;
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

    let finalImageUrl = imageUrl;
    if (isJoining && globalProfile && !file) {
      finalImageUrl = globalProfile.image_url;
    }

    const requestData = {
      requestType: 'ADD',
      ...formData,
      imageUrl: finalImageUrl,
      isJoining: isJoining
    };

    const { error } = await supabase.from('join_requests').insert([{
      family_id: familyId || initialNodes[0]?.family_id,
      submitted_by: user.id,
      request_data: requestData
    }]);

    setLoading(false);
    
    if (error) {
      alert('Error submitting request: ' + error.message);
    } else {
      alert('Request submitted for approval!');
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <button className="close-btn" onClick={onClose}><X size={24} /></button>
        <h2 className="text-gradient">{isJoining ? 'Join Family Tree' : 'Add Family Member'}</h2>
        <p className="text-muted">
          {isJoining ? 'Your global profile details are locked. Please select how you are related to an existing member.' : 'Your request will be sent to existing members for approval.'}
        </p>
        
        <form onSubmit={handleSubmit} className="add-member-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} disabled={isJoining} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} disabled={isJoining} />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Birth Date</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} disabled={isJoining} />
            </div>
          </div>

          {!isJoining && (
            <div className="form-group">
              <label>Profile Photo</label>
              <input type="file" accept="image/*" onChange={handleFileChange} style={{padding: '0.5rem'}} />
            </div>
          )}
          
          <div className="form-group">
            <label>Relationship Type</label>
            <select name="relationship" value={formData.relationship} onChange={handleChange}>
              <option value="child">Child of</option>
              <option value="parent">Parent of</option>
              <option value="spouse">Spouse of</option>
            </select>
          </div>
          
          <div className="form-group autocomplete-group">
            <label>Relative</label>
            <input 
              type="text" 
              placeholder="Search existing members (optional for root)" 
              value={searchQuery}
              onChange={handleSearchChange}
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

export default AddMemberModal;
