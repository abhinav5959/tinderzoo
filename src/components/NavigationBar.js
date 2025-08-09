import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NavigationBar = ({ activeTab, onTabChange }) => {
  const [newInterestsCount, setNewInterestsCount] = useState(0);

  const tabs = [
    { id: 'swipe', label: 'Swipe', icon: '🐾', activeIcon: '🐾', color: '#10b981' },
    { id: 'matches', label: 'Matches', icon: '❤️', activeIcon: '💕', color: '#ef4444', hasNotification: newInterestsCount > 0 },
    { id: 'chats', label: 'Chats', icon: '💬', activeIcon: '💭', color: '#3b82f6' },
    { id: 'profile', label: 'Profile', icon: '🐶', activeIcon: '🐕', color: '#f59e0b' },
    { id: 'settings', label: 'Settings', icon: '⚙️', activeIcon: '🔧', color: '#8b5cf6' }
  ];

  useEffect(() => {
    const checkForNewInterests = () => {
      const receivedInterests = JSON.parse(localStorage.getItem('receivedInterests') || '[]');
      const activeProfile = JSON.parse(localStorage.getItem('activePetProfile') || '{}');
      
      if (activeProfile.id) {
        const myInterests = receivedInterests.filter(interest => 
          interest.toPet.id === activeProfile.id
        );
        setNewInterestsCount(myInterests.length);
      }
    };

    checkForNewInterests();
    
    // Check every 5 seconds for new interests
    const interval = setInterval(checkForNewInterests, 5000);
    
    return () => clearInterval(interval);
  }, []);

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
            <div style={{ position: 'relative' }}>
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
              {tab.hasNotification && (
                <motion.div
                  className="notification-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  {newInterestsCount}
                </motion.div>
              )}
            </div>
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