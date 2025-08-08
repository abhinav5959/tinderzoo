import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animals } from './data/animals';
import { loadDummyProfiles } from './data/dummyPetProfiles';

import PetProfileCreator from './components/PetProfileCreator';
import ProfileCard from './components/ProfileCard';
import MatchScreen from './components/MatchScreen';
import DateGame from './components/DateGame';
import GossipTicker from './components/GossipTicker';
import HabitatChaos from './components/HabitatChaos';
import PetProfileManager from './components/PetProfileManager';
import DatabaseAdmin from './components/DatabaseAdmin';
import ChatSystem from './components/ChatSystem';
import FiltersAndPreferences from './components/FiltersAndPreferences';
import SuperLikeFeature from './components/SuperLikeFeature';
import UndoFeature from './components/UndoFeature';
import SendInterest from './components/SendInterest';
import NavigationBar from './components/NavigationBar';
import MatchesScreen from './components/MatchesScreen';
import ChatsScreen from './components/ChatsScreen';
import SettingsScreen from './components/SettingsScreen';
import LoginSystem from './components/LoginSystem';
import ProfileBrowser from './components/ProfileBrowser';

function App() {
  const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
  const [likedAnimals, setLikedAnimals] = useState([]);
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState({ totalLikes: 0, totalMatches: 0 });
  const [loading, setLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [showDateGame, setShowDateGame] = useState(false);
  const [showHabitatChaos, setShowHabitatChaos] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [habitatConflict, setHabitatConflict] = useState(null);
  const [showPetProfile, setShowPetProfile] = useState(false);
  const [showDatabaseAdmin, setShowDatabaseAdmin] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuperLike, setShowSuperLike] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const [currentChatMatch, setCurrentChatMatch] = useState(null);
  const [lastSwipedAnimal, setLastSwipedAnimal] = useState(null);
  const [lastSwipeDirection, setLastSwipeDirection] = useState(null);
  const [filters, setFilters] = useState({});
  const [showPetProfileCreator, setShowPetProfileCreator] = useState(false);
  const [activePetProfile, setActivePetProfile] = useState(null);
  const [showSendInterest, setShowSendInterest] = useState(false);
  const [interestAnimal, setInterestAnimal] = useState(null);
  const [activeTab, setActiveTab] = useState('swipe');
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [showProfileViewer, setShowProfileViewer] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const currentAnimal = animals[currentAnimalIndex];

  const loadUserData = (user) => {
    // Load user-specific data from localStorage
    const userLikedAnimals = JSON.parse(localStorage.getItem(`likedAnimals_${user.id}`) || '[]');
    const userMatches = JSON.parse(localStorage.getItem(`matches_${user.id}`) || '[]');
    
    setLikedAnimals(userLikedAnimals);
    setMatches(userMatches);
    setStats({
      totalLikes: userLikedAnimals.length,
      totalMatches: userMatches.length
    });
  };

  // Check for existing login on app start
  useEffect(() => {
    const checkExistingLogin = () => {
      // Clear any existing user data to force login screen
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
      setShowLogin(true);
    };

    checkExistingLogin();
  }, []);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        // Load dummy pet profiles if none exist
        loadDummyProfiles();
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  const handleSwipe = async (direction) => {
    // Store last swiped animal for undo feature
    setLastSwipedAnimal(currentAnimal);
    setLastSwipeDirection(direction);
    
    if (direction === 'right') {
      // Update local state
      const updatedLikedAnimals = [...likedAnimals, currentAnimal];
      setLikedAnimals(updatedLikedAnimals);
      setStats(prev => ({ ...prev, totalLikes: prev.totalLikes + 1 }));
      
      // Save to localStorage with user-specific keys
      if (currentUser) {
        localStorage.setItem(`likedAnimals_${currentUser.id}`, JSON.stringify(updatedLikedAnimals));
      }
      
      // Check for matches (50% chance for demo purposes)
      if (Math.random() > 0.5) {
        const matchedAnimal = animals[Math.floor(Math.random() * animals.length)];
        if (matchedAnimal.id !== currentAnimal.id) {
          const newMatch = { 
            id: Date.now().toString(),
            animal1: currentAnimal, 
            animal2: matchedAnimal 
          };
          
          // Check for habitat conflict
          if (currentAnimal.habitat !== matchedAnimal.habitat) {
            setHabitatConflict({ animal1: currentAnimal, animal2: matchedAnimal });
            setShowHabitatChaos(true);
          } else {
            // Update local state
            const updatedMatches = [...matches, newMatch];
            setMatches(updatedMatches);
            setStats(prev => ({ ...prev, totalMatches: prev.totalMatches + 1 }));
            
            // Save to localStorage with user-specific keys
            if (currentUser) {
              localStorage.setItem(`matches_${currentUser.id}`, JSON.stringify(updatedMatches));
            }
            
            // Show match screen
            setCurrentMatch(newMatch);
            setShowMatch(true);
          }
        }
      }
    }
    
    // Move to next animal
    setCurrentAnimalIndex(prev => (prev + 1) % animals.length);
  };

  const handleButtonSwipe = (direction) => {
    handleSwipe(direction);
  };



  const handleKeepSwiping = () => {
    setShowMatch(false);
    setCurrentMatch(null);
  };

  const handleGoOnDate = () => {
    setShowMatch(false);
    setShowDateGame(true);
  };

  const handleDateGameReset = () => {
    setShowDateGame(false);
    setCurrentMatch(null);
  };

  const handleHabitatChaosClose = () => {
    setShowHabitatChaos(false);
    setHabitatConflict(null);
  };

  const handleOpenChat = (match) => {
    setCurrentChatMatch(match);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setCurrentChatMatch(null);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    // In a real app, you would filter the animals based on these preferences
    console.log('Filters applied:', newFilters);
  };

  const handleSuperLike = (animal, message) => {
    // Add super like logic here
    console.log('Super like sent to:', animal.name, 'with message:', message);
    // You could add special matching logic for super likes
  };

  const handleUndo = () => {
    if (lastSwipedAnimal && lastSwipeDirection === 'right') {
      // Remove from liked animals
      const updatedLikedAnimals = likedAnimals.filter(animal => animal.id !== lastSwipedAnimal.id);
      setLikedAnimals(updatedLikedAnimals);
      setStats(prev => ({ ...prev, totalLikes: prev.totalLikes - 1 }));
      localStorage.setItem('likedAnimals', JSON.stringify(updatedLikedAnimals));
    }
    
    // Go back to previous animal
    setCurrentAnimalIndex(prev => (prev - 1 + animals.length) % animals.length);
  };

  const handleProfileCreated = (profile) => {
    setActivePetProfile(profile);
    setShowPetProfileCreator(false);
  };

  const handleBackToProfileCreator = () => {
    setShowPetProfileCreator(true);
  };

  const handleSendInterest = (animal) => {
    setInterestAnimal(animal);
    setShowSendInterest(true);
  };

  const handleInterestSent = (interest, isAutoMatch) => {
    setShowSendInterest(false);
    setInterestAnimal(null);
    
    if (isAutoMatch) {
      // Create a match from mutual interest
      const newMatch = {
        id: Date.now().toString(),
        animal1: interest.fromPet,
        animal2: interest.toPet,
        type: 'mutual-interest'
      };
      
      const updatedMatches = [...matches, newMatch];
      setMatches(updatedMatches);
      setStats(prev => ({ ...prev, totalMatches: prev.totalMatches + 1 }));
      localStorage.setItem('matches', JSON.stringify(updatedMatches));
      
      setCurrentMatch(newMatch);
      setShowMatch(true);
    } else {
      // Show success message
      alert(`Interest sent to ${interest.toPet.name}! 🐾 Let's hope they wag back!`);
    }
  };

  const handleCloseInterest = () => {
    setShowSendInterest(false);
    setInterestAnimal(null);
  };

  const handleCardClick = (animal) => {
    setSelectedAnimal(animal);
    setShowProfileViewer(true);
  };

  const handleCloseProfileViewer = () => {
    setShowProfileViewer(false);
    setSelectedAnimal(null);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setShowLogin(false);
    // Load user-specific data
    loadUserData(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setShowLogin(true);
    // Clear all data
    setLikedAnimals([]);
    setMatches([]);
    setStats({ totalLikes: 0, totalMatches: 0 });
  };

  if (loading) {
    return (
      <div className="app">
        <div className="main-content">
          <div className="card-container">
            <div className="animal-card">
              <div className="animal-info">
                <h2 className="animal-name">Loading...</h2>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    border: '3px solid #f3f3f3',
                    borderTop: '3px solid #3498db',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto'
                  }}></div>
                  <p style={{ marginTop: '1rem', color: '#666' }}>
                    Loading TindrZoo Xtreme...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show login system if user is not logged in
  if (showLogin || !currentUser) {
    return <LoginSystem onLoginSuccess={handleLoginSuccess} />;
  }

  if (showPetProfileCreator) {
    return (
      <PetProfileCreator 
        onProfileCreated={handleProfileCreated}
        existingProfiles={[]}
      />
    );
  }

  if (showPetProfile) {
    return <PetProfileManager onBack={() => setShowPetProfile(false)} />;
  }

  // Render different screens based on active tab
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'swipe':
        return (
          <div className="main-content">
            {/* Header */}
            <div className="header">
              <h1 className="title">
                TindrZoo Xtreme 🦁
              </h1>
              <p className="subtitle">
                Swipe animals, find love, create chaos! 💕
              </p>
              <div style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                <p>Likes: {stats.totalLikes} | Matches: {stats.totalMatches}</p>
                <div style={{ marginTop: '0.5rem' }}>
                  <button
                    onClick={handleBackToProfileCreator}
                    style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      border: 'none', 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem',
                      marginRight: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    🐾 Manage Profiles
                  </button>
                  {activePetProfile && (
                    <button
                      onClick={() => setShowPetProfile(true)}
                      style={{ 
                        background: 'rgba(255,255,255,0.2)', 
                        border: 'none', 
                        color: 'white', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem', 
                        fontSize: '0.75rem',
                        marginRight: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      🐕 {activePetProfile.name}
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(true)}
                    style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      border: 'none', 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem',
                      marginRight: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    🔍 Filters
                  </button>
                  <button
                    onClick={() => setShowUndo(true)}
                    style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      border: 'none', 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem',
                      marginRight: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    ↩️ Undo
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      border: 'none', 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem',
                      marginRight: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    🐾 Browse Profiles
                  </button>
                  <button
                    onClick={() => setShowDatabaseAdmin(true)}
                    style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      border: 'none', 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem',
                      marginRight: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    🗄️ Database
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{ 
                      background: 'rgba(239, 68, 68, 0.8)', 
                      border: 'none', 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Main Swipe Area */}
            <div className="main-area">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAnimalIndex}
                  className="card-container"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProfileCard 
                    animal={currentAnimal} 
                    onSwipe={handleSwipe}
                    onSendInterest={handleSendInterest}
                    onCardClick={handleCardClick}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Swipe Buttons */}
              <div className="swipe-buttons">
                <button
                  onClick={() => handleButtonSwipe('left')}
                  className="swipe-button left"
                >
                  ❌
                </button>

                <button
                  onClick={() => setShowSuperLike(true)}
                  className="swipe-button superlike"
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '100px',
                    height: '100px',
                    fontSize: '2.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)'
                  }}
                >
                  ⭐
                </button>

                <button
                  onClick={() => handleButtonSwipe('right')}
                  className="swipe-button right"
                >
                  ❤️
                </button>
              </div>

              {/* Instructions */}
              <div className="instructions">
                <p>Swipe right to like, left to pass, or use the buttons above!</p>
                <p className="animal-counter">
                  Animal {currentAnimalIndex + 1} of {animals.length}
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'matches':
        return <MatchesScreen onOpenChat={handleOpenChat} />;
      
      case 'chats':
        return <ChatsScreen onOpenChat={handleOpenChat} />;
      
      case 'profile':
        return <ProfileBrowser currentUser={currentUser} />;
      
      case 'settings':
        return <SettingsScreen />;
      
      default:
        return null;
    }
  };

  return (
    <div className="app">
      {renderActiveScreen()}

      {/* Modals */}
      <AnimatePresence>
        {showMatch && currentMatch && (
          <MatchScreen
            animal1={currentMatch.animal1}
            animal2={currentMatch.animal2}
            onKeepSwiping={handleKeepSwiping}
            onGoOnDate={handleGoOnDate}
            onOpenChat={handleOpenChat}
          />
        )}

        {showDateGame && (
          <DateGame onReset={handleDateGameReset} />
        )}

        {showHabitatChaos && habitatConflict && (
          <HabitatChaos
            animal1={habitatConflict.animal1}
            animal2={habitatConflict.animal2}
            onClose={handleHabitatChaosClose}
          />
        )}

        {showDatabaseAdmin && (
          <DatabaseAdmin onClose={() => setShowDatabaseAdmin(false)} />
        )}

        {showChat && currentChatMatch && (
          <ChatSystem 
            match={currentChatMatch} 
            onClose={handleCloseChat} 
          />
        )}

        {showFilters && (
          <FiltersAndPreferences 
            onClose={() => setShowFilters(false)}
            onApplyFilters={handleApplyFilters}
          />
        )}

        {showSuperLike && (
          <SuperLikeFeature 
            animal={currentAnimal}
            onSuperLike={handleSuperLike}
            onClose={() => setShowSuperLike(false)}
          />
        )}

        {showUndo && (
          <UndoFeature 
            onUndo={handleUndo}
            onClose={() => setShowUndo(false)}
            lastSwipedAnimal={lastSwipedAnimal}
            swipeDirection={lastSwipeDirection}
          />
        )}

        {showSendInterest && interestAnimal && (
          <SendInterest 
            animal={interestAnimal}
            onInterestSent={handleInterestSent}
            onClose={handleCloseInterest}
            isVisible={showSendInterest}
          />
        )}

        {showProfileViewer && selectedAnimal && (
          <ProfileViewer
            profile={{
              id: selectedAnimal.id,
              name: selectedAnimal.name,
              species: selectedAnimal.species || 'Unknown',
              breed: selectedAnimal.breed || 'Unknown',
              age: selectedAnimal.age || 'Unknown',
              gender: selectedAnimal.gender || 'Unknown',
              description: selectedAnimal.bio,
              personality: selectedAnimal.personality || ['Friendly', 'Playful'],
              favoriteActivity: selectedAnimal.favoriteActivity || 'Playing',
              photos: [selectedAnimal.image],
              createdAt: new Date().toISOString(),
              ownerId: 'unknown',
              ownerUsername: 'Unknown',
              isOwnProfile: false
            }}
            isOwnProfile={false}
            onClose={handleCloseProfileViewer}
            onEdit={() => alert('Edit functionality not available for swipe animals')}
            onDelete={() => alert('Delete functionality not available for swipe animals')}
          />
        )}
      </AnimatePresence>

      {/* Navigation Bar */}
      <NavigationBar 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
}

export default App;
