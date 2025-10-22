/**
  Main Entry Point
 */

import React, { useState } from 'react';
import { GameStateProvider, useGameState } from './contexts/GameStateContext';
import WelcomeScreen from './components/WelcomeScreen';
import PasswordModal from './components/PasswordModal';
import GameInterface from './components/GameInterface';

const AppContent = () => {
  const { isAuthenticated, startMusic } = useGameState();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Show welcome screen first
  if (!showPasswordModal && !isAuthenticated) {
    return (
      <WelcomeScreen
        onEnter={() => {
          startMusic();
          setShowPasswordModal(true);
        }}
      />
    );
  }

  // Show password modal
  if (showPasswordModal && !isAuthenticated) {
    return (
      <PasswordModal
        show={true}
        onSuccess={() => {}}
      />
    );
  }

  // Show full game once authenticated
  return <GameInterface />;
};

function App() {
  return (
    <GameStateProvider>
      <AppContent />
    </GameStateProvider>
  );
}

export default App;