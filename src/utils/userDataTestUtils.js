// Utility functions for testing user-specific data persistence

export const showUserData = (userId = null) => {
  const currentUser = userId ? { id: userId } : JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  if (!currentUser.id) {
    console.log('No user logged in or user ID not provided');
    return;
  }

  console.log(`=== USER DATA FOR USER ${currentUser.id} ===`);
  
  const userPetProfiles = JSON.parse(localStorage.getItem(`user_${currentUser.id}_petProfiles`) || '[]');
  const userMatches = JSON.parse(localStorage.getItem(`user_${currentUser.id}_matches`) || '[]');
  const userSentInterests = JSON.parse(localStorage.getItem(`user_${currentUser.id}_sentInterests`) || '[]');
  const userReceivedInterests = JSON.parse(localStorage.getItem(`user_${currentUser.id}_receivedInterests`) || '[]');
  const activeProfileId = localStorage.getItem(`user_${currentUser.id}_activePetProfile`);
  
  console.log('Pet Profiles:', userPetProfiles);
  console.log('Active Profile ID:', activeProfileId);
  console.log('Matches:', userMatches);
  console.log('Sent Interests:', userSentInterests);
  console.log('Received Interests:', userReceivedInterests);
  console.log('=================================');
  
  return {
    petProfiles: userPetProfiles,
    activeProfileId,
    matches: userMatches,
    sentInterests: userSentInterests,
    receivedInterests: userReceivedInterests
  };
};

export const showAllUsersData = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  console.log('=== ALL USERS DATA ===');
  users.forEach(user => {
    console.log(`\n--- User: ${user.username} (ID: ${user.id}) ---`);
    showUserData(user.id);
  });
  console.log('=====================');
  
  return users;
};

export const createTestUser = (username, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const newUser = {
    id: Date.now(),
    username,
    password,
    registeredAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  console.log(`Test user created: ${username} (ID: ${newUser.id})`);
  return newUser;
};

export const createTestPetForUser = (userId, petName, species = 'Dog') => {
  const testPet = {
    id: Date.now(),
    name: petName,
    species: species,
    breed: 'Mixed',
    age: '2',
    gender: 'Male',
    personality: ['Playful', 'Friendly'],
    description: `This is ${petName}, a lovely ${species.toLowerCase()}!`,
    photos: [],
    favoriteActivity: 'Playing fetch',
    createdAt: new Date().toISOString()
  };
  
  const userPetProfiles = JSON.parse(localStorage.getItem(`user_${userId}_petProfiles`) || '[]');
  userPetProfiles.push(testPet);
  localStorage.setItem(`user_${userId}_petProfiles`, JSON.stringify(userPetProfiles));
  
  // Set as active if it's the first pet
  if (userPetProfiles.length === 1) {
    localStorage.setItem(`user_${userId}_activePetProfile`, testPet.id);
  }
  
  console.log(`Test pet created for user ${userId}: ${petName}`);
  return testPet;
};

export const switchToUser = (userId) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    console.log(`User with ID ${userId} not found`);
    return;
  }
  
  // Simulate login by setting current user and loading their data
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  // Load user's pet profiles
  const userPetProfiles = JSON.parse(localStorage.getItem(`user_${user.id}_petProfiles`) || '[]');
  localStorage.setItem('petProfiles', JSON.stringify(userPetProfiles));
  
  // Load user's active profile
  const activeProfileId = localStorage.getItem(`user_${user.id}_activePetProfile`);
  if (activeProfileId) {
    const activeProfile = userPetProfiles.find(p => p.id.toString() === activeProfileId);
    if (activeProfile) {
      localStorage.setItem('activePetProfile', JSON.stringify(activeProfile));
    }
  }
  
  console.log(`Switched to user: ${user.username} (ID: ${user.id})`);
  showUserData(user.id);
  
  return user;
};

export const clearAllUserData = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  users.forEach(user => {
    localStorage.removeItem(`user_${user.id}_petProfiles`);
    localStorage.removeItem(`user_${user.id}_matches`);
    localStorage.removeItem(`user_${user.id}_sentInterests`);
    localStorage.removeItem(`user_${user.id}_receivedInterests`);
    localStorage.removeItem(`user_${user.id}_activePetProfile`);
  });
  
  localStorage.removeItem('users');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('petProfiles');
  localStorage.removeItem('activePetProfile');
  localStorage.removeItem('matches');
  localStorage.removeItem('sentInterests');
  localStorage.removeItem('receivedInterests');
  
  console.log('All user data cleared');
};

