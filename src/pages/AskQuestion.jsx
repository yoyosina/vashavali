import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { supabase } from '../lib/supabaseClient';

const AskQuestion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    if (!user) {
      setShowDialog(true);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('user_questions')
        .insert([{ auth_id: user.id, question: question.trim() }]);

      if (error) throw error;

      setQuestion('');
      alert('Thank you! Your question has been recorded securely.');
    } catch (err) {
      console.error('Error submitting question:', err);
      alert('There was an error submitting your question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', padding: '4rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass-panel-premium interact-card" style={{ maxWidth: '600px', width: '100%', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <MessageSquare size={48} color="var(--color-accent-gold)" style={{ marginBottom: '1rem' }} />
          <h2>Ask a Question</h2>
          <p className="text-muted">
            Have a specific question about Vashavali? Send it to our support team.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="input-group" style={{ flexDirection: 'column', alignItems: 'flex-start', background: 'transparent', padding: 0 }}>
            <label htmlFor="question" style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Your Question</label>
            <textarea
              id="question"
              rows={5}
              placeholder="e.g., How does the global portability feature work across multiple trees?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', opacity: isSubmitting ? 0.7 : 1 }}>
            {isSubmitting ? 'Submitting...' : 'Submit Question'}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {showDialog && (
          <>
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDialog(false)}
              style={{ zIndex: 1000 }}
            />
            <motion.div 
              className="modal-container glass-panel-premium"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ 
                position: 'fixed', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                zIndex: 1001, 
                maxWidth: '450px', 
                width: '90%',
                padding: '2rem',
                textAlign: 'center'
              }}
            >
              <AlertCircle size={48} color="var(--color-accent-gold)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ marginBottom: '1rem' }}>Sign Up Required</h3>
              <p className="text-muted" style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
                You need to sign up to ask a question. Please create your Global Profile to continue.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={() => setShowDialog(false)} className="btn-secondary" style={{ flex: 1 }}>
                  Go Back
                </button>
                <button 
                  onClick={() => {
                    setShowDialog(false);
                    navigate('/global-profile');
                  }} 
                  className="btn-primary" 
                  style={{ flex: 1 }}
                >
                  Sign Up
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AskQuestion;
