import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './Lightbox.css';

const Lightbox = ({ images, currentIndex, onClose, onNavigate }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(-1);
      if (e.key === 'ArrowRight') onNavigate(1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNavigate]);

  if (!images || images.length === 0) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>
        <X size={32} />
      </button>

      {images.length > 1 && (
        <button 
          className="lightbox-nav prev" 
          onClick={(e) => { e.stopPropagation(); onNavigate(-1); }}
        >
          <ChevronLeft size={48} />
        </button>
      )}

      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img src={images[currentIndex]} alt={`Gallery item ${currentIndex + 1}`} />
      </div>

      {images.length > 1 && (
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
