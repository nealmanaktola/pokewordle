import { POKEMON_LIST, type Pokemon } from '../data/pokemon';

const EPOCH = new Date('2024-01-01').getTime();
const MS_PER_DAY = 86400000;

export function getDailyPokemon(): Pokemon {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayNumber = Math.floor((today.getTime() - EPOCH) / MS_PER_DAY);
  return POKEMON_LIST[dayNumber % POKEMON_LIST.length];
}

export function getPuzzleNumber(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - EPOCH) / MS_PER_DAY) + 1;
}

export function getTodayKey(): string {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

export function getRandomPokemon(): Pokemon {
  const index = Math.floor(Math.random() * POKEMON_LIST.length);
  return POKEMON_LIST[index];
}
