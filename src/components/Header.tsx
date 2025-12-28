import './Header.css';

interface HeaderProps {
  onHelp: () => void;
}

export function Header({ onHelp }: HeaderProps) {
  return (
    <header className="header">
      <button className="header-btn" onClick={onHelp} aria-label="Help">
        ?
      </button>
      <h1 className="title">Pokedle</h1>
      <div className="header-spacer" />
    </header>
  );
}
