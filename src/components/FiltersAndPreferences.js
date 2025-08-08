import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FiltersAndPreferences = ({ onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    habitats: [],
    ageRange: [0, 100],
    distance: 50,
    verifiedOnly: false,
    onlineOnly: false,
    superLikesOnly: false
  });

  const habitats = [
    { id: 'savanna', name: 'Savanna', emoji: '🌾' },
    { id: 'jungle', name: 'Jungle', emoji: '🌴' },
    { id: 'ocean', name: 'Ocean', emoji: '🌊' },
    { id: 'forest', name: 'Forest', emoji: '🌲' },
    { id: 'desert', name: 'Desert', emoji: '🏜️' },
    { id: 'arctic', name: 'Arctic', emoji: '❄️' },
    { id: 'mountains', name: 'Mountains', emoji: '⛰️' },
    { id: 'grassland', name: 'Grassland', emoji: '🌱' }
  ];

  useEffect(() => {
    // Load saved filters from localStorage
    const savedFilters = JSON.parse(localStorage.getItem('datingFilters') || '{}');
    setFilters(prev => ({ ...prev, ...savedFilters }));
  }, []);

  const handleHabitatToggle = (habitatId) => {
    setFilters(prev => ({
      ...prev,
      habitats: prev.habitats.includes(habitatId)
        ? prev.habitats.filter(h => h !== habitatId)
        : [...prev.habitats, habitatId]
    }));
  };

  const handleAgeRangeChange = (min, max) => {
    setFilters(prev => ({
      ...prev,
      ageRange: [min, max]
    }));
  };

  const handleDistanceChange = (distance) => {
    setFilters(prev => ({
      ...prev,
      distance: parseInt(distance)
    }));
  };

  const handleToggle = (key) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleApply = () => {
    localStorage.setItem('datingFilters', JSON.stringify(filters));
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters = {
      habitats: [],
      ageRange: [0, 100],
      distance: 50,
      verifiedOnly: false,
      onlineOnly: false,
      superLikesOnly: false
    };
    setFilters(defaultFilters);
    localStorage.removeItem('datingFilters');
  };

  return (
    <motion.div
      className="filters-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="filters-container"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="filters-header">
          <h2>🔍 Filters & Preferences</h2>
          <button onClick={onClose} className="close-filters-btn">✕</button>
        </div>

        <div className="filters-content">
          {/* Habitats */}
          <div className="filter-section">
            <h3>🌍 Preferred Habitats</h3>
            <div className="habitats-grid">
              {habitats.map(habitat => (
                <button
                  key={habitat.id}
                  onClick={() => handleHabitatToggle(habitat.id)}
                  className={`habitat-btn ${filters.habitats.includes(habitat.id) ? 'selected' : ''}`}
                >
                  <span className="habitat-emoji">{habitat.emoji}</span>
                  <span className="habitat-name">{habitat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Age Range */}
          <div className="filter-section">
            <h3>🎂 Age Range</h3>
            <div className="age-range-container">
              <div className="age-inputs">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.ageRange[0]}
                  onChange={(e) => handleAgeRangeChange(parseInt(e.target.value), filters.ageRange[1])}
                  className="age-input"
                />
                <span>to</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.ageRange[1]}
                  onChange={(e) => handleAgeRangeChange(filters.ageRange[0], parseInt(e.target.value))}
                  className="age-input"
                />
              </div>
              <div className="age-slider">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.ageRange[0]}
                  onChange={(e) => handleAgeRangeChange(parseInt(e.target.value), filters.ageRange[1])}
                  className="range-slider"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.ageRange[1]}
                  onChange={(e) => handleAgeRangeChange(filters.ageRange[0], parseInt(e.target.value))}
                  className="range-slider"
                />
              </div>
            </div>
          </div>

          {/* Distance */}
          <div className="filter-section">
            <h3>📍 Maximum Distance</h3>
            <div className="distance-container">
              <input
                type="range"
                min="1"
                max="100"
                value={filters.distance}
                onChange={(e) => handleDistanceChange(e.target.value)}
                className="distance-slider"
              />
              <span className="distance-value">{filters.distance} km</span>
            </div>
          </div>

          {/* Toggle Options */}
          <div className="filter-section">
            <h3>⚙️ Additional Filters</h3>
            <div className="toggle-options">
              <label className="toggle-option">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={() => handleToggle('verifiedOnly')}
                />
                <span className="toggle-label">
                  <span className="toggle-icon">✅</span>
                  Verified profiles only
                </span>
              </label>

              <label className="toggle-option">
                <input
                  type="checkbox"
                  checked={filters.onlineOnly}
                  onChange={() => handleToggle('onlineOnly')}
                />
                <span className="toggle-label">
                  <span className="toggle-icon">🟢</span>
                  Online now only
                </span>
              </label>

              <label className="toggle-option">
                <input
                  type="checkbox"
                  checked={filters.superLikesOnly}
                  onChange={() => handleToggle('superLikesOnly')}
                />
                <span className="toggle-label">
                  <span className="toggle-icon">⭐</span>
                  Super likes only
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="filters-actions">
          <button onClick={handleReset} className="reset-btn">
            🔄 Reset
          </button>
          <button onClick={handleApply} className="apply-btn">
            ✅ Apply Filters
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FiltersAndPreferences;
