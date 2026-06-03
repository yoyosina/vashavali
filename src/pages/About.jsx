import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Code, Database, Layout, Heart } from 'lucide-react';
import './LandingPage.css'; // Reuse landing page aesthetics

const About = () => {
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
          About <span className="text-gradient">Vanshavali</span>
        </h1>
        <p className="hero-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
          A modern, ultra-secure family tree application designed to preserve heritage through interactive mapping, deep collaboration, and absolute privacy.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', zIndex: 10, padding: '0 1rem' }}
      >
        {/* Developer Profile Section */}
        <motion.div variants={itemVariants} className="glass-panel-premium interact-card" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--color-accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', overflow: 'hidden' }}>
            <img src="https://avatars.githubusercontent.com/yoyosina" alt="Narendra Sinha" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>Narendra Sinha</h2>
          <p className="text-muted" style={{ marginBottom: '2rem', maxWidth: '500px' }}>
            Full Stack Developer | Architect of Vanshavali
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="https://github.com/yoyosina" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Github size={20} /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/narendrasinha/" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Linkedin size={20} /> LinkedIn
            </a>
          </div>
        </motion.div>

        {/* Tech Stack Section */}
        <motion.div variants={itemVariants} className="glass-panel-premium" style={{ padding: '3rem' }}>
          <h3 style={{ marginBottom: '2rem', textAlign: 'center' }} className="overline">The Technology Stack</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                <Layout size={24} color="#61DAFB" />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Frontend Architecture</h4>
                <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>Built with React 18 & Vite for lightning-fast HMR. Framer Motion powers the fluid micro-interactions, and React Flow drives the interactive node canvas.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                <Database size={24} color="#4ade80" />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Backend & Auth</h4>
                <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>Powered by Supabase (PostgreSQL). Features Row Level Security (RLS) policies for strict privacy, Edge Functions for approvals, and highly secure media buckets.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                <Code size={24} color="#facc15" />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Design System</h4>
                <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>Custom CSS implementation utilizing modern CSS Variables, ultra-light frosted glassmorphism techniques, and responsive flex/grid layouts.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
