import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const GameStateContext = createContext();

const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within GameStateProvider');
  }
  return context;
};

const ROOMS = {
  entrance: {
    id: 'entrance',
    name: 'Grand Entrance Hall',
    description: 'Thunder rumbles outside as rain lashes against cracked stained glass windows. A grand staircase spirals into darkness above.',
    connections: ['library', 'dining', 'garden'],
    music: '/music/thunder-dreams.mp3',
    background: 'https://i.imgur.com/U0t9EZn.png'
  },
  library: {
    id: 'library',
    name: 'Forbidden Library',
    description: 'Ancient tomes line towering shelves, their leather bindings cracked with age. The air smells of decay and old secrets.',
    connections: ['entrance', 'study'],
    music: '/music/the-chamber.mp3',
    background: 'https://i.imgur.com/JWWK66y.png'
  },
  dining: {
    id: 'dining',
    name: 'Cursed Dining Room',
    description: 'A long table set for twelve ghostly guests. Cobwebs drape the corners like funeral shrouds.',
    connections: ['entrance', 'kitchen'],
    music: '/music/ghostpocalypse.mp3',
    background: 'https://i.imgur.com/HcVTV7i.png'
  },
  garden: {
    id: 'garden',
    name: 'Dead Garden',
    description: 'Withered roses choke the overgrown paths. The moon casts twisted shadows through gnarled trees.',
    connections: ['entrance'],
    music: '/music/dreamy-flashback.mp3',
    background: 'https://i.imgur.com/R77iGFG.png'
  },
  study: {
    id: 'study',
    name: 'Eleanor\'s Study',
    description: 'Personal journals lie scattered. A portrait watches with eyes that seem to follow you.',
    connections: ['library'],
    music: '/music/atlantean-twilight.mp3',
    background: 'https://i.imgur.com/ljUWOqY.png'
  },
  kitchen: {
    id: 'kitchen',
    name: 'Abandoned Kitchen',
    description: 'Rusted pots hang above a cold stove. Something dark stains the floor near the pantry.',
    connections: ['dining'],
    music: '/music/decay.mp3',
    background: 'https://i.imgur.com/ow5F0My.png'
  }
};

const API_CONFIG = {
  DEMO_SERVER: 'https://echoes-estate-backend.onrender.com'
};

const GameStateProvider = ({ children }) => {
  const [currentRoom, setCurrentRoom] = useState('entrance');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [ghostTrust, setGhostTrust] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [demoPassword, setDemoPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [demoServerStatus, setDemoServerStatus] = useState({ online: false, checked: false });
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [musicStarted, setMusicStarted] = useState(false);

  const audioRef = useRef(null);
  const welcomeMusicRef = useRef(null);

  useEffect(() => {
    checkDemoServer();
  }, []);

  useEffect(() => {
    // Initialize welcome music
    if (!isAuthenticated && musicStarted) {
      welcomeMusicRef.current = new Audio('/music/cryptic-sorrow.mp3');
      welcomeMusicRef.current.loop = true;
      welcomeMusicRef.current.volume = musicVolume;
      
      const playWelcomeMusic = async () => {
        try {
          await welcomeMusicRef.current.play();
        } catch (error) {
          console.log('Audio autoplay blocked');
        }
      };
      
      playWelcomeMusic();

      return () => {
        if (welcomeMusicRef.current) {
          welcomeMusicRef.current.pause();
          welcomeMusicRef.current = null;
        }
      };
    }
  }, [isAuthenticated, musicVolume, musicStarted]);

  useEffect(() => {
    const playRoomMusic = async () => {
      const musicUrl = ROOMS[currentRoom].music;
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0;
      
      try {
        await audioRef.current.play();
        
        // Fade in
        const fadeIn = setInterval(() => {
          if (audioRef.current && audioRef.current.volume < musicVolume - 0.05) {
            audioRef.current.volume += 0.05;
          } else {
            if (audioRef.current) {
              audioRef.current.volume = isMusicMuted ? 0 : musicVolume;
            }
            clearInterval(fadeIn);
          }
        }, 50);
      } catch (error) {
        console.log('Error playing room music:', error);
      }
    };

    if (isAuthenticated && ROOMS[currentRoom]) {
      // Stop welcome music if still playing
      if (welcomeMusicRef.current) {
        welcomeMusicRef.current.pause();
        welcomeMusicRef.current = null;
      }

      // Fade out current music
      if (audioRef.current) {
        const fadeOut = setInterval(() => {
          if (audioRef.current && audioRef.current.volume > 0.05) {
            audioRef.current.volume -= 0.05;
          } else {
            clearInterval(fadeOut);
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current = null;
            }
            playRoomMusic();
          }
        }, 50);
      } else {
        playRoomMusic();
      }
    }
  }, [currentRoom, isAuthenticated, musicVolume, isMusicMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMusicMuted ? 0 : musicVolume;
    }
    if (welcomeMusicRef.current) {
      welcomeMusicRef.current.volume = isMusicMuted ? 0 : musicVolume;
    }
  }, [isMusicMuted, musicVolume]);



  const checkDemoServer = async () => {
    try {
      const response = await fetch(`${API_CONFIG.DEMO_SERVER}/health`);
      if (response.ok) {
        const data = await response.json();
        setDemoServerStatus({ online: true, checked: true, ...data });
      } else {
        setDemoServerStatus({ online: false, checked: true });
      }
    } catch (error) {
      setDemoServerStatus({ online: false, checked: true });
    }
  };

  const verifyPassword = async (password) => {
    try {
      const response = await fetch(`${API_CONFIG.DEMO_SERVER}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (response.ok) {
        const data = await response.json();
        setDemoPassword(password);
        setIsAuthenticated(true);
        return { success: true, data };
      }
      return { success: false, error: 'Invalid password' };
    } catch (error) {
      return { success: false, error: 'Unable to connect' };
    }
  };

  const addMessage = (role, content) => {
    setConversationHistory(prev => [...prev, { role, content }]);
  };

  const moveToRoom = (roomId) => {
    if (ROOMS[roomId]) {
      setCurrentRoom(roomId);
      addMessage('system', `You moved to the ${ROOMS[roomId].name}.`);
    }
  };

  const adjustTrust = (amount) => {
    setGhostTrust(prev => Math.max(0, Math.min(100, prev + amount)));
  };

  const startMusic = () => {
    setMusicStarted(true);
  };

  const toggleMute = () => {
    setIsMusicMuted(prev => !prev);
  };

  const changeVolume = (newVolume) => {
    setMusicVolume(newVolume);
  };

  return (
    <GameStateContext.Provider value={{
      currentRoom, conversationHistory, ghostTrust, isLoading, demoPassword,
      isAuthenticated, demoServerStatus, isMusicMuted, musicVolume, musicStarted,
      setIsLoading, addMessage, moveToRoom, adjustTrust, verifyPassword, 
      toggleMute, changeVolume, startMusic, ROOMS
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <span>{displayedText}</span>;
};

const PasswordModal = ({ onSuccess, show }) => {
  const { verifyPassword } = useGameState();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async () => {
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }
    setIsVerifying(true);
    setError('');
    
    const result = await verifyPassword(password.trim());
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error);
      setPassword('');
    }
    setIsVerifying(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'linear-gradient(rgba(0,0,0,0.5), rgba(13,2,33,0.7)), url(https://i.imgur.com/OCuqVi0.png)',
      backgroundSize: 'cover', backgroundPosition: 'center',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
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
        padding: '48px', borderRadius: '16px', maxWidth: '500px', width: '90%',
        border: '3px solid #ff6b35', textAlign: 'center',
        boxShadow: '0 20px 80px rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)'
      }}>
        <h2 className="password-title" style={{ 
          color: '#ff6b35', marginTop: 0, fontSize: '48px',
          fontFamily: 'Creepster, cursive',
          textShadow: '0 0 30px rgba(255,107,53,0.8)',
          letterSpacing: '4px', marginBottom: '12px'
        }}>ECHOES OF THE ESTATE</h2>
        <p className="password-subtitle" style={{ color: '#9d7cc1', fontSize: '13px', fontFamily: 'monospace',
          letterSpacing: '2px', marginBottom: '24px', textTransform: 'uppercase'
        }}>The Haunted Mansion Awaits</p>
        <p className="password-description" style={{ color: '#e0d4f7', marginBottom: '32px', lineHeight: '1.7',
          fontFamily: 'Special Elite, cursive', fontSize: '15px'
        }}>Eleanor's melancholic presence lingers in every shadow. Enter the password to unlock the mysteries.</p>
        <input type="password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Enter password..." disabled={isVerifying}
          className="password-input"
          style={{
            width: '100%', padding: '18px',
            background: 'linear-gradient(135deg, rgba(13,2,33,0.9), rgba(26,11,46,0.9))',
            border: error ? '2px solid #ff6b6b' : '2px solid #8b008b',
            borderRadius: '10px', color: '#e0d4f7', fontSize: '18px',
            marginBottom: '16px', boxSizing: 'border-box',
            fontFamily: 'Special Elite, cursive'
          }} />
        {error && (
          <div style={{
            color: '#ff6b6b', fontSize: '14px', marginBottom: '16px',
            padding: '12px', background: 'rgba(255,107,107,0.15)',
            borderRadius: '8px', border: '1px solid #ff6b6b'
          }}>{error}</div>
        )}
        <button onClick={handleSubmit} disabled={isVerifying}
          className="password-button"
          style={{
            width: '100%', padding: '18px',
            background: isVerifying ? 'linear-gradient(135deg, #555, #333)' : 'linear-gradient(135deg, #ff6b35, #ff8c61)',
            color: '#fff', border: 'none', borderRadius: '10px',
            cursor: isVerifying ? 'not-allowed' : 'pointer',
            fontSize: '20px', fontWeight: 'bold',
            fontFamily: 'Creepster, cursive', letterSpacing: '3px'
          }}>{isVerifying ? 'SUMMONING...' : 'UNLOCK THE GATES'}</button>
        <p style={{ color: '#9d7cc1', fontSize: '13px', marginTop: '24px',
          marginBottom: 0, fontFamily: 'monospace', opacity: 0.8
        }}>Hint: echoes + the current year</p>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <GameStateProvider>
      <AppContent />
    </GameStateProvider>
  );
};

const AppContent = () => {
  const { addMessage, isAuthenticated, demoServerStatus, conversationHistory,
    isLoading, setIsLoading, demoPassword, currentRoom, ROOMS, ghostTrust,
    adjustTrust, moveToRoom, isMusicMuted, toggleMute, startMusic } = useGameState();
  const [hasStarted, setHasStarted] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [input, setInput] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    if (isAuthenticated && ROOMS[currentRoom]) {
      setBackgroundImage(ROOMS[currentRoom].background);
    }
  }, [currentRoom, isAuthenticated]);

  const handleInitialClick = () => {
    startMusic();
    setShowPasswordModal(true);
  };

  const startGame = () => {
    setHasStarted(true);
    setBackgroundImage(ROOMS[currentRoom].background);
    addMessage('system', 'Welcome to Echoes of the Estate. You sense a presence...');
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      const systemPrompt = `You are Eleanor Ashford's ghost, died 1892. Melancholic, elegant, archaic speech. Room: ${ROOMS[currentRoom].name}. Trust: ${ghostTrust}/100. Be atmospheric, 2-4 sentences.`;
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.filter(m => m.role !== 'system').slice(-10),
        { role: 'user', content: userMessage }
      ];

      const response = await fetch(`${API_CONFIG.DEMO_SERVER}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Demo-Password': demoPassword },
        body: JSON.stringify({ messages })
      });

      if (response.ok) {
        const data = await response.json();
        addMessage('assistant', data.message);
        if (userMessage.toLowerCase().match(/sorry|help|comfort/)) adjustTrust(5);
      } else {
        addMessage('system', 'Error connecting to ghost...');
      }
    } catch (error) {
      addMessage('system', `Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showPasswordModal && !isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(rgba(0,0,0,0.5), rgba(13,2,33,0.7)), url(https://i.imgur.com/OCuqVi0.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: '20px',
        fontFamily: 'Special Elite, cursive',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
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
          boxShadow: '0 20px 80px rgba(0,0,0,0.9)',
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
          }}>ECHOES OF THE ESTATE</h1>
          <p className="initial-subtitle" style={{
            color: '#ffd700',
            fontSize: '24px',
            fontFamily: 'Creepster, cursive',
            letterSpacing: '2px',
            marginBottom: '48px'
          }}>Eleanor's Mansion Awaits...</p>
          <button onClick={handleInitialClick} className="initial-button" style={{
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
          }}>
            APPROACH THE MANSION
          </button>
        </div>
      </div>
    );
  }

  if (showPasswordModal && !isAuthenticated) {
    return <PasswordModal onSuccess={startGame} show={showPasswordModal} />;
  }

  if (!hasStarted) {
    return (
      <div style={{
        minHeight: '100vh', 
        background: 'linear-gradient(rgba(0,0,0,0.5), rgba(13,2,33,0.7)), url(https://i.imgur.com/OCuqVi0.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: '20px', fontFamily: 'Special Elite, cursive',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Creepster&family=Special+Elite&display=swap" rel="stylesheet" />
        <div style={{ 
          maxWidth: '700px', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(45,27,61,0.85), rgba(26,11,46,0.85))',
          padding: '60px 40px',
          borderRadius: '16px',
          border: '3px solid #ff6b35',
          boxShadow: '0 20px 80px rgba(0,0,0,0.9)',
          backdropFilter: 'blur(10px)'
        }}>
          <h1 style={{
            color: '#ff6b35', fontSize: '64px', marginBottom: '16px',
            textShadow: '0 0 40px rgba(255,107,53,1)',
            fontFamily: 'Creepster, cursive', letterSpacing: '4px', marginTop: 0
          }}>ECHOES OF THE ESTATE</h1>
          <p style={{ color: '#ffd700', fontSize: '22px',
            fontFamily: 'Creepster, cursive', letterSpacing: '2px'
          }}>An AI-Powered Ghost Story</p>
          <p style={{ color: '#e0d4f7', fontSize: '17px', marginBottom: '40px' }}>
            Explore a haunted mansion and communicate with Eleanor Ashford's melancholic spirit.
          </p>
          {demoServerStatus.checked && (
            <div style={{
              padding: '20px', marginBottom: '32px', borderRadius: '12px',
              background: demoServerStatus.online ? 'rgba(76,175,80,0.15)' : 'rgba(255,107,107,0.15)',
              border: `2px solid ${demoServerStatus.online ? '#4caf50' : '#ff6b6b'}`,
              color: demoServerStatus.online ? '#4caf50' : '#ff6b6b'
            }}>{demoServerStatus.online ? 'SPIRITS ACTIVE' : 'SERVER OFFLINE'}</div>
          )}
          <button onClick={startGame} style={{
            padding: '22px 56px', background: 'linear-gradient(135deg, #ff6b35, #ff8c61)',
            color: '#fff', border: 'none', borderRadius: '12px',
            fontSize: '24px', fontWeight: 'bold',
            fontFamily: 'Creepster, cursive', cursor: 'pointer'
          }}>ENTER THE MANSION</button>
          <div style={{ marginTop: '48px', padding: '16px',
            background: 'rgba(139,0,139,0.15)', borderRadius: '8px'
          }}>
            <p style={{ color: '#9d7cc1', fontSize: '13px', margin: 0 }}>
              BUILD Halloween Hacks 2024
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', 
      background: 'linear-gradient(rgba(0,0,0,0.5), rgba(13,2,33,0.7)), url(https://i.imgur.com/U0t9EZn.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '20px', fontFamily: 'Special Elite, cursive'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Creepster&family=Special+Elite&display=swap" rel="stylesheet" />
      <style>{`
        @media (max-width: 768px) {
          .game-container {
            padding: 10px !important;
          }
          .game-header {
            padding: 16px !important;
            margin-bottom: 16px !important;
          }
          .game-header h1 {
            font-size: 28px !important;
            padding-right: 0 !important;
          }
          .mute-button {
            padding: 8px 12px !important;
            font-size: 12px !important;
            position: relative !important;
            top: auto !important;
            right: auto !important;
            margin-top: 12px !important;
            justify-content: center !important;
          }
          .room-panel {
            padding: 16px !important;
            margin-bottom: 16px !important;
          }
          .room-panel h2 {
            font-size: 20px !important;
          }
          .room-panel p {
            font-size: 14px !important;
          }
          .room-button {
            padding: 10px 16px !important;
            font-size: 12px !important;
          }
          .trust-panel {
            padding: 16px !important;
            margin-bottom: 16px !important;
          }
          .chat-box {
            height: 300px !important;
            padding: 16px !important;
            margin-bottom: 16px !important;
          }
          .chat-message {
            padding: 12px !important;
            margin-bottom: 12px !important;
          }
          .input-container input {
            padding: 12px !important;
            font-size: 14px !important;
          }
          .send-button {
            padding: 12px 20px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
      <div className="game-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header className="game-header" style={{
          textAlign: 'center', marginBottom: '32px', padding: '24px',
          background: 'linear-gradient(135deg, rgba(45,27,61,0.95), rgba(26,11,46,0.95))',
          borderRadius: '12px', border: '2px solid #ff6b35',
          backdropFilter: 'blur(10px)', position: 'relative'
        }}>
          <h1 style={{
            color: '#ff6b35', fontSize: '48px', margin: 0,
            fontFamily: 'Creepster, cursive', letterSpacing: '3px'
          }}>ECHOES OF THE ESTATE</h1>
          
          <div className="mute-button" style={{
            position: 'absolute', top: '24px', right: '24px',
            display: 'flex', gap: '12px', alignItems: 'center'
          }}>
            <button onClick={toggleMute} style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, rgba(139,0,139,0.8), rgba(75,0,130,0.8))',
              color: '#ffd700', border: '2px solid #8b008b',
              borderRadius: '8px', cursor: 'pointer',
              fontSize: '14px', fontWeight: 'bold'
            }}>
              {isMusicMuted ? '🔇 UNMUTE' : '🔊 MUTE'}
            </button>
          </div>
        </header>

        <div className="room-panel" style={{
          padding: '24px', 
          background: 'linear-gradient(135deg, rgba(26,11,46,0.95), rgba(45,27,61,0.95))',
          borderRadius: '12px', marginBottom: '24px', border: '2px solid #ff6b35',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ color: '#ff6b35', marginTop: 0, fontFamily: 'Creepster, cursive' }}>
            {ROOMS[currentRoom].name}
          </h2>
          <p style={{ color: '#e0d4f7' }}>{ROOMS[currentRoom].description}</p>
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,107,53,0.3)' }}>
            <p style={{ color: '#9d7cc1', fontSize: '14px' }}>Available paths:</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {ROOMS[currentRoom].connections.map(roomId => (
                <button key={roomId} onClick={() => moveToRoom(roomId)} className="room-button" style={{
                  padding: '12px 20px', 
                  background: 'linear-gradient(135deg, rgba(45,27,61,0.9), rgba(26,11,46,0.9))',
                  color: '#ff6b35', border: '2px solid #ff6b35', borderRadius: '8px',
                  cursor: 'pointer', fontSize: '14px'
                }}>Go to {ROOMS[roomId].name}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="trust-panel" style={{
          padding: '20px', 
          background: 'linear-gradient(135deg, rgba(26,11,46,0.95), rgba(45,27,61,0.95))',
          borderRadius: '12px', marginBottom: '24px', border: '2px solid #8b008b',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ marginBottom: '8px', color: '#9d7cc1', fontSize: '13px' }}>
            GHOST TRUST: {ghostTrust}%
          </div>
          <div style={{
            height: '24px', background: 'rgba(13,2,33,0.8)', borderRadius: '12px', overflow: 'hidden'
          }}>
            <div style={{
              height: '100%', width: `${ghostTrust}%`,
              background: 'linear-gradient(90deg, #ff6b35, #ffd700)',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        <div className="chat-box" style={{
          height: '350px', overflowY: 'auto', padding: '20px',
          background: 'linear-gradient(180deg, rgba(13,2,33,0.95), rgba(26,11,46,0.95))',
          borderRadius: '12px', marginBottom: '24px', border: '2px solid #8b008b',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            background: 'rgba(139,0,139,0.3)', border: '1px solid #ff6b35',
            borderRadius: '8px', padding: '12px', marginBottom: '20px',
            fontSize: '13px', color: '#ffd700', textAlign: 'center'
          }}>AI Powered by Claude | Music by Kevin MacLeod</div>
          {conversationHistory.map((msg, idx) => (
            <div key={idx} className="chat-message" style={{
              marginBottom: '16px', padding: '14px',
              background: msg.role === 'user' ? 'rgba(45,27,61,0.8)' : msg.role === 'assistant' ? 'rgba(26,11,46,0.8)' : 'rgba(139,0,139,0.6)',
              borderRadius: '10px',
              borderLeft: `4px solid ${msg.role === 'user' ? '#ff6b35' : msg.role === 'assistant' ? '#8b008b' : '#ffd700'}`
            }}>
              <div style={{ fontSize: '11px', color: '#9d7cc1', marginBottom: '6px' }}>
                {msg.role === 'user' ? 'You' : msg.role === 'assistant' ? 'Eleanor' : 'System'}
              </div>
              <div style={{ color: '#e0d4f7' }}>
                {idx === conversationHistory.length - 1 && msg.role === 'assistant' ? (
                  <TypewriterText text={msg.content} />
                ) : msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="input-container" style={{ display: 'flex', gap: '12px' }}>
          <input type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Speak to the ghost..." disabled={isLoading}
            style={{
              flex: 1, padding: '16px',
              background: 'linear-gradient(135deg, rgba(26,11,46,0.95), rgba(13,2,33,0.95))',
              border: '2px solid #8b008b', borderRadius: '10px',
              color: '#e0d4f7', fontSize: '15px',
              backdropFilter: 'blur(10px)'
            }} />
          <button onClick={sendMessage} disabled={isLoading} className="send-button" style={{
            padding: '16px 32px',
            background: isLoading ? '#555' : 'linear-gradient(135deg, #ff6b35, #ff8c61)',
            color: '#fff', border: 'none', borderRadius: '10px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '15px', fontWeight: 'bold'
          }}>{isLoading ? 'Summoning...' : 'Send'}</button>
        </div>
      </div>
    </div>
  );
};

export default App;
