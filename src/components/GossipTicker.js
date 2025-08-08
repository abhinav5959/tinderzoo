import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gossipHeadlines } from '../data/gossip';

const GossipTicker = () => {
  const [currentHeadline, setCurrentHeadline] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % gossipHeadlines.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white py-3 overflow-hidden">
      <motion.div
        className="whitespace-nowrap text-lg font-medium"
        animate={{ x: [-100, -2000] }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <span className="mr-8">📰 BREAKING: </span>
        <span className="mr-8">{gossipHeadlines[currentHeadline]}</span>
        <span className="mr-8">📰 BREAKING: </span>
        <span className="mr-8">{gossipHeadlines[currentHeadline]}</span>
        <span className="mr-8">📰 BREAKING: </span>
        <span className="mr-8">{gossipHeadlines[currentHeadline]}</span>
      </motion.div>
    </div>
  );
};

export default GossipTicker;
