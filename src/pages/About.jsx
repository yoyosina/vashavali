import React from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Layout, Heart } from 'lucide-react';
import './LandingPage.css'; // Reuse landing page aesthetics

const GithubIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>;

const LinkedinIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;

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
        {/* Inject Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Narendra Sinha",
              "jobTitle": "Full Stack Developer",
              "worksFor": {
                "@type": "Organization",
                "name": "Vashavali"
              },
              "url": "https://vashavali.vercel.app/about",
              "sameAs": [
                "https://github.com/yoyosina",
                "https://www.linkedin.com/in/narendrasinha/"
              ],
              "image": "https://avatars.githubusercontent.com/yoyosina"
            })
          }}
        />

        {/* Vision & Core Philosophy */}
        <motion.div variants={itemVariants} className="glass-panel-premium" style={{ padding: '3rem' }}>
          <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }} className="overline">Our Core Philosophy</h3>
          <p className="text-muted" style={{ lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
            Vashavali was born from a fundamental belief: your family's history belongs strictly to your family. In an era where digital platforms constantly harvest, analyze, and monetize user data, we stand firmly against this practice. Our absolute commitment to a <strong>"no data mining"</strong> policy ensures that your genealogical records, intimate family stories, and personal memories are never scanned for advertising, sold to third parties, or used for behavioral profiling. When you map your heritage on Vashavali, you do so with the absolute guarantee that your data remains locked within your family’s private ecosystem. We don’t track your behaviors, we don’t share your connections, and we don’t build marketing profiles based on your ancestry. Your legacy is sacred, and we treat it with the uncompromising privacy and respect it deserves.
          </p>
          <p className="text-muted" style={{ lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
            At the heart of our platform is the concept of a <strong>Global Identity</strong>. We recognize that individuals are not monolithic; they often belong to multiple, diverse extended family networks—such as maternal lineages, paternal lineages, and distinct branches created through marriage and partnerships. Instead of forcing you to recreate your profile, repeatedly upload your photos, and tediously rewrite your biography for every new tree you join, your Global Identity serves as your centralized, hyper-secure master profile. It acts as the single source of truth for who you are within the Vashavali ecosystem. You have full sovereignty over this identity. You dictate what information is shared, ensuring that the essence of your identity is preserved beautifully and accurately across every generation and family branch you choose to engage with.
          </p>
          <p className="text-muted" style={{ lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
            This architecture leads seamlessly into our promise of <strong>Global Portability</strong>. When you are securely invited to a new family tree—perhaps by a distant cousin or a new spouse—your Global Identity ports directly into that new space instantly. You immediately appear in the new tree with your curated profile picture, your life timeline, and your biographical details entirely intact. If you ever decide to update your profile picture, document a new life milestone, or refine your biography, that update automatically and intelligently propagates across every family tree you are a part of. This eliminates redundant data entry, resolves conflicting records, and guarantees that your living legacy remains consistent, continuously up-to-date, and fully under your direct control, regardless of how vast your family connections grow.
          </p>
          <p className="text-muted" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
            Ultimately, Vashavali is more than just a software application—it is a digital vault and an elegant canvas for the most important stories in the world: yours. By bridging cutting-edge technology with an unyielding ethical stance on privacy, we empower families across the globe to map their roots securely. Whether you are preserving ancient lineage data or celebrating the birth of a new generation, our platform is engineered to support the complex, beautiful, and deeply interconnected tapestry of human relationships. We invite you to experience a space where the past is honored, the present is celebrated, and the future is securely written.
          </p>
        </motion.div>

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
              <GithubIcon size={20} /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/narendrasinha/" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LinkedinIcon size={20} /> LinkedIn
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
