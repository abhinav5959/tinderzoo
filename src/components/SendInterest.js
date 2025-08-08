import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SendInterest = ({ animal, onInterestSent, onClose, isVisible }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [interestSent, setInterestSent] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const interestMessages = [
    "Send a Tail Wag 🐕",
    "Paw Wave 🐾", 
    "Sniff Hello 🐶",
    "Meow Wave 🐱",
    "Throw a Bone 🦴",
    "Send a Purr 🐈",
    "Wag Your Tail 🐕",
    "Give a Paw 🐾"
  ];

  const [selectedMessage, setSelectedMessage] = useState(interestMessages[0]);

  const handleSendInterest = () => {
    if (cooldown) return;

    setCooldown(true);
    setShowAnimation(true);
    setInterestSent(true);

    // Save interest to localStorage
    const interests = JSON.parse(localStorage.getItem('sentInterests') || '[]');
    const newInterest = {
      id: Date.now(),
      fromPet: JSON.parse(localStorage.getItem('activePetProfile') || '{}'),
      toPet: animal,
      message: selectedMessage,
      timestamp: new Date().toISOString(),
      status: 'pending' // pending, accepted, ignored
    };
    
    interests.push(newInterest);
    localStorage.setItem('sentInterests', JSON.stringify(interests));

    // Check if the other pet has also sent interest
    const receivedInterests = JSON.parse(localStorage.getItem('receivedInterests') || '[]');
    const mutualInterest = receivedInterests.find(interest => 
      interest.fromPet.id === animal.id && 
      interest.toPet.id === newInterest.fromPet.id
    );

    if (mutualInterest) {
      // Auto match!
      setTimeout(() => {
        onInterestSent(newInterest, true); // true = auto match
      }, 2000);
    } else {
      // Save as received interest for the other pet
      const receivedInterest = {
        ...newInterest,
        id: Date.now() + 1,
        fromPet: animal,
        toPet: newInterest.fromPet
      };
      receivedInterests.push(receivedInterest);
      localStorage.setItem('receivedInterests', JSON.stringify(receivedInterests));

      setTimeout(() => {
        onInterestSent(newInterest, false); // false = no auto match
      }, 2000);
    }

    // Reset cooldown after 5 seconds
    setTimeout(() => {
      setCooldown(false);
    }, 5000);
  };

  const handleClose = () => {
    setShowAnimation(false);
    setInterestSent(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="send-interest-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="send-interest-container"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="interest-header">
            <h2>🐾 Send Interest to {animal.name}</h2>
            <button className="close-interest-btn" onClick={handleClose}>
              ✕
            </button>
          </div>

          <div className="animal-preview">
            <div className="animal-image">
              <img src={animal.image} alt={animal.name} />
            </div>
            <div className="animal-info">
              <h3>{animal.name}</h3>
              <p>{animal.species} • {animal.age || 'Age not specified'}</p>
              <p className="animal-bio">{animal.bio}</p>
            </div>
          </div>

          <div className="interest-message-section">
            <h3>Choose your message:</h3>
            <div className="message-options">
              {interestMessages.map((message, index) => (
                <button
                  key={index}
                  className={`message-option ${selectedMessage === message ? 'selected' : ''}`}
                  onClick={() => setSelectedMessage(message)}
                >
                  {message}
                </button>
              ))}
            </div>
          </div>

          <div className="interest-actions">
            <button 
              className={`send-interest-btn ${cooldown ? 'disabled' : ''}`}
              onClick={handleSendInterest}
              disabled={cooldown}
            >
              {cooldown ? '⏳ Wait 5s...' : selectedMessage}
            </button>
            <button className="cancel-btn" onClick={handleClose}>
              Cancel
            </button>
          </div>

          <div className="interest-info">
            <p>💡 Sending interest increases your chances of matching!</p>
            <p>🔄 If they send interest back, it's an instant match!</p>
          </div>
        </motion.div>

        {/* Animation Overlay */}
        <AnimatePresence>
          {showAnimation && (
            <motion.div 
              className="interest-animation-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="animation-container">
                <motion.div 
                  className="paw-print"
                  initial={{ x: -100, y: 100, scale: 0 }}
                  animate={{ 
                    x: [0, 50, 100, 150, 200],
                    y: [0, -50, 0, -50, 0],
                    scale: [1, 1.2, 1, 1.2, 1],
                    rotate: [0, 15, 0, -15, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    ease: "easeInOut"
                  }}
                >
                  🐾
                </motion.div>
                
                <motion.div 
                  className="heart-particles"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="heart-particle"
                      initial={{ 
                        x: 0, 
                        y: 0, 
                        scale: 0,
                        opacity: 0 
                      }}
                      animate={{ 
                        x: Math.cos(i * 60) * 100,
                        y: Math.sin(i * 60) * 100,
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ 
                        duration: 1.5,
                        delay: i * 0.1,
                        ease: "easeOut"
                      }}
                    >
                      ❤️
                    </motion.span>
                  ))}
                </motion.div>

                <motion.h2 
                  className="success-message"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  Interest Sent! 🐾
                </motion.h2>
                
                <motion.p 
                  className="success-subtitle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  Let's hope they wag back! 🐕
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default SendInterest;
