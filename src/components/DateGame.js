import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DateGame = ({ onReset }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [outcome, setOutcome] = useState('');

  const dateOptions = [
    {
      id: 'dinner',
      name: 'Romantic Dinner',
      emoji: '🍽️',
      outcomes: [
        "The lion ate the zebra. Literally. It was a very short date.",
        "The penguin tried to cook but kept sliding on the ice. Kitchen disaster!",
        "The giraffe couldn't fit in the restaurant. Had to eat through the window.",
        "The elephant ordered everything on the menu. Bill was astronomical!",
        "The sloth fell asleep during appetizers. Still sleeping there."
      ]
    },
    {
      id: 'walk',
      name: 'Long Walk',
      emoji: '🚶',
      outcomes: [
        "The polar bear melted in the sun. Now it's just a regular bear.",
        "The monkey kept climbing trees and getting lost. GPS didn't help.",
        "The penguin tried to waddle on sand. It was not pretty.",
        "The giraffe got stuck under a low bridge. Fire department called.",
        "The sloth walked 3 feet in 2 hours. New world record!"
      ]
    },
    {
      id: 'netflix',
      name: 'Netflix & Chill',
      emoji: '📺',
      outcomes: [
        "The lion roared at every jump scare. Neighbors complained.",
        "The penguin kept sliding off the couch. Couch is now an ice rink.",
        "The giraffe's neck blocked the TV. Had to watch from outside.",
        "The elephant sat on the remote. Now everything is broken.",
        "The sloth fell asleep during the opening credits. Still there."
      ]
    }
  ];

  const handleDateSelect = (dateOption) => {
    setSelectedDate(dateOption);
    const randomOutcome = dateOption.outcomes[Math.floor(Math.random() * dateOption.outcomes.length)];
    setOutcome(randomOutcome);
    setShowOutcome(true);
  };

  const handleReset = () => {
    setSelectedDate(null);
    setShowOutcome(false);
    setOutcome('');
    onReset();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-red-400 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl">
        <h2 className="text-3xl font-funny font-bold text-center text-purple-600 mb-8">
          Choose Your Date! 💕
        </h2>

        <AnimatePresence>
          {!showOutcome ? (
            <motion.div
              key="date-options"
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {dateOptions.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => handleDateSelect(option)}
                  className="w-full bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 p-6 rounded-2xl border-2 border-transparent hover:border-pink-300 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{option.emoji}</span>
                    <span className="text-xl font-medium text-gray-800">{option.name}</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="outcome"
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-2xl font-funny font-bold text-purple-600 mb-4">
                Date Outcome!
              </h3>
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                {outcome}
              </p>
              <button
                onClick={handleReset}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                Try Again! 🔄
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DateGame;
