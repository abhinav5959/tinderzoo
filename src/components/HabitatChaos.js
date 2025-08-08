import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HabitatChaos = ({ animal1, animal2, onClose }) => {
  const habitatConflicts = {
    'arctic-domestic': {
      message: "The penguin tried to visit the cat but melted in the heat! 🐧💦",
      animation: "🌡️"
    },
    'arctic-savanna': {
      message: "The polar bear got lost in the desert and is now just a regular bear! 🐻☀️",
      animation: "🏜️"
    },
    'arctic-jungle': {
      message: "The penguin tried to climb trees but kept sliding down! 🐧🌴",
      animation: "🌴"
    },
    'savanna-domestic': {
      message: "The lion scared the cat so much it's still hiding under the bed! 🦁😿",
      animation: "🏠"
    },
    'savanna-arctic': {
      message: "The lion tried to hunt in the snow but just got cold! 🦁❄️",
      animation: "❄️"
    },
    'jungle-domestic': {
      message: "The monkey swung through the house and broke everything! 🐵🏠",
      animation: "🏠"
    },
    'jungle-arctic': {
      message: "The monkey tried to build a snowman but it kept falling apart! 🐵⛄",
      animation: "⛄"
    }
  };

  const getConflictKey = (hab1, hab2) => {
    const habitats = [hab1, hab2].sort();
    return `${habitats[0]}-${habitats[1]}`;
  };

  const conflictKey = getConflictKey(animal1.habitat, animal2.habitat);
  const conflict = habitatConflicts[conflictKey];

  if (!conflict) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-red-400 via-orange-500 to-yellow-400 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl text-center"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
        >
          <div className="text-6xl mb-4 animate-bounce-slow">
            {conflict.animation}
          </div>
          
          <h2 className="text-2xl font-funny font-bold text-red-600 mb-4">
            Habitat Chaos! 🌍
          </h2>
          
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {conflict.message}
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
            <div className="text-center">
              <img
                src={animal1.image}
                alt={animal1.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-red-300"
              />
              <p className="text-sm font-medium mt-2">{animal1.name}</p>
            </div>
            <div className="text-center">
              <img
                src={animal2.image}
                alt={animal2.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-red-300"
              />
              <p className="text-sm font-medium mt-2">{animal2.name}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-xl font-medium hover:from-red-600 hover:to-orange-600 transition-colors"
          >
            That Was Hilarious! 😂
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HabitatChaos;
