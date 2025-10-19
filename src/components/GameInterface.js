/**
 * ═══════════════════════════════════════════════════════════════
 * GAME INTERFACE - Main game screen
 * 
 * The complete interactive game with:
 * - Room exploration and navigation
 * - Chat with Eleanor (AI)
 * - Ghost trust meter
 * - Save/load system
 * - Music controls
 * 
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { API_CONFIG } from '../data/rooms';

// Typewriter effect for Eleanor's messages
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

const GameInterface = () => {
  const {
    currentRoom,
    ROOMS,
    conversationHistory,
    ghostTrust,
    isLoading,
    demoPassword,
    setIsLoading,
    addMessage,
    moveToRoom,
    adjustTrust,
    toggleMute,
    isMusicMuted,
    saveGameToLocalStorage,
    loadGameFromLocalStorage,
    generateSaveCode,
    loadGameFromCode,
    clearSavedGame
  } = useGameState();

  const [input, setInput] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(ROOMS.entrance.background);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [saveCode, setSaveCode] = useState('');
  const [loadCodeInput, setLoadCodeInput] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  // Update background when room changes
  useEffect(() => {
    if (ROOMS[currentRoom]) {
      setBackgroundImage(ROOMS[currentRoom].background);
    }
  }, [currentRoom, ROOMS]);

  // Auto-save on state changes
  useEffect(() => {
    saveGameToLocalStorage();
  }, [currentRoom, ghostTrust, conversationHistory, saveGameToLocalStorage]);

  // Load saved game on mount
  useEffect(() => {
    const hasSaved = loadGameFromLocalStorage();
    if (hasSaved) {
      addMessage('system', 'Previous progress restored. Welcome back to Echoes of the Estate...');
    } else {
      addMessage('system', 'Welcome to Echoes of the Estate. You sense a presence...');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save/Load functions
  const handleGenerateSaveCode = () => {
    const code = generateSaveCode();
    setSaveCode(code);
    setSaveMessage('Save code generated! Copy it to use on any device.');
  };

  const handleLoadFromCode = () => {
    if (!loadCodeInput.trim()) {
      setSaveMessage('Please enter a save code');
      return;
    }
    const result = loadGameFromCode(loadCodeInput);
    if (result.success) {
      setSaveMessage('Progress loaded successfully!');
      setShowSaveMenu(false);
      setLoadCodeInput('');
      setBackgroundImage(ROOMS[currentRoom].background);
    } else {
      setSaveMessage('Invalid save code. Please try again.');
    }
  };

  const handleNewGame = () => {
    if (window.confirm('Start a new game? This will clear your current progress.')) {
      clearSavedGame();
      setSaveMessage('Progress cleared. Starting fresh!');
      setShowSaveMenu(false);
      addMessage('system', 'Welcome to Echoes of the Estate. You sense a presence...');
    }
  };

  // Send message to AI
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
        headers: { 
          'Content-Type': 'application/json', 
          'X-Demo-Password': demoPassword 
        },
        body: JSON.stringify({ messages })
      });

      if (response.ok) {
        const data = await response.json();
        addMessage('assistant', data.message);
        
        // Adjust trust based on message content
        if (userMessage.toLowerCase().match(/sorry|help|comfort/)) {
          adjustTrust(5);
        }
      } else {
        addMessage('system', 'Error connecting to ghost...');
      }
    } catch (error) {
      addMessage('system', `Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(rgba(0,0,0,0.5), rgba(13,2,33,0.7)), url('${backgroundImage}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '20px',
      fontFamily: 'Special Elite, cursive',
      transition: 'background-image 0.5s ease-in-out'
    }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Creepster&family=Special+Elite&display=swap" rel="stylesheet" />
      
      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .game-container { padding: 10px !important; }
          .game-header { padding: 16px 12px !important; }
          .game-header h1 { font-size: 24px !important; }
          .room-panel { padding: 16px !important; }
          .room-panel h2 { font-size: 18px !important; }
          .chat-box { height: 250px !important; }
          .input-container { flex-direction: column !important; }
        }
      `}</style>

      <div className="game-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <header className="game-header" style={{
          textAlign: 'center',
          marginBottom: '32px',
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(45,27,61,0.95), rgba(26,11,46,0.95))',
          borderRadius: '12px',
          border: '2px solid #ff6b35',
          backdropFilter: 'blur(10px)',
          position: 'relative'
        }}>
          <h1 style={{
            color: '#ff6b35',
            fontSize: '48px',
            margin: 0,
            fontFamily: 'Creepster, cursive',
            letterSpacing: '3px'
          }}>
            ECHOES OF THE ESTATE
          </h1>

          {/* Controls */}
          <div style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            display: 'flex',
            gap: '12px'
          }}>
            <button
              onClick={() => setShowSaveMenu(!showSaveMenu)}
              style={{
                padding: '12px 20px',
                background: 'linear-gradient(135deg, rgba(139,0,139,0.8), rgba(75,0,130,0.8))',
                color: '#ffd700',
                border: '2px solid #8b008b',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              💾 SAVE
            </button>
            <button
              onClick={toggleMute}
              style={{
                padding: '12px 20px',
                background: 'linear-gradient(135deg, rgba(139,0,139,0.8), rgba(75,0,130,0.8))',
                color: '#ffd700',
                border: '2px solid #8b008b',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              {isMusicMuted ? '🔇 UNMUTE' : '🔊 MUTE'}
            </button>
          </div>
        </header>

        {/* Save Menu */}
        {showSaveMenu && (
          <div style={{
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(45,27,61,0.95), rgba(26,11,46,0.95))',
            borderRadius: '12px',
            marginBottom: '24px',
            border: '2px solid #ffd700',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: '#ffd700', marginTop: 0, fontFamily: 'Creepster, cursive' }}>
              💾 Save & Load Progress
            </h3>

            {/* Auto-save status */}
            <p style={{ color: '#e0d4f7', fontSize: '14px' }}>
              ✅ Auto-saved to this browser
            </p>

            {/* Generate save code */}
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,215,0,0.3)' }}>
              <p style={{ color: '#e0d4f7', fontSize: '14px' }}>
                📋 Generate save code:
              </p>
              <button
                onClick={handleGenerateSaveCode}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #ff6b35, #ff8c61)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Generate Code
              </button>

              {saveCode && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: 'rgba(255,215,0,0.1)',
                  border: '1px solid #ffd700',
                  borderRadius: '8px'
                }}>
                  <p style={{ 
                    color: '#e0d4f7', 
                    fontSize: '12px', 
                    wordBreak: 'break-all',
                    fontFamily: 'monospace' 
                  }}>
                    {saveCode}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(saveCode);
                      setSaveMessage('Copied!');
                    }}
                    style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #8b008b, #9d7cc1)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    📋 Copy
                  </button>
                </div>
              )}
            </div>

            {/* Load from code */}
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,215,0,0.3)' }}>
              <p style={{ color: '#e0d4f7', fontSize: '14px' }}>
                🔓 Load from code:
              </p>
              <input
                type="text"
                value={loadCodeInput}
                onChange={(e) => setLoadCodeInput(e.target.value)}
                placeholder="Paste code..."
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(13,2,33,0.8)',
                  border: '2px solid #8b008b',
                  borderRadius: '8px',
                  color: '#e0d4f7',
                  fontSize: '14px',
                  marginBottom: '12px',
                  boxSizing: 'border-box',
                  fontFamily: 'monospace'
                }}
              />
              <button
                onClick={handleLoadFromCode}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #ff6b35, #ff8c61)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Load Game
              </button>
            </div>

            {/* New game */}
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,215,0,0.3)' }}>
              <button
                onClick={handleNewGame}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #555, #333)',
                  color: '#ff6b6b',
                  border: '2px solid #ff6b6b',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                🗑️ New Game
              </button>
            </div>

            {saveMessage && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(76,175,80,0.2)',
                border: '1px solid #4caf50',
                borderRadius: '8px',
                color: '#4caf50',
                fontSize: '14px'
              }}>
                {saveMessage}
              </div>
            )}
          </div>
        )}

        {/* Room Panel */}
        <div className="room-panel" style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(26,11,46,0.95), rgba(45,27,61,0.95))',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '2px solid #ff6b35',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ color: '#ff6b35', marginTop: 0, fontFamily: 'Creepster, cursive' }}>
            {ROOMS[currentRoom].name}
          </h2>

          <div style={{
            width: '100%',
            height: '300px',
            borderRadius: '8px',
            marginBottom: '20px',
            backgroundImage: `url('${ROOMS[currentRoom].cardImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '2px solid #ff6b35',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
          }} />

          <p style={{ color: '#e0d4f7' }}>{ROOMS[currentRoom].description}</p>

          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,107,53,0.3)' }}>
            <p style={{ color: '#9d7cc1', fontSize: '14px' }}>Available paths:</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {ROOMS[currentRoom].connections.map(roomId => (
                <button
                  key={roomId}
                  onClick={() => moveToRoom(roomId)}
                  style={{
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, rgba(45,27,61,0.9), rgba(26,11,46,0.9))',
                    color: '#ff6b35',
                    border: '2px solid #ff6b35',
                    borderRadius: '8px',
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

        {/* Trust Meter */}
        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(26,11,46,0.95), rgba(45,27,61,0.95))',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '2px solid #8b008b',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ marginBottom: '8px', color: '#9d7cc1', fontSize: '13px' }}>
            GHOST TRUST: {ghostTrust}%
          </div>
          <div style={{
            height: '24px',
            background: 'rgba(13,2,33,0.8)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${ghostTrust}%`,
              background: 'linear-gradient(90deg, #ff6b35, #ffd700)',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        {/* Chat Box */}
        <div className="chat-box" style={{
          height: '350px',
          overflowY: 'auto',
          padding: '20px',
          background: 'linear-gradient(180deg, rgba(13,2,33,0.95), rgba(26,11,46,0.95))',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '2px solid #8b008b',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            background: 'rgba(139,0,139,0.3)',
            border: '1px solid #ff6b35',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            fontSize: '13px',
            color: '#ffd700',
            textAlign: 'center'
          }}>
            AI Powered by Claude | Music by Kevin MacLeod
          </div>

          {conversationHistory.map((msg, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '16px',
                padding: '14px',
                background:
                  msg.role === 'user'
                    ? 'rgba(45,27,61,0.8)'
                    : msg.role === 'assistant'
                    ? 'rgba(26,11,46,0.8)'
                    : 'rgba(139,0,139,0.6)',
                borderRadius: '10px',
                borderLeft: `4px solid ${
                  msg.role === 'user'
                    ? '#ff6b35'
                    : msg.role === 'assistant'
                    ? '#8b008b'
                    : '#ffd700'
                }`
              }}
            >
              <div style={{ fontSize: '11px', color: '#9d7cc1', marginBottom: '6px' }}>
                {msg.role === 'user' ? 'You' : msg.role === 'assistant' ? 'Eleanor' : 'System'}
              </div>
              <div style={{ color: '#e0d4f7' }}>
                {idx === conversationHistory.length - 1 && msg.role === 'assistant' ? (
                  <TypewriterText text={msg.content} />
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="input-container" style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Speak to the ghost..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '16px',
              background: 'linear-gradient(135deg, rgba(26,11,46,0.95), rgba(13,2,33,0.95))',
              border: '2px solid #8b008b',
              borderRadius: '10px',
              color: '#e0d4f7',
              fontSize: '15px',
              backdropFilter: 'blur(10px)'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            style={{
              padding: '16px 32px',
              background: isLoading ? '#555' : 'linear-gradient(135deg, #ff6b35, #ff8c61)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: 'bold'
            }}
          >
            {isLoading ? 'Summoning...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameInterface;
