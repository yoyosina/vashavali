import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, EyeOff, Database, Server, Key } from 'lucide-react';
import './LandingPage.css';

const Security = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="landing-container" style={{ paddingBottom: '4rem' }}>
      {/* Background Elements */}
      <div className="bg-orb orb-1" style={{ top: '-10%', left: '-10%' }} />
      <div className="bg-orb orb-2" style={{ top: '40%', right: '-10%' }} />

      <motion.div 
        className="about-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '3rem', position: 'relative', zIndex: 10 }}
      >
        <h1 className="awwwards-title" style={{ fontSize: '3.5rem' }}>
          Uncompromising <span className="text-gradient">Security</span>
        </h1>
        <p className="hero-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
          At Vashavali, your legacy is protected with enterprise-grade encryption and an absolute zero data-mining guarantee.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative', zIndex: 10, padding: '0 1rem' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <motion.div variants={itemVariants} className="glass-panel-premium interact-card" style={{ padding: '2.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'inline-block', marginBottom: '1.5rem' }}>
              <Lock size={32} color="var(--color-accent-gold)" />
            </div>
            <h3 style={{ marginBottom: '1rem' }}>End-to-End Encryption</h3>
            <p className="text-muted" style={{ lineHeight: '1.7' }}>
              All data transmitted between your device and our servers is secured using industry-standard TLS 1.3 encryption. Your family's sensitive records, memories, and personal details remain completely unreadable to unauthorized parties during transit.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel-premium interact-card" style={{ padding: '2.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'inline-block', marginBottom: '1.5rem' }}>
              <EyeOff size={32} color="#4ade80" />
            </div>
            <h3 style={{ marginBottom: '1rem' }}>Zero Data Mining</h3>
            <p className="text-muted" style={{ lineHeight: '1.7' }}>
              We unequivocally pledge never to mine, analyze, or sell your family's data. Unlike other platforms, we do not monetize your heritage. You are not the product; your privacy is our primary feature.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel-premium interact-card" style={{ padding: '2.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'inline-block', marginBottom: '1.5rem' }}>
              <Database size={32} color="#61DAFB" />
            </div>
            <h3 style={{ marginBottom: '1rem' }}>Isolated Row-Level Security</h3>
            <p className="text-muted" style={{ lineHeight: '1.7' }}>
              Our PostgreSQL database implements strict Row Level Security (RLS). This means your data is cryptographically isolated at the database engine level, ensuring that only authenticated users from your specific family tree can access your records.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel-premium interact-card" style={{ padding: '2.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'inline-block', marginBottom: '1.5rem' }}>
              <Shield size={32} color="#facc15" />
            </div>
            <h3 style={{ marginBottom: '1rem' }}>Strict Invite-Only Access</h3>
            <p className="text-muted" style={{ lineHeight: '1.7' }}>
              Vashavali operates strictly on an invite-only model. There are no public directories, and no one can stumble upon your family tree. Access requires a direct invitation and a secure family code.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel-premium interact-card" style={{ padding: '2.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'inline-block', marginBottom: '1.5rem' }}>
              <Key size={32} color="#a855f7" />
            </div>
            <h3 style={{ marginBottom: '1rem' }}>Super-User Approvals</h3>
            <p className="text-muted" style={{ lineHeight: '1.7' }}>
              Joining a tree and proposing edits are gated by a comprehensive approval system. Designated super-users have complete control over who joins the family and what changes are finalized, preventing unauthorized modifications.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel-premium interact-card" style={{ padding: '2.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'inline-block', marginBottom: '1.5rem' }}>
              <Server size={32} color="#f43f5e" />
            </div>
            <h3 style={{ marginBottom: '1rem' }}>Secure Infrastructure</h3>
            <p className="text-muted" style={{ lineHeight: '1.7' }}>
              Our infrastructure runs on highly secure, compliant server environments powered by Supabase. We utilize edge functions for secure computing and tightly-controlled media buckets for all your stored photos and documents.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Security;
