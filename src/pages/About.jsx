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

        {/* History & Founding Principles */}
        <motion.div variants={itemVariants} className="glass-panel-premium" style={{ padding: '3rem' }}>
          <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }} className="overline">History & Founding Principles</h3>
          <p className="text-muted" style={{ lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
            The seed for Vashavali was planted through a simple observation of how different cultures preserve their legacies. In many Western cultures, meticulously documenting family lineages is a well-established tradition. A striking example of this was a story of a family from Australia who journeyed across the globe to visit the historic bungalow of their great-grandfather, a former worker in the British East India Company. This profoundly emotional connection across time and space was only possible because they had their family history thoroughly documented and preserved.
          </p>
          <p className="text-muted" style={{ lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
            In contrast, many other cultures, including those in India, have historically lacked centralized, accessible systems for this kind of rigorous documentation. While deep-rooted traditions exist—such as the ancient, manual logbooks maintained by priests in the sacred city of Varanasi, where generational records are physically inscribed upon a family's visit—these methods, though culturally rich, are highly localized, disorganized, and vulnerable to the passage of time. They are beautiful traditions, but they are not globally accessible or digitally secure. Vashavali was conceived to solve this exact problem: bridging the gap between ancient heritage and modern, immortal digital preservation.
          </p>
          <p className="text-muted" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
            The realization was clear: if we could digitize this process, heritage could be secured instantly, allowing generations upon generations to access their roots from anywhere in the world. However, digitizing family history introduces a critical challenge. Family data is incredibly personal, intimate, and sensitive. Why would anyone willingly place their most private moments on the internet in an era plagued by data exploitation? To resolve this, Vashavali was built from the ground up as a digital fortress. It is a platform entirely free from data mining, built with an ironclad promise to never sell, analyze, or exploit user data. We trade the vulnerability of public internet platforms for the absolute security of isolated, encrypted environments.
          </p>
        </motion.div>

        {/* Vision & Mission */}
        <motion.div variants={itemVariants} className="glass-panel-premium" style={{ padding: '3rem' }}>
          <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }} className="overline">Vision & Mission</h3>
          <p className="text-muted" style={{ lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
            Our mission is to empower families globally to map their roots securely without compromising their privacy. We envision a future where every family, regardless of their cultural background, has a pristine, interactive, and beautifully designed digital canvas to weave their narrative. Vashavali stands as a stark alternative to modern social networks; it is not a place for public broadcast, but an invite-only sanctuary for private connection. 
          </p>
          <p className="text-muted" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
            At the heart of our platform is the concept of <strong>Global Portability</strong> and a <strong>Global Identity</strong>. We recognize that individuals often belong to multiple extended family networks. Instead of forcing you to endlessly recreate profiles across different trees, your Global Identity serves as your secure master profile. When you are invited to a new family tree, your identity ports directly into that new space instantly, maintaining a single, sovereign source of truth for who you are within the Vashavali ecosystem.
          </p>
        </motion.div>

        {/* Core Values */}
        <motion.div variants={itemVariants} className="glass-panel-premium" style={{ padding: '3rem' }}>
          <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }} className="overline">Core Values</h3>
          <ul className="text-muted" style={{ lineHeight: '1.8', fontSize: '1.05rem', paddingLeft: '1.5rem', margin: 0 }}>
            <li style={{ marginBottom: '1rem' }}><strong>Zero Data Mining:</strong> Your legacy is yours. We firmly stand against data harvesting. Your records and memories are never scanned for advertising or sold to third parties.</li>
            <li style={{ marginBottom: '1rem' }}><strong>Absolute Security:</strong> We utilize isolated databases and end-to-end encryption to ensure your family's data cannot be accessed by unauthorized entities or public search engines.</li>
            <li style={{ marginBottom: '1rem' }}><strong>Sovereign Identity:</strong> You own your data. You dictate exactly what information is shared, ensuring your identity is preserved beautifully and accurately.</li>
            <li><strong>Generational Preservation:</strong> We build for the future. Our architecture is designed to withstand the test of time, ensuring that the roots mapped today will be accessible to your descendants centuries from now.</li>
          </ul>
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
