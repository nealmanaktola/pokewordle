import type { LetterState, TileData } from '../types';

export function evaluateGuess(guess: string, solution: string): LetterState[] {
  const length = solution.length;
  const result: LetterState[] = Array(length).fill('absent');
  const solutionChars = solution.split('');
  const guessChars = guess.split('');

  // First pass: mark exact matches (green)
  for (let i = 0; i < length; i++) {
    if (guessChars[i] === solutionChars[i]) {
      result[i] = 'correct';
      solutionChars[i] = '#'; // Mark as used
    }
  }

  // Second pass: mark present (yellow) - only unused letters
  for (let i = 0; i < length; i++) {
    if (result[i] !== 'correct') {
      const idx = solutionChars.indexOf(guessChars[i]);
      if (idx !== -1) {
        result[i] = 'present';
        solutionChars[idx] = '#'; // Mark as used
      }
    }
  }

  return result;
}

export function createEmptyRow(length: number): TileData[] {
  return Array(length).fill(null).map(() => ({ letter: '', state: 'empty' as LetterState }));
}

export function createInitialGuesses(length: number): TileData[][] {
  return Array(6).fill(null).map(() => createEmptyRow(length));
}

export function updateKeyboardState(
  currentState: Record<string, LetterState>,
  guess: string,
  evaluation: LetterState[]
): Record<string, LetterState> {
  const newState = { ...currentState };

  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i];
    const letterState = evaluation[i];
    const existingState = newState[letter];

    // Priority: correct > present > absent
    if (letterState === 'correct') {
      newState[letter] = 'correct';
    } else if (letterState === 'present' && existingState !== 'correct') {
      newState[letter] = 'present';
    } else if (!existingState) {
      newState[letter] = letterState;
    }
  }

  return newState;
}
