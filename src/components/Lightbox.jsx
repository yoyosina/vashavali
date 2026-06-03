import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Wand2, Download, RefreshCw, AlertTriangle } from 'lucide-react';
import { colorizeImage } from '../utils/ai';
import './Lightbox.css';

const Lightbox = ({ images, currentIndex, onClose, onNavigate }) => {
  const [isColorizing, setIsColorizing] = useState(false);
  const [colorizedUrl, setColorizedUrl] = useState(null);
  const [error, setError] = useState(null);

  // Reset state when navigating to a new image
  useEffect(() => {
    setColorizedUrl(null);
    setError(null);
    setIsColorizing(false);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && !isColorizing) onNavigate(-1);
      if (e.key === 'ArrowRight' && !isColorizing) onNavigate(1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNavigate, isColorizing]);

  const handleColorize = async (e) => {
    e.stopPropagation();
    setIsColorizing(true);
    setError(null);
    
    try {
      const resultUrl = await colorizeImage(images[currentIndex]);
      setColorizedUrl(resultUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsColorizing(false);
    }
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = colorizedUrl;
    link.download = `colorized-photo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      {/* Top Action Bar */}
      <div className="lightbox-top-bar" onClick={(e) => e.stopPropagation()}>
        {!isColorizing && !colorizedUrl && (
          <button className="btn-ai-action" onClick={handleColorize} title="AI Colorize">
            <Wand2 size={18} />
            <span>AI Colorize</span>
          </button>
        )}
        
        {colorizedUrl && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-ai-action" onClick={handleDownload} style={{ background: 'var(--color-accent-gold)' }}>
              <Download size={18} />
              <span>Download</span>
            </button>
            <button className="btn-ai-action" onClick={() => setColorizedUrl(null)}>
              <RefreshCw size={18} />
              <span>Reset</span>
            </button>
          </div>
        )}

        <button className="lightbox-close" onClick={onClose}>
          <X size={32} />
        </button>
      </div>

      {images.length > 1 && !isColorizing && !colorizedUrl && (
        <button 
          className="lightbox-nav prev" 
          onClick={(e) => { e.stopPropagation(); onNavigate(-1); }}
        >
          <ChevronLeft size={48} />
        </button>
      )}

      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {isColorizing ? (
          <div className="ai-loading-state glass-panel">
            <RefreshCw size={40} className="spin-anim" style={{ color: 'var(--color-accent-gold)' }} />
            <h3 style={{ marginTop: '1rem' }}>AI is analyzing the photo...</h3>
            <p className="text-muted">This may take up to 30 seconds to cold-start the neural network.</p>
          </div>
        ) : error ? (
          <div className="ai-error-state glass-panel">
            <AlertTriangle size={40} style={{ color: '#ef4444' }} />
            <h3 style={{ marginTop: '1rem' }}>AI Colorization Failed</h3>
            <p className="text-muted" style={{ maxWidth: '400px', textAlign: 'center' }}>{error}</p>
            <button className="btn-secondary" onClick={() => setError(null)} style={{ marginTop: '1rem' }}>Try Again</button>
          </div>
        ) : (
          <div className={`image-comparison ${colorizedUrl ? 'show-colorized' : ''}`}>
            <img 
              src={colorizedUrl || images[currentIndex]} 
              alt={`Gallery item ${currentIndex + 1}`} 
              className={colorizedUrl ? 'colorized-img' : 'original-img'}
            />
            {colorizedUrl && (
              <div className="preview-badge glass-panel">AI Colorized Preview</div>
            )}
          </div>
        )}
      </div>

      {images.length > 1 && !isColorizing && !colorizedUrl && (
        <button 
          className="lightbox-nav next" 
          onClick={(e) => { e.stopPropagation(); onNavigate(1); }}
        >
          <ChevronRight size={48} />
        </button>
      )}
    </div>
  );
};

export default Lightbox;
