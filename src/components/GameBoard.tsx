import type { TileData } from '../types';
import { Row } from './Row';
import './GameBoard.css';

interface GameBoardProps {
  guesses: TileData[][];
  currentRow: number;
  revealingRow: number | null;
  shakeRow: number | null;
  won: boolean;
}

export function GameBoard({ guesses, currentRow, revealingRow, shakeRow, won }: GameBoardProps) {
  return (
    <div className="game-board">
      {guesses.map((tiles, index) => (
        <Row
          key={index}
          tiles={tiles}
          isRevealing={revealingRow === index}
          isShaking={shakeRow === index}
          isCurrentRow={currentRow === index}
          isBouncing={won && index === currentRow - 1}
        />
      ))}
    </div>
  );
}
