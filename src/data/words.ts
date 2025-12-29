// Complete English word list (~275k words)
// Source: an-array-of-english-words npm package
import words from 'an-array-of-english-words';

// Convert to uppercase Set for fast lookup
export const VALID_WORDS = new Set(words.map((w: string) => w.toUpperCase()));

export function isValidWord(word: string): boolean {
  return VALID_WORDS.has(word.toUpperCase());
}
