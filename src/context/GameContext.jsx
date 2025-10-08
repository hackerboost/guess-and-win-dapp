import { createContext, useContext, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../lib";

const GameContext = createContext(undefined);

export const GameProvider = ({ children }) => {
  const [gameActive, setGameActive] = useState(false);
  const [secretNumber, setSecretNumber] = useState(null);
  const [reward, setReward] = useState(0);
  const [guessResult, setGuessResult] = useState(null);
  const [winner, setWinner] = useState(false);

  const initializeContract = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const gameContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const isActive = await gameContract.gameStatus();
      setGameActive(isActive);

      if (isActive) {
        const rewardAmount = await gameContract.rewardPool();
        setReward(ethers.formatEther(rewardAmount));
      }

      return gameContract;
    } else {
      console.error("Ethereum provider not found");
    }
  };

  const startGame = async (rewardInput, secretNumberInput) => {
    try {
      const contract = await initializeContract();
      if (!contract) return;

      const valueInWei = ethers.parseEther(rewardInput || "0");

      // Start the game and fund it
      const tx1 = await contract.startGame({ value: valueInWei });
      await tx1.wait();

      // Set the secret number
      const tx2 = await contract.setSecretNumber(secretNumberInput);
      await tx2.wait();

      // Update state
      setGameActive(true);

      const rewardAmount = await contract.rewardPool();
      setReward(ethers.formatEther(rewardAmount));

      setGuessResult(null);
      setWinner(false);
    } catch (err) {
      console.error("Error starting game:", err);
      const reason = err?.info?.error?.message || err?.message;
      console.error("Revert reason:", reason);
    }
  };

  const endGame = async () => {
    if (!activeContract) {
      console.error("Contract not initialized");
      return;
    }

    const res = await activeContract.endGame();
    if (!res) {
      console.error("Failed to stop game on contract");
      return;
    }

    setGameActive(false);
    setSecretNumber(null);
    setReward(0);
    setGuessResult(null);
    setWinner(false);
  };

  // Make a guess
  const makeGuess = async (guess) => {
  if (!gameActive) return;

  const activeContract = await initializeContract();
  if (!activeContract) {
    console.error("Contract not initialized");
    return;
  }

  try {
    const tx = await activeContract.guessNumber(guess);
    const receipt = await tx.wait(); // Wait for the transaction to be mined

    // Check for events in the transaction receipt
    const winnerEvent = receipt.logs
      .map((log) => {
        try {
          return activeContract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .filter((log) => log && log.name === "Winner")[0];

    const wrongGuessEvent = receipt.logs
      .map((log) => {
        try {
          return activeContract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .filter((log) => log && log.name === "WrongGuess")[0];

    // Update UI state
    if (winnerEvent) {
      setWinner(true);
      setGameActive(false);
      setGuessResult("correct");

      const rewardAmount = await activeContract.rewardPool();
      setReward(ethers.formatEther(rewardAmount));
    } else if (wrongGuessEvent) {
      setGuessResult("incorrect, try again");
    }

  } catch (error) {
    console.error("Error making guess:", error);
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
        endGame,
        initializeContract,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
};
