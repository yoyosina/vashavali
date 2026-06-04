import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const ManageTrees = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const fetchTrees = async () => {
      const { data, error } = await supabase
        .from('families')
        .select('*')
        .eq('super_user_id', user.id);
        
      if (data) setTrees(data);
      setLoading(false);
    };
    
    fetchTrees();
  }, [user, navigate]);

  if (loading) return <div style={{padding: '2rem', textAlign: 'center', color: 'var(--color-text-primary)'}}>Loading...</div>;

  return (
    <div style={{maxWidth: '800px', margin: '2rem auto', padding: '0 1rem', color: 'var(--color-text-primary)'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
        <Shield size={32} color="var(--color-accent-gold)" />
        <h2 className="text-gradient" style={{margin: 0}}>Manage Your Trees</h2>
      </div>
      
      {trees.length === 0 ? (
        <div className="glass-panel" style={{padding: '2rem', textAlign: 'center'}}>
          <p className="text-muted">You do not manage any family trees.</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {trees.map(tree => (
            <div 
              key={tree.id} 
              className="glass-panel tree-card" 
              style={{
                padding: '1.5rem', 
                cursor: 'pointer', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
              onClick={() => navigate(`/${tree.code}`)}
            >
              <div>
                <h3 style={{margin: '0 0 0.5rem 0'}}>{tree.name}</h3>
                <p style={{margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem'}}>Secret Code: {tree.code}</p>
              </div>
              <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); navigate(`/${tree.code}/approvals`); }}>
                  Approvals
                </button>
                <button className="btn-primary" onClick={(e) => { e.stopPropagation(); navigate(`/${tree.code}`); }}>
                  Open Tree
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTrees;
