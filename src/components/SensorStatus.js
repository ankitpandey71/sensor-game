import React from 'react';
import './SensorStatus.css';

const SensorStatus = ({ sensorSupported, sensorData }) => {
  return (
    <div className="sensor-status">
      <h3>Sensor Status</h3>
      <div className="status-grid">
        <div className="status-item">
          <span className="label">Device Support:</span>
          <span className={`badge ${sensorSupported ? 'supported' : 'unsupported'}`}>
            {sensorSupported ? '✓ Yes' : '✗ No'}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Alpha (Z-axis):</span>
          <span className="value">{sensorData.alpha}°</span>
        </div>
        <div className="status-item">
          <span className="label">Beta (X-axis):</span>
          <span className="value">{sensorData.beta}°</span>
        </div>
        <div className="status-item">
          <span className="label">Gamma (Y-axis):</span>
          <span className="value">{sensorData.gamma}°</span>
        </div>
      </div>
    </div>
  );
};

export default SensorStatus;
