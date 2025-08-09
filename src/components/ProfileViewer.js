import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileViewer = ({ profile, isOwnProfile = false, onClose, onEdit, onDelete }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showFullPhoto, setShowFullPhoto] = useState(false);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === (profile.photos?.length - 1) ? 0 : prev + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? (profile.photos?.length - 1) : prev - 1
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleOverlayClick = (e) => {
    // Close if clicking on the overlay background (not the content)
    if (e.target.className === 'profile-viewer-overlay') {
      onClose();
    }
  };

  return (
    <div className="profile-viewer-overlay" onClick={handleOverlayClick}>
      <motion.div 
        className="profile-viewer-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="profile-viewer-header">
          <h2>{isOwnProfile ? '🐕 My Pet Profile' : '🐾 Pet Profile'}</h2>
          <button 
            onClick={onClose} 
            className="close-profile-btn"
            title="Close Profile"
            aria-label="Close Profile"
          >
            ✕
          </button>
        </div>

        {/* Photo Gallery */}
        <div className="profile-photo-section">
          {profile.photos && profile.photos.length > 0 ? (
            <div className="photo-gallery">
              <div className="main-photo-container">
                <img 
                  src={profile.photos[currentPhotoIndex]?.url || profile.photos[currentPhotoIndex]} 
                  alt={`${profile.name} photo ${currentPhotoIndex + 1}`}
                  className="main-photo"
                  onClick={() => setShowFullPhoto(true)}
                />
                
                {profile.photos.length > 1 && (
                  <>
                    <button className="photo-nav-btn prev" onClick={prevPhoto}>
                      ‹
                    </button>
                    <button className="photo-nav-btn next" onClick={nextPhoto}>
                      ›
                    </button>
                    <div className="photo-counter">
                      {currentPhotoIndex + 1} / {profile.photos.length}
                    </div>
                  </>
                )}
              </div>
              
              {profile.photos.length > 1 && (
                <div className="photo-thumbnails">
                  {profile.photos.map((photo, index) => (
                    <img 
                      key={index}
                      src={photo?.url || photo}
                      alt={`${profile.name} thumbnail ${index + 1}`}
                      className={`thumbnail ${index === currentPhotoIndex ? 'active' : ''}`}
                      onClick={() => setCurrentPhotoIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="no-photo-placeholder">
              <div className="no-photo-icon">📷</div>
              <p>No photos available</p>
            </div>
          )}
        </div>

        {/* Profile Information */}
        <div className="profile-info-section">
          <div className="profile-basic-info">
            <h1 className="profile-name">{profile.name}</h1>
            <div className="profile-badges">
              <span className="badge species">{profile.species}</span>
              <span className="badge breed">{profile.breed}</span>
              <span className="badge age">{profile.age}</span>
              <span className="badge gender">{profile.gender}</span>
            </div>
          </div>

          <div className="profile-description">
            <h3>About {profile.name}</h3>
            <p>{profile.description}</p>
          </div>

          <div className="profile-personality">
            <h3>Personality</h3>
            <div className="personality-tags">
              {profile.personality?.map((trait, index) => (
                <span key={index} className="personality-tag">
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <div className="profile-favorites">
            <h3>Favorite Activity</h3>
            <p className="favorite-activity">{profile.favoriteActivity}</p>
          </div>

          {isOwnProfile && (
            <div className="profile-meta">
              <p className="created-date">
                Profile created: {formatDate(profile.createdAt)}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isOwnProfile && (
          <div className="profile-actions">
            <button 
              className="action-btn edit-btn"
              onClick={onEdit}
            >
              ✏️ Edit Profile
            </button>
            <button 
              className="action-btn delete-btn"
              onClick={onDelete}
            >
              🗑️ Delete Profile
            </button>
          </div>
        )}

        {!isOwnProfile && (
          <div className="profile-actions">
            <button 
              className="action-btn like-btn"
              onClick={() => {
                alert(`You liked ${profile.name}'s profile! 💕`);
                onClose();
              }}
            >
              ❤️ Like Profile
            </button>
            <button 
              className="action-btn interest-btn"
              onClick={() => {
                alert(`Interest sent to ${profile.name}! 🐾`);
                onClose();
              }}
            >
              🐾 Send Interest
            </button>
          </div>
        )}
      </motion.div>

      {/* Full Photo Modal */}
      <AnimatePresence>
        {showFullPhoto && (
          <motion.div 
            className="full-photo-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFullPhoto(false)}
          >
            <motion.img 
              src={profile.photos[currentPhotoIndex]?.url || profile.photos[currentPhotoIndex]}
              alt={`${profile.name} full photo`}
              className="full-photo"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              className="close-full-photo"
              onClick={() => setShowFullPhoto(false)}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileViewer;