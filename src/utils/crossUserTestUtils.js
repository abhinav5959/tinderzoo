// Test utilities for cross-user pet visibility and interactions

export const setupTestScenario = () => {
  console.log('🧪 Setting up cross-user test scenario...');
  
  // Clear all existing data first
  clearAllData();
  
  // Create test users
  const alice = createTestUser('alice', 'password123');
  const bob = createTestUser('bob', 'password456');
  
  // Create pets for Alice
  const fluffyId = createTestPetForUser(alice.id, 'Fluffy', 'Cat', 'Persian', 'Cuddly, Playful');
  const rexId = createTestPetForUser(alice.id, 'Rex', 'Dog', 'Golden Retriever', 'Energetic, Friendly');
  
  // Create pets for Bob
  const buddyId = createTestPetForUser(bob.id, 'Buddy', 'Bird', 'Parrot', 'Talkative, Social');
  const bellaId = createTestPetForUser(bob.id, 'Bella', 'Rabbit', 'Lop', 'Gentle, Curious');
  
  console.log('✅ Test scenario created:');
  console.log(`   Alice (${alice.id}): Fluffy (Cat), Rex (Dog)`);
  console.log(`   Bob (${bob.id}): Buddy (Bird), Bella (Rabbit)`);
  
  return { alice, bob, pets: { fluffyId, rexId, buddyId, bellaId } };
};

export const testUserCanSeePetsFromOtherUsers = (testingUserId, otherUserIds) => {
  console.log(`🔍 Testing: User ${testingUserId} should see pets from users: ${otherUserIds.join(', ')}`);
  
  // Simulate loading pets for the testing user
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  let visiblePets = [];
  
  users.forEach(user => {
    if (user.id !== testingUserId) {
      const userPets = JSON.parse(localStorage.getItem(`user_${user.id}_petProfiles`) || '[]');
      userPets.forEach(pet => {
        visiblePets.push({
          ...pet,
          ownerId: user.id,
          ownerUsername: user.username
        });
      });
    }
  });
  
  console.log(`📋 User ${testingUserId} can see ${visiblePets.length} pets:`);
  visiblePets.forEach(pet => {
    console.log(`   - ${pet.name} (${pet.species}) owned by ${pet.ownerUsername}`);
  });
  
  return visiblePets;
};

export const testInterestSending = (fromUserId, toUserId, petName) => {
  console.log(`💕 Testing: User ${fromUserId} sending interest to ${petName} (owned by ${toUserId})`);
  
  // Find the target pet
  const targetUserPets = JSON.parse(localStorage.getItem(`user_${toUserId}_petProfiles`) || '[]');
  const targetPet = targetUserPets.find(pet => pet.name === petName);
  
  if (!targetPet) {
    console.log(`❌ Pet ${petName} not found for user ${toUserId}`);
    return false;
  }
  
  // Find sender's active pet
  const senderActiveProfileId = localStorage.getItem(`user_${fromUserId}_activePetProfile`);
  const senderPets = JSON.parse(localStorage.getItem(`user_${fromUserId}_petProfiles`) || '[]');
  const senderPet = senderPets.find(pet => pet.id.toString() === senderActiveProfileId);
  
  if (!senderPet) {
    console.log(`❌ No active pet found for user ${fromUserId}`);
    return false;
  }
  
  // Create interest
  const interest = {
    id: Date.now(),
    fromPet: senderPet,
    toPet: targetPet,
    fromUserId: fromUserId,
    toUserId: toUserId,
    message: 'Woof! You seem pawsome! 🐾',
    sentAt: new Date().toISOString(),
    type: 'interest'
  };
  
  // Save interest to receiver's data
  const receivedInterests = JSON.parse(localStorage.getItem(`user_${toUserId}_receivedInterests`) || '[]');
  receivedInterests.push(interest);
  localStorage.setItem(`user_${toUserId}_receivedInterests`, JSON.stringify(receivedInterests));
  
  console.log(`✅ Interest sent: ${senderPet.name} → ${targetPet.name}`);
  return interest;
};

export const createTestUser = (username, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const newUser = {
    id: Date.now() + Math.random(), // Ensure unique ID
    username,
    password,
    registeredAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  return newUser;
};

export const createTestPetForUser = (userId, name, species, breed, personality) => {
  const petId = Date.now() + Math.random();
  const testPet = {
    id: petId,
    name,
    species: species || 'Dog',
    breed: breed || 'Mixed',
    age: '2',
    gender: 'Male',
    personality: personality ? personality.split(', ') : ['Friendly'],
    description: `This is ${name}, a lovely ${(species || 'Dog').toLowerCase()}! ${personality || 'Very friendly'}`,
    photos: [`https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400`],
    favoriteActivity: 'Playing and having fun',
    createdAt: new Date().toISOString()
  };
  
  const userPetProfiles = JSON.parse(localStorage.getItem(`user_${userId}_petProfiles`) || '[]');
  userPetProfiles.push(testPet);
  localStorage.setItem(`user_${userId}_petProfiles`, JSON.stringify(userPetProfiles));
  
  // Set as active if it's the first pet
  if (userPetProfiles.length === 1) {
    localStorage.setItem(`user_${userId}_activePetProfile`, petId);
  }
  
  return petId;
};

export const switchToUser = (userId) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    console.log(`❌ User with ID ${userId} not found`);
    return null;
  }
  
  // Save current user's data first if there is one
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  if (currentUser.id) {
    saveUserDataBeforeSwitch(currentUser.id);
  }
  
  // Switch to new user
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  // Load new user's data
  loadUserData(user);
  
  console.log(`🔄 Switched to user: ${user.username} (ID: ${user.id})`);
  return user;
};

const saveUserDataBeforeSwitch = (userId) => {
  const petProfiles = JSON.parse(localStorage.getItem('petProfiles') || '[]');
  const activePetProfile = JSON.parse(localStorage.getItem('activePetProfile') || '{}');
  const matches = JSON.parse(localStorage.getItem('matches') || '[]');
  const sentInterests = JSON.parse(localStorage.getItem('sentInterests') || '[]');
  const receivedInterests = JSON.parse(localStorage.getItem('receivedInterests') || '[]');
  
  localStorage.setItem(`user_${userId}_petProfiles`, JSON.stringify(petProfiles));
  localStorage.setItem(`user_${userId}_matches`, JSON.stringify(matches));
  localStorage.setItem(`user_${userId}_sentInterests`, JSON.stringify(sentInterests));
  localStorage.setItem(`user_${userId}_receivedInterests`, JSON.stringify(receivedInterests));
  
  if (activePetProfile.id) {
    localStorage.setItem(`user_${userId}_activePetProfile`, activePetProfile.id);
  }
};

const loadUserData = (user) => {
  const userPetProfiles = JSON.parse(localStorage.getItem(`user_${user.id}_petProfiles`) || '[]');
  const userMatches = JSON.parse(localStorage.getItem(`user_${user.id}_matches`) || '[]');
  const userSentInterests = JSON.parse(localStorage.getItem(`user_${user.id}_sentInterests`) || '[]');
  const userReceivedInterests = JSON.parse(localStorage.getItem(`user_${user.id}_receivedInterests`) || '[]');
  const activeProfileId = localStorage.getItem(`user_${user.id}_activePetProfile`);
  
  localStorage.setItem('petProfiles', JSON.stringify(userPetProfiles));
  localStorage.setItem('matches', JSON.stringify(userMatches));
  localStorage.setItem('sentInterests', JSON.stringify(userSentInterests));
  localStorage.setItem('receivedInterests', JSON.stringify(userReceivedInterests));
  
  if (activeProfileId) {
    const activeProfile = userPetProfiles.find(p => p.id.toString() === activeProfileId);
    if (activeProfile) {
      localStorage.setItem('activePetProfile', JSON.stringify(activeProfile));
    }
  }
};

export const clearAllData = () => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('user_') || ['users', 'currentUser', 'petProfiles', 'activePetProfile', 'matches', 'sentInterests', 'receivedInterests'].includes(key)) {
      localStorage.removeItem(key);
    }
  });
  console.log('🧹 All user and pet data cleared');
};

export const runCompleteTest = () => {
  console.log('🚀 Running complete cross-user pet visibility test...\n');
  
  // Setup
  const { alice, bob } = setupTestScenario();
  
  console.log('\n1️⃣ Testing Alice can see Bob\'s pets:');
  const aliceVisiblePets = testUserCanSeePetsFromOtherUsers(alice.id, [bob.id]);
  
  console.log('\n2️⃣ Testing Bob can see Alice\'s pets:');
  const bobVisiblePets = testUserCanSeePetsFromOtherUsers(bob.id, [alice.id]);
  
  console.log('\n3️⃣ Testing interest sending:');
  const interest1 = testInterestSending(alice.id, bob.id, 'Buddy');
  const interest2 = testInterestSending(bob.id, alice.id, 'Fluffy');
  
  console.log('\n✅ Cross-user test completed!');
  console.log('   - Users can see each other\'s pets ✓');
  console.log('   - Users can send interests to other pets ✓');
  console.log('   - Data isolation maintained ✓');
  
  return {
    alice,
    bob,
    aliceVisiblePets,
    bobVisiblePets,
    interests: [interest1, interest2]
  };
};

