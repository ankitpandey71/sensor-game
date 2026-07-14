import React, { useState, useEffect, useRef } from 'react';
import './Game.css';
import Player from './Player';
import Obstacle from './Obstacle';
import Collectible from './Collectible';

const Game = ({ sensorData, onQuit }) => {
  const canvasRef = useRef(null);
  const [playerPos, setPlayerPos] = useState({ x: 350, y: 500 });
  const [obstacles, setObstacles] = useState([]);
  const [collectibles, setCollectibles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStartTime] = useState(Date.now());

  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;
  const PLAYER_WIDTH = 40;
  const PLAYER_HEIGHT = 40;
  const OBSTACLE_WIDTH = 50;
  const OBSTACLE_HEIGHT = 50;
  const COLLECTIBLE_SIZE = 20;

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      const step = 20;
      setPlayerPos((prev) => {
        let newX = prev.x;
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          newX = Math.max(0, prev.x - step);
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          newX = Math.min(GAME_WIDTH - PLAYER_WIDTH, prev.x + step);
        }
        return { ...prev, x: newX };
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Handle sensor controls (tilt)
  useEffect(() => {
    const gamma = sensorData.gamma || 0; // Left-right tilt
    const sensitivity = 3; // Adjust for sensitivity
    
    setPlayerPos((prev) => {
      let newX = prev.x + gamma * sensitivity;
      newX = Math.max(0, Math.min(GAME_WIDTH - PLAYER_WIDTH, newX));
      return { ...prev, x: newX };
    });
  }, [sensorData.gamma]);

  // Generate obstacles
  useEffect(() => {
    if (gameOver) return;

    const obstacleInterval = setInterval(() => {
      const newObstacle = {
        id: Math.random(),
        x: Math.random() * (GAME_WIDTH - OBSTACLE_WIDTH),
        y: -OBSTACLE_HEIGHT,
        speed: 3 + Math.random() * 2,
      };
      setObstacles((prev) => [...prev, newObstacle]);
    }, 800);

    return () => clearInterval(obstacleInterval);
  }, [gameOver]);

  // Generate collectibles
  useEffect(() => {
    if (gameOver) return;

    const collectibleInterval = setInterval(() => {
      const newCollectible = {
        id: Math.random(),
        x: Math.random() * (GAME_WIDTH - COLLECTIBLE_SIZE),
        y: -COLLECTIBLE_SIZE,
        speed: 2,
      };
      setCollectibles((prev) => [...prev, newCollectible]);
    }, 2000);

    return () => clearInterval(collectibleInterval);
  }, [gameOver]);

  // Update game state
  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      // Update obstacles
      setObstacles((prev) => {
        const updated = prev.map((obs) => ({
          ...obs,
          y: obs.y + obs.speed,
        }));
        return updated.filter((obs) => obs.y < GAME_HEIGHT);
      });

      // Update collectibles
      setCollectibles((prev) => {
        const updated = prev.map((col) => ({
          ...col,
          y: col.y + col.speed,
        }));
        return updated.filter((col) => col.y < GAME_HEIGHT);
      });

      // Check collisions with obstacles
      obstacles.forEach((obs) => {
        if (
          playerPos.x < obs.x + OBSTACLE_WIDTH &&
          playerPos.x + PLAYER_WIDTH > obs.x &&
          playerPos.y < obs.y + OBSTACLE_HEIGHT &&
          playerPos.y + PLAYER_HEIGHT > obs.y
        ) {
          setGameOver(true);
        }
      });

      // Check collisions with collectibles
      setCollectibles((prev) => {
        return prev.filter((col) => {
          if (
            playerPos.x < col.x + COLLECTIBLE_SIZE &&
            playerPos.x + PLAYER_WIDTH > col.x &&
            playerPos.y < col.y + COLLECTIBLE_SIZE &&
            playerPos.y + PLAYER_HEIGHT > col.y
          ) {
            setScore((s) => s + 10);
            return false;
          }
          return true;
        });
      });
    }, 30);

    return () => clearInterval(gameLoop);
  }, [playerPos, obstacles, gameOver]);

  const elapsedSeconds = Math.floor((Date.now() - gameStartTime) / 1000);

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-stats">
          <div className="stat">
            <span className="label">Score:</span>
            <span className="value">{score}</span>
          </div>
          <div className="stat">
            <span className="label">Time:</span>
            <span className="value">{elapsedSeconds}s</span>
          </div>
        </div>
        <button className="quit-button" onClick={onQuit}>
          Exit Game
        </button>
      </div>

      <div className="game-canvas" ref={canvasRef}>
        {/* Background */}
        <div className="background"></div>

        {/* Player */}
        <Player x={playerPos.x} y={playerPos.y} />

        {/* Obstacles */}
        {obstacles.map((obs) => (
          <Obstacle key={obs.id} x={obs.x} y={obs.y} />
        ))}

        {/* Collectibles */}
        {collectibles.map((col) => (
          <Collectible key={col.id} x={col.x} y={col.y} />
        ))}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="game-over-overlay">
            <div className="game-over-card">
              <h2>Game Over! 💥</h2>
              <p>Final Score: <strong>{score}</strong></p>
              <p>Survived for: <strong>{elapsedSeconds}s</strong></p>
              <button className="restart-button" onClick={onQuit}>
                Back to Menu
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="sensor-info">
        <div className="tilt-indicator">
          <span>Tilt: {Math.round(sensorData.gamma)}°</span>
        </div>
      </div>
    </div>
  );
};

export default Game;
