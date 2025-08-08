import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hybridNames, hybridBios, hybridImages } from '../data/hybrids';

const MatchScreen = ({ animal1, animal2, onKeepSwiping, onGoOnDate, onOpenChat }) => {
  const [hybridAnimal, setHybridAnimal] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    // Simulate hybrid generation (replace with Stable Diffusion API call)
    const generateHybrid = async () => {
      setIsGenerating(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const randomName = hybridNames[Math.floor(Math.random() * hybridNames.length)];
      const randomBio = hybridBios[Math.floor(Math.random() * hybridBios.length)];
      const randomImage = hybridImages[Math.floor(Math.random() * hybridImages.length)];
      
      setHybridAnimal({
        name: randomName,
        bio: randomBio,
        image: randomImage
      });
      
      setIsGenerating(false);
    };

    generateHybrid();
  }, [animal1, animal2]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Match Animation */}
          <motion.div
            className="text-6xl mb-4"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              repeatDelay: 2
            }}
          >
            🎉
          </motion.div>

          <h2 className="text-3xl font-funny font-bold text-gray-800 mb-2">
            It's a Match!
          </h2>
          
          <p className="text-gray-600 mb-6">
            {animal1.name} and {animal2.name} are now dating! 💕
          </p>

          {/* Hybrid Animal */}
          {isGenerating ? (
            <div className="mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600">Generating hybrid animal...</p>
            </div>
          ) : hybridAnimal ? (
            <div className="mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 overflow-hidden">
                <img 
                  src={hybridAnimal.image} 
                  alt={hybridAnimal.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-funny font-bold text-gray-800 mb-2">
                {hybridAnimal.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {hybridAnimal.bio}
              </p>
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={onKeepSwiping}
              className="px-6 py-3 bg-gray-500 text-white rounded-full font-medium hover:bg-gray-600 transition-colors"
            >
              Keep Swiping
            </button>
            <button
              onClick={() => onOpenChat({ animal1, animal2, id: Date.now().toString() })}
              className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
            >
              💬 Chat Now
            </button>
            <button
              onClick={onGoOnDate}
              className="px-6 py-3 bg-pink-500 text-white rounded-full font-medium hover:bg-pink-600 transition-colors"
            >
              Go on a Date! 💕
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MatchScreen;
