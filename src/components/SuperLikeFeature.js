import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SuperLikeFeature = ({ animal, onSuperLike, onClose }) => {
  const [superLikesRemaining, setSuperLikesRemaining] = useState(5);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState('');

  const superLikeMessages = [
    "You're absolutely amazing! ⭐",
    "I can't stop thinking about you! 💫",
    "You're the one I've been waiting for! ✨",
    "Let's make this happen! 🚀",
    "You're my perfect match! 💖",
    "I'm super into you! 🔥",
    "You're incredible! 🌟",
    "Let's create something special! 💫"
  ];

  useEffect(() => {
    // Load remaining super likes from localStorage
    const saved = JSON.parse(localStorage.getItem('superLikesRemaining') || '5');
    setSuperLikesRemaining(saved);
  }, []);

  const handleSuperLike = () => {
    if (superLikesRemaining <= 0) {
      alert('You have no super likes remaining! Get more tomorrow.');
      return;
    }

    if (!selectedMessage) {
      alert('Please select a message to send with your super like!');
      return;
    }

    setIsAnimating(true);

    // Animate the super like
    setTimeout(() => {
      // Update super likes count
      const newCount = superLikesRemaining - 1;
      setSuperLikesRemaining(newCount);
      localStorage.setItem('superLikesRemaining', newCount.toString());

      // Call the parent function
      onSuperLike(animal, selectedMessage);
      
      // Close the modal
      setTimeout(() => {
        onClose();
      }, 1000);
    }, 2000);
  };

  const handleMessageSelect = (message) => {
    setSelectedMessage(message);
  };

  return (
    <motion.div
      className="superlike-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="superlike-container"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="superlike-header">
          <h2>⭐ Super Like {animal.name}!</h2>
          <button onClick={onClose} className="close-superlike-btn">✕</button>
        </div>

        {/* Animal Info */}
        <div className="animal-preview">
          <img src={animal.image} alt={animal.name} className="animal-image" />
          <h3>{animal.name}</h3>
          <p>{animal.bio}</p>
        </div>

        {/* Super Likes Remaining */}
        <div className="superlikes-remaining">
          <span className="remaining-count">{superLikesRemaining}</span>
          <span className="remaining-text">Super Likes remaining today</span>
        </div>

        {/* Message Selection */}
        <div className="message-selection">
          <h3>💬 Choose your message:</h3>
          <div className="message-grid">
            {superLikeMessages.map((message, index) => (
              <button
                key={index}
                onClick={() => handleMessageSelect(message)}
                className={`message-option ${selectedMessage === message ? 'selected' : ''}`}
              >
                {message}
              </button>
            ))}
          </div>
        </div>

        {/* Super Like Animation */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              className="superlike-animation"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 2 }}
            >
              <div className="superlike-stars">
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
              </div>
              <h2>SUPER LIKE SENT!</h2>
              <p>{selectedMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        {!isAnimating && (
          <div className="superlike-actions">
            <button onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button
              onClick={handleSuperLike}
              disabled={superLikesRemaining <= 0 || !selectedMessage}
              className="superlike-btn"
            >
              ⭐ Send Super Like
            </button>
          </div>
        )}

        {/* Info */}
        <div className="superlike-info">
          <p>💡 Super Likes are 3x more likely to get a match!</p>
          <p>🕐 You get 5 Super Likes per day</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SuperLikeFeature;
