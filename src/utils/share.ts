import type { TileData } from '../types';
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
  currentRow: number
): string {
  const puzzleNumber = getPuzzleNumber();
  const attempts = won ? currentRow : 'X';

  const grid = guesses
    .slice(0, currentRow)
    .map(row => row.map(tile => EMOJI_MAP[tile.state]).join(''))
    .join('\n');

  return `Pokedle #${puzzleNumber} ${attempts}/6\n\n${grid}`;
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
