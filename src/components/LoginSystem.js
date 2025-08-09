import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginSystem = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      onLoginSuccess(JSON.parse(currentUser));
    }
  }, [onLoginSuccess]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const handleLogin = () => {
    const { username, password } = formData;
    
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Load user's pet profiles
      loadUserPetProfiles(user.id);
      
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        onLoginSuccess(user);
      }, 1000);
    } else {
      setError('Invalid username or password');
    }
  };

  const loadUserPetProfiles = (userId) => {
    // Load user-specific pet profiles
    const userPetProfiles = JSON.parse(localStorage.getItem(`user_${userId}_petProfiles`) || '[]');
    
    // Set as current pet profiles
    localStorage.setItem('petProfiles', JSON.stringify(userPetProfiles));
    
    // Load user's active profile if it exists
    const activeProfileId = localStorage.getItem(`user_${userId}_activePetProfile`);
    if (activeProfileId) {
      const activeProfile = userPetProfiles.find(p => p.id === activeProfileId);
      if (activeProfile) {
        localStorage.setItem('activePetProfile', JSON.stringify(activeProfile));
      }
    }
    
    // Load user's other data
    const userMatches = JSON.parse(localStorage.getItem(`user_${userId}_matches`) || '[]');
    const userSentInterests = JSON.parse(localStorage.getItem(`user_${userId}_sentInterests`) || '[]');
    const userReceivedInterests = JSON.parse(localStorage.getItem(`user_${userId}_receivedInterests`) || '[]');
    
    localStorage.setItem('matches', JSON.stringify(userMatches));
    localStorage.setItem('sentInterests', JSON.stringify(userSentInterests));
    localStorage.setItem('receivedInterests', JSON.stringify(userReceivedInterests));
  };

  const handleRegister = () => {
    const { username, password, confirmPassword } = formData;
    
    if (!username || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(u => u.username === username);

    if (existingUser) {
      setError('Username already exists');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      createdAt: new Date().toISOString(),
      petProfiles: [],
      matches: [],
      likedAnimals: [],
      sentInterests: [],
      receivedInterests: [],
      chatMessages: {}
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    setSuccess('Registration successful! Welcome to TindrZoo Xtreme! 🐾');
    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 1500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: '', password: '', confirmPassword: '' });
    setError('');
    setSuccess('');
  };

  return (
    <div className="login-system">
      <motion.div 
        className="login-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
          <h1>🐾 TindrZoo Xtreme</h1>
          <p>The wildest animal dating app ever!</p>
        </div>

        <div className="login-tabs">
          <button 
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            🔐 Login
          </button>
          <button 
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            📝 Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="form-input"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className="form-input"
              />
            </div>
          )}

          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ❌ {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              className="success-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ✅ {success}
            </motion.div>
          )}

          <button type="submit" className="submit-btn">
            {isLogin ? '🔐 Login' : '📝 Register'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              onClick={toggleMode}
              className="toggle-btn"
            >
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </p>
        </div>

        <div className="login-features">
          <h3>✨ Features</h3>
          <ul>
            <li>🐾 Create pet profiles</li>
            <li>💕 Swipe and match</li>
            <li>💬 Chat with matches</li>
            <li>⭐ Send interests</li>
            <li>🎮 Play date games</li>
            <li>🔍 Advanced filters</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginSystem;