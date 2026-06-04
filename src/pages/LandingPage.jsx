import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Shield, Globe, ArrowRight, Key, Fingerprint, Lock, Database, EyeOff } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import './LandingPage.css';



const LandingPage = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (code.trim()) {
      navigate(`/${code.trim().toLowerCase()}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 12 }
    }
  };

  return (
    <div className="landing-container">
      {/* Parallax Background Elements */}
      <motion.div className="bg-orb orb-1" />
      <motion.div className="bg-orb orb-2" />

      <motion.div 
        className="landing-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Inject Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "How does Vashavali protect my privacy?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Vashavali uses end-to-end encryption and isolated databases. We have a strict zero data-mining policy, ensuring your family tree is never shared or monetized."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Is my family tree visible to the public?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "No. Vashavali is strictly invite-only. Only members invited by a family super-user can view or edit the tree."
                      }
                    }
                  ]
                },
                {
                  "@type": "HowTo",
                  "name": "How to join Vashavali",
                  "description": "Step-by-step guide on how to join a secure family tree on the Vashavali platform.",
                  "step": [
                    {
                      "@type": "HowToStep",
                      "name": "Receive an Invite",
                      "text": "Obtain a unique Family Code from your family's designated super-user."
                    },
                    {
                      "@type": "HowToStep",
                      "name": "Enter the Code",
                      "text": "Navigate to the Vashavali landing page and enter your unique code into the 'Access a Family Tree' input field."
                    },
                    {
                      "@type": "HowToStep",
                      "name": "Create a Global Profile",
                      "text": "Sign in and set up your secure global identity, which will seamlessly port into your invited family tree."
                    }
                  ]
                }
              ]
            })
          }}
        />

        <div className="hero-logo-wrapper">
          <img src="/logo.png" alt="Vashavali Logo" className="hero-logo" />
        </div>
        
        <h1 className="awwwards-title">
          Preserve Your <br/><span className="text-gradient">Legacy</span>
        </h1>
        
        <p className="hero-subtitle">
          An exclusive, ultra-secure platform to map your ancestry and connect generations.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <Link to="/demo" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} />
            Explore Interactive Demo
          </Link>
        </div>
      </motion.div>

      <motion.div 
        className="mission-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="mission-content glass-panel-premium">
          <h3 className="overline">Our Mission</h3>
          <h2>Connecting the Past, Present, and Future</h2>
          <p>
            Your family's history is deeply personal. Vashavali provides a completely isolated, 
            invite-only sanctuary to weave your family narrative. No public directories. No data mining. 
            Just your heritage, beautifully preserved.
          </p>
        </div>
      </motion.div>

      <div className="action-grid">
        <motion.form 
          onSubmit={handleJoin} 
          className="join-form glass-panel-premium interact-card"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ y: -5 }}
        >
          <h3>Access a Family Tree</h3>
          <p className="text-muted">Enter the unique Family Code provided by your family admin.</p>
          <div className="input-group">
            <input 
              id="familyCode"
              type="text" 
              placeholder="e.g. alf123bqc" 
              value={code} 
              onChange={(e) => setCode(e.target.value)}
              required
              aria-label="Family Code"
            />
            <button type="submit" className="btn-primary icon-btn">
              <ArrowRight size={20} />
            </button>
          </div>
        </motion.form>

        <motion.div 
          className="global-profile-section glass-panel-premium interact-card"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ y: -5 }}
        >
          <h3>Your Global Identity</h3>
          <p className="text-muted">
            Create your master profile before joining a tree. Your bio, timeline, and photos 
            will seamlessly port into any family you join.
          </p>
          <div style={{marginTop: '1.5rem'}}>
            {user ? (
              <Link to="/global-profile" className="btn-secondary">Manage My Profile</Link>
            ) : (
              <Link to="/auth" className="btn-secondary">Sign in to Create Profile</Link>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="features-grid"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="feature-card glass-panel-premium">
          <Shield size={40} className="feature-icon" />
          <h4>Absolute Privacy</h4>
          <p>Access is strictly invite-only. Super users must approve all view and edit requests.</p>
        </div>
        <div className="feature-card glass-panel-premium">
          <Globe size={40} className="feature-icon" />
          <h4>Global Portability</h4>
          <p>Maintain one beautiful profile and port it seamlessly into any family tree you are part of.</p>
        </div>
        <div className="feature-card glass-panel-premium">
          <Users size={40} className="feature-icon" />
          <h4>Collaborative</h4>
          <p>Propose edits, upload memories, and grow your family's tree together organically.</p>
        </div>
      </motion.div>
      <motion.section 
        className="how-it-works-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        style={{ marginTop: '4rem' }}
      >
        <h2 className="section-title">How It Works</h2>
        <div className="how-it-works-grid">
          <div className="step-card glass-panel-premium interact-card">
            <Key size={40} className="feature-icon" />
            <h4>1. Receive an Invite</h4>
            <p>Obtain a unique Family Code from your family's designated super-user.</p>
          </div>
          <div className="step-card glass-panel-premium interact-card">
            <Fingerprint size={40} className="feature-icon" />
            <h4>2. Authenticate Securely</h4>
            <p>Enter the code and authenticate to verify your identity.</p>
          </div>
          <div className="step-card glass-panel-premium interact-card">
            <Users size={40} className="feature-icon" />
            <h4>3. Preserve Your Legacy</h4>
            <p>Seamlessly port your profile and grow your family's tree together.</p>
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="privacy-matters-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ marginTop: '4rem' }}
      >
        <h2 className="section-title">Privacy Matters</h2>
        <div className="privacy-grid">
          <div className="privacy-card glass-panel-premium interact-card gold-border">
            <EyeOff size={40} className="feature-icon" />
            <h4>Zero Data Mining</h4>
            <p>Your legacy is yours. We strictly do not analyze, sell, or monetize your data.</p>
          </div>
          <div className="privacy-card glass-panel-premium interact-card gold-border">
            <Database size={40} className="feature-icon" />
            <h4>Isolated Environments</h4>
            <p>Every tree exists in an isolated database to prevent unauthorized access.</p>
          </div>
          <div className="privacy-card glass-panel-premium interact-card gold-border">
            <Lock size={40} className="feature-icon" />
            <h4>End-to-End Encryption</h4>
            <p>State-of-the-art encryption secures all sensitive communications and records.</p>
          </div>
        </div>
      </motion.section>

      <footer className="landing-footer" style={{ marginTop: '4rem', paddingBottom: '2rem' }}>
        <div className="glass-panel-premium text-center" style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
          <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>
            Platform Architect: Vashavali Development Team
            <br/>
            {/* eslint-disable-next-line no-undef */}
            v{__APP_VERSION__} &bull; Last Updated: {__BUILD_DATE__}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
