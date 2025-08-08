import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PetProfileManager = ({ onBack }) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [petBio, setPetBio] = useState('');
  const [petImage, setPetImage] = useState('');

  const petTypes = [
    'Dog', 'Cat', 'Bird', 'Fish', 'Hamster', 'Rabbit', 
    'Guinea Pig', 'Turtle', 'Snake', 'Lizard', 'Other'
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const savedProfile = localStorage.getItem('petProfile');
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        setProfile(profileData);
        setPetName(profileData.petName || '');
        setPetType(profileData.petType || '');
        setPetBio(profileData.petBio || '');
        setPetImage(profileData.petImage || '');
      }
    } catch (error) {
      setError('Error loading profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      const updatedProfile = {
        ...profile,
        petName,
        petType,
        petBio,
        petImage: petImage || `https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=${petName}`,
        updatedAt: new Date()
      };

      localStorage.setItem('petProfile', JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      setError('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPetName(profile?.petName || '');
    setPetType(profile?.petType || '');
    setPetBio(profile?.petBio || '');
    setPetImage(profile?.petImage || '');
    setIsEditing(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your pet profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">😿</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onBack}
            className="bg-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-funny font-bold text-gray-800 mb-2">
            Pet Profile 🐾
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Edit your pet profile' : 'Your pet profile'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* Profile Display */}
        {!isEditing && profile && (
          <div className="space-y-6">
            {/* Pet Image */}
            <div className="text-center">
              <img
                src={profile.petImage}
                alt={profile.petName}
                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-purple-200"
              />
            </div>

            {/* Pet Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name</label>
                <p className="text-lg font-semibold text-gray-800">{profile.petName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pet Type</label>
                <p className="text-lg font-semibold text-gray-800">{profile.petType}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <p className="text-gray-600">{profile.petBio}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                <p className="text-gray-600">
                  {profile.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-purple-500 text-white py-3 rounded-xl font-medium hover:bg-purple-600 transition-colors"
              >
                Edit Profile ✏️
              </button>
              <button
                onClick={onBack}
                className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors"
              >
                Back to App 🦁
              </button>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Name
                </label>
                <input
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Fluffy"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Type
                </label>
                <select
                  value={petType}
                  onChange={(e) => setPetType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select pet type</option>
                  {petTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Bio
                </label>
                <textarea
                  value={petBio}
                  onChange={(e) => setPetBio(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Tell us about your pet's personality..."
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Image URL (optional)
                </label>
                <input
                  type="url"
                  value={petImage}
                  onChange={(e) => setPetImage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/pet-image.jpg"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-purple-500 text-white py-3 rounded-xl font-medium hover:bg-purple-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes 💾'}
                </button>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default PetProfileManager;
