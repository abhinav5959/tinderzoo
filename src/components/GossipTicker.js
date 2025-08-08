import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gossipHeadlines } from '../data/gossip';

const GossipTicker = () => {
  const [currentGossip, setCurrentGossip] = useState('');

  useEffect(() => {
    const updateGossip = () => {
      const randomGossip = gossipHeadlines[Math.floor(Math.random() * gossipHeadlines.length)];
      setCurrentGossip(randomGossip);
    };

    // Set initial gossip
    updateGossip();

    // Update gossip every 5 seconds
    const interval = setInterval(updateGossip, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="gossip-ticker">
      <motion.div
        className="gossip-text"
        animate={{ x: [-100, -2000] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        📰 BREAKING: {currentGossip} 🦁
      </motion.div>
    </div>
  );
};

export default GossipTicker;
