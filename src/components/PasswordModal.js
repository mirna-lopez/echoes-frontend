import React, { useState } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { useLanguage } from '../contexts/LanguageContext';

const PasswordModal = ({ show }) => {
  const { enterGame } = useGameState();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError(t('nameEntry.errorEmpty'));
      return;
    }
    enterGame(name.trim());
  };

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
      <link href="https://fonts.googleapis.com/css2?family=Creepster&family=Special+Elite&display=swap" rel="stylesheet" />

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
        <h2 className="password-title" style={{
          color: '#ff6b35',
          marginTop: 0,
          fontSize: '48px',
          fontFamily: 'Creepster, cursive',
          textShadow: '0 0 30px rgba(255,107,53,0.8)',
          letterSpacing: '4px',
          marginBottom: '12px'
        }}>
          {t('nameEntry.title')}
        </h2>

        <p className="password-subtitle" style={{
          color: '#9d7cc1',
          fontSize: '13px',
          fontFamily: 'monospace',
          letterSpacing: '2px',
          marginBottom: '24px',
          textTransform: 'uppercase'
        }}>
          {t('nameEntry.subtitle')}
        </p>

        <p className="password-description" style={{
          color: '#e0d4f7',
          marginBottom: '32px',
          lineHeight: '1.7',
          fontFamily: 'Special Elite, cursive',
          fontSize: '15px'
        }}>
          {t('nameEntry.description')}
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={t('nameEntry.placeholder')}
          maxLength={30}
          autoFocus
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

        <button
          onClick={handleSubmit}
          className="password-button"
          style={{
            width: '100%',
            padding: '18px',
            background: 'linear-gradient(135deg, #ff6b35, #ff8c61)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: 'bold',
            fontFamily: 'Creepster, cursive',
            letterSpacing: '3px'
          }}
        >
          {t('nameEntry.submitButton')}
        </button>
      </div>
    </div>
  );
};

export default PasswordModal;
