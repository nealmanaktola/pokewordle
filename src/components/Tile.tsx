import type { LetterState } from '../types';
import './Tile.css';

interface TileProps {
  letter: string;
  state: LetterState;
  isRevealing?: boolean;
  index?: number;
  isCurrentRow?: boolean;
}

export function Tile({ letter, state, isRevealing, index = 0, isCurrentRow }: TileProps) {
  const isRevealed = state !== 'empty';
  const stateClass = isRevealed ? state : '';
  // Keep flipped if revealed (has a state) OR currently revealing
  const revealClass = isRevealed ? 'flip' : '';
  const revealingClass = isRevealing ? 'revealing' : '';
  const popClass = letter && isCurrentRow && state === 'empty' ? 'pop' : '';
  const filledClass = letter ? 'filled' : '';

  return (
    <div
      className={`tile ${stateClass} ${revealClass} ${revealingClass} ${popClass} ${filledClass}`}
      style={{ '--tile-index': index } as React.CSSProperties}
    >
      <div className="tile-inner">
        <div className="tile-front">{letter}</div>
        <div className="tile-back">{letter}</div>
      </div>
    </div>
  );
}
