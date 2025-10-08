import { Link } from 'react-router-dom';
import './Index.css';

const Index = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <header className="home-header">
          <h1>🎲 Guess a Number</h1>
          <p>A simple gaming platform where you can win rewards by guessing the right number</p>
        </header>

        <div className="role-cards">
          <Link to="/owner" className="role-card">
            <div className="role-icon">👑</div>
            <h2>Game Owner</h2>
            <p>Set up games and manage rewards</p>
            <span className="role-action">Enter as Owner →</span>
          </Link>

          <Link to="/player" className="role-card">
            <div className="role-icon">🎮</div>
            <h2>Player</h2>
            <p>Guess the number and win rewards</p>
            <span className="role-action">Play Now →</span>
          </Link>
        </div>

        <div className="how-it-works">
          <h3>How It Works</h3>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <p>Owner sets a secret number and reward amount</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <p>Players submit their guesses</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <p>Winner gets the entire reward pool</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
