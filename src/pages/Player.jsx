import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Link } from 'react-router-dom';
import './Player.css';

const Player = () => {
  const { gameActive, reward, guessResult, winner, makeGuess, resetGuessResult } = useGame();
  const [guess, setGuess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(guess);
    
    if (!isNaN(num) && num > 0) {
      makeGuess(num);
      setGuess('');
    }
  };

  return (
    <div className="page-container">
      <nav className="nav">
        <Link to="/" className="nav-link">← Home</Link>
        <Link to="/owner" className="nav-link">Owner View</Link>
      </nav>

      <div className="content">
        <header className="page-header">
          <h1>🎮 Player Panel</h1>
          <p>Guess the number and win the reward</p>
        </header>

        {winner && (
          <div className="winner-banner">
            <h2>🎊 You Won! 🎊</h2>
            <p>Congratulations! Reward of {reward} ETH is yours!</p>
          </div>
        )}

        <div className="panel">
          {gameActive ? (
            <>
              <div className="reward-display">
                <span className="reward-label">Reward Pool</span>
                <span className="reward-amount">{reward} ETH</span>
              </div>
              
              <form onSubmit={handleSubmit} className="guess-form">
                <div className="form-group">
                  <label htmlFor="guess">Your Guess</label>
                  <input
                    id="guess"
                    type="number"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Enter your guess"
                    min="1"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Submit Guess
                </button>
              </form>

              {guessResult && guessResult !== 'correct' && (
                <div className={`guess-feedback ${guessResult}`}>
                  {guessResult === 'too-high' && '⬇️ Too high, try a lower number'}
                  {guessResult === 'too-low' && '⬆️ Too low, try a higher number'}
                </div>
              )}
            </>
          ) : (
            <div className="no-game">
              <div className="no-game-icon">🎲</div>
              <h2>No Active Game</h2>
              <p>Waiting for the owner to start a new game...</p>
              <p className="hint">Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;
