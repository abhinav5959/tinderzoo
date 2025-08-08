import React from 'react';
import { motion } from 'framer-motion';

const NavigationBar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'swipe', label: 'Swipe', icon: '🐾', activeIcon: '🐾', color: '#10b981' },
    { id: 'matches', label: 'Matches', icon: '❤️', activeIcon: '💕', color: '#ef4444' },
    { id: 'chats', label: 'Chats', icon: '💬', activeIcon: '💭', color: '#3b82f6' },
    { id: 'profile', label: 'Profile', icon: '🐶', activeIcon: '🐕', color: '#f59e0b' },
    { id: 'settings', label: 'Settings', icon: '⚙️', activeIcon: '🔧', color: '#8b5cf6' }
  ];

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
  };

  return (
    <motion.div
      className="navigation-bar"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="nav-container">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              className="nav-icon"
              animate={activeTab === tab.id ? {
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ duration: 0.3 }}
            >
              {activeTab === tab.id ? tab.activeIcon : tab.icon}
            </motion.div>
            <span className="nav-label">{tab.label}</span>

            {activeTab === tab.id && (
              <motion.div
                className="active-indicator"
                layoutId="activeIndicator"
                style={{ backgroundColor: tab.color }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default NavigationBar;