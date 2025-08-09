# 🗄️ Database Setup Guide for TindrZoo Xtreme

## Firebase Setup (Recommended)

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "TindrZoo Xtreme" (or whatever you prefer)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Anonymous" authentication
5. Click "Save"

### 3. Enable Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to you
5. Click "Done"

### 4. Get Your Firebase Config
1. In Firebase Console, click the gear icon ⚙️
2. Select "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "TindrZoo Web")
6. Copy the config object

### 5. Update Firebase Config
Replace the placeholder config in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 6. Set Firestore Rules
In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /likes/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /matches/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Alternative: Local Storage (No Setup Required)

If you don't want to set up Firebase, you can use local storage:

```javascript
// In App.js, replace database calls with:
const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const getFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};
```

## Database Collections Structure

### Likes Collection
```javascript
{
  userId: "anonymous_user_id",
  animalId: 1,
  animalName: "Sir Fluffington III",
  animalImage: "https://...",
  habitat: "domestic",
  timestamp: Date
}
```

### Matches Collection
```javascript
{
  userId: "anonymous_user_id",
  animal1: {
    id: 1,
    name: "Sir Fluffington III",
    image: "https://...",
    habitat: "domestic"
  },
  animal2: {
    id: 2,
    name: "Bark Obama",
    image: "https://...",
    habitat: "domestic"
  },
  timestamp: Date,
  isActive: true
}
```

### Users Collection
```javascript
{
  userId: "anonymous_user_id",
  lastActivity: Date,
  totalLikes: 5,
  totalMatches: 2,
  preferences: {
    favoriteHabitat: "domestic"
  }
}
```

## Features Added

✅ **Anonymous Authentication** - Users can sign in without email/password
✅ **Data Persistence** - Likes and matches saved to cloud
✅ **Real-time Stats** - Live counters for likes and matches
✅ **User Sessions** - Data persists across browser sessions
✅ **Error Handling** - Graceful fallbacks for network issues
✅ **Loading States** - Smooth user experience during data loading

## Testing the Database

1. **Start the app**: `npm start`
2. **Sign in anonymously** when prompted
3. **Swipe some animals** - data will be saved to Firebase
4. **Refresh the page** - your data will be restored
5. **Check Firebase Console** - see your data in real-time

## Troubleshooting

### Common Issues:
- **"Firebase not initialized"** - Check your config in `firebase.js`
- **"Permission denied"** - Update Firestore rules
- **"Network error"** - Check internet connection
- **"Auth error"** - Enable Anonymous auth in Firebase Console

### Debug Mode:
Add this to see database operations:
```javascript
// In database.js
console.log('Saving like:', { userId, animal });
```

## Production Deployment

For production, update Firestore rules to be more restrictive:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Cost Considerations

Firebase Free Tier includes:
- 50,000 reads/day
- 20,000 writes/day
- 1GB storage
- Perfect for development and small apps

For larger scale, consider:
- Supabase (PostgreSQL)
- MongoDB Atlas
- AWS DynamoDB

---

🎉 **Your TindrZoo Xtreme app now has a real database!** 

Users can sign in anonymously, their likes and matches will be saved to the cloud, and everything will persist across sessions. Perfect for a hackathon demo! 🚀


