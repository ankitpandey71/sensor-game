import React from 'react';
import './Player.css';

const Player = ({ x, y }) => {
  return (
    <div className="player" style={{ left: `${x}px`, top: `${y}px` }}>
      <div className="player-body">🚀</div>
    </div>
  );
};

export default Player;
