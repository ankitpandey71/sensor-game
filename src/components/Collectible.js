import React from 'react';
import './Collectible.css';

const Collectible = ({ x, y }) => {
  return (
    <div className="collectible" style={{ left: `${x}px`, top: `${y}px` }}>
      ⭐
    </div>
  );
};

export default Collectible;
