/* Password check modal
Shows before game access, validates with backend
Includes hint and error messages
*/

import React, { useState } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { useLanguage } from '../contexts/LanguageContext';

const PasswordModal = ({ onSuccess, show }) => {
  const { verifyPassword } = useGameState();
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  /**
   * Handle password submission
   */
  const handleSubmit = async () => {
    if (!password.trim()) {
      setError(t('password.errorEmpty'));
      return;
    }
    
    setIsVerifying(true);
    setError('');
    
    const result = await verifyPassword(password.trim());
    if (result.success) {
      onSuccess(); // Proceed to game
    } else {
      setError(result.error === 'Unable to connect' ? t('password.errorConnect') : t('password.errorMessage'));
      setPassword(''); // Clear for retry
    }
    
    setIsVerifying(false);
  };

  // Don't render if not shown
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0,
      background: 'linear-gradient(rgba(0,0,0,0.5), rgba(13,2,33,0.7)), url(https://i.imgur.com/OCuqVi0.png)',
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 1000,
      overflow: 'auto'
    }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Creepster&family=Special+Elite&display=swap" rel="stylesheet" />
      
      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .password-container {
            padding: 32px 24px !important;
            max-width: 90% !important;
          }
          .password-title {
            font-size: 32px !important;
          }
          .password-subtitle {
            font-size: 11px !important;
          }
          .password-description {
            font-size: 14px !important;
          }
          .password-input {
            padding: 14px !important;
            font-size: 16px !important;
          }
          .password-button {
            padding: 14px !important;
            font-size: 16px !important;
          }
        }
      `}</style>

      {/* Password Form Container */}
      <div className="password-container" style={{
        background: 'linear-gradient(135deg, rgba(45,27,61,0.9), rgba(26,11,46,0.9))',
        padding: '48px', 
        borderRadius: '16px', 
        maxWidth: '500px', 
        width: '90%',
        border: '3px solid #ff6b35', 
        textAlign: 'center',
        boxShadow: '0 20px 80px rgba(0,0,0,0.9)', 
        backdropFilter: 'blur(10px)'
      }}>
        {/* Title */}
        <h2 className="password-title" style={{ 
          color: '#ff6b35', 
          marginTop: 0, 
          fontSize: '48px',
          fontFamily: 'Creepster, cursive',
          textShadow: '0 0 30px rgba(255,107,53,0.8)',
          letterSpacing: '4px', 
          marginBottom: '12px'
        }}>
          {t('password.title')}
        </h2>

        {/* Subtitle */}
        <p className="password-subtitle" style={{ 
          color: '#9d7cc1', 
          fontSize: '13px', 
          fontFamily: 'monospace',
          letterSpacing: '2px', 
          marginBottom: '24px', 
          textTransform: 'uppercase'
        }}>
          {t('password.subtitle')}
        </p>

        {/* Description */}
        <p className="password-description" style={{ 
          color: '#e0d4f7', 
          marginBottom: '32px', 
          lineHeight: '1.7',
          fontFamily: 'Special Elite, cursive', 
          fontSize: '15px'
        }}>
          {t('password.description')}
        </p>

        {/* Password Input */}
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={t('password.placeholder')}
          disabled={isVerifying}
          className="password-input"
          style={{
            width: '100%', 
            padding: '18px',
            background: 'linear-gradient(135deg, rgba(13,2,33,0.9), rgba(26,11,46,0.9))',
            border: error ? '2px solid #ff6b6b' : '2px solid #8b008b',
            borderRadius: '10px', 
            color: '#e0d4f7', 
            fontSize: '18px',
            marginBottom: '16px', 
            boxSizing: 'border-box',
            fontFamily: 'Special Elite, cursive'
          }} 
        />

        {/* Error Message */}
        {error && (
          <div style={{
            color: '#ff6b6b', 
            fontSize: '14px', 
            marginBottom: '16px',
            padding: '12px', 
            background: 'rgba(255,107,107,0.15)',
            borderRadius: '8px', 
            border: '1px solid #ff6b6b'
          }}>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button 
          onClick={handleSubmit} 
          disabled={isVerifying}
          className="password-button"
          style={{
            width: '100%', 
            padding: '18px',
            background: isVerifying ? 'linear-gradient(135deg, #555, #333)' : 'linear-gradient(135deg, #ff6b35, #ff8c61)',
            color: '#fff', 
            border: 'none', 
            borderRadius: '10px',
            cursor: isVerifying ? 'not-allowed' : 'pointer',
            fontSize: '20px', 
            fontWeight: 'bold',
            fontFamily: 'Creepster, cursive', 
            letterSpacing: '3px'
          }}
        >
          {isVerifying ? t('password.loadingButton') : t('password.submitButton')}
        </button>

        {/* Hint */}
        <p style={{ 
          color: '#9d7cc1', 
          fontSize: '13px', 
          marginTop: '24px',
          marginBottom: 0, 
          fontFamily: 'monospace', 
          opacity: 0.8
        }}>
          {t('password.hint')}
        </p>
      </div>
    </div>
  );
};

export default PasswordModal;