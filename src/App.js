import React, { useState } from 'react';
import { animals } from './data/animals';

function App() {
  const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
  const currentAnimal = animals[currentAnimalIndex];

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      alert(`You liked ${currentAnimal.name}! ❤️`);
    } else {
      alert(`You passed on ${currentAnimal.name}! ❌`);
    }
    setCurrentAnimalIndex((prev) => (prev + 1) % animals.length);
  };

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <h1 className="title">
          TindrZoo Xtreme 🦁
        </h1>
        <p className="subtitle">
          Swipe animals, find love, create chaos! 💕
        </p>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="card-container">
          {/* Animal Card */}
          <div className="animal-card">
            {/* Animal Image */}
            <div className="animal-image">
              <img
                src={currentAnimal.image}
                alt={currentAnimal.name}
              />
              <div className="habitat-badge">
                <span>🏠</span>
                <span>Domestic</span>
              </div>
            </div>

            {/* Animal Info */}
            <div className="animal-info">
              <h2 className="animal-name">
                {currentAnimal.name}
              </h2>
              
              <p className="animal-bio">
                {currentAnimal.bio}
              </p>

              {/* Fake NatGeo Fact */}
              <div className="fact-box">
                <p className="fact-text">
                  <span className="fact-label">NatGeo but Wrong:</span> {currentAnimal.fakeFact}
                </p>
              </div>
            </div>
          </div>

          {/* Swipe Buttons */}
          <div className="swipe-buttons">
            <button
              onClick={() => handleSwipe('left')}
              className="swipe-button left"
            >
              ❌
            </button>

            <button
              onClick={() => handleSwipe('right')}
              className="swipe-button right"
            >
              ❤️
            </button>
          </div>

          {/* Instructions */}
          <div className="instructions">
            <p>Click the buttons to like or pass on animals!</p>
            <p className="animal-counter">
              Animal {currentAnimalIndex + 1} of {animals.length}
            </p>
          </div>
        </div>
      </div>

      {/* Gossip Ticker */}
      <div className="gossip-ticker">
        <div className="gossip-text">
          📰 BREAKING: {currentAnimal.name} was spotted at the local zoo! 🦁
        </div>
      </div>
    </div>
  );
}

export default App;
