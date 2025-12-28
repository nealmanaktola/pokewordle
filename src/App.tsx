import { useState, useEffect, useCallback } from 'react';
import { useGame } from './hooks/useGame';
import { Header } from './components/Header';
import { GameBoard } from './components/GameBoard';
import { Keyboard } from './components/Keyboard';
import { Modal } from './components/Modal';
import { Toast } from './components/Toast';
import { PokemonReveal } from './components/PokemonReveal';
import { HelpModal } from './components/HelpModal';
import { Footer } from './components/Footer';
import { generateShareText, shareResult } from './utils/share';
import type { GameMode } from './types';
import './App.css';

function App() {
  const [mode, setMode] = useState<GameMode>('daily');
  const { state, handleKey, resetGame } = useGame(mode);
  const [showHelp, setShowHelp] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Handle physical keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showHelp || showResult) return;

      const key = e.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        const error = handleKey(key);
        if (error) {
          setToast(error);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKey, showHelp, showResult]);

  // Show result modal after game ends
  useEffect(() => {
    if (state.gameStatus !== 'playing' && state.revealingRow === null) {
      const timer = setTimeout(() => {
        setShowResult(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.gameStatus, state.revealingRow]);

  const handleKeyboardClick = useCallback((key: string) => {
    const error = handleKey(key);
    if (error) {
      setToast(error);
    }
  }, [handleKey]);

  const handleShare = useCallback(async () => {
    const text = generateShareText(
      state.guesses,
      state.gameStatus === 'won',
      state.currentRow,
      mode
    );
    const success = await shareResult(text);
    if (success) {
      setToast('Copied to clipboard!');
    }
  }, [state.guesses, state.gameStatus, state.currentRow, mode]);

  const isInputDisabled = state.revealingRow !== null || state.gameStatus !== 'playing';

  return (
    <div className="app">
      <Header onHelp={() => setShowHelp(true)} mode={mode} onModeChange={setMode} />

      <main className="game-container">
        <GameBoard
          guesses={state.guesses}
          currentRow={state.currentRow}
          revealingRow={state.revealingRow}
          shakeRow={state.shakeRow}
          won={state.gameStatus === 'won'}
        />

        <Keyboard
          keyboardState={state.keyboardState}
          onKey={handleKeyboardClick}
          disabled={isInputDisabled}
        />
      </main>

      <Footer />

      {toast && (
        <Toast
          message={toast}
          onClose={() => setToast(null)}
        />
      )}

      <Modal isOpen={showHelp} onClose={() => setShowHelp(false)}>
        <HelpModal />
      </Modal>

      <Modal isOpen={showResult} onClose={() => setShowResult(false)}>
        <PokemonReveal
          id={state.solutionId}
          name={state.solution}
          isVictory={state.gameStatus === 'won'}
          guessCount={state.currentRow}
          onShare={handleShare}
          mode={mode}
          onPlayAgain={() => {
            resetGame();
            setShowResult(false);
          }}
        />
      </Modal>
    </div>
  );
}

export default App;
