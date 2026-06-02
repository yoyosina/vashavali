import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Camera, Save } from 'lucide-react';
import '../components/AddMemberModal.css'; // Reuse existing form styles

const GlobalProfileBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    bio: '',
    imageUrl: '',
    milestones: [] // Stored as JSON
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth?returnTo=/global-profile');
      return;
    }
    const loadProfile = async () => {
      const { data } = await supabase.from('global_profiles').select('*').eq('auth_id', user.id).single();
      if (data) {
        setFormData({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          birthDate: data.birth_date || '',
          bio: data.bio || '',
          imageUrl: data.image_url || '',
          milestones: data.milestones || []
        });
      }
      setLoading(false);
    };
    loadProfile();
  }, [user, navigate]);

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { error: uploadError, data } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);
      
    if (uploadError) {
      alert("Error uploading image: " + uploadError.message);
    } else if (data) {
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setFormData(prev => ({...prev, imageUrl: publicUrl}));
    }
    setUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      auth_id: user.id,
      first_name: formData.firstName,
      last_name: formData.lastName,
      birth_date: formData.birthDate || null,
      bio: formData.bio,
      image_url: formData.imageUrl,
      milestones: formData.milestones
    };

    const { error } = await supabase.from('global_profiles').upsert(payload, { onConflict: 'auth_id' });
    
    setSaving(false);
    if (error) {
      alert("Error saving profile: " + error.message);
    } else {
      alert("Global Profile Saved! You can now request access to a family tree.");
      navigate('/');
    }
  };

  if (loading) return <div className="glass-panel" style={{margin: '2rem', padding: '2rem', textAlign: 'center'}}>Loading...</div>;

  return (
    <div style={{maxWidth: '800px', margin: '2rem auto', padding: '0 1rem'}}>
      <div className="glass-panel" style={{padding: '2rem'}}>
        <h2 className="text-gradient" style={{marginTop: 0}}>Your Global Profile</h2>
        <p className="text-muted">Fill this out once. When you join a family tree, this profile is automatically imported.</p>
        
        <form onSubmit={handleSave} className="add-member-form">
          <div style={{display: 'flex', gap: '1rem', flexDirection: 'column'}}>
            <div className="form-group">
              <label htmlFor="imageUrl">Profile Picture URL</label>
              <div style={{display: 'flex', gap: '1rem'}}>
                <div style={{width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {formData.imageUrl ? <img src={formData.imageUrl} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}}/> : <Camera size={24} color="#666"/>}
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1}}>
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <input id="imageUrl" type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Paste image URL..." style={{flex: 1}}/>
                    <label className="btn-secondary" style={{cursor: 'pointer', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center'}}>
                      {uploading ? 'Uploading...' : 'Upload Image'}
                      <input type="file" accept="image/*" onChange={handleFileUpload} style={{display: 'none'}} disabled={uploading}/>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{display: 'flex', gap: '1rem'}}>
              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="firstName">First Name *</label>
                <input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label htmlFor="lastName">Last Name *</label>
                <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="birthDate">Date of Birth</label>
              <input id="birthDate" type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Biography</label>
              <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows="4" placeholder="Tell your story..."></textarea>
            </div>
            
            <div className="form-group">
              <label>Milestones (Coming Soon to Global Builder)</label>
              <p className="text-muted" style={{fontSize: '0.85rem'}}>You can manage your detailed timeline from within the family tree once approved.</p>
            </div>
          </div>
          
          <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
            <button type="button" className="btn-secondary" onClick={() => navigate('/')}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              <Save size={18} style={{marginRight: '0.5rem', verticalAlign: 'middle'}}/>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GlobalProfileBuilder;
