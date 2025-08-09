// Utility functions for testing the interest system

export const createTestInterest = (fromPetName, toPetName, message = "Paw Wave 🐾") => {
  const testInterest = {
    id: Date.now(),
    fromPet: {
      id: `pet_${fromPetName.toLowerCase()}`,
      name: fromPetName,
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
      species: "Cat",
      breed: "Mixed"
    },
    toPet: {
      id: `pet_${toPetName.toLowerCase()}`,
      name: toPetName,
      image: "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400",
      species: "Dog", 
      breed: "Golden Retriever"
    },
    message: message,
    sentAt: new Date().toISOString(),
    type: message,
    status: 'pending'
  };

  // Add to received interests
  const receivedInterests = JSON.parse(localStorage.getItem('receivedInterests') || '[]');
  receivedInterests.push(testInterest);
  localStorage.setItem('receivedInterests', JSON.stringify(receivedInterests));

  console.log(`Test interest created: ${fromPetName} → ${toPetName}`);
  return testInterest;
};

export const clearAllInterests = () => {
  localStorage.removeItem('sentInterests');
  localStorage.removeItem('receivedInterests');
  console.log('All interests cleared');
};

export const showCurrentInterests = () => {
  const sent = JSON.parse(localStorage.getItem('sentInterests') || '[]');
  const received = JSON.parse(localStorage.getItem('receivedInterests') || '[]');
  
  console.log('=== CURRENT INTERESTS ===');
  console.log('Sent:', sent);
  console.log('Received:', received);
  console.log('========================');
  
  return { sent, received };
};

