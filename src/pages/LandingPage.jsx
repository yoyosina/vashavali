import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Users, Shield, Globe, ArrowRight, Key, Fingerprint, Lock, Database, EyeOff, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import './LandingPage.css';



const LandingPage = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  
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
          <img src={theme === 'light' ? '/logo-light.svg' : '/logo-dark.svg'} alt="Vashavali Logo" className="hero-logo" />
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
          <h4>How does Vashavali ensure absolute privacy?</h4>
          <p>Access is strictly invite-only. Super users must approve all view and edit requests before anyone can join your tree.</p>
        </div>
        <div className="feature-card glass-panel-premium">
          <Globe size={40} className="feature-icon" />
          <h4>What is Global Portability?</h4>
          <p>Maintain one beautiful master profile and port it seamlessly into any family tree you are part of without re-entering data.</p>
        </div>
        <div className="feature-card glass-panel-premium">
          <Users size={40} className="feature-icon" />
          <h4>How is the platform collaborative?</h4>
          <p>Family members can propose edits, upload shared memories, and grow your family's interconnected tree together organically.</p>
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
            <h4>Do you practice Zero Data Mining?</h4>
            <p>Yes. Your legacy is yours alone. We strictly do not analyze, sell, or monetize your genealogical data.</p>
          </div>
          <div className="privacy-card glass-panel-premium interact-card gold-border">
            <Database size={40} className="feature-icon" />
            <h4>Are trees in Isolated Environments?</h4>
            <p>Yes. Every family tree exists in an isolated, secure database to prevent cross-contamination or unauthorized access.</p>
          </div>
          <div className="privacy-card glass-panel-premium interact-card gold-border">
            <Lock size={40} className="feature-icon" />
            <h4>Do you use End-to-End Encryption?</h4>
            <p>Absolutely. State-of-the-art encryption secures all sensitive communications, personal records, and media.</p>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        className="testimonials-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        style={{ marginTop: '5rem' }}
      >
        <h2 className="section-title">What Our Families Say</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
          
          <div className="glass-panel-premium interact-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem', color: 'var(--color-accent-gold)' }}>
              <Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" />
            </div>
            <p className="text-muted" style={{ fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              "Vashavali finally gave us a place to securely map our ancestry without worrying about data brokers. The global portability feature is pure genius!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.1)' }}>
                <img src="https://i.pravatar.cc/150?u=sarahjenkins" alt="Sarah Jenkins" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.2rem 0' }}>Sarah Jenkins</h4>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Joined 2024</span>
              </div>
            </div>
          </div>

          <div className="glass-panel-premium interact-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem', color: 'var(--color-accent-gold)' }}>
              <Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" />
            </div>
            <p className="text-muted" style={{ fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              "The approval workflows ensure our tree remains accurate. I love how beautiful and interactive the node canvas is compared to legacy platforms."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.1)' }}>
                <img src="https://i.pravatar.cc/150?u=michaelchen" alt="Michael Chen" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.2rem 0' }}>Michael Chen</h4>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Joined 2025</span>
              </div>
            </div>
          </div>

          <div className="glass-panel-premium interact-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem', color: 'var(--color-accent-gold)' }}>
              <Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" />
            </div>
            <p className="text-muted" style={{ fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              "Setting up my Global Identity once and using it across both my parents' and in-laws' trees saved me so much time. Absolutely stunning UI."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.1)' }}>
                <img src="https://i.pravatar.cc/150?u=priyasharma" alt="Priya Sharma" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.2rem 0' }}>Priya Sharma</h4>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Joined 2025</span>
              </div>
            </div>
          </div>

        </div>
      </motion.section>

      {/* Expandable FAQ Section */}
      <motion.section 
        className="faq-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        style={{ marginTop: '5rem', marginBottom: '4rem' }}
      >
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0 1rem' }}>
          
          <div className="glass-panel-premium interact-card" onClick={() => toggleFaq(0)} style={{ padding: '1.5rem', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0 }}>What is Vashavali?</h4>
              {openFaq === 0 ? <ChevronUp size={20} className="text-muted" /> : <ChevronDown size={20} className="text-muted" />}
            </div>
            {openFaq === 0 && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-muted" style={{ marginTop: '1rem', marginBottom: 0, lineHeight: '1.6' }}>
                Vashavali is an exclusive, ultra-secure digital family tree and heritage platform. It enables families to collaboratively map their ancestry, preserve generational memories, and build an interactive lineage securely. Unlike public directories, Vashavali prioritizes absolute privacy, operating entirely free from data mining or third-party data sales.
              </motion.p>
            )}
          </div>

          <div className="glass-panel-premium interact-card" onClick={() => toggleFaq(1)} style={{ padding: '1.5rem', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0 }}>How does Vashavali ensure my family's privacy?</h4>
              {openFaq === 1 ? <ChevronUp size={20} className="text-muted" /> : <ChevronDown size={20} className="text-muted" />}
            </div>
            {openFaq === 1 && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-muted" style={{ marginTop: '1rem', marginBottom: 0, lineHeight: '1.6' }}>
                Vashavali guarantees privacy by utilizing isolated database environments and state-of-the-art end-to-end encryption. Access to any family tree is strictly invite-only, meaning only authenticated members explicitly approved by a designated family super-user can view, edit, or interact with your sensitive historical records and media.
              </motion.p>
            )}
          </div>

          <div className="glass-panel-premium interact-card" onClick={() => toggleFaq(2)} style={{ padding: '1.5rem', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0 }}>Is Vashavali free to use?</h4>
              {openFaq === 2 ? <ChevronUp size={20} className="text-muted" /> : <ChevronDown size={20} className="text-muted" />}
            </div>
            {openFaq === 2 && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-muted" style={{ marginTop: '1rem', marginBottom: 0, lineHeight: '1.6' }}>
                Vashavali operates on a freemium model. Core functionality, including creating your secure Global Identity and participating in invited family trees, is completely free. We do not subsidize free accounts by selling your data; instead, premium features like advanced AI media restoration and geospatial mapping require a subscription.
              </motion.p>
            )}
          </div>

          <div className="glass-panel-premium interact-card" onClick={() => toggleFaq(3)} style={{ padding: '1.5rem', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0 }}>How do I invite family members to my tree?</h4>
              {openFaq === 3 ? <ChevronUp size={20} className="text-muted" /> : <ChevronDown size={20} className="text-muted" />}
            </div>
            {openFaq === 3 && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-muted" style={{ marginTop: '1rem', marginBottom: 0, lineHeight: '1.6' }}>
                To invite family members, the designated super-user simply generates a secure, unique Family Code from the tree's dashboard. You can securely share this code with relatives. They then enter the code on the landing page, create their Global Identity, and await your final approval to join.
              </motion.p>
            )}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/ask-question" className="btn-secondary" style={{ padding: '0.8rem 2rem' }}>
              Have another question? Ask us
            </Link>
          </div>

        </div>
      </motion.section>

    </div>
  );
};

export default LandingPage;
