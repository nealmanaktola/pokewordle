import type { TileData, GameMode } from '../types';
import { getPuzzleNumber } from './dailyPokemon';

const EMOJI_MAP = {
  correct: '🟩',
  present: '🟨',
  absent: '⬛',
  empty: '⬜',
};

export function generateShareText(
  guesses: TileData[][],
  won: boolean,
  currentRow: number,
  mode: GameMode
): string {
  const attempts = won ? currentRow : 'X';

  const grid = guesses
    .slice(0, currentRow)
    .map(row => row.map(tile => EMOJI_MAP[tile.state]).join(''))
    .join('\n');

  if (mode === 'unlimited') {
    return `PokeWordle (Unlimited) ${attempts}/6\n\n${grid}`;
  }

  const puzzleNumber = getPuzzleNumber();
  return `PokeWordle #${puzzleNumber} ${attempts}/6\n\n${grid}`;
}

export async function shareResult(text: string): Promise<boolean> {
  // Try native share API first (mobile)
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return true;
    } catch {
      // User cancelled or error, fall through to clipboard
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
