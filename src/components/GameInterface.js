// Main game screen - where everything happens
// Has chat, room navigation, trust meter, save system
// TODO: add achievement system later

import React, { useState, useEffect } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { useLanguage } from '../contexts/LanguageContext';
import { API_CONFIG } from '../data/rooms';
import { SUPPORTED_LANGUAGES } from '../data/translations';

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

  const { currentLanguage, changeLanguage, t } = useLanguage();

  const [input, setInput] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(ROOMS.entrance.background);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [saveCode, setSaveCode] = useState('');
  const [loadCodeInput, setLoadCodeInput] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [translatedHistory, setTranslatedHistory] = useState([]);

  // Helper to get language name for AI prompt
  const getLanguageName = (code) => {
    const names = {
      en: 'English',
      es: 'Spanish',
      pt: 'Portuguese',
      fr: 'French',
      hi: 'Hindi',
      ja: 'Japanese'
    };
    return names[code] || 'English';
  };

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update background when room changes
  useEffect(() => {
    if (ROOMS[currentRoom]) {
      setBackgroundImage(ROOMS[currentRoom].background);
    }
  }, [currentRoom, ROOMS]);

  // Auto-save on state changes (now includes language)
  useEffect(() => {
    saveGameToLocalStorage();
  }, [currentRoom, ghostTrust, conversationHistory, saveGameToLocalStorage]);

  // Load saved game on mount
  useEffect(() => {
    const hasSaved = loadGameFromLocalStorage();
    if (hasSaved) {
      addMessage('system', t('systemMessages.restored'));
    } else {
      addMessage('system', t('systemMessages.welcome'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save/Load functions
  const handleGenerateSaveCode = () => {
    const code = generateSaveCode();
    setSaveCode(code);
    setSaveMessage(t('saveMenu.saveGenerated'));
  };

  const handleLoadFromCode = () => {
    if (!loadCodeInput.trim()) {
      setSaveMessage(t('saveMenu.enterCodeError'));
      return;
    }
    const result = loadGameFromCode(loadCodeInput);
    if (result.success) {
      setSaveMessage(t('saveMenu.loadSuccess'));
      setShowSaveMenu(false);
      setLoadCodeInput('');
      setBackgroundImage(ROOMS[currentRoom].background);
    } else {
      setSaveMessage(t('saveMenu.loadError'));
    }
  };

  const handleNewGame = () => {
    if (window.confirm(t('saveMenu.newGameConfirm'))) {
      clearSavedGame();
      setSaveMessage(t('saveMenu.newGameSuccess'));
      setShowSaveMenu(false);
      addMessage('system', t('systemMessages.welcome'));
    }
  };

  // Send message to AI (with language support)
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      // System prompt with language instruction
      const systemPrompt = `You are Eleanor Ashford's ghost, died 1892. Melancholic, elegant, archaic speech. Room: ${t(`rooms.${currentRoom}.name`)}. Trust: ${ghostTrust}/100. Be atmospheric, 2-4 sentences. IMPORTANT: Respond in ${getLanguageName(currentLanguage)} language.`;
      
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.filter(m => m.role !== 'system').slice(-10),
        { role: 'user', content: userMessage }
      ];

      const response = await fetch(`${API_CONFIG.DEMO_SERVER}/api/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'X-Demo-Password': demoPassword,
          'X-User-Language': currentLanguage // Send language to backend
        },
        body: JSON.stringify({ messages })
      });

      if (response.ok) {
        const data = await response.json();
        addMessage('assistant', data.message);
        
        // Adjust trust based on message content
         const lowerMessage = userMessage.toLowerCase();
        if (lowerMessage.match(/sorry|help|comfort|understand|sympathize|empathize|sad|lonely/)) {
          adjustTrust(15);
        } else if (lowerMessage.match(/good|kind|nice|beautiful/)) {
          adjustTrust(10);
        } else if (lowerMessage.length > 20) {
          adjustTrust(5); 
        }
      } else {
        addMessage('system', t('systemMessages.errorConnecting'));
      }
    } catch (error) {
      addMessage('system', `${t('systemMessages.error')} ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Translate conversation history messages
  useEffect(() => {
    const translated = conversationHistory.map(msg => {
      // Translate system messages about room movement
      if (msg.role === 'system' && msg.content.includes('You moved to')) {
        // Extract room ID from the message or use current room
        return {
          ...msg,
          content: `${t('roomPanel.movedTo')} ${t(`rooms.${currentRoom}.name`)}.`
        };
      }
      // Translate welcome message
      if (msg.role === 'system' && msg.content.includes('Welcome to Echoes of the Estate')) {
        if (msg.content.includes('Previous progress restored')) {
          return { ...msg, content: t('systemMessages.restored') };
        }
        return { ...msg, content: t('systemMessages.welcome') };
      }
      // Translate error messages
      if (msg.role === 'system' && msg.content.includes('Error connecting')) {
        return { ...msg, content: t('systemMessages.errorConnecting') };
      }
      if (msg.role === 'system' && msg.content.includes('Error:')) {
        const errorText = msg.content.split('Error:')[1] || '';
        return { ...msg, content: `${t('systemMessages.error')}${errorText}` };
      }
      return msg;
    });
    setTranslatedHistory(translated);
  }, [conversationHistory, currentRoom, currentLanguage, t]);

  // Watch for room changes and replace English message with translated one
  useEffect(() => {
    if (conversationHistory.length > 0) {
      const lastMessage = conversationHistory[conversationHistory.length - 1];
      // Check if it's a room movement message in English
      if (lastMessage && lastMessage.role === 'system' && lastMessage.content.includes('You moved to')) {
        // Extract room name and translate
        const translatedMessage = `${t('roomPanel.movedTo')} ${t(`rooms.${currentRoom}.name`)}.`;
        // Replace the message if it's different
        if (lastMessage.content !== translatedMessage) {
          // Update the last message
          conversationHistory[conversationHistory.length - 1] = {
            role: 'system',
            content: translatedMessage
          };
        }
      }
    }
  }, [conversationHistory, currentRoom, t]);

  // Custom room movement handler
  const handleMoveToRoom = (roomId) => {
    moveToRoom(roomId);
  };

 return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      background: `linear-gradient(rgba(0,0,0,0.5), rgba(13,2,33,0.7)), url('${backgroundImage}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: 'Special Elite, cursive',
      transition: 'background-image 0.5s ease-in-out',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Creepster&family=Special+Elite&display=swap" rel="stylesheet" />
      
      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .game-container { padding: 10px 10px !important; }
          .game-header { padding: 16px 12px !important; }
          .game-header h1 { 
            font-size: 28px !important; 
            margin-bottom: 16px !important;
          }
          .header-controls {
            flex-direction: row !important;
            width: 100% !important;
            flex-wrap: wrap !important;
          }
          .header-controls button {
            flex: 1 1 45% !important;
            font-size: 12px !important;
            padding: 10px 12px !important;
          }
          .room-panel { padding: 16px !important; }
          .room-panel h2 { font-size: 18px !important; }
          .room-panel-image { 
            height: 200px !important;
          }
          .chat-box { height: 250px !important; }
          .input-container { 
            flex-direction: column !important;
            gap: 8px !important;
          }
          .input-container input {
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .input-container button {
            width: 100% !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>

      <div className="game-container" style={{ 
        maxWidth: '1000px', 
        margin: '0 auto',
        padding: '20px'
      }}>
        {/* Header */}
        <header className="game-header" style={{
          textAlign: 'center',
          padding: '24px 20px',
          background: 'linear-gradient(135deg, rgba(45,27,61,0.95), rgba(26,11,46,0.95))',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '2px solid #ff6b35',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 1000
        }}>
          <h1 style={{
            margin: '0 0 20px 0',
            fontSize: '48px',
            fontFamily: 'Creepster, cursive',
            color: '#ff6b35',
            letterSpacing: '3px'
          }}>
            {t('header.title')}
          </h1>

          <div className="header-controls" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
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
              {isMusicMuted ? t('header.unmuteMusic') : t('header.muteMusic')}
            </button>

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
              {t('header.saveLoadButton')}
            </button>

            {/* Language Button */}
            <div style={{ position: 'relative', zIndex: 9999 }}>
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
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
                {t('header.languageButton')}
              </button>

              {/* Language Dropdown */}
              {showLanguageMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: 'linear-gradient(135deg, rgba(13,2,33,0.98), rgba(26,11,46,0.98))',
                  border: '3px solid #7b2cbf',
                  borderRadius: '12px',
                  padding: '12px',
                  minWidth: '200px',
                  zIndex: 10000,
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                }}>
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setShowLanguageMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        marginBottom: '8px',
                        background: currentLanguage === lang.code 
                          ? 'linear-gradient(135deg, #7b2cbf, #9d4edd)' 
                          : 'rgba(45,27,61,0.5)',
                        color: currentLanguage === lang.code ? '#ffd700' : '#e0d4f7',
                        border: currentLanguage === lang.code 
                          ? '2px solid #ffd700' 
                          : '1px solid rgba(123,44,191,0.3)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>{lang.flag}</span>
                      <span>{lang.name}</span>
                      {currentLanguage === lang.code && <span style={{ marginLeft: 'auto' }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Save Menu */}
        {showSaveMenu && (
          <div style={{
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(13,2,33,0.98), rgba(26,11,46,0.98))',
            borderRadius: '12px',
            marginBottom: '24px',
            border: '2px solid #ffd700',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: '#ffd700', marginTop: 0, fontFamily: 'Creepster, cursive' }}>
              {t('saveMenu.title')}
            </h3>

            {/* Generate save code */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#9d7cc1', fontSize: '14px', marginBottom: '8px' }}>
                {t('saveMenu.generateTitle')}
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
                  fontWeight: 'bold',
                  marginBottom: '12px'
                }}
              >
                {t('saveMenu.generateButton')}
              </button>

              {saveCode && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: 'rgba(26,11,46,0.8)',
                  borderRadius: '8px',
                  border: '1px solid #ff6b35'
                }}>
                  <p style={{ color: '#9d7cc1', fontSize: '12px', marginBottom: '8px' }}>
                    {t('saveMenu.codeLabel')}
                  </p>
                  <input
                    type="text"
                    value={saveCode}
                    readOnly
                    onClick={(e) => {
                      e.target.select();
                      navigator.clipboard.writeText(saveCode);
                      setSaveMessage(t('saveMenu.copiedMessage'));
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(13,2,33,0.9)',
                      border: '1px solid #ff6b35',
                      borderRadius: '6px',
                      color: '#ffd700',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Load from code */}
            <div style={{ marginBottom: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,215,0,0.3)' }}>
              <p style={{ color: '#9d7cc1', fontSize: '14px', marginBottom: '8px' }}>
                {t('saveMenu.loadTitle')}
              </p>
              <input
                type="text"
                value={loadCodeInput}
                onChange={(e) => setLoadCodeInput(e.target.value)}
                placeholder={t('saveMenu.loadPlaceholder')}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(13,2,33,0.9)',
                  border: '1px solid #8b008b',
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
                {t('saveMenu.loadButton')}
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
                {t('saveMenu.newGameButton')}
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
            {t(`rooms.${currentRoom}.name`)}
          </h2>

          <div className="room-panel-image" style={{
            width: '100%',
            height: '300px',
            borderRadius: '8px',
            marginBottom: '20px',
            backgroundImage: `url('${isMobile ? ROOMS[currentRoom].background : ROOMS[currentRoom].cardImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '2px solid #ff6b35',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
          }} />

          <p style={{ color: '#e0d4f7' }}>{t(`rooms.${currentRoom}.description`)}</p>

          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,107,53,0.3)' }}>
            <p style={{ color: '#9d7cc1', fontSize: '14px' }}>{t('roomPanel.availablePaths')}</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {ROOMS[currentRoom].connections.map(roomId => (
                <button
                  key={roomId}
                  onClick={() => handleMoveToRoom(roomId)}
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
                  {t('roomPanel.goTo')} {t(`rooms.${roomId}.name`)}
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
            {t('trust.label')} {ghostTrust}%
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
            {t('chat.aiCredit')}
          </div>

          {translatedHistory.map((msg, idx) => (
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
                {msg.role === 'user' ? t('chat.you') : msg.role === 'assistant' ? t('chat.eleanor') : t('chat.system')}
              </div>
              <div style={{ color: '#e0d4f7' }}>
                {idx === translatedHistory.length - 1 && msg.role === 'assistant' ? (
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
            placeholder={t('chat.placeholder')}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '16px',
              background: 'linear-gradient(135deg, rgba(26,11,46,0.95), rgba(13,2,33,0.95))',
              border: '2px solid #8b008b',
              borderRadius: '10px',
              color: '#e0d4f7',
              fontSize: '15px',
              backdropFilter: 'blur(10px)',
              boxSizing: 'border-box'
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
              fontWeight: 'bold',
              boxSizing: 'border-box'
            }}
          >
            {isLoading ? t('chat.summoning') : t('chat.sendButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameInterface;