export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export interface TileData {
  letter: string;
  state: LetterState;
}

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  solution: string;
  solutionId: number;
  guesses: TileData[][];
  currentGuess: string;
  currentRow: number;
  gameStatus: GameStatus;
  keyboardState: Record<string, LetterState>;
  revealingRow: number | null;
  shakeRow: number | null;
}

export type GameAction =
  | { type: 'ADD_LETTER'; letter: string }
  | { type: 'DELETE_LETTER' }
  | { type: 'SUBMIT_GUESS' }
  | { type: 'SET_REVEALING'; row: number | null }
  | { type: 'SET_SHAKE'; row: number | null }
  | { type: 'LOAD_STATE'; state: Partial<GameState> };
