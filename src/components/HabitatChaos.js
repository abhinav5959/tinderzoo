import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HabitatChaos = ({ animal1, animal2, onClose }) => {
  const habitatConflicts = {
    'arctic': {
      'desert': 'The arctic animal melted in the desert heat! 🌡️💧',
      'jungle': 'The arctic animal got lost in the humid jungle! 🌴❄️',
      'ocean': 'The arctic animal tried to swim but sank like a rock! 🏊‍♂️💧'
    },
    'desert': {
      'arctic': 'The desert animal froze solid in the arctic! 🥶❄️',
      'jungle': 'The desert animal got lost in the dense jungle! 🌴🏜️',
      'ocean': 'The desert animal tried to swim but sank like a rock! 🏊‍♂️💧'
    },
    'jungle': {
      'arctic': 'The jungle animal froze solid in the arctic! 🥶❄️',
      'desert': 'The jungle animal dried up in the desert heat! 🌡️💧',
      'ocean': 'The jungle animal tried to swim but sank like a rock! 🏊‍♂️💧'
    },
    'ocean': {
      'arctic': 'The ocean animal froze solid in the arctic! 🥶❄️',
      'desert': 'The ocean animal dried up in the desert heat! 🌡️💧',
      'jungle': 'The ocean animal got lost in the dense jungle! 🌴🏊‍♂️'
    }
  };

  const getConflictMessage = () => {
    const conflict = habitatConflicts[animal1.habitat]?.[animal2.habitat];
    return conflict || 'These animals live in completely different worlds! 🌍';
  };

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
          {/* Chaos Animation */}
          <motion.div
            className="text-6xl mb-4"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            💥
          </motion.div>

          <h2 className="text-3xl font-funny font-bold text-gray-800 mb-4">
            Habitat Chaos! 🌍
          </h2>
          
          <div className="flex justify-center gap-4 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">
                🦁
              </div>
              <p className="text-sm font-medium">{animal1.name}</p>
              <p className="text-xs text-gray-500">{animal1.habitat}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">
                🐧
              </div>
              <p className="text-sm font-medium">{animal2.name}</p>
              <p className="text-xs text-gray-500">{animal2.habitat}</p>
            </div>
          </div>

          <motion.p
            className="text-lg text-gray-700 mb-6 p-4 bg-red-100 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {getConflictMessage()}
          </motion.p>

          <button
            onClick={onClose}
            className="px-6 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
          >
            Continue Swiping! 🦁
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HabitatChaos;
