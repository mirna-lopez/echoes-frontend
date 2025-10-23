// Welcome screen - first thing users see
// Has title and enter button with pulsing animation

import React, { useEffect } from 'react';

const WelcomeScreen = ({ onEnter }) => {
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.background = 'black';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      background: 'linear-gradient(rgba(0,0,0,0.5), rgba(13,2,33,0.7)), url(https://i.imgur.com/OCuqVi0.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      fontFamily: 'Special Elite, cursive',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      overflow: 'hidden'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Creepster&family=Special+Elite&display=swap" rel="stylesheet" />
      
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @media (max-width: 768px) {
          .initial-container {
            padding: 40px 30px !important;
          }
          .initial-title {
            font-size: 42px !important;
            margin-bottom: 16px !important;
          }
          .initial-subtitle {
            font-size: 18px !important;
            margin-bottom: 32px !important;
          }
          .initial-button {
            padding: 20px 48px !important;
            font-size: 20px !important;
          }
        }
      `}</style>

      <div className="initial-container" style={{
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(45,27,61,0.85), rgba(26,11,46,0.85))',
        padding: '80px 60px',
        borderRadius: '16px',
        border: '3px solid #ff6b35',
        boxShadow: '0 0 40px rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        animation: 'pulse 2s ease-in-out infinite'
      }}>
        <h1 className="initial-title" style={{
          color: '#ff6b35',
          fontSize: '72px',
          marginBottom: '24px',
          textShadow: '0 0 40px rgba(255,107,53,1)',
          fontFamily: 'Creepster, cursive',
          letterSpacing: '4px',
          marginTop: 0
        }}>
          ECHOES OF THE ESTATE
        </h1>

        <p className="initial-subtitle" style={{
          color: '#ffd700',
          fontSize: '24px',
          fontFamily: 'Creepster, cursive',
          letterSpacing: '2px',
          marginBottom: '48px'
        }}>
          Eleanor's Mansion Awaits...
        </p>

        <button 
          onClick={onEnter} 
          className="initial-button" 
          style={{
            padding: '28px 72px',
            background: 'linear-gradient(135deg, #ff6b35, #ff8c61)',
            color: '#fff',
            border: '3px solid #ffd700',
            borderRadius: '12px',
            fontSize: '28px',
            fontWeight: 'bold',
            fontFamily: 'Creepster, cursive',
            cursor: 'pointer',
            letterSpacing: '3px',
            boxShadow: '0 10px 30px rgba(255,107,53,0.5)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 15px 40px rgba(255,107,53,0.7)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 10px 30px rgba(255,107,53,0.5)';
          }}
        >
          APPROACH THE MANSION
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
