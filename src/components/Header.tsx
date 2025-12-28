import type { GameMode } from '../types';
import './Header.css';

interface HeaderProps {
  onHelp: () => void;
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export function Header({ onHelp, mode, onModeChange }: HeaderProps) {
  return (
    <header className="header">
      <button className="header-btn" onClick={onHelp} aria-label="Help">
        ?
      </button>
      <div className="header-center">
        <h1 className="title">PokeWordle</h1>
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === 'daily' ? 'active' : ''}`}
            onClick={() => onModeChange('daily')}
          >
            Daily
          </button>
          <button
            className={`mode-btn ${mode === 'unlimited' ? 'active' : ''}`}
            onClick={() => onModeChange('unlimited')}
          >
            Unlimited
          </button>
        </div>
      </div>
      <div className="header-spacer" />
    </header>
  );
}
