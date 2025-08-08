import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SettingsScreen = () => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [stats, setStats] = useState({
    totalLikes: 0,
    totalMatches: 0,
    totalInterests: 0,
    totalProfiles: 0
  });

  React.useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const likes = JSON.parse(localStorage.getItem('likedAnimals') || '[]');
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    const interests = JSON.parse(localStorage.getItem('sentInterests') || '[]');
    const profiles = JSON.parse(localStorage.getItem('petProfiles') || '[]');

    setStats({
      totalLikes: likes.length,
      totalMatches: matches.length,
      totalInterests: interests.length,
      totalProfiles: profiles.length
    });
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone!')) {
      localStorage.removeItem('likedAnimals');
      localStorage.removeItem('matches');
      localStorage.removeItem('sentInterests');
      localStorage.removeItem('receivedInterests');
      localStorage.removeItem('chatMessages');
      localStorage.removeItem('petProfiles');
      localStorage.removeItem('activePetProfile');
      
      setStats({
        totalLikes: 0,
        totalMatches: 0,
        totalInterests: 0,
        totalProfiles: 0
      });
      
      alert('All data cleared successfully!');
    }
  };

  const handleExportData = () => {
    const data = {
      likedAnimals: JSON.parse(localStorage.getItem('likedAnimals') || '[]'),
      matches: JSON.parse(localStorage.getItem('matches') || '[]'),
      sentInterests: JSON.parse(localStorage.getItem('sentInterests') || '[]'),
      receivedInterests: JSON.parse(localStorage.getItem('receivedInterests') || '[]'),
      chatMessages: JSON.parse(localStorage.getItem('chatMessages') || '{}'),
      petProfiles: JSON.parse(localStorage.getItem('petProfiles') || '[]'),
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `tindrzoo-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    alert('Data exported successfully!');
  };

  const handleResetToDummyProfiles = () => {
    if (window.confirm('Reset to dummy profiles? This will clear your current profiles.')) {
      // This would call loadDummyProfiles() if available
      alert('Feature not implemented yet - would reset to dummy profiles');
    }
  };

  return (
    <div className="settings-screen">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Manage your TindrZoo experience</p>
      </div>

      <div className="settings-content">
        {/* Statistics Section */}
        <div className="settings-section">
          <h2>📊 Your Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-number">{stats.totalLikes}</div>
              <div className="stat-label">Total Likes</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💕</div>
              <div className="stat-number">{stats.totalMatches}</div>
              <div className="stat-label">Matches</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🐾</div>
              <div className="stat-number">{stats.totalInterests}</div>
              <div className="stat-label">Interests Sent</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🐕</div>
              <div className="stat-number">{stats.totalProfiles}</div>
              <div className="stat-label">Pet Profiles</div>
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="settings-section">
          <h2>🗄️ Data Management</h2>
          <div className="settings-actions">
            <button 
              className="settings-btn export-btn"
              onClick={handleExportData}
            >
              📤 Export Data
            </button>
            <button 
              className="settings-btn reset-btn"
              onClick={handleResetToDummyProfiles}
            >
              🔄 Reset to Dummy Profiles
            </button>
            <button 
              className="settings-btn danger-btn"
              onClick={handleClearData}
            >
              🗑️ Clear All Data
            </button>
          </div>
        </div>

        {/* App Information Section */}
        <div className="settings-section">
          <h2>ℹ️ App Information</h2>
          <div className="app-info">
            <div className="info-item">
              <strong>Version:</strong> 1.0.0
            </div>
            <div className="info-item">
              <strong>Created:</strong> TindrZoo Xtreme
            </div>
            <div className="info-item">
              <strong>Description:</strong> The wildest animal dating app ever!
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="settings-section">
          <h2>✨ Features</h2>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🐾</span>
              <span className="feature-text">Swipe through animal profiles</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💕</span>
              <span className="feature-text">Match with compatible pets</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💬</span>
              <span className="feature-text">Chat with your matches</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⭐</span>
              <span className="feature-text">Send super likes and interests</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎮</span>
              <span className="feature-text">Play fun dating mini-games</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔍</span>
              <span className="feature-text">Advanced filtering options</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;