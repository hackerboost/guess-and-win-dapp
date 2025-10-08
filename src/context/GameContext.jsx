import { createContext, useContext, useState, ReactNode } from 'react';

const GameContext = createContext(undefined);

export const GameProvider = ({ children }) => {
  const [gameActive, setGameActive] = useState(false);
  const [secretNumber, setSecretNumber] = useState(null);
  const [reward, setReward] = useState(0);
  const [guessResult, setGuessResult] = useState(null);
  const [winner, setWinner] = useState(false);

  const startGame = (secret, rewardAmount) => {
    setSecretNumber(secret);
    setReward(rewardAmount);
    setGameActive(true);
    setGuessResult(null);
    setWinner(false);
  };

  const makeGuess = (guess) => {
    if (secretNumber === null) return;

    if (guess === secretNumber) {
      setGuessResult('correct');
      setWinner(true);
      setGameActive(false);
    } else if (guess > secretNumber) {
      setGuessResult('too-high');
    } else {
      setGuessResult('too-low');
    }
  };

  const resetGuessResult = () => {
    setGuessResult(null);
  };

  return (
    <GameContext.Provider
      value={{
        gameActive,
        secretNumber,
        reward,
        guessResult,
        winner,
        startGame,
        makeGuess,
        resetGuessResult,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
