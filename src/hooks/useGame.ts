import { useReducer, useCallback, useEffect } from 'react';
import type { GameState, GameAction, TileData } from '../types';
import { evaluateGuess, createInitialGuesses, updateKeyboardState } from '../utils/gameLogic';
import { getDailyPokemon, getTodayKey } from '../utils/dailyPokemon';
import { isValidWord } from '../data/words';
import { POKEMON_LIST } from '../data/pokemon';

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

function createInitialState(): GameState {
  const pokemon = getDailyPokemon();
  return {
    solution: pokemon.name,
    solutionId: pokemon.id,
    guesses: createInitialGuesses(),
    currentGuess: '',
    currentRow: 0,
    gameStatus: 'playing',
    keyboardState: {},
    revealingRow: null,
    shakeRow: null,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_LETTER': {
      if (state.gameStatus !== 'playing') return state;
      if (state.currentGuess.length >= WORD_LENGTH) return state;
      if (state.revealingRow !== null) return state;

      const newGuess = state.currentGuess + action.letter;
      const newGuesses = [...state.guesses];
      newGuesses[state.currentRow] = newGuesses[state.currentRow].map((_, i) => ({
        letter: i < newGuess.length ? newGuess[i] : '',
        state: 'empty' as const,
      }));

      return {
        ...state,
        currentGuess: newGuess,
        guesses: newGuesses,
      };
    }

    case 'DELETE_LETTER': {
      if (state.gameStatus !== 'playing') return state;
      if (state.currentGuess.length === 0) return state;
      if (state.revealingRow !== null) return state;

      const newGuess = state.currentGuess.slice(0, -1);
      const newGuesses = [...state.guesses];
      newGuesses[state.currentRow] = newGuesses[state.currentRow].map((_, i) => ({
        letter: i < newGuess.length ? newGuess[i] : '',
        state: 'empty' as const,
      }));

      return {
        ...state,
        currentGuess: newGuess,
        guesses: newGuesses,
      };
    }

    case 'SUBMIT_GUESS': {
      if (state.gameStatus !== 'playing') return state;
      if (state.currentGuess.length !== WORD_LENGTH) return state;
      if (state.revealingRow !== null) return state;

      const evaluation = evaluateGuess(state.currentGuess, state.solution);
      const newGuesses = [...state.guesses];
      newGuesses[state.currentRow] = state.currentGuess.split('').map((letter, i) => ({
        letter,
        state: evaluation[i],
      })) as TileData[];

      const newKeyboardState = updateKeyboardState(
        state.keyboardState,
        state.currentGuess,
        evaluation
      );

      const won = state.currentGuess === state.solution;
      const lost = !won && state.currentRow >= MAX_GUESSES - 1;

      return {
        ...state,
        guesses: newGuesses,
        currentGuess: '',
        currentRow: state.currentRow + 1,
        gameStatus: won ? 'won' : lost ? 'lost' : 'playing',
        keyboardState: newKeyboardState,
        revealingRow: state.currentRow,
      };
    }

    case 'SET_REVEALING': {
      return {
        ...state,
        revealingRow: action.row,
      };
    }

    case 'SET_SHAKE': {
      return {
        ...state,
        shakeRow: action.row,
      };
    }

    case 'LOAD_STATE': {
      return {
        ...state,
        ...action.state,
      };
    }

    default:
      return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

  // Load saved state from localStorage
  useEffect(() => {
    const todayKey = getTodayKey();
    const savedState = localStorage.getItem(`pokedle-${todayKey}`);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Only load if it's for today's puzzle
        const currentPokemon = getDailyPokemon();
        if (parsed.solution === currentPokemon.name) {
          dispatch({ type: 'LOAD_STATE', state: parsed });
        }
      } catch {
        // Ignore invalid saved state
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    const todayKey = getTodayKey();
    const stateToSave = {
      solution: state.solution,
      solutionId: state.solutionId,
      guesses: state.guesses,
      currentGuess: state.currentGuess,
      currentRow: state.currentRow,
      gameStatus: state.gameStatus,
      keyboardState: state.keyboardState,
    };
    localStorage.setItem(`pokedle-${todayKey}`, JSON.stringify(stateToSave));
  }, [state]);

  // Clear reveal state after animation
  useEffect(() => {
    if (state.revealingRow !== null) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_REVEALING', row: null });
      }, 1500); // 5 tiles * 200ms delay + 500ms animation
      return () => clearTimeout(timer);
    }
  }, [state.revealingRow]);

  // Clear shake state after animation
  useEffect(() => {
    if (state.shakeRow !== null) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_SHAKE', row: null });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.shakeRow]);

  const handleKey = useCallback((key: string) => {
    if (key === 'ENTER') {
      if (state.currentGuess.length !== WORD_LENGTH) {
        dispatch({ type: 'SET_SHAKE', row: state.currentRow });
        return 'Not enough letters';
      }
      // Check if it's a valid word (real English word or Pokemon name)
      const isPokemonName = POKEMON_LIST.some(p => p.name === state.currentGuess);
      if (!isPokemonName && !isValidWord(state.currentGuess)) {
        dispatch({ type: 'SET_SHAKE', row: state.currentRow });
        return 'Not a valid word';
      }
      dispatch({ type: 'SUBMIT_GUESS' });
    } else if (key === 'BACK' || key === 'BACKSPACE') {
      dispatch({ type: 'DELETE_LETTER' });
    } else if (/^[A-Z]$/.test(key)) {
      dispatch({ type: 'ADD_LETTER', letter: key });
    }
    return null;
  }, [state.currentGuess.length, state.currentRow, state.currentGuess]);

  return {
    state,
    handleKey,
  };
}
