import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MatchesScreen = ({ onOpenChat }) => {
  const [matches, setMatches] = useState([]);
  const [receivedInterests, setReceivedInterests] = useState([]);
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' or 'interests'

  useEffect(() => {
    loadMatchesAndInterests();
  }, []);

  const loadMatchesAndInterests = () => {
    const savedMatches = JSON.parse(localStorage.getItem('matches') || '[]');
    const savedInterests = JSON.parse(localStorage.getItem('receivedInterests') || '[]');
    const activeProfile = JSON.parse(localStorage.getItem('activePetProfile') || '{}');

    const filteredInterests = savedInterests.filter(interest =>
      interest.toPet.id === activeProfile.id
    );

    setMatches(savedMatches);
    setReceivedInterests(filteredInterests);
  };

  const handleAcceptInterest = (interest) => {
    // Create a match from accepted interest
    const newMatch = {
      id: Date.now().toString(),
      animal1: interest.fromPet,
      animal2: interest.toPet,
      type: 'accepted-interest',
      matchedAt: new Date().toISOString()
    };

    const updatedMatches = [...matches, newMatch];
    setMatches(updatedMatches);
    localStorage.setItem('matches', JSON.stringify(updatedMatches));

    // Remove from received interests
    const updatedInterests = receivedInterests.filter(i => i.id !== interest.id);
    setReceivedInterests(updatedInterests);
    localStorage.setItem('receivedInterests', JSON.stringify(updatedInterests));

    alert(`It's a match with ${interest.fromPet.name}! 💕`);
  };

  const handleIgnoreInterest = (interest) => {
    // Remove from received interests
    const updatedInterests = receivedInterests.filter(i => i.id !== interest.id);
    setReceivedInterests(updatedInterests);
    localStorage.setItem('receivedInterests', JSON.stringify(updatedInterests));
  };

  return (
    <div className="matches-screen">
      <div className="matches-header">
        <h1>💕 Matches & Interests</h1>
        <p>Connect with your perfect pet matches!</p>
      </div>

      <div className="matches-tabs">
        <button 
          className={`matches-tab ${activeTab === 'matches' ? 'active' : ''}`}
          onClick={() => setActiveTab('matches')}
        >
          ❤️ Matches ({matches.length})
        </button>
        <button 
          className={`matches-tab ${activeTab === 'interests' ? 'active' : ''}`}
          onClick={() => setActiveTab('interests')}
        >
          🐾 Interests ({receivedInterests.length})
        </button>
      </div>

      <div className="matches-content">
        {activeTab === 'matches' ? (
          <div className="matches-list">
            {matches.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💔</div>
                <h3>No matches yet</h3>
                <p>Keep swiping to find your perfect pet matches!</p>
              </div>
            ) : (
              <div className="matches-grid">
                {matches.map((match) => (
                  <motion.div 
                    key={match.id}
                    className="match-card"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="match-images">
                      <img src={match.animal1.image} alt={match.animal1.name} />
                      <div className="match-heart">💕</div>
                      <img src={match.animal2.image} alt={match.animal2.name} />
                    </div>
                    <div className="match-info">
                      <h3>{match.animal1.name} & {match.animal2.name}</h3>
                      <p>Matched {new Date(match.matchedAt || Date.now()).toLocaleDateString()}</p>
                      <button 
                        className="chat-btn"
                        onClick={() => onOpenChat(match)}
                      >
                        💬 Start Chat
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="interests-list">
            {receivedInterests.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🐾</div>
                <h3>No interests received</h3>
                <p>Other pet owners will send you interests when they like your pet!</p>
              </div>
            ) : (
              <div className="interests-grid">
                {receivedInterests.map((interest) => (
                  <motion.div 
                    key={interest.id}
                    className="interest-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="interest-header">
                      <img src={interest.fromPet.image || interest.fromPet.photos?.[0]} alt={interest.fromPet.name} />
                      <div className="interest-info">
                        <h3>{interest.fromPet.name}</h3>
                        <p>Sent you: "{interest.message || interest.type || 'an interest'}" 🐾</p>
                        <span className="interest-time">
                          {new Date(interest.sentAt || interest.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="interest-actions">
                      <button 
                        className="accept-btn"
                        onClick={() => handleAcceptInterest(interest)}
                      >
                        ✅ Accept
                      </button>
                      <button 
                        className="ignore-btn"
                        onClick={() => handleIgnoreInterest(interest)}
                      >
                        ❌ Ignore
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesScreen;