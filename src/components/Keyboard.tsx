import type { LetterState } from '../types';
import './Keyboard.css';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
];

interface KeyboardProps {
  keyboardState: Record<string, LetterState>;
  onKey: (key: string) => void;
  disabled?: boolean;
}

export function Keyboard({ keyboardState, onKey, disabled }: KeyboardProps) {
  const handleClick = (key: string) => {
    if (disabled) return;
    onKey(key);
  };

  return (
    <div className="keyboard">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            const state = keyboardState[key] || '';
            const isWide = key === 'ENTER' || key === 'BACK';

            return (
              <button
                key={key}
                className={`key ${state} ${isWide ? 'wide' : ''}`}
                onClick={() => handleClick(key)}
                disabled={disabled}
              >
                {key === 'BACK' ? '⌫' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
