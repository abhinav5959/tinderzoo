import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';

// Collection names
const COLLECTIONS = {
  LIKES: 'likes',
  MATCHES: 'matches',
  USERS: 'users',
  ANIMALS: 'animals'
};

// Save a liked animal
export const saveLikedAnimal = async (userId, animal) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.LIKES), {
      userId,
      animalId: animal.id,
      animalName: animal.name,
      animalImage: animal.image,
      timestamp: new Date(),
      habitat: animal.habitat
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving liked animal:', error);
    throw error;
  }
};

// Save a match
export const saveMatch = async (userId, animal1, animal2) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.MATCHES), {
      userId,
      animal1: {
        id: animal1.id,
        name: animal1.name,
        image: animal1.image,
        habitat: animal1.habitat
      },
      animal2: {
        id: animal2.id,
        name: animal2.name,
        image: animal2.image,
        habitat: animal2.habitat
      },
      timestamp: new Date(),
      isActive: true
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving match:', error);
    throw error;
  }
};

// Get user's liked animals
export const getLikedAnimals = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.LIKES),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting liked animals:', error);
    throw error;
  }
};

// Get user's matches
export const getMatches = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.MATCHES),
      where('userId', '==', userId),
      where('isActive', '==', true),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting matches:', error);
    throw error;
  }
};

// Update match status (for when animals go on dates)
export const updateMatchStatus = async (matchId, isActive) => {
  try {
    const matchRef = doc(db, COLLECTIONS.MATCHES, matchId);
    await updateDoc(matchRef, {
      isActive,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error updating match status:', error);
    throw error;
  }
};

// Save user profile
export const saveUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...userData,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDocs(userRef);
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Get app statistics
export const getAppStats = async (userId) => {
  try {
    const [likesSnapshot, matchesSnapshot] = await Promise.all([
      getDocs(query(collection(db, COLLECTIONS.LIKES), where('userId', '==', userId))),
      getDocs(query(collection(db, COLLECTIONS.MATCHES), where('userId', '==', userId), where('isActive', '==', true)))
    ]);
    
    return {
      totalLikes: likesSnapshot.size,
      totalMatches: matchesSnapshot.size,
      lastActivity: new Date()
    };
  } catch (error) {
    console.error('Error getting app stats:', error);
    throw error;
  }
};

