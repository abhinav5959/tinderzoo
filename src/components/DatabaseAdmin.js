import React, { useState, useEffect } from 'react';

const DatabaseAdmin = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dbInfo, setDbInfo] = useState(null);
  const [allData, setAllData] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDatabaseInfo();
  }, []);

  const loadDatabaseInfo = async () => {
    setLoading(true);
    try {
      // Get data from localStorage
      const petProfile = localStorage.getItem('petProfile');
      const likedAnimals = JSON.parse(localStorage.getItem('likedAnimals') || '[]');
      const matches = JSON.parse(localStorage.getItem('matches') || '[]');
      
      const info = {
        totalUsers: petProfile ? 1 : 0,
        totalLikes: likedAnimals.length,
        totalMatches: matches.length,
        databaseSize: 'localStorage',
        lastBackup: new Date().toISOString()
      };
      
      const data = {
        users: petProfile ? [JSON.parse(petProfile)] : [],
        likes: likedAnimals,
        matches: matches
      };
      
      const health = {
        status: 'healthy',
        issues: [],
        lastCheck: new Date().toISOString()
      };
      
      setDbInfo(info);
      setAllData(data);
      setHealthStatus(health);
    } catch (error) {
      console.error('Error loading database info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const query = searchQuery.toLowerCase();
      const results = [];
      
      // Search in pet profile
      const petProfile = localStorage.getItem('petProfile');
      if (petProfile) {
        const profile = JSON.parse(petProfile);
        if (profile.petName?.toLowerCase().includes(query) || 
            profile.petType?.toLowerCase().includes(query) ||
            profile.petBio?.toLowerCase().includes(query)) {
          results.push({
            type: 'user',
            data: profile,
            match: `Pet: ${profile.petName} (${profile.petType})`
          });
        }
      }
      
      // Search in liked animals
      const likedAnimals = JSON.parse(localStorage.getItem('likedAnimals') || '[]');
      likedAnimals.forEach(animal => {
        if (animal.name?.toLowerCase().includes(query) || 
            animal.bio?.toLowerCase().includes(query)) {
          results.push({
            type: 'like',
            data: animal,
            match: `Liked: ${animal.name}`
          });
        }
      });
      
      // Search in matches
      const matches = JSON.parse(localStorage.getItem('matches') || '[]');
      matches.forEach(match => {
        if (match.animal1?.name?.toLowerCase().includes(query) || 
            match.animal2?.name?.toLowerCase().includes(query)) {
          results.push({
            type: 'match',
            data: match,
            match: `Match: ${match.animal1?.name} + ${match.animal2?.name}`
          });
        }
      });
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    setLoading(true);
    try {
      // Create backup from localStorage
      const backup = {
        petProfile: localStorage.getItem('petProfile'),
        likedAnimals: localStorage.getItem('likedAnimals'),
        matches: localStorage.getItem('matches'),
        timestamp: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tindrzoo-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert(`Backup created successfully!`);
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Error creating backup');
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
      setLoading(true);
      try {
        localStorage.removeItem('petProfile');
        localStorage.removeItem('likedAnimals');
        localStorage.removeItem('matches');
        alert('All data cleared successfully');
        loadDatabaseInfo();
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Error clearing data');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExportCSV = async () => {
    setLoading(true);
    try {
      // Create CSV from localStorage data
      let csv = 'Type,Name,Details,Date\n';
      
      // Add pet profile
      const petProfile = localStorage.getItem('petProfile');
      if (petProfile) {
        const profile = JSON.parse(petProfile);
        csv += `Pet Profile,${profile.petName || 'Unknown'},${profile.petType || 'Unknown'},${profile.updatedAt || 'Unknown'}\n`;
      }
      
      // Add liked animals
      const likedAnimals = JSON.parse(localStorage.getItem('likedAnimals') || '[]');
      likedAnimals.forEach(animal => {
        csv += `Liked Animal,${animal.name || 'Unknown'},${animal.habitat || 'Unknown'},${new Date().toISOString()}\n`;
      });
      
      // Add matches
      const matches = JSON.parse(localStorage.getItem('matches') || '[]');
      matches.forEach(match => {
        csv += `Match,${match.animal1?.name || 'Unknown'} + ${match.animal2?.name || 'Unknown'},Match,${new Date().toISOString()}\n`;
      });
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tindrzoo-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('CSV export completed');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting CSV');
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="admin-section">
      <h3>Database Overview</h3>
      
      {dbInfo && (
        <div className="info-grid">
          <div className="info-card">
            <h4>Location</h4>
            <p>{dbInfo.location}</p>
          </div>
          
          <div className="info-card">
            <h4>Files</h4>
            <ul>
              {Object.entries(dbInfo.files).map(([name, path]) => (
                <li key={name}>{name}: {path.split('/').pop()}</li>
              ))}
            </ul>
          </div>
          
          <div className="info-card">
            <h4>Statistics</h4>
            <ul>
              <li>Users: {dbInfo.stats.users}</li>
              <li>Pet Profiles: {dbInfo.stats.petProfiles}</li>
              <li>Likes: {dbInfo.stats.likes}</li>
              <li>Matches: {dbInfo.stats.matches}</li>
            </ul>
          </div>
        </div>
      )}
      
      {healthStatus && (
        <div className={`health-status ${healthStatus.status}`}>
          <h4>Health Status: {healthStatus.status.toUpperCase()}</h4>
          <p>Last checked: {new Date(healthStatus.timestamp).toLocaleString()}</p>
          {healthStatus.issues && healthStatus.issues.length > 0 && (
            <div className="issues">
              <h5>Issues:</h5>
              <ul>
                {healthStatus.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderData = () => (
    <div className="admin-section">
      <h3>Database Data</h3>
      
      {allData && (
        <div className="data-tabs">
          <div className="tab-buttons">
            <button 
              className={activeTab === 'users' ? 'active' : ''} 
              onClick={() => setActiveTab('users')}
            >
              Users ({allData.summary.totalUsers})
            </button>
            <button 
              className={activeTab === 'profiles' ? 'active' : ''} 
              onClick={() => setActiveTab('profiles')}
            >
              Pet Profiles ({allData.summary.totalPetProfiles})
            </button>
            <button 
              className={activeTab === 'likes' ? 'active' : ''} 
              onClick={() => setActiveTab('likes')}
            >
              Likes ({allData.summary.totalLikes})
            </button>
            <button 
              className={activeTab === 'matches' ? 'active' : ''} 
              onClick={() => setActiveTab('matches')}
            >
              Matches ({allData.summary.totalMatches})
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'users' && (
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Anonymous</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allData.authUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.id.substring(0, 8)}...</td>
                        <td>{user.email || 'Anonymous'}</td>
                        <td>{user.isAnonymous ? 'Yes' : 'No'}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'profiles' && (
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Pet Name</th>
                      <th>Type</th>
                      <th>Age</th>
                      <th>Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allData.database.petProfiles.map(profile => (
                      <tr key={profile.userId}>
                        <td>{profile.userId.substring(0, 8)}...</td>
                        <td>{profile.petName}</td>
                        <td>{profile.petType}</td>
                        <td>{profile.age}</td>
                        <td>{new Date(profile.updatedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'likes' && (
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Animal</th>
                      <th>Habitat</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allData.database.likes.map(like => (
                      <tr key={like.id}>
                        <td>{like.userId.substring(0, 8)}...</td>
                        <td>{like.animalName}</td>
                        <td>{like.habitat}</td>
                        <td>{new Date(like.timestamp).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'matches' && (
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Animal 1</th>
                      <th>Animal 2</th>
                      <th>Active</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allData.database.matches.map(match => (
                      <tr key={match.id}>
                        <td>{match.userId.substring(0, 8)}...</td>
                        <td>{match.animal1.name}</td>
                        <td>{match.animal2.name}</td>
                        <td>{match.isActive ? 'Yes' : 'No'}</td>
                        <td>{new Date(match.timestamp).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderSearch = () => (
    <div className="admin-section">
      <h3>Search Database</h3>
      
      <div className="search-controls">
        <input
          type="text"
          placeholder="Search for users, animals, or data..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {searchResults.length > 0 && (
        <div className="search-results">
          <h4>Search Results ({searchResults.length})</h4>
          <div className="results-list">
            {searchResults.map((result, index) => (
              <div key={index} className={`result-item ${result.type}`}>
                <div className="result-type">{result.type.toUpperCase()}</div>
                <div className="result-content">
                  {result.type === 'user' && (
                    <div>
                      <strong>Email:</strong> {result.email || 'Anonymous'}<br/>
                      <strong>ID:</strong> {result.id.substring(0, 8)}...
                    </div>
                  )}
                  {result.type === 'like' && (
                    <div>
                      <strong>Animal:</strong> {result.animalName}<br/>
                      <strong>User:</strong> {result.userId.substring(0, 8)}...
                    </div>
                  )}
                  {result.type === 'match' && (
                    <div>
                      <strong>Match:</strong> {result.animal1.name} + {result.animal2.name}<br/>
                      <strong>User:</strong> {result.userId.substring(0, 8)}...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderActions = () => (
    <div className="admin-section">
      <h3>Database Actions</h3>
      
      <div className="action-buttons">
        <button onClick={handleBackup} disabled={loading} className="action-btn backup">
          💾 Create Backup
        </button>
        
        <button onClick={handleExportCSV} disabled={loading} className="action-btn export">
          📊 Export CSV
        </button>
        
        <button onClick={loadDatabaseInfo} disabled={loading} className="action-btn refresh">
          🔄 Refresh Data
        </button>
        
        <button onClick={handleClearData} disabled={loading} className="action-btn clear">
          🗑️ Clear All Data
        </button>
      </div>
      
      <div className="warning">
        <p>⚠️ Warning: Clearing data cannot be undone!</p>
      </div>
    </div>
  );

  return (
    <div className="database-admin">
      <div className="admin-header">
        <h2>🦁 TindrZoo Database Admin</h2>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={activeTab === 'data' ? 'active' : ''} 
          onClick={() => setActiveTab('data')}
        >
          📋 Data
        </button>
        <button 
          className={activeTab === 'search' ? 'active' : ''} 
          onClick={() => setActiveTab('search')}
        >
          🔍 Search
        </button>
        <button 
          className={activeTab === 'actions' ? 'active' : ''} 
          onClick={() => setActiveTab('actions')}
        >
          ⚙️ Actions
        </button>
      </div>
      
      <div className="admin-content">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        )}
        
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'data' && renderData()}
        {activeTab === 'search' && renderSearch()}
        {activeTab === 'actions' && renderActions()}
      </div>
    </div>
  );
};

export default DatabaseAdmin;
