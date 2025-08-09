import React from 'react';
import { motion } from 'framer-motion';

const ProfileCard = ({ animal, onSwipe, onSendInterest, onCardClick }) => {
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 100;
    if (info.offset.x > swipeThreshold) {
      onSwipe('right');
    } else if (info.offset.x < -swipeThreshold) {
      onSwipe('left');
    }
  };

  const handleInterestClick = (e) => {
    e.stopPropagation();
    onSendInterest(animal);
  };

  const handleCardClick = (e) => {
    // Only trigger if it's a click, not a drag
    if (Math.abs(e.movementX) < 10 && Math.abs(e.movementY) < 10) {
      onCardClick(animal);
    }
  };

  return (
    <motion.div
      className="animal-card"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      onClick={handleCardClick}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      {/* Background Image - Full Card */}
      <img
        src={animal.image}
        alt={animal.name}
        loading="lazy"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
          borderRadius: 'inherit',
          zIndex: 1
        }}
      />

      {/* Habitat Badge */}
      <div className="habitat-badge" style={{ zIndex: 3 }}>
        <span>🏠</span>
        <span>{animal.habitat}</span>
      </div>
      
      {/* Interest Button */}
      <button 
        className="interest-btn"
        onClick={handleInterestClick}
        title="Send Interest"
        style={{ zIndex: 3 }}
      >
        🐾
      </button>

      {/* Animal Info Overlay */}
      <div className="animal-info" style={{ zIndex: 2 }}>
        <h2 className="animal-name">
          {animal.name}
        </h2>
        
        <p className="animal-bio">
          {animal.bio}
        </p>

        {/* Fake NatGeo Fact */}
        <div className="fact-box">
          <p className="fact-text">
            <span className="fact-label">NatGeo but Wrong:</span> {animal.fakeFact}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;

