import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Home, Users, CheckSquare, LogIn, LogOut, Settings, Shield, Menu, X } from 'lucide-react';
import './App.css';

import { useAuth } from './context/AuthContext';
import { supabase } from './lib/supabaseClient';

import LandingPage from './pages/LandingPage';
import GlobalProfileBuilder from './pages/GlobalProfileBuilder';
import FamilyAccessGate from './components/FamilyAccessGate';
import FamilyTreeCanvas from './pages/FamilyTreeCanvas';
import PersonalProfile from './pages/PersonalProfile';
import Auth from './pages/Auth';
import Approvals from './pages/Approvals';
import AddMemberModal from './components/AddMemberModal';
import ManageTrees from './pages/ManageTrees';

const DemoOrFamilyGate = ({ children }) => {
  const { familyCode } = useParams();
  if (familyCode && familyCode.toLowerCase() === 'demo') {
    return children;
  }
  return <FamilyAccessGate>{children}</FamilyAccessGate>;
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserMember, setCurrentUserMember] = useState(null);
  const [globalProfile, setGlobalProfile] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Helper to get familyCode from URL
  const pathParts = location.pathname.split('/').filter(Boolean);
  const familyCode = pathParts[0] && !['auth', 'global-profile', 'manage-trees'].includes(pathParts[0]) ? pathParts[0] : null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  useEffect(() => {
    if (user && familyCode) {
      const loadUserStatus = async () => {
        const { data: family } = await supabase.from('families').select('id').eq('code', familyCode).single();
        if (family) {
          const { data: member } = await supabase.from('members').select('*').eq('auth_id', user.id).eq('family_id', family.id).single();
          setCurrentUserMember(member || null);
        }
        const { data: profile } = await supabase.from('global_profiles').select('*').eq('auth_id', user.id).single();
        setGlobalProfile(profile || null);
      }
      loadUserStatus();
    }
  }, [user, familyCode, location.pathname]);

  return (
    <div className="app-container">
      <nav className="glass-panel top-nav">
        <div className="nav-brand">
          <Link to="/">
            <img src="/logo.png" alt="Vanshavali Logo" style={{ height: '45px', objectFit: 'contain' }} />
          </Link>
        </div>

        <div className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} color="white" /> : <Menu size={28} color="white" />}
        </div>

        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {familyCode && (
            <Link to={`/${familyCode}`} className={`nav-link ${location.pathname === `/${familyCode}` ? 'active' : ''}`}>
              <Home size={20} />
              <span>Tree View</span>
            </Link>
          )}
          
          {familyCode === 'demo' ? (
            <button className="nav-link" onClick={() => !user ? navigate(`/auth`) : setIsModalOpen(true)}>
              <Users size={20} />
              <span>Add Member</span>
            </button>
          ) : familyCode ? (
            user ? (
              <>
                {currentUserMember ? (
                  <button className="nav-link" onClick={() => setIsModalOpen(true)}>
                    <Users size={20} />
                    <span>Add Member</span>
                  </button>
                ) : (
                  <button className="nav-link" onClick={() => setIsModalOpen(true)} style={{color: 'var(--color-accent-gold)', border: '1px solid var(--color-accent-gold)'}}>
                    <Users size={20} />
                    <span>Join Family Tree</span>
                  </button>
                )}
                <Link to={`/${familyCode}/approvals`} className={`nav-link ${location.pathname === `/${familyCode}/approvals` ? 'active' : ''}`}>
                  <CheckSquare size={20} />
                  <span>Approvals</span>
                </Link>
              </>
            ) : null
          ) : null}
          
          {user ? (
            <>
              <Link to="/manage-trees" className={`nav-link ${location.pathname === '/manage-trees' ? 'active' : ''}`}>
                <Shield size={20} />
                <span>Manage Tree</span>
              </Link>
              <Link to="/global-profile" className="nav-link">
                <Settings size={20} />
                <span>Profile</span>
              </Link>
              <button className="nav-link" onClick={handleLogout}>
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/auth" className={`nav-link ${location.pathname === '/auth' ? 'active' : ''}`}>
              <LogIn size={20} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/global-profile" element={<GlobalProfileBuilder />} />
          <Route path="/manage-trees" element={<ManageTrees />} />
          
          <Route path="/:familyCode/*" element={
            <DemoOrFamilyGate>
              <Routes>
                <Route path="/" element={<FamilyTreeCanvas />} />
                <Route path="/profile/:id" element={<PersonalProfile />} />
                <Route path="/approvals" element={user ? <Approvals /> : <Auth />} />
              </Routes>
            </DemoOrFamilyGate>
          } />
        </Routes>
      </main>

      {familyCode && <AddMemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        familyCode={familyCode} 
        isJoining={!currentUserMember}
        globalProfile={globalProfile}
      />}
    </div>
  );
}

export default App;
