import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileViewer from './ProfileViewer';

const ProfileBrowser = ({ currentUser }) => {
  const [allProfiles, setAllProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showProfileViewer, setShowProfileViewer] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'my', 'others'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAllProfiles();
  }, [currentUser]);

  const loadAllProfiles = () => {
    // For now, we'll create some dummy profiles since the actual pet profiles might not exist
    const dummyProfiles = [
      {
        id: '1',
        name: 'Buddy',
        species: 'Dog',
        breed: 'Golden Retriever',
        age: '3 years',
        gender: 'Male',
        description: 'Loves playing fetch and making new friends!',
        personality: ['Friendly', 'Playful', 'Loyal'],
        favoriteActivity: 'Playing fetch',
        photos: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=400'],
        createdAt: new Date().toISOString(),
        ownerId: 'user1',
        ownerUsername: 'PetLover123',
        isOwnProfile: false
      },
      {
        id: '2',
        name: 'Whiskers',
        species: 'Cat',
        breed: 'Persian',
        age: '2 years',
        gender: 'Female',
        description: 'Elegant and graceful, loves sunny windowsills.',
        personality: ['Calm', 'Elegant', 'Independent'],
        favoriteActivity: 'Sunbathing',
        photos: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'],
        createdAt: new Date().toISOString(),
        ownerId: 'user2',
        ownerUsername: 'CatWhisperer',
        isOwnProfile: false
      },
      {
        id: '3',
        name: 'Max',
        species: 'Dog',
        breed: 'German Shepherd',
        age: '4 years',
        gender: 'Male',
        description: 'Protective, intelligent, and loves long walks.',
        personality: ['Protective', 'Intelligent', 'Active'],
        favoriteActivity: 'Long walks',
        photos: ['https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400'],
        createdAt: new Date().toISOString(),
        ownerId: currentUser?.id || 'current',
        ownerUsername: currentUser?.username || 'You',
        isOwnProfile: true
      }
    ];
    
    setAllProfiles(dummyProfiles);
  };

  const filteredProfiles = allProfiles.filter(profile => {
    const matchesFilter = filter === 'all' || 
      (filter === 'my' && profile.isOwnProfile) ||
      (filter === 'others' && !profile.isOwnProfile);
    
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.breed.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setShowProfileViewer(true);
  };

  const handleCloseProfileViewer = () => {
    setShowProfileViewer(false);
    setSelectedProfile(null);
  };

  const handleEditProfile = () => {
    alert('Edit functionality will be implemented in the profile creator');
    handleCloseProfileViewer();
  };

  const handleDeleteProfile = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProfile.name}'s profile?`)) {
      const updatedProfiles = allProfiles.filter(p => p.id !== selectedProfile.id);
      setAllProfiles(updatedProfiles);
      handleCloseProfileViewer();
      alert('Profile deleted successfully!');
    }
  };

  return (
    <div className="profile-browser">
      <div className="profile-browser-header">
        <h1>🐾 Pet Profiles</h1>
        <p>Discover amazing pets and their stories</p>
      </div>

      {/* Search and Filter */}
      <div className="browser-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search pets by name, species, or breed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-tabs">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            🌍 All Pets ({allProfiles.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'my' ? 'active' : ''}`}
            onClick={() => setFilter('my')}
          >
            🐕 My Pets ({allProfiles.filter(p => p.isOwnProfile).length})
          </button>
          <button 
            className={`filter-btn ${filter === 'others' ? 'active' : ''}`}
            onClick={() => setFilter('others')}
          >
            🐾 Other Pets ({allProfiles.filter(p => !p.isOwnProfile).length})
          </button>
        </div>
      </div>

      {/* Profiles Grid */}
      {filteredProfiles.length === 0 ? (
        <div className="empty-profiles">
          <div className="empty-icon">🐾</div>
          <h3>No profiles found</h3>
          <p>
            {searchTerm 
              ? `No pets match "${searchTerm}"`
              : filter === 'my' 
                ? "You haven't created any pet profiles yet"
                : "No other pet profiles available"
            }
          </p>
        </div>
      ) : (
        <div className="profiles-grid">
          {filteredProfiles.map((profile) => (
            <motion.div 
              key={profile.id}
              className="profile-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleProfileClick(profile)}
            >
              <div className="profile-card-image">
                <img 
                  src={profile.photos?.[0]?.url || profile.photos?.[0] || 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400'} 
                  alt={profile.name}
                />
                {profile.isOwnProfile && (
                  <div className="own-profile-badge">My Pet</div>
                )}
                {profile.photos && profile.photos.length > 1 && (
                  <div className="photo-count-badge">
                    📷 {profile.photos.length}
                  </div>
                )}
              </div>
              
              <div className="profile-card-info">
                <h3 className="profile-card-name">{profile.name}</h3>
                <div className="profile-card-details">
                  <span className="detail-item">{profile.species}</span>
                  <span className="detail-item">•</span>
                  <span className="detail-item">{profile.breed}</span>
                  <span className="detail-item">•</span>
                  <span className="detail-item">{profile.age}</span>
                </div>
                
                <div className="profile-card-personality">
                  {profile.personality?.slice(0, 3).map((trait, index) => (
                    <span key={index} className="personality-chip">
                      {trait}
                    </span>
                  ))}
                </div>
                
                {!profile.isOwnProfile && (
                  <div className="profile-card-owner">
                    <span className="owner-label">Owner:</span>
                    <span className="owner-name">{profile.ownerUsername}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Profile Viewer Modal */}
      <AnimatePresence>
        {showProfileViewer && selectedProfile && (
          <ProfileViewer
            profile={selectedProfile}
            isOwnProfile={selectedProfile.isOwnProfile}
            onClose={handleCloseProfileViewer}
            onEdit={handleEditProfile}
            onDelete={handleDeleteProfile}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileBrowser;