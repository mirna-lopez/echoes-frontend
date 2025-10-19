/*═══════════════════════════════════════════════════════════════
 * GAME STATE CONTEXT - Central state management
 * 
 * This is the "brain" of the application. It manages:
 * - All game state (room, conversation, trust)
 * - Music/audio system
 * - Save/load functionality
 * - API communication
 * - Authentication
 * 
 * All components that need game data will use this context.
 * 
 * ═══════════════════════════════════════════════════════════════
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ROOMS, API_CONFIG } from '../data/rooms';

// Create the context
const GameStateContext = createContext();

/**
 * Custom hook to access game state from any component
 * Usage: const { currentRoom, moveToRoom } = useGameState();
 */
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within GameStateProvider');
  }
  return context;
};

/**
 * GameStateProvider - Wraps the entire app
 */
export const GameStateProvider = ({ children }) => {
  // ═══ GAME STATE ═══
  const [currentRoom, setCurrentRoom] = useState('entrance');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [ghostTrust, setGhostTrust] = useState(0); // 0-100 trust meter
  const [isLoading, setIsLoading] = useState(false);
  
  // ═══ AUTHENTICATION ═══
  const [demoPassword, setDemoPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [demoServerStatus, setDemoServerStatus] = useState({ online: false, checked: false });
  
  // ═══ AUDIO CONTROLS ═══
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [musicStarted, setMusicStarted] = useState(false);
  
  // ═══ AUDIO REFS (for music playback) ═══
  const audioRef = useRef(null); // Current room music
  const welcomeMusicRef = useRef(null); // Welcome screen music

  // ═══ CHECK SERVER ON MOUNT ═══
  useEffect(() => {
    checkDemoServer();
  }, []);

  // ═══ WELCOME MUSIC MANAGEMENT ═══
  useEffect(() => {
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

  // ═══ ROOM MUSIC MANAGEMENT ═══
  useEffect(() => {
    const playRoomMusic = async () => {
      const musicUrl = ROOMS[currentRoom].music;
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0;
      
      try {
        await audioRef.current.play();
        
        // Fade in effect
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
      // Stop welcome music
      if (welcomeMusicRef.current) {
        welcomeMusicRef.current.pause();
        welcomeMusicRef.current = null;
      }

      // Fade out current music, then play new room music
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

  // ═══ VOLUME CONTROL ═══
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMusicMuted ? 0 : musicVolume;
    }
    if (welcomeMusicRef.current) {
      welcomeMusicRef.current.volume = isMusicMuted ? 0 : musicVolume;
    }
  }, [isMusicMuted, musicVolume]);

  // ═══════════════════════════════════════════════════════════════
  // API FUNCTIONS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Check if demo server is online
   */
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

  /**
   * Verify user password with backend
   */
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

  // ═══════════════════════════════════════════════════════════════
  // GAME ACTIONS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Add message to conversation history
   */
  const addMessage = (role, content) => {
    setConversationHistory(prev => [...prev, { role, content }]);
  };

  /**
   * Move player to a new room
   */
  const moveToRoom = (roomId) => {
    if (ROOMS[roomId]) {
      setCurrentRoom(roomId);
      addMessage('system', `You moved to the ${ROOMS[roomId].name}.`);
    }
  };

  /**
   * Adjust ghost trust level (clamped between 0-100)
   */
  const adjustTrust = (amount) => {
    setGhostTrust(prev => Math.max(0, Math.min(100, prev + amount)));
  };

  // ═══════════════════════════════════════════════════════════════
  // SAVE/LOAD SYSTEM
  // ═══════════════════════════════════════════════════════════════

  /**
   * Save game to browser localStorage (auto-save)
   */
  const saveGameToLocalStorage = () => {
    const gameState = {
      currentRoom,
      conversationHistory,
      ghostTrust,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('echoesEstateProgress', JSON.stringify(gameState));
  };

  /**
   * Load game from localStorage
   */
  const loadGameFromLocalStorage = () => {
    const saved = localStorage.getItem('echoesEstateProgress');
    if (saved) {
      const gameState = JSON.parse(saved);
      setCurrentRoom(gameState.currentRoom);
      setConversationHistory(gameState.conversationHistory || []);
      setGhostTrust(gameState.ghostTrust || 0);
      return true;
    }
    return false;
  };

  /**
   * Generate portable save code (base64 encoded)
   */
  const generateSaveCode = () => {
    const gameState = {
      currentRoom,
      conversationHistory: conversationHistory.slice(-20),
      ghostTrust,
      timestamp: new Date().toISOString()
    };
    return btoa(JSON.stringify(gameState));
  };

  /**
   * Load game from save code
   */
  const loadGameFromCode = (code) => {
    try {
      const decoded = atob(code);
      const gameState = JSON.parse(decoded);
      setCurrentRoom(gameState.currentRoom);
      setConversationHistory(gameState.conversationHistory || []);
      setGhostTrust(gameState.ghostTrust || 0);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid save code' };
    }
  };

  /**
   * Clear all saved progress
   */
  const clearSavedGame = () => {
    localStorage.removeItem('echoesEstateProgress');
    setCurrentRoom('entrance');
    setConversationHistory([]);
    setGhostTrust(0);
  };

  // ═══════════════════════════════════════════════════════════════
  // AUDIO CONTROLS
  // ═══════════════════════════════════════════════════════════════

  const startMusic = () => setMusicStarted(true);
  const toggleMute = () => setIsMusicMuted(prev => !prev);
  const changeVolume = (newVolume) => setMusicVolume(newVolume);

  // ═══════════════════════════════════════════════════════════════
  // PROVIDE ALL STATE & FUNCTIONS TO CHILDREN
  // ═══════════════════════════════════════════════════════════════

  const value = {
    // State
    currentRoom,
    conversationHistory,
    ghostTrust,
    isLoading,
    demoPassword,
    isAuthenticated,
    demoServerStatus,
    isMusicMuted,
    musicVolume,
    musicStarted,
    ROOMS,
    // Actions
    setIsLoading,
    addMessage,
    moveToRoom,
    adjustTrust,
    verifyPassword,
    toggleMute,
    changeVolume,
    startMusic,
    saveGameToLocalStorage,
    loadGameFromLocalStorage,
    generateSaveCode,
    loadGameFromCode,
    clearSavedGame
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};