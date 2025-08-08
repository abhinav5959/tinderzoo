import React from 'react';
import { motion } from 'framer-motion';
import { habitats } from '../data/animals';

const ProfileCard = ({ animal, onSwipe }) => {
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 100;
    
    if (info.offset.x > swipeThreshold) {
      onSwipe('right');
    } else if (info.offset.x < -swipeThreshold) {
      onSwipe('left');
    }
  };

  const habitatInfo = habitats[animal.habitat];

  return (
    <motion.div
      className="relative w-80 h-96 bg-white rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Animal Image */}
      <div className="relative h-64 bg-gradient-to-br from-purple-400 to-pink-400">
        <img
          src={animal.image}
          alt={animal.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
          <span className="text-2xl">{habitatInfo.emoji}</span>
          <span className="text-sm font-medium text-gray-700">{habitatInfo.name}</span>
        </div>
      </div>

      {/* Animal Info */}
      <div className="p-6">
        <h2 className="text-2xl font-funny font-bold text-gray-800 mb-2">
          {animal.name}
        </h2>
        
        <p className="text-gray-600 mb-4 leading-relaxed">
          {animal.bio}
        </p>

        {/* Fake NatGeo Fact */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg border-l-4 border-yellow-400">
          <p className="text-sm text-gray-700 italic">
            <span className="font-bold text-orange-600">NatGeo but Wrong:</span> {animal.fakeFact}
          </p>
        </div>
      </div>

      {/* Swipe Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
          ❌ Nope
        </div>
        <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
          ❤️ Like
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;

