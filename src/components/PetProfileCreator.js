import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadDummyProfiles, resetToDummyProfiles } from '../data/dummyPetProfiles';

const PetProfileCreator = ({ onProfileCreated, existingProfiles = [] }) => {
  const [showCreator, setShowCreator] = useState(true);
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'manage'
  const [petData, setPetData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    personality: [],
    description: '',
    photos: [],
    favoriteActivity: '',
    id: Date.now()
  });

  const [activeProfile, setActiveProfile] = useState(null);

  const speciesOptions = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Horse', 'Other'];
  const genderOptions = ['Male', 'Female'];
  const personalityOptions = [
    'Playful', 'Lazy', 'Social', 'Shy', 'Aggressive', 'Calm', 'Energetic', 
    'Cuddly', 'Independent', 'Curious', 'Protective', 'Friendly', 'Timid', 'Bold'
  ];

  const handleInputChange = (field, value) => {
    setPetData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePersonalityToggle = (trait) => {
    setPetData(prev => ({
      ...prev,
      personality: prev.personality.includes(trait)
        ? prev.personality.filter(p => p !== trait)
        : [...prev.personality, trait]
    }));
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const newPhotos = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file: file
    }));
    
    setPetData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos].slice(0, 6) // Max 6 photos
    }));
  };

  const removePhoto = (photoId) => {
    setPetData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId)
    }));
  };

  const handleSubmit = () => {
    if (!petData.name || !petData.species || !petData.description) {
      alert('Please fill in the required fields: Name, Species, and Description');
      return;
    }

    const newProfile = {
      ...petData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingProfiles = JSON.parse(localStorage.getItem('petProfiles') || '[]');
    const updatedProfiles = [...existingProfiles, newProfile];
    localStorage.setItem('petProfiles', JSON.stringify(updatedProfiles));

    // Set as active profile
    localStorage.setItem('activePetProfile', JSON.stringify(newProfile));

    onProfileCreated(newProfile);
  };

  const loadExistingProfiles = () => {
    return JSON.parse(localStorage.getItem('petProfiles') || '[]');
  };

  const handleLoadDummyProfiles = () => {
    const profiles = loadDummyProfiles();
    setActiveProfile(profiles[0] || null);
    alert('Dummy pet profiles loaded successfully! You can now manage them or create your own.');
  };

  const handleResetToDummyProfiles = () => {
    if (window.confirm('This will replace all existing profiles with dummy profiles. Are you sure?')) {
      const profiles = resetToDummyProfiles();
      setActiveProfile(profiles[0] || null);
      alert('Reset to dummy profiles!');
    }
  };

  const setProfileActive = (profile) => {
    localStorage.setItem('activePetProfile', JSON.stringify(profile));
    setActiveProfile(profile);
  };

  const deleteProfile = (profileId) => {
    const profiles = loadExistingProfiles();
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    localStorage.setItem('petProfiles', JSON.stringify(updatedProfiles));
    
    // If we deleted the active profile, clear it
    const activeProfile = JSON.parse(localStorage.getItem('activePetProfile') || 'null');
    if (activeProfile && activeProfile.id === profileId) {
      localStorage.removeItem('activePetProfile');
      setActiveProfile(null);
    }
  };

  useEffect(() => {
    const active = JSON.parse(localStorage.getItem('activePetProfile') || 'null');
    setActiveProfile(active);
  }, []);

  return (
    <div className="pet-profile-creator">
      <motion.div 
        className="creator-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="creator-header">
          <h1>🐾 Pet Profile Creator</h1>
          <p>Create your pet's dating profile to find them love!</p>
        </div>

        <div className="tab-buttons">
          <button 
            className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            🐕 Create New Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            📋 Manage Profiles ({loadExistingProfiles().length})
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'create' ? (
            <motion.div 
              key="create"
              className="create-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="form-section">
                <h3>🐾 Basic Info</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Pet Name *</label>
                    <input
                      type="text"
                      value={petData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your pet's name"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Species *</label>
                    <select
                      value={petData.species}
                      onChange={(e) => handleInputChange('species', e.target.value)}
                      className="form-select"
                    >
                      {speciesOptions.map(species => (
                        <option key={species} value={species}>{species}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Breed</label>
                    <input
                      type="text"
                      value={petData.breed}
                      onChange={(e) => handleInputChange('breed', e.target.value)}
                      placeholder="e.g., Golden Retriever, Persian"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="text"
                      value={petData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="e.g., 3 years old"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      value={petData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="form-select"
                    >
                      {genderOptions.map(gender => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>🎭 Personality</h3>
                <div className="personality-grid">
                  {personalityOptions.map(trait => (
                    <button
                      key={trait}
                      className={`personality-tag ${petData.personality.includes(trait) ? 'selected' : ''}`}
                      onClick={() => handlePersonalityToggle(trait)}
                    >
                      {trait}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>📝 Description *</h3>
                <textarea
                  value={petData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Tell us about your pet's personality, likes, dislikes, and what they're looking for in a companion..."
                  className="form-textarea"
                  rows="4"
                />
              </div>

              <div className="form-section">
                <h3>🎯 Favorite Activity</h3>
                <input
                  type="text"
                  value={petData.favoriteActivity}
                  onChange={(e) => handleInputChange('favoriteActivity', e.target.value)}
                  placeholder="e.g., chasing squirrels, sleeping in sunbeams, playing fetch"
                  className="form-input"
                />
              </div>

              <div className="form-section">
                <h3>📸 Photos (Max 6)</h3>
                <div className="photo-upload-area">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="photo-input"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="upload-btn">
                    📷 Add Photos
                  </label>
                </div>
                
                {petData.photos.length > 0 && (
                  <div className="photo-grid">
                    {petData.photos.map((photo, index) => (
                      <div key={photo.id} className="photo-item">
                        <img src={photo.url} alt={`Photo ${index + 1}`} />
                        <button 
                          className="remove-photo"
                          onClick={() => removePhoto(photo.id)}
                        >
                          ❌
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button 
                  className="submit-btn"
                  onClick={handleSubmit}
                >
                  🐾 Create Profile & Start Dating!
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="manage"
              className="manage-profiles"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="profiles-grid">
                {loadExistingProfiles().map(profile => (
                  <div key={profile.id} className="profile-card">
                    <div className="profile-image">
                      {profile.photos.length > 0 ? (
                        <img src={profile.photos[0].url} alt={profile.name} />
                      ) : (
                        <div className="no-photo">🐾</div>
                      )}
                    </div>
                    <div className="profile-info">
                      <h4>{profile.name}</h4>
                      <p>{profile.species} • {profile.gender}</p>
                      {profile.breed && <p>{profile.breed}</p>}
                      <div className="personality-tags">
                        {profile.personality.slice(0, 3).map(trait => (
                          <span key={trait} className="tag">{trait}</span>
                        ))}
                      </div>
                    </div>
                    <div className="profile-actions">
                      <button 
                        className={`action-btn ${activeProfile?.id === profile.id ? 'active' : ''}`}
                        onClick={() => setProfileActive(profile)}
                      >
                        {activeProfile?.id === profile.id ? '✅ Active' : '🎯 Set Active'}
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => deleteProfile(profile.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {loadExistingProfiles().length === 0 && (
                <div className="no-profiles">
                  <p>No pet profiles yet! Create your first one above or load some dummy profiles to get started.</p>
                  <div className="dummy-profile-actions">
                    <button 
                      className="action-btn"
                      onClick={handleLoadDummyProfiles}
                    >
                      🐾 Load Dummy Profiles
                    </button>
                  </div>
                </div>
              )}
              
              {loadExistingProfiles().length > 0 && (
                <div className="profile-actions-bottom">
                  <button 
                    className="action-btn"
                    onClick={handleLoadDummyProfiles}
                  >
                    🐾 Add Dummy Profiles
                  </button>
                  <button 
                    className="action-btn"
                    onClick={handleResetToDummyProfiles}
                  >
                    🔄 Reset to Dummy Profiles
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PetProfileCreator;
