import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DateGame = ({ onReset }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [outcome, setOutcome] = useState('');

  const dateOptions = [
    {
      name: 'Romantic Dinner',
      emoji: '🍽️',
      outcomes: [
        'The lion ate the zebra! 🦁💀',
        'They shared a candlelit dinner and fell in love! 💕',
        'The penguin froze the sushi! 🐧❄️',
        'They had a food fight and made a mess! 🍕💥',
        'The giraffe couldn\'t reach the table! 🦒😅'
      ]
    },
    {
      name: 'Long Walk',
      emoji: '🚶‍♂️',
      outcomes: [
        'The sloth fell asleep during the walk! 🦥😴',
        'They discovered a beautiful sunset together! 🌅💕',
        'The cheetah ran too fast and left the other behind! 🐆💨',
        'They got lost in the jungle! 🌴🗺️',
        'The elephant stepped on the mouse\'s tail! 🐘🐭'
      ]
    },
    {
      name: 'Netflix & Chill',
      emoji: '📺',
      outcomes: [
        'They watched "The Lion King" and cried together! 🦁👑',
        'The bear fell asleep on the couch! 🐻😴',
        'They argued about what to watch! 📺😤',
        'The monkey kept changing the channel! 🐒📱',
        'They cuddled and watched a romantic movie! 💕🍿'
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
          {!showOutcome ? (
            <>
              <h2 className="text-3xl font-funny font-bold text-gray-800 mb-6">
                Choose a Date Activity! 💕
              </h2>
              
              <div className="space-y-4">
                {dateOptions.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleDateSelect(option)}
                    className="w-full p-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all transform hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <div>{option.name}</div>
                  </motion.button>
                ))}
              </div>
            </>
          ) : (
            <>
              <motion.div
                className="text-6xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                {selectedDate.emoji}
              </motion.div>
              
              <h3 className="text-2xl font-funny font-bold text-gray-800 mb-4">
                {selectedDate.name} Result:
              </h3>
              
              <motion.p
                className="text-lg text-gray-700 mb-6 p-4 bg-yellow-100 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {outcome}
              </motion.p>
              
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
              >
                Back to Swiping! 🦁
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DateGame;
