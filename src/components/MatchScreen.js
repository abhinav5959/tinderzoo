import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hybridNames, hybridBios, hybridImages } from '../data/hybrids';

const MatchScreen = ({ animal1, animal2, onKeepSwiping, onGoOnDate }) => {
  const [hybrid, setHybrid] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    // Simulate hybrid generation (replace with Stable Diffusion API call)
    const generateHybrid = async () => {
      setIsGenerating(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const randomIndex = Math.floor(Math.random() * hybridNames.length);
      const newHybrid = {
        name: hybridNames[randomIndex],
        bio: hybridBios[randomIndex],
        image: hybridImages[randomIndex]
      };
      
      setHybrid(newHybrid);
      setIsGenerating(false);
    };

    generateHybrid();
  }, [animal1, animal2]);

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Match Animation */}
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <h1 className="text-4xl font-funny font-bold text-pink-600 mb-4">
            It's a Match! 🎉
          </h1>
          <div className="text-6xl mb-4">💕</div>
        </motion.div>

        {/* Matched Animals */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="text-center">
            <img
              src={animal1.image}
              alt={animal1.name}
              className="w-16 h-16 rounded-full object-cover border-4 border-pink-300"
            />
            <p className="text-sm font-medium mt-2">{animal1.name}</p>
          </div>
          <div className="text-center">
            <img
              src={animal2.image}
              alt={animal2.name}
              className="w-16 h-16 rounded-full object-cover border-4 border-pink-300"
            />
            <p className="text-sm font-medium mt-2">{animal2.name}</p>
          </div>
        </div>

        {/* Hybrid Animal */}
        <AnimatePresence>
          {isGenerating ? (
            <motion.div
              key="generating"
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-4xl mb-4">🧬</div>
              <p className="text-gray-600">Generating your hybrid baby...</p>
              <div className="mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="hybrid"
              className="text-center py-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-funny font-bold text-purple-600 mb-2">
                Meet {hybrid.name}!
              </h3>
              <img
                src={hybrid.image}
                alt={hybrid.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-purple-300"
              />
              <p className="text-sm text-gray-600 mb-6">{hybrid.bio}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onKeepSwiping}
            className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors"
          >
            Keep Swiping
          </button>
          <button
            onClick={onGoOnDate}
            disabled={isGenerating}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 transition-colors disabled:opacity-50"
          >
            Go on a Date! 💕
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchScreen;
