import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const FamilyAccessGate = ({ children }) => {
  const { familyCode } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [family, setFamily] = useState(null);
  const [accessStatus, setAccessStatus] = useState(null); // 'PENDING', 'APPROVED', 'REJECTED', or null
  const [globalProfile, setGlobalProfile] = useState(null);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      // 1. Check if family code exists
      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .select('*')
        .eq('code', familyCode.toLowerCase())
        .single();
        
      if (familyError || !familyData) {
        setLoading(false);
        return; // Family not found
      }
      setFamily(familyData);

      // 2. If not logged in, just stop here (they need to authenticate)
      if (!user) {
        setLoading(false);
        return;
      }

      // 3. Check access
      const { data: accessData } = await supabase
        .from('family_access')
        .select('status')
        .eq('family_id', familyData.id)
        .eq('user_id', user.id)
        .single();
        
      if (accessData) {
        setAccessStatus(accessData.status);
      }

      // 4. Load global profile just in case they need to request access
      const { data: profileData } = await supabase
        .from('global_profiles')
        .select('*')
        .eq('auth_id', user.id)
        .single();
      
      if (profileData) {
        setGlobalProfile(profileData);
      }
      
      setLoading(false);
    };
    
    checkAccess();
  }, [familyCode, user]);

  const handleRequestAccess = async () => {
    if (!globalProfile) {
      alert("Please create your Global Profile first!");
      navigate('/global-profile');
      return;
    }
    
    setRequesting(true);
    
    // 1. Create a join_request of type 'VIEW_ACCESS'
    const requestData = {
      requestType: 'VIEW_ACCESS',
      profileData: globalProfile
    };
    
    await supabase.from('join_requests').insert([{
      family_id: family.id,
      submitted_by: user.id,
      request_data: requestData
    }]);

    // 2. Create the pending family_access record
    await supabase.from('family_access').insert([{
      family_id: family.id,
      user_id: user.id,
      status: 'PENDING'
    }]);
    
    setAccessStatus('PENDING');
    setRequesting(false);
  };

  if (loading) {
    return <div style={{color: 'white', textAlign: 'center', marginTop: '20vh'}}>Loading Family Data...</div>;
  }

  if (!family) {
    return (
      <div style={{color: 'white', textAlign: 'center', marginTop: '20vh'}}>
        <h2 className="text-gradient">Family Not Found</h2>
        <p>No family tree exists with the code "{familyCode}".</p>
        <button className="btn-secondary" onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{color: 'white', textAlign: 'center', marginTop: '20vh'}} className="glass-panel">
        <h2 className="text-gradient">Authentication Required</h2>
        <p>You must be signed in to access {family.name}.</p>
        <button className="btn-primary" onClick={() => navigate(`/auth?returnTo=/${familyCode}`)}>Sign In</button>
      </div>
    );
  }

  if (accessStatus === 'APPROVED') {
    return children;
  }

  if (accessStatus === 'PENDING') {
    return (
      <div style={{color: 'white', textAlign: 'center', marginTop: '20vh', padding: '2rem', maxWidth: '600px', margin: '20vh auto'}} className="glass-panel">
        <h2 className="text-gradient">Request in Processing</h2>
        <p>Your request to join <strong>{family.name}</strong> has been sent to the family admin.</p>
        <p className="text-muted">You will be notified once they review it.</p>
        <button className="btn-secondary" style={{marginTop: '2rem'}} onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  // Not approved, not pending -> User can request access
  return (
    <div style={{color: 'white', textAlign: 'center', marginTop: '20vh', padding: '2rem', maxWidth: '600px', margin: '20vh auto'}} className="glass-panel">
      <h2 className="text-gradient">Access {family.name}</h2>
      <p>This is a private family tree. You must request access to view it.</p>
      
      {!globalProfile ? (
        <div style={{background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '1.5rem', borderRadius: '8px', margin: '2rem 0'}}>
          <p style={{color: '#ef4444', margin: 0, marginBottom: '1.5rem'}}>You need to create your Global Profile before requesting access.</p>
          <button className="btn-primary" onClick={() => navigate('/global-profile')}>Create Profile</button>
        </div>
      ) : (
        <div style={{margin: '2rem 0'}}>
          <p style={{color: '#4ade80'}}>Global Profile ready! Requesting access will automatically import your profile into the tree once approved.</p>
          <button className="btn-primary" onClick={handleRequestAccess} disabled={requesting}>
            {requesting ? 'Sending Request...' : 'Request Access'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FamilyAccessGate;
