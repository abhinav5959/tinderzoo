const fs = require('fs');
const path = require('path');

console.log('🦁 Setting up TindrZoo Xtreme Local Database...\n');

// Database directory
const DB_DIR = path.join(__dirname, 'database');

// Create database directory
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
  console.log('✅ Created database directory');
} else {
  console.log('✅ Database directory already exists');
}

// Database files
const databaseFiles = {
  'users.json': [],
  'petProfiles.json': [],
  'likes.json': [],
  'matches.json': []
};

// Create database files
Object.entries(databaseFiles).forEach(([filename, initialData]) => {
  const filePath = path.join(DB_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
    console.log(`✅ Created ${filename}`);
  } else {
    console.log(`✅ ${filename} already exists`);
  }
});

// Create database info file
const dbInfo = {
  name: 'TindrZoo Xtreme Local Database',
  version: '1.0.0',
  created: new Date().toISOString(),
  description: 'Local JSON-based database for TindrZoo Xtreme app',
  collections: {
    users: 'User accounts and authentication data',
    petProfiles: 'Pet profile information',
    likes: 'Liked animal records',
    matches: 'Animal match records'
  },
  location: DB_DIR,
  files: Object.keys(databaseFiles)
};

const infoPath = path.join(DB_DIR, 'database-info.json');
fs.writeFileSync(infoPath, JSON.stringify(dbInfo, null, 2));
console.log('✅ Created database-info.json');

console.log('\n🎉 Local Database Setup Complete!');
console.log(`📁 Database location: ${DB_DIR}`);
console.log('\n📊 Database Collections:');
Object.entries(dbInfo.collections).forEach(([name, description]) => {
  console.log(`   • ${name}: ${description}`);
});

console.log('\n🚀 Your TindrZoo Xtreme app is now ready with local database storage!');
console.log('💾 All data will be stored locally on your system in JSON files.');
console.log('🔒 No internet connection required for data storage.');
