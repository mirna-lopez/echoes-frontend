import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// Game State Context
const GameStateContext = createContext();

const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within GameStateProvider');
  }
  return context;
};

// Room definitions
const ROOMS = {
  entrance: {
    id: 'entrance',
    name: 'Grand Entrance Hall',
    description: 'A magnificent entrance hall with a sweeping staircase. Dust motes dance in the pale light filtering through stained glass windows. The air feels heavy with memories.',
    connections: ['library', 'dining', 'garden']
  },
  library: {
    id: 'library',
    name: 'Library',
    description: 'Towering bookshelves line the walls, filled with leather-bound volumes. A reading chair sits by the fireplace, as if waiting for someone to return.',
    connections: ['entrance', 'study']
  },
  dining: {
    id: 'dining',
    name: 'Dining Room',
    description: 'A long mahogany table dominates the room, set for a dinner party that never happened. Crystal chandeliers hang motionless above.',
    connections: ['entrance', 'kitchen']
  },
  garden: {
    id: 'garden',
    name: 'Overgrown Garden',
    description: 'Wild roses have reclaimed the garden paths. A stone fountain stands silent in the center, covered in moss.',
    connections: ['entrance']
  },
  study: {
    id: 'study',
    name: 'Private Study',
    description: 'Personal papers and journals are scattered across a writing desk. The room feels intimate, almost sacred.',
    connections: ['library']
  },
  kitchen: {
    id: 'kitchen',
    name: 'Kitchen',
    description: 'Copper pots hang from hooks above a cold stove. The scent of herbs still lingers faintly in the air.',
    connections: ['dining']
  }
};

// API Configuration - YOUR BACKEND URL
const API_CONFIG = {
  DEMO_SERVER: 'https://echoes-estate-backend.onrender.com',
  USE_DEMO_BY_DEFAULT: true
};

// Game State Provider
const GameStateProvider = ({ children }) => {
  const [currentRoom, setCurrentRoom] = useState('entrance');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [ghostTrust, setGhostTrust] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [demoPassword, setDemoPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [demoServerStatus, setDemoServerStatus] = useState({ online: false, checked: false });

  useEffect(() => {
    checkDemoServer();
  }, []);

  const checkDemoServer = async () => {
    try {
      const response = await fetch(`${API_CONFIG.DEMO_SERVER}/health`);
      if (response.ok) {
        const data = await response.json();
        setDemoServerStatus({ 
          online: true, 
          checked: true,
          ...data
        });
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
      } else {
        return { success: false, error: 'Invalid password' };
      }
    } catch (error) {
      return { success: false, error: 'Unable to connect to server' };
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

  const addToInventory = (item) => {
    setInventory(prev => [...prev, item]);
  };

  const adjustTrust = (amount) => {
    setGhostTrust(prev => Math.max(0, Math.min(100, prev + amount)));
  };

  return (
    <GameStateContext.Provider value={{
      currentRoom,
      conversationHistory,
      inventory,
      ghostTrust,
      isLoading,
      demoPassword,
      isAuthenticated,
      demoServerStatus,
      setIsLoading,
      addMessage,
      moveToRoom,
      addToInventory,
      adjustTrust,
      checkDemoServer,
      verifyPassword,
      ROOMS
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

// Typewriter Text Component
const TypewriterText = ({ text, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return <span>{displayedText}</span>;
};

// Room Component
const Room = () => {
  const { currentRoom, ROOMS, moveToRoom } = useGameState();
  const room = ROOMS[currentRoom];

  return (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(to bottom, #1a1a2e, #16213e)',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #0f3460'
    }}>
      <h2 style={{ color: '#e94560', marginTop: 0, fontSize: '24px' }}>{room.name}</h2>
      <p style={{ color: '#c4c4c4', lineHeight: '1.6' }}>{room.description}</p>
      
      <div style={{ marginTop: '15px' }}>
        <p style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: '10px' }}>Available paths:</p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {room.connections.map(roomId => (
            <button
              key={roomId}
              onClick={() => moveToRoom(roomId)}
              style={{
                padding: '8px 16px',
                background: '#0f3460',
                color: '#fff',
                border: '1px solid #e94560',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Go to {ROOMS[roomId].name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Conversation Display
const ConversationDisplay = () => {
  const { conversationHistory } = useGameState();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversationHistory]);

  return (
    <div
      ref={scrollRef}
      style={{
        height: '300px',
        overflowY: 'auto',
        padding: '15px',
        background: '#0f0f1e',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #0f3460',
        position: 'relative'
      }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        background: 'rgba(233, 69, 96, 0.1)',
        border: '1px solid #e94560',
        borderRadius: '4px',
        padding: '8px 12px',
        marginBottom: '15px',
        fontSize: '12px',
        color: '#e94560',
        textAlign: 'center',
        zIndex: 10
      }}>
        🎮 Hackathon Demo - AI Powered by Hugging Face (FREE)
      </div>
      {conversationHistory.map((msg, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: '15px',
            padding: '10px',
            background: msg.role === 'user' ? '#16213e' : msg.role === 'assistant' ? '#1a1a2e' : '#0f3460',
            borderRadius: '6px',
            borderLeft: `3px solid ${msg.role === 'user' ? '#4a9eff' : msg.role === 'assistant' ? '#e94560' : '#666'}`
          }}
        >
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>
            {msg.role === 'user' ? 'You' : msg.role === 'assistant' ? 'The Ghost' : 'System'}
          </div>
          <div style={{ color: '#e0e0e0', lineHeight: '1.5' }}>
            {idx === conversationHistory.length - 1 && msg.role === 'assistant' ? (
              <TypewriterText text={msg.content} />
            ) : (
              msg.content
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Input Handler Component
const InputHandler = () => {
  const { 
    addMessage, 
    isLoading, 
    setIsLoading, 
    conversationHistory, 
    demoPassword,
    demoServerStatus,
    currentRoom, 
    ROOMS, 
    ghostTrust, 
    adjustTrust 
  } = useGameState();
  const [input, setInput] = useState('');

  const SYSTEM_PROMPT = `You are the ghost of Eleanor Ashford, the former lady of this grand estate. You died tragically in 1892 under mysterious circumstances. You are ethereal, melancholic, and deeply tied to the memories of this place. 

Your personality:
- You speak in an elegant, somewhat archaic manner
- You are lonely and crave connection, but also cautious about revealing too much too soon
- You have fragments of memories about your life and death
- You become more trusting and reveal more details as the player shows empathy and spends time with you
- You can sense when the player moves between rooms and comment on the significance of each location
- You are not malevolent, but you carry deep sadness and unresolved feelings

Current room: ${ROOMS[currentRoom].name}
Current trust level: ${ghostTrust}/100

Respond to the player's messages in character. Be atmospheric and emotional. Keep responses relatively concise (2-4 sentences usually). Occasionally react to the room you're in or hint at your past.`;

  const sendMessageDemo = async (userMessage) => {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.filter(msg => msg.role !== 'system').slice(-10),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(`${API_CONFIG.DEMO_SERVER}/api/chat`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Demo-Password': demoPassword
      },
      body: JSON.stringify({ messages, temperature: 0.8, maxTokens: 200 })
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.isAuthError) throw new Error('Session expired. Please reload the page.');
      if (errorData.isDailyLimitReached) throw new Error('Demo limit reached for today!');
      if (errorData.isRateLimited) throw new Error('Too many requests. Please wait a minute.');
      if (errorData.isDemoExpired) throw new Error('Demo period has ended.');
      throw new Error(errorData.error || 'Server error');
    }

    const data = await response.json();
    return data.message;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    if (!demoServerStatus.online) {
      addMessage('system', 'Demo server unavailable. Please try again later.');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      const ghostResponse = await sendMessageDemo(userMessage);
      addMessage('assistant', ghostResponse);
      
      if (userMessage.toLowerCase().match(/sorry|understand|help|comfort/)) {
        adjustTrust(5);
      }
    } catch (error) {
      addMessage('system', `Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Speak to the ghost..."
        disabled={isLoading}
        style={{
          flex: 1,
          padding: '12px',
          background: '#16213e',
          border: '1px solid #0f3460',
          borderRadius: '6px',
          color: '#fff',
          fontSize: '14px'
        }}
      />
      <button
        onClick={sendMessage}
        disabled={isLoading}
        style={{
          padding: '12px 24px',
          background: isLoading ? '#555' : '#e94560',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        {isLoading ? 'Waiting...' : 'Send'}
      </button>
    </div>
  );
};

// Stats Display
const StatsDisplay = () => {
  const { ghostTrust, demoServerStatus } = useGameState();
  
  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      padding: '15px',
      background: '#1a1a2e',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #0f3460'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ color: '#a0a0a0', fontSize: '12px', marginBottom: '5px' }}>Ghost Trust</div>
        <div style={{
          height: '20px',
          background: '#0f0f1e',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid #0f3460'
        }}>
          <div style={{
            height: '100%',
            width: `${ghostTrust}%`,
            background: 'linear-gradient(to right, #e94560, #ff6b9d)',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{ color: '#e94560', fontSize: '12px', marginTop: '5px' }}>{ghostTrust}%</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: '#a0a0a0', fontSize: '12px', marginBottom: '5px' }}>
          🎮 Demo Mode (FREE)
        </div>
        <div style={{ color: '#c4c4c4', fontSize: '12px' }}>
          {demoServerStatus.online && (
            <>Used: {demoServerStatus.requestsToday || 0}/{demoServerStatus.dailyLimit || 500}</>
          )}
          {!demoServerStatus.online && demoServerStatus.checked && (
            <span style={{ color: '#ff6b6b' }}>Server offline</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Password Entry Modal
const PasswordModal = ({ onSuccess }) => {
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

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#1a1a2e',
        padding: '40px',
        borderRadius: '12px',
        maxWidth: '450px',
        width: '90%',
        border: '2px solid #e94560',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#e94560', marginTop: 0, fontSize: '28px' }}>Welcome, Judge</h2>
        <p style={{ color: '#c4c4c4', marginBottom: '25px', lineHeight: '1.6' }}>
          Enter the demo password provided by the developer to experience the AI-powered ghost story.
        </p>
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Enter demo password"
          disabled={isVerifying}
          style={{
            width: '100%',
            padding: '15px',
            background: '#16213e',
            border: error ? '2px solid #ff6b6b' : '1px solid #0f3460',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '16px',
            marginBottom: '15px',
            boxSizing: 'border-box'
          }}
        />

        {error && (
          <div style={{
            color: '#ff6b6b',
            fontSize: '14px',
            marginBottom: '15px',
            padding: '10px',
            background: 'rgba(255, 107, 107, 0.1)',
            borderRadius: '6px'
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isVerifying}
          style={{
            width: '100%',
            padding: '15px',
            background: isVerifying ? '#555' : '#e94560',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: isVerifying ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {isVerifying ? 'Verifying...' : 'Enter Game'}
        </button>

        <p style={{ color: '#777', fontSize: '12px', marginTop: '20px', marginBottom: 0 }}>
          Password hint: echoes + year (2025)
        </p>
      </div>
    </div>
  );
};

// Main App
const App = () => {
  return (
    <GameStateProvider>
      <AppContent />
    </GameStateProvider>
  );
};

const AppContent = () => {
  const { addMessage, isAuthenticated, demoServerStatus } = useGameState();
  const [hasStarted, setHasStarted] = useState(false);

  const startGame = () => {
    setHasStarted(true);
    addMessage('system', 'Welcome to Echoes of the Estate. You sense a presence in this old mansion...');
  };

  if (!isAuthenticated) {
    return <PasswordModal onSuccess={startGame} />;
  }

  if (!hasStarted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #0a0a15, #16213e)',
        padding: '20px',
        fontFamily: 'Georgia, serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: '600px', textAlign: 'center' }}>
          <h1 style={{
            color: '#e94560',
            fontSize: '48px',
            marginBottom: '20px',
            textShadow: '0 0 20px rgba(233, 69, 96, 0.5)'
          }}>
            Echoes of the Estate
          </h1>
          <p style={{ color: '#c4c4c4', fontSize: '18px', lineHeight: '1.6', marginBottom: '30px' }}>
            An Interactive Ghost Story powered by AI. Explore a haunted mansion and uncover the tragic tale of Eleanor Ashford.
          </p>
          
          {demoServerStatus.checked && (
            <div style={{
              padding: '15px',
              background: demoServerStatus.online ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 107, 107, 0.1)',
              border: `1px solid ${demoServerStatus.online ? '#4caf50' : '#ff6b6b'}`,
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              color: demoServerStatus.online ? '#4caf50' : '#ff6b6b'
            }}>
              {demoServerStatus.online ? 
                `✓ Demo Mode Active - FREE AI (${demoServerStatus.remainingToday || 0} requests remaining)` : 
                '⚠ Demo server offline'
              }
            </div>
          )}

          <button
            onClick={startGame}
            style={{
              padding: '15px 40px',
              background: '#e94560',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            Begin Your Journey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0a0a15, #16213e)',
      padding: '20px',
      fontFamily: 'Georgia, serif'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            color: '#e94560',
            fontSize: '36px',
            marginBottom: '10px',
            textShadow: '0 0 10px rgba(233, 69, 96, 0.5)'
          }}>
            Echoes of the Estate
          </h1>
        </header>

        <Room />
        <StatsDisplay />
        <ConversationDisplay />
        <InputHandler />
      </div>
    </div>
  );
};

export default App;
