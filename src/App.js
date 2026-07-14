import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Game from './components/Game';
import SensorStatus from './components/SensorStatus';

function App() {
  const [sensorData, setSensorData] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
    accelerationX: 0,
    accelerationY: 0,
    accelerationZ: 0,
  });
  const [sensorSupported, setSensorSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    // Check if device motion API is supported
    const checkSensorSupport = () => {
      if (window.DeviceOrientationEvent && window.DeviceMotionEvent) {
        setSensorSupported(true);
      }
    };

    checkSensorSupport();

    // Request permission for iOS 13+
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ requires user permission
      console.log('iOS 13+ detected - permission required');
    } else {
      // Non-iOS or older iOS
      setPermissionGranted(true);
    }
  }, []);

  const handlePermissionRequest = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          setupSensorListeners();
        }
      } catch (error) {
        console.error('Permission denied:', error);
        alert('Sensor permission denied. Using fallback controls.');
        setPermissionGranted(true); // Allow game with keyboard fallback
      }
    } else {
      setPermissionGranted(true);
      setupSensorListeners();
    }
  };

  const setupSensorListeners = () => {
    // Device Orientation listener
    window.addEventListener('deviceorientation', (event) => {
      setSensorData((prev) => ({
        ...prev,
        alpha: Math.round(event.alpha),
        beta: Math.round(event.beta),
        gamma: Math.round(event.gamma),
      }));
    });

    // Device Motion listener
    window.addEventListener('devicemotion', (event) => {
      setSensorData((prev) => ({
        ...prev,
        accelerationX: event.acceleration?.x || 0,
        accelerationY: event.acceleration?.y || 0,
        accelerationZ: event.acceleration?.z || 0,
      }));
    });
  };

  const handleStartGame = () => {
    if (!permissionGranted) {
      handlePermissionRequest();
    } else {
      setGameStarted(true);
    }
  };

  return (
    <div className="App">
      <div className="container">
        {!gameStarted ? (
          <div className="welcome-screen">
            <h1>🎮 Sensor Game</h1>
            <p>Control the game using your mobile device sensors!</p>
            
            <SensorStatus sensorSupported={sensorSupported} sensorData={sensorData} />
            
            <div className="instructions">
              <h2>How to Play:</h2>
              <ul>
                <li>📱 Tilt your device left/right to move the player</li>
                <li>🎯 Avoid red obstacles</li>
                <li>💫 Collect yellow stars to gain points</li>
                <li>⌨️ Use Arrow keys or WASD if sensors don't work</li>
                <li>📊 Try to get the highest score!</li>
              </ul>
            </div>

            {sensorSupported ? (
              <button className="start-button" onClick={handleStartGame}>
                {permissionGranted ? '🚀 Start Game' : '📱 Grant Sensor Permission'}
              </button>
            ) : (
              <div className="warning">
                ⚠️ Sensors not supported on this device.
                <br />
                Using keyboard controls instead.
                <button className="start-button" onClick={() => setGameStarted(true)}>
                  🚀 Start Game (Keyboard)
                </button>
              </div>
            )}
          </div>
        ) : (
          <Game sensorData={sensorData} onQuit={() => setGameStarted(false)} />
        )}
      </div>
    </div>
  );
}

export default App;
