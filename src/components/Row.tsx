import type { TileData } from '../types';
import { Tile } from './Tile';
import './Row.css';

interface RowProps {
  tiles: TileData[];
  isRevealing?: boolean;
  isShaking?: boolean;
  isCurrentRow?: boolean;
  isBouncing?: boolean;
}

export function Row({ tiles, isRevealing, isShaking, isCurrentRow, isBouncing }: RowProps) {
  const shakeClass = isShaking ? 'shake' : '';
  const bounceClass = isBouncing ? 'bounce' : '';

  return (
    <div className={`row ${shakeClass} ${bounceClass}`}>
      {tiles.map((tile, index) => (
        <Tile
          key={index}
          letter={tile.letter}
          state={tile.state}
          isRevealing={isRevealing}
          index={index}
          isCurrentRow={isCurrentRow}
        />
      ))}
    </div>
  );
}
