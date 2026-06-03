import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="glass-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img src="/logo.png" alt="Vanshavali" style={{ height: '30px', opacity: 0.8 }} />
          <p className="copyright text-muted">
            &copy; {new Date().getFullYear()} Vanshavali. Crafted by Narendra Sinha.
          </p>
        </div>
        
        <div className="footer-links">
          <Link to="/about" className="footer-link">About</Link>
          <a href="https://github.com/yoyosina" target="_blank" rel="noopener noreferrer" className="footer-icon-link">
            <Github size={18} />
          </a>
          <a href="https://www.linkedin.com/in/narendrasinha/" target="_blank" rel="noopener noreferrer" className="footer-icon-link">
            <Linkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
