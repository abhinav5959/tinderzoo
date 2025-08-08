import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UndoFeature = ({ onUndo, onClose, lastSwipedAnimal, swipeDirection }) => {
  const [undosRemaining, setUndosRemaining] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds to undo

  useEffect(() => {
    // Load remaining undos from localStorage
    const saved = JSON.parse(localStorage.getItem('undosRemaining') || '3');
    setUndosRemaining(saved);

    // Countdown timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  const handleUndo = () => {
    if (undosRemaining <= 0) {
      alert('You have no undos remaining! Get more tomorrow.');
      return;
    }

    setIsAnimating(true);

    // Animate the undo
    setTimeout(() => {
      // Update undos count
      const newCount = undosRemaining - 1;
      setUndosRemaining(newCount);
      localStorage.setItem('undosRemaining', newCount.toString());

      // Call the parent function
      onUndo();
      
      // Close the modal
      setTimeout(() => {
        onClose();
      }, 1000);
    }, 1500);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="undo-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="undo-container"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="undo-header">
          <h2>↩️ Undo Last Swipe</h2>
          <button onClick={onClose} className="close-undo-btn">✕</button>
        </div>

        {/* Timer */}
        <div className="undo-timer">
          <div className="timer-circle">
            <span className="timer-text">{formatTime(timeRemaining)}</span>
            <span className="timer-label">Time remaining</span>
          </div>
        </div>

        {/* Last Swiped Animal */}
        {lastSwipedAnimal && (
          <div className="last-swiped">
            <h3>Last swiped:</h3>
            <div className="animal-card">
              <img src={lastSwipedAnimal.image} alt={lastSwipedAnimal.name} className="animal-image" />
              <div className="animal-info">
                <h4>{lastSwipedAnimal.name}</h4>
                <p>{lastSwipedAnimal.bio}</p>
                <span className={`swipe-direction ${swipeDirection}`}>
                  {swipeDirection === 'right' ? '❤️ Liked' : '❌ Passed'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Undos Remaining */}
        <div className="undos-remaining">
          <span className="remaining-count">{undosRemaining}</span>
          <span className="remaining-text">Undos remaining today</span>
        </div>

        {/* Undo Animation */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              className="undo-animation"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1.5 }}
            >
              <div className="undo-icon">↩️</div>
              <h2>UNDO COMPLETE!</h2>
              <p>You can swipe again</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        {!isAnimating && (
          <div className="undo-actions">
            <button onClick={onClose} className="cancel-btn">
              Let it go
            </button>
            <button
              onClick={handleUndo}
              disabled={undosRemaining <= 0}
              className="undo-btn"
            >
              ↩️ Undo Swipe
            </button>
          </div>
        )}

        {/* Info */}
        <div className="undo-info">
          <p>💡 You can undo your last swipe within 30 seconds</p>
          <p>🕐 You get 3 undos per day</p>
          <p>⚠️ Undoing will bring back the last animal you swiped</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UndoFeature;
