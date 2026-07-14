import React from 'react';
import './Obstacle.css';

const Obstacle = ({ x, y }) => {
  return (
    <div className="obstacle" style={{ left: `${x}px`, top: `${y}px` }}>
      <div className="obstacle-body">⚠️</div>
    </div>
  );
};

export default Obstacle;
