import type { GameMode } from '../types';
import { getArtwork } from '../data/pokemon';
import './PokemonReveal.css';

interface PokemonRevealProps {
  id: number;
  name: string;
  isVictory: boolean;
  guessCount: number;
  onShare: () => void;
  mode: GameMode;
  onPlayAgain: () => void;
}

export function PokemonReveal({ id, name, isVictory, guessCount, onShare, mode, onPlayAgain }: PokemonRevealProps) {
  return (
    <div className="pokemon-reveal">
      <div className={`pokemon-image ${isVictory ? 'victory' : 'defeat'}`}>
        <img src={getArtwork(id)} alt={name} />
      </div>

      <h2 className="pokemon-name">{name}</h2>

      {isVictory ? (
        <p className="result-message">
          You caught it in {guessCount} {guessCount === 1 ? 'try' : 'tries'}!
        </p>
      ) : (
        <p className="result-message">
          The Pokemon got away...
        </p>
      )}

      <div className="reveal-buttons">
        <button className="share-btn" onClick={onShare}>
          Share Result
        </button>
        {mode === 'unlimited' && (
          <button className="play-again-btn" onClick={onPlayAgain}>
            Play Again
          </button>
        )}
      </div>
    </div>
  );
}
