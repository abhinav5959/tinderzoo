// Debug utilities for pet visibility issues

export const debugUserPets = () => {
  console.log('🔍 DEBUGGING PET VISIBILITY SYSTEM');
  console.log('===================================');
  
  // Check all users
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  console.log(`Total users: ${users.length}`);
  
  users.forEach((user, index) => {
    console.log(`\n${index + 1}. User: ${user.username} (ID: ${user.id})`);
    
    // Check pet profiles for this user
    const userPets = JSON.parse(localStorage.getItem(`user_${user.id}_petProfiles`) || '[]');
    console.log(`   Pet profiles: ${userPets.length}`);
    
    userPets.forEach((pet, petIndex) => {
      console.log(`     ${petIndex + 1}. ${pet.name} (${pet.species}) - ID: ${pet.id}`);
    });
    
    // Check active profile
    const activeProfileId = localStorage.getItem(`user_${user.id}_activePetProfile`);
    console.log(`   Active profile ID: ${activeProfileId}`);
  });
  
  // Check current user
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  console.log(`\nCurrent logged-in user: ${currentUser.username || 'None'} (ID: ${currentUser.id || 'None'})`);
  
  // Check session storage
  const sessionPets = JSON.parse(localStorage.getItem('petProfiles') || '[]');
  console.log(`Session pet profiles: ${sessionPets.length}`);
  
  console.log('\n===================================');
  
  return { users, currentUser, sessionPets };
};

export const simulateLoadPets = () => {
  console.log('🧪 SIMULATING PET LOADING PROCESS');
  console.log('==================================');
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  let allPets = [];
  
  console.log(`Loading pets for current user: ${currentUser.username || 'Unknown'}`);
  console.log(`Should see pets from other ${users.length - 1} users`);
  
  users.forEach(user => {
    if (user.id !== currentUser.id) {
      const userPets = JSON.parse(localStorage.getItem(`user_${user.id}_petProfiles`) || '[]');
      console.log(`\n  ${user.username}: ${userPets.length} pets`);
      
      userPets.forEach(pet => {
        console.log(`    - ${pet.name} (${pet.species})`);
      });
      
      allPets = [...allPets, ...userPets];
    }
  });
  
  console.log(`\nTotal pets that should be visible: ${allPets.length}`);
  console.log('==================================');
  
  return allPets;
};

export const createTestData = () => {
  console.log('🛠️ CREATING TEST DATA');
  console.log('======================');
  
  // Clear existing data
  localStorage.removeItem('users');
  localStorage.removeItem('currentUser');
  
  // Create test users
  const alice = {
    id: Date.now(),
    username: 'alice',
    password: 'password123',
    registeredAt: new Date().toISOString()
  };
  
  const bob = {
    id: Date.now() + 1,
    username: 'bob', 
    password: 'password456',
    registeredAt: new Date().toISOString()
  };
  
  const users = [alice, bob];
  localStorage.setItem('users', JSON.stringify(users));
  
  // Create pets for Alice
  const alicePets = [
    {
      id: Date.now() + 100,
      name: 'Fluffy',
      species: 'Cat',
      breed: 'Persian',
      age: '3',
      gender: 'Female',
      personality: ['Cuddly', 'Playful'],
      description: 'A lovely Persian cat who loves to cuddle!',
      photos: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'],
      favoriteActivity: 'Sleeping in sunny spots',
      createdAt: new Date().toISOString()
    }
  ];
  
  // Create pets for Bob
  const bobPets = [
    {
      id: Date.now() + 200,
      name: 'Rex',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: '2',
      gender: 'Male',
      personality: ['Energetic', 'Friendly'],
      description: 'A energetic golden retriever who loves fetch!',
      photos: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=400'],
      favoriteActivity: 'Playing fetch',
      createdAt: new Date().toISOString()
    }
  ];
  
  // Save pets to user-specific storage
  localStorage.setItem(`user_${alice.id}_petProfiles`, JSON.stringify(alicePets));
  localStorage.setItem(`user_${bob.id}_petProfiles`, JSON.stringify(bobPets));
  
  // Set active profiles
  localStorage.setItem(`user_${alice.id}_activePetProfile`, alicePets[0].id);
  localStorage.setItem(`user_${bob.id}_activePetProfile`, bobPets[0].id);
  
  console.log('Test data created:');
  console.log(`- Alice (ID: ${alice.id}) with pet Fluffy`);
  console.log(`- Bob (ID: ${bob.id}) with pet Rex`);
  console.log('======================');
  
  return { alice, bob, alicePets, bobPets };
};

export const loginAsUser = (username) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.username === username);
  
  if (!user) {
    console.log(`❌ User ${username} not found`);
    return null;
  }
  
  // Set as current user
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  // Load their data
  const userPets = JSON.parse(localStorage.getItem(`user_${user.id}_petProfiles`) || '[]');
  localStorage.setItem('petProfiles', JSON.stringify(userPets));
  
  const activeProfileId = localStorage.getItem(`user_${user.id}_activePetProfile`);
  if (activeProfileId) {
    const activeProfile = userPets.find(p => p.id.toString() === activeProfileId);
    if (activeProfile) {
      localStorage.setItem('activePetProfile', JSON.stringify(activeProfile));
    }
  }
  
  console.log(`✅ Logged in as ${username}`);
  return user;
};

export const runFullDebugTest = () => {
  console.log('🚀 RUNNING FULL DEBUG TEST');
  console.log('===========================');
  
  // Create test data
  const testData = createTestData();
  
  // Login as Alice and check what she sees
  console.log('\n1️⃣ Login as Alice:');
  loginAsUser('alice');
  const aliceVisiblePets = simulateLoadPets();
  
  // Login as Bob and check what he sees  
  console.log('\n2️⃣ Login as Bob:');
  loginAsUser('bob');
  const bobVisiblePets = simulateLoadPets();
  
  console.log('\n📊 SUMMARY:');
  console.log(`Alice should see ${aliceVisiblePets.length} pets (Bob's pets)`);
  console.log(`Bob should see ${bobVisiblePets.length} pets (Alice's pets)`);
  
  if (aliceVisiblePets.length === 0 && bobVisiblePets.length === 0) {
    console.log('❌ ISSUE: No cross-user pets are being loaded!');
  } else {
    console.log('✅ Cross-user pet loading appears to work');
  }
  
  console.log('===========================');
  
  return testData;
};

// Quick test function to run from browser console
window.debugPets = () => {
  console.log('🔍 QUICK PET DEBUG');
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  console.log(`Total users: ${users.length}`);
  console.log(`Current user: ${currentUser.username || 'None'}`);
  
  users.forEach(user => {
    const pets = JSON.parse(localStorage.getItem(`user_${user.id}_petProfiles`) || '[]');
    console.log(`${user.username}: ${pets.length} pets`, pets.map(p => p.name));
  });
  
  // Test the loadAllUserPets logic manually
  let allPets = [];
  users.forEach(user => {
    if (user.id !== currentUser.id) {
      const userPets = JSON.parse(localStorage.getItem(`user_${user.id}_petProfiles`) || '[]');
      allPets = [...allPets, ...userPets];
    }
  });
  
  console.log(`Pets visible to ${currentUser.username}: ${allPets.length}`, allPets.map(p => p.name));
  
  return allPets;
};
