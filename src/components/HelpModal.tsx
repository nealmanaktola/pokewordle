import './HelpModal.css';

export function HelpModal() {
  return (
    <div className="help-content">
      <h2>How To Play</h2>
      <p>Guess the Pokemon in 6 tries!</p>

      <div className="help-section">
        <p>Each guess must be a valid English word or Pokemon name. The number of tiles shows how many letters are in the answer.</p>
        <p>After each guess, the color of the tiles will change to show how close your guess was.</p>
      </div>

      <div className="help-examples">
        <h3>Examples</h3>

        <div className="example-row">
          <div className="example-tile correct">P</div>
          <div className="example-tile">I</div>
          <div className="example-tile">K</div>
          <div className="example-tile">A</div>
          <div className="example-tile">C</div>
          <div className="example-tile">H</div>
          <div className="example-tile">U</div>
        </div>
        <p><strong>P</strong> is in the word and in the correct spot.</p>

        <div className="example-row">
          <div className="example-tile">C</div>
          <div className="example-tile">H</div>
          <div className="example-tile present">A</div>
          <div className="example-tile">R</div>
        </div>
        <p><strong>A</strong> is in the word but in the wrong spot.</p>

        <div className="example-row">
          <div className="example-tile">M</div>
          <div className="example-tile">E</div>
          <div className="example-tile absent">W</div>
        </div>
        <p><strong>W</strong> is not in the word in any spot.</p>
      </div>

      <div className="help-section">
        <p><strong>Daily:</strong> A new Pokemon appears every day!</p>
        <p><strong>Unlimited:</strong> Play as many times as you want with random Pokemon.</p>
      </div>
    </div>
  );
}
