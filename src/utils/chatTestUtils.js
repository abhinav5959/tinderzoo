// Utility functions for testing the chat system

export const createTestMatch = (animal1Name, animal2Name) => {
  const testMatch = {
    id: `match_${Date.now()}`,
    animal1: {
      id: `pet_${animal1Name.toLowerCase()}`,
      name: animal1Name,
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
      species: "Cat",
      breed: "Mixed"
    },
    animal2: {
      id: `pet_${animal2Name.toLowerCase()}`,
      name: animal2Name,
      image: "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400",
      species: "Dog", 
      breed: "Golden Retriever"
    },
    type: 'test-match',
    matchedAt: new Date().toISOString()
  };

  // Add to matches
  const matches = JSON.parse(localStorage.getItem('matches') || '[]');
  matches.push(testMatch);
  localStorage.setItem('matches', JSON.stringify(matches));

  console.log(`Test match created: ${animal1Name} ↔ ${animal2Name}`);
  return testMatch;
};

export const createTestMessage = (matchId, senderName, text, isUser = false) => {
  const message = {
    id: Date.now(),
    text: text,
    sender: isUser ? 'user' : 'match',
    senderName: senderName,
    timestamp: new Date().toISOString(),
    read: false
  };

  // Add to chat messages
  const messages = JSON.parse(localStorage.getItem(`chat_${matchId}`) || '[]');
  messages.push(message);
  localStorage.setItem(`chat_${matchId}`, JSON.stringify(messages));

  console.log(`Test message created in ${matchId}: ${senderName} says "${text}"`);
  return message;
};

export const showAllChats = () => {
  const matches = JSON.parse(localStorage.getItem('matches') || '[]');
  
  console.log('=== ALL CHAT DATA ===');
  matches.forEach(match => {
    const messages = JSON.parse(localStorage.getItem(`chat_${match.id}`) || '[]');
    console.log(`Chat ${match.id} (${match.animal1.name} ↔ ${match.animal2.name}):`, messages);
  });
  console.log('====================');
  
  return matches;
};

export const clearAllChats = () => {
  const matches = JSON.parse(localStorage.getItem('matches') || '[]');
  matches.forEach(match => {
    localStorage.removeItem(`chat_${match.id}`);
  });
  localStorage.removeItem('matches');
  console.log('All chats and matches cleared');
};

