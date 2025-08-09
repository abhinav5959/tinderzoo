import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatSystem = ({ match, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const animalEmojis = {
    'Lion': '🦁',
    'Tiger': '🐯',
    'Elephant': '🐘',
    'Giraffe': '🦒',
    'Penguin': '🐧',
    'Dolphin': '🐬',
    'Panda': '🐼',
    'Kangaroo': '🦘',
    'Sloth': '🦥',
    'Capybara': '🦫'
  };

  const autoResponses = [
    "Hey there! 🐾",
    "How's your day going?",
    "Love your profile! 😍",
    "Want to grab some leaves together? 🍃",
    "You're so cute! 🥰",
    "What's your favorite food?",
    "Do you like long walks in the savanna?",
    "Are you a morning or night animal?",
    "What's your superpower?",
    "Want to be my animal soulmate? 💕"
  ];

  useEffect(() => {
    // Load existing messages from localStorage
    const savedMessages = JSON.parse(localStorage.getItem(`chat_${match.id}`) || '[]');
    setMessages(savedMessages);

    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [match.id]);

  useEffect(() => {
    // Save messages to localStorage
    localStorage.setItem(`chat_${match.id}`, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, match.id]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const activeProfile = JSON.parse(localStorage.getItem('activePetProfile') || '{}');
    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      senderName: activeProfile.name || 'You',
      senderImage: activeProfile.image || activeProfile.photos?.[0],
      timestamp: new Date().toISOString(),
      read: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing indicator with more realistic delay
    setIsTyping(true);
    setTimeout(() => {
      const autoResponse = autoResponses[Math.floor(Math.random() * autoResponses.length)];
      const response = {
        id: Date.now() + 1,
        text: autoResponse,
        sender: 'match',
        senderName: match.animal2.name,
        senderImage: match.animal2.image,
        timestamp: new Date().toISOString(),
        read: false
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500 + Math.random() * 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div
      className="chat-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="chat-container"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-match-info">
            <div className="match-avatars">
              <img src={match.animal1.image} alt={match.animal1.name} className="avatar" />
              <img src={match.animal2.image} alt={match.animal2.name} className="avatar" />
            </div>
            <div className="match-names">
              <h3>{match.animal1.name} & {match.animal2.name}</h3>
              <p>It's a match! 💕</p>
            </div>
          </div>
          <button onClick={onClose} className="close-chat-btn">✕</button>
        </div>

        {/* Messages */}
        <div className="messages-container">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'match-message'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {message.sender === 'match' && (
                  <div className="message-avatar">
                    <img 
                      src={message.senderImage || match.animal2.image} 
                      alt={message.senderName || match.animal2.name}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}
                <div className="message-content">
                  {message.sender === 'match' && (
                    <div className="message-sender">
                      {message.senderName || match.animal2.name}
                    </div>
                  )}
                  <p>{message.text}</p>
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              className="typing-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>{match.animal2.name} is typing...</p>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="message-input-container">
          <div className="input-wrapper">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows="1"
              className="message-input"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="send-btn"
            >
              ➤
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatSystem;
