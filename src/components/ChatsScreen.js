import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ChatsScreen = ({ onOpenChat }) => {
  const [matches, setMatches] = useState([]);
  const [chatMessages, setChatMessages] = useState({});

  useEffect(() => {
    loadMatchesAndChats();
    
    // Refresh chat data every 5 seconds to show new messages
    const interval = setInterval(loadMatchesAndChats, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadMatchesAndChats = () => {
    const savedMatches = JSON.parse(localStorage.getItem('matches') || '[]');
    
    // Load messages for each match from individual chat storage
    const allChatMessages = {};
    savedMatches.forEach(match => {
      const matchMessages = JSON.parse(localStorage.getItem(`chat_${match.id}`) || '[]');
      allChatMessages[match.id] = matchMessages;
    });

    setMatches(savedMatches);
    setChatMessages(allChatMessages);
  };

  const getLastMessage = (matchId) => {
    const messages = chatMessages[matchId] || [];
    return messages.length > 0 ? messages[messages.length - 1] : null;
  };

  const getUnreadCount = (matchId) => {
    const messages = chatMessages[matchId] || [];
    return messages.filter(msg => !msg.read && !msg.isOwn).length;
  };

  const formatLastMessage = (message) => {
    if (!message) return 'Start a conversation...';
    return message.text.length > 50 ? message.text.substring(0, 50) + '...' : message.text;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="chats-screen">
      <div className="chats-header">
        <h1>💬 Chats</h1>
        <p>Connect with your matches!</p>
      </div>

      <div className="chats-content">
        {matches.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>No chats yet</h3>
            <p>Get some matches first, then start chatting!</p>
          </div>
        ) : (
          <div className="chats-list">
            {matches.map((match) => {
              const lastMessage = getLastMessage(match.id);
              const unreadCount = getUnreadCount(match.id);
              
              return (
                <motion.div 
                  key={match.id}
                  className="chat-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => onOpenChat(match)}
                >
                  <div className="chat-avatar">
                    <img src={match.animal2.image} alt={match.animal2.name} />
                    {unreadCount > 0 && (
                      <div className="unread-badge">{unreadCount}</div>
                    )}
                  </div>
                  
                  <div className="chat-info">
                    <div className="chat-header">
                      <h3 className="chat-name">{match.animal2.name}</h3>
                      <span className="chat-time">
                        {formatTime(lastMessage?.timestamp)}
                      </span>
                    </div>
                    <p className="chat-preview">
                      {formatLastMessage(lastMessage)}
                    </p>
                  </div>
                  
                  <div className="chat-arrow">→</div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsScreen;