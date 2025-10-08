import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Link } from 'react-router-dom';
import './Owner.css';

const Owner = () => {
  const { gameActive, winner, reward, startGame } = useGame();
  const [secretNumber, setSecretNumber] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(secretNumber);
    const rew = parseFloat(rewardAmount);
    
    if (!isNaN(num) && !isNaN(rew) && num > 0 && rew > 0) {
      startGame(num, rew);
      setSecretNumber('');
      setRewardAmount('');
    }
  };

  return (
    <div className="page-container">
      <nav className="nav">
        <Link to="/" className="nav-link">← Home</Link>
        <Link to="/player" className="nav-link">Player View</Link>
      </nav>

      <div className="content">
        <header className="page-header">
          <h1>👑 Owner Panel</h1>
          <p>Set up the game and manage rewards</p>
        </header>

        {winner && (
          <div className="winner-banner">
            <h2>🎊 Winner! 🎊</h2>
            <p>Reward of {reward} ETH transferred to winner!</p>
          </div>
        )}

        <div className="panel">
          {!gameActive ? (
            <form onSubmit={handleSubmit} className="game-form">
              <h2>Start New Game</h2>
              <div className="form-group">
                <label htmlFor="secretNumber">Secret Number</label>
                <input
                  id="secretNumber"
                  type="number"
                  value={secretNumber}
                  onChange={(e) => setSecretNumber(e.target.value)}
                  placeholder="Enter secret number"
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reward">Reward (ETH)</label>
                <input
                  id="reward"
                  type="number"
                  step="0.001"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(e.target.value)}
                  placeholder="Enter reward amount"
                  min="0.001"
                  required
                />
              </div>
              <button type="submit" className="btn-primary">
                Start Game
              </button>
            </form>
          ) : (
            <div className="game-status">
              <h2>Game Active</h2>
              <div className="status-info">
                <div className="status-item">
                  <span className="status-label">Status</span>
                  <span className="status-value active">Live</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Reward Pool</span>
                  <span className="status-value">{reward} ETH</span>
                </div>
              </div>
              <p className="waiting-text">Waiting for players to guess...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Owner;
