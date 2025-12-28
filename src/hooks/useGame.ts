import { useReducer, useCallback, useEffect, useRef } from 'react';
import type { GameState, GameAction, TileData, GameMode } from '../types';
import { evaluateGuess, createInitialGuesses, updateKeyboardState } from '../utils/gameLogic';
import { getDailyPokemon, getTodayKey, getRandomPokemon } from '../utils/dailyPokemon';
import { isValidWord } from '../data/words';
import { POKEMON_LIST } from '../data/pokemon';

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

function loadSavedState(): GameState | null {
  const todayKey = getTodayKey();
  const savedState = localStorage.getItem(`pokewordle-${todayKey}`);
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      const currentPokemon = getDailyPokemon();
      if (parsed.solution === currentPokemon.name) {
        return {
          ...parsed,
          revealingRow: null,
          shakeRow: null,
        };
      }
    } catch {
      // Ignore invalid saved state
    }
  }
  return null;
}

function createInitialState(mode: GameMode): GameState {
  // For daily mode, try to load saved state first
  if (mode === 'daily') {
    const saved = loadSavedState();
    if (saved) {
      return saved;
    }
  }

  // Get Pokemon based on mode
  const pokemon = mode === 'daily' ? getDailyPokemon() : getRandomPokemon();

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

    case 'RESET_GAME': {
      return {
        solution: action.pokemon.name,
        solutionId: action.pokemon.id,
        guesses: createInitialGuesses(),
        currentGuess: '',
        currentRow: 0,
        gameStatus: 'playing',
        keyboardState: {},
        revealingRow: null,
        shakeRow: null,
      };
    }

    default:
      return state;
  }
}

export function useGame(mode: GameMode) {
  const [state, dispatch] = useReducer(
    gameReducer,
    mode,
    (m) => createInitialState(m)
  );
  const isFirstRender = useRef(true);
  const prevMode = useRef(mode);

  // Reset game when mode changes
  useEffect(() => {
    if (prevMode.current !== mode) {
      prevMode.current = mode;
      const pokemon = mode === 'daily' ? getDailyPokemon() : getRandomPokemon();
      dispatch({ type: 'RESET_GAME', pokemon });
    }
  }, [mode]);

  // Save state to localStorage (only for daily mode, skip first render)
  useEffect(() => {
    if (mode !== 'daily') return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

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
    localStorage.setItem(`pokewordle-${todayKey}`, JSON.stringify(stateToSave));
  }, [state, mode]);

  // Clear reveal state after animation
  useEffect(() => {
    if (state.revealingRow !== null) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_REVEALING', row: null });
      }, 1500);
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

  const resetGame = useCallback(() => {
    const pokemon = getRandomPokemon();
    dispatch({ type: 'RESET_GAME', pokemon });
  }, []);

  return {
    state,
    handleKey,
    resetGame,
  };
}
