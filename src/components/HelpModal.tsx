import './HelpModal.css';

export function HelpModal() {
  return (
    <div className="help-content">
      <h2>How To Play</h2>
      <p>Guess the Pokemon in 6 tries!</p>

      <div className="help-section">
        <p>Each guess must be a 5-letter word. Hit the enter button to submit.</p>
        <p>After each guess, the color of the tiles will change to show how close your guess was.</p>
      </div>

      <div className="help-examples">
        <h3>Examples</h3>

        <div className="example-row">
          <div className="example-tile correct">E</div>
          <div className="example-tile">E</div>
          <div className="example-tile">V</div>
          <div className="example-tile">E</div>
          <div className="example-tile">E</div>
        </div>
        <p><strong>E</strong> is in the word and in the correct spot.</p>

        <div className="example-row">
          <div className="example-tile">D</div>
          <div className="example-tile present">I</div>
          <div className="example-tile">T</div>
          <div className="example-tile">T</div>
          <div className="example-tile">O</div>
        </div>
        <p><strong>I</strong> is in the word but in the wrong spot.</p>

        <div className="example-row">
          <div className="example-tile">Z</div>
          <div className="example-tile">U</div>
          <div className="example-tile">B</div>
          <div className="example-tile absent">A</div>
          <div className="example-tile">T</div>
        </div>
        <p><strong>A</strong> is not in the word in any spot.</p>
      </div>

      <div className="help-section">
        <p>A new Pokemon appears every day!</p>
      </div>
    </div>
  );
}
