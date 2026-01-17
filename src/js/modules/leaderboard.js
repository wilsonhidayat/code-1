// Leaderboard Class
export class FirebaseLeaderboard {
  constructor() {
    this.taps = [];
    this.users = [];
    this.isInitialized = false;
    this.setupRealtimeListener();
  }

  async setupRealtimeListener() {
    try {
      console.log('🔄 Setting up realtime listener...');
      const { db, collection, onSnapshot, query } = await import('../config/firebase.js');
      
      // Listen for real-time updates on taps (without orderBy to avoid index requirement)
      const tapsQuery = query(collection(db, 'taps'));
      onSnapshot(tapsQuery, (snapshot) => {
        this.taps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)); // Sort in JavaScript
        console.log('📊 Taps updated:', this.taps.length, 'taps');
        this.loadUsers();
      }, (error) => {
        console.error('❌ Realtime listener error:', error);
        this.showError('Error listening to data updates. Check Firebase config.');
      });
      
      // Listen for real-time updates on users (without orderBy to avoid index requirement)
      const usersQuery = query(collection(db, 'users'));
      onSnapshot(usersQuery, (snapshot) => {
        this.users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0)); // Sort in JavaScript
        console.log('👥 Users updated:', this.users.length, 'users');
        this.computeAndRenderLeaderboard();
      }, (error) => {
        console.error('❌ Users listener error:', error);
      });
      
      // Listen for active sessions (for debugging)
      const activeSessionsQuery = query(collection(db, 'activeSessions'));
      onSnapshot(activeSessionsQuery, (snapshot) => {
        const activeSessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (b.startTime || 0) - (a.startTime || 0)); // Sort in JavaScript
        console.log('🏃‍♂️ Active sessions updated:', activeSessions.length, 'sessions');
        this.updateActiveSessionsDisplay(activeSessions);
      }, (error) => {
        console.error('❌ Active sessions listener error:', error);
      });
      
      this.isInitialized = true;
      console.log('✅ Firebase connection established');
    } catch (error) {
      console.error('❌ Error setting up realtime listener:', error);
      this.showError('Error connecting to database. Check Firebase config.');
    }
  }

  async loadUsers() {
    try {
      console.log('👥 Loading users...');
      const { db, collection, getDocs } = await import('../config/firebase.js');
      const usersSnapshot = await getDocs(collection(db, 'users'));
      this.users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0)); // Sort in JavaScript
      console.log('👥 Users loaded:', this.users.length, 'users');
      this.computeAndRenderLeaderboard();
    } catch (error) {
      console.error('❌ Error loading users:', error);
      this.showError('Error loading data. Check Firebase config.');
    }
  }

  // Update active sessions display
  updateActiveSessionsDisplay(activeSessions) {
    const statusElement = document.getElementById('status');
    if (statusElement) {
      if (activeSessions.length > 0) {
        const sessionList = activeSessions.map(session => {
          const startTime = new Date(session.startTime);
          const duration = Math.floor((Date.now() - startTime.getTime()) / 1000);
          const minutes = Math.floor(duration / 60);
          const seconds = duration % 60;
          return `${session.userName} (${minutes}:${seconds.toString().padStart(2, '0')})`;
        }).join(', ');
        
        statusElement.innerHTML = `🏃‍♂️ Active sessions: ${sessionList}`;
        statusElement.style.background = '#e8f5e8';
        statusElement.style.color = '#2e7d32';
      } else {
        statusElement.innerHTML = `📊 Leaderboard updated - ${this.users.length} users, ${this.taps.length} sessions`;
        statusElement.style.background = '#f8f9fa';
        statusElement.style.color = '#495057';
      }
    }
  }

  showError(message) {
    const tbody = document.querySelector('#tbl tbody');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 40px;">${message}</td></tr>`;
    }
  }

  async getTaps() {
    return this.taps;
  }

  async getUsers() {
    return this.users;
  }

  computeLeaderboard(taps, users) {
    console.log('🔄 Computing leaderboard with', taps.length, 'taps and', users.length, 'users');
    const userMap = new Map(users.map(u => [u.id, u]));
    const byUser = new Map();
    
    // Sort taps by timestamp (handle both string and number timestamps)
    const sorted = [...taps].sort((a, b) => {
      const aTime = typeof a.timestamp === 'string' ? new Date(a.timestamp).getTime() : (a.timestamp || 0);
      const bTime = typeof b.timestamp === 'string' ? new Date(b.timestamp).getTime() : (b.timestamp || 0);
      return aTime - bTime;
    });
    const lastStartByUser = new Map();
    
    // First pass: process completed sessions
    for (const tap of sorted) {
      if (tap.station === 'start') {
        lastStartByUser.set(tap.userId, tap);
        console.log(`🏁 Start tap: ${tap.userName} (${tap.userId}) at ${new Date(tap.timestamp).toLocaleTimeString()}`);
      } else if (tap.station === 'stop') {
        const start = lastStartByUser.get(tap.userId);
        if (start) {
          // Handle both string and number timestamps
          const startTime = typeof start.timestamp === 'string' ? new Date(start.timestamp).getTime() : (start.timestamp || 0);
          const stopTime = typeof tap.timestamp === 'string' ? new Date(tap.timestamp).getTime() : (tap.timestamp || 0);
          const duration = stopTime - startTime;
          
          // Only process if duration is reasonable (between 1 second and 2 hours)
          if (duration > 1000 && duration < 2 * 60 * 60 * 1000) {
            const user = userMap.get(tap.userId) || { 
              name: tap.userName || 'User',
              photo: tap.photo || '',
              id: tap.userId
            };
            const stats = byUser.get(tap.userId) || { 
              user, 
              sessions: 0, 
              personalBest: null, // Track personal best time
              allTimes: [], // Track all session times
              photo: user.photo,
              hasCompletedSession: false
            };
            stats.sessions += 1;
            stats.allTimes.push(duration);
            stats.hasCompletedSession = true;
            
            // Update personal best (fastest time)
            if (stats.personalBest === null || duration < stats.personalBest) {
              stats.personalBest = duration;
            }
            
            byUser.set(tap.userId, stats);
            lastStartByUser.delete(tap.userId);
            console.log(`🏁 Stop tap: ${tap.userName} (${tap.userId}) - Duration: ${Math.round(duration/1000)}s`);
          }
        }
      }
    }
    
    // Second pass: add users who have only start taps (incomplete sessions)
    for (const tap of sorted) {
      if (tap.station === 'start' && !byUser.has(tap.userId)) {
        const user = userMap.get(tap.userId) || { 
          name: tap.userName || 'User',
          photo: tap.photo || '',
          id: tap.userId
        };
        byUser.set(tap.userId, {
          user,
          sessions: 0,
          personalBest: null,
          allTimes: [],
          photo: user.photo,
          hasCompletedSession: false
        });
      }
    }
    
    // Convert to array and sort
    const leaderboardData = [...byUser.values()]
      .sort((a, b) => {
        // Users with completed sessions first, sorted by personal best (fastest time first)
        if (a.hasCompletedSession && b.hasCompletedSession) {
          return a.personalBest - b.personalBest;
        }
        // Users with completed sessions before those without
        if (a.hasCompletedSession && !b.hasCompletedSession) return -1;
        if (!a.hasCompletedSession && b.hasCompletedSession) return 1;
        // Both without completed sessions - sort by name
        return a.user.name.localeCompare(b.user.name);
      })
      .map((x, i) => {
        // Calculate rank based on position in sorted array
        // Users without completed sessions get no rank (or a special indicator)
        const rank = x.hasCompletedSession ? i + 1 : '-';
        
        return { 
          rank, 
          name: x.user.name, 
          sessions: x.sessions,
          personalBest: x.personalBest,
          averageTime: x.allTimes.length > 0 ? x.allTimes.reduce((sum, time) => sum + time, 0) / x.allTimes.length : null,
          photo: x.photo || x.user.photo,
          hasCompletedSession: x.hasCompletedSession
        };
      });
    
    return leaderboardData;
  }

  computeAndRenderLeaderboard() {
    console.log('🔄 Computing leaderboard with', this.taps.length, 'taps and', this.users.length, 'users');
    const leaderboard = this.computeLeaderboard(this.taps, this.users);
    console.log('🏆 Leaderboard computed:', leaderboard.length, 'entries');
    this.renderLeaderboard(leaderboard);
  }

  async load() {
    // Recompute and render leaderboard
    this.computeAndRenderLeaderboard();
  }

  renderLeaderboard(leaderboard) {
    console.log('🎨 Rendering leaderboard:', leaderboard);
    const tbody = document.querySelector('#tbl tbody');
    const podium = document.getElementById('podium');
    const loading = document.getElementById('loading');
    const table = document.getElementById('tbl');
    const status = document.getElementById('status');
    
    // Hide loading, show table and status
    if (loading) loading.style.display = 'none';
    if (table) table.style.display = 'table';
    if (status) status.style.display = 'block';
    
    // Clear existing content
    if (tbody) tbody.innerHTML = '';
    if (podium) podium.innerHTML = '';
    
    if (leaderboard.length === 0) {
      console.log('📭 No leaderboard data to display');
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px;">No data yet. Start using the stations!</td></tr>';
      }
      if (status) {
        status.innerHTML = '📊 No data yet. Start using the stations!';
        status.style.background = '#fff3cd';
        status.style.color = '#856404';
      }
      return;
    }
    
    // Render top 3 in podium (only users with completed sessions)
    const completedSessions = leaderboard.filter(entry => entry.hasCompletedSession);
    const top3 = completedSessions.slice(0, 3);
    console.log('🏆 Top 3 entries:', top3);
    if (podium) {
      top3.forEach((entry, index) => {
        console.log(`🥇 Podium ${index + 1}:`, entry);
        const div = document.createElement('div');
        div.className = 'podium-item';
        const timeDisplay = entry.personalBest ? this.formatTime(entry.personalBest) : 'No time';
        div.innerHTML = `
          <div class="podium-circle podium-${index + 1}">${entry.rank}</div>
          <img class="podium-face" src="${entry.photo}" alt="User face" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNmMGYwZjAiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIyMCIgeT0iMjAiPgo8cGF0aCBkPSJNMjAgMjBDMjMuMzEzNyAyMCAyNiAxNy4zMTM3IDI2IDE0QzI2IDEwLjY4NjMgMjMuMzEzNyA4IDIwIDhDMTYuNjg2MyA4IDE0IDEwLjY4NjMgMTQgMTRDMTQgMTcuMzEzNyAxNi42ODYzIDIwIDIwIDIwWiIgZmlsbD0iIzk5OTk5OSIvPgo8cGF0aCBkPSJNMjAgMjJDMTUuNTgxNyAyMiAxMiAyNC41ODE3IDEyIDI5SDI4VjI5QzI4IDI0LjU4MTcgMjQuNDE4MyAyMiAyMCAyMloiIGZpbGw9IiM5OTk5OTkiLz4KPC9zdmc+Cjwvc3ZnPgo'" />
          <h3>${entry.name}</h3>
          <div class="podium-time">${timeDisplay}</div>
          <p>${entry.sessions} attempts</p>
        `;
        podium.appendChild(div);
      });
    }
    
    // Render all entries in table
    if (tbody) {
      console.log('📊 Rendering table with', leaderboard.length, 'entries');
      leaderboard.forEach((entry, index) => {
        console.log(`📋 Table row ${index + 1}:`, entry);
        const row = document.createElement('tr');
        
        const timeDisplay = entry.personalBest ? this.formatTime(entry.personalBest) : 'No time';
        const timeClass = entry.hasCompletedSession ? 'time-cell' : 'time-cell in-progress';
        
        row.innerHTML = `
          <td class="rank">${entry.rank}</td>
          <td class="face-cell">
            <img class="table-face" src="${entry.photo}" alt="User face" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNmMGYwZjAiLz4KPHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxNSIgeT0iMTUiPgo8cGF0aCBkPSJNMTUgMTVDMTcuNzYxNCAxNSAyMCAxMi43NjE0IDIwIDEwQzIwIDcuMjM4NTggMTcuNzYxNCA1IDE1IDVDMTIuMjM4NiA1IDEwIDcuMjM4NTggMTAgMTBDMTAgMTIuNzYxNCAxMi4yMzg2IDE1IDE1IDE1WiIgZmlsbD0iIzk5OTk5OSIvPgo8cGF0aCBkPSJNMTUgMTdDMTEuNjg2MyAxNyA5IDE5LjY4NjMgOSAyM0gyMVYyM0MyMSAxOS42ODYzIDE4LjMxMzcgMTcgMTUgMTdaIiBmaWxsPSIjOTk5OTk5Ii8+Cjwvc3ZnPgo8L3N2Zz4K'" />
          </td>
          <td class="${timeClass}">${timeDisplay}</td>
          <td class="sessions-cell">${entry.sessions}</td>
        `;
        tbody.appendChild(row);
      });
    }
  }

  formatTime(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10); // Show centiseconds
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}.${ms.toString().padStart(2, '0')}s`;
    } else {
      return `${seconds}.${ms.toString().padStart(2, '0')}s`;
    }
  }


  // Clear all data (admin function)
  async clearAllData() {
    try {
      const { db, collection, getDocs, deleteDoc, doc } = await import('../config/firebase.js');
      
      // Clear taps collection
      const tapsSnapshot = await getDocs(collection(db, 'taps'));
      for (const tapDoc of tapsSnapshot.docs) {
        await deleteDoc(doc(db, 'taps', tapDoc.id));
      }
      
      // Clear users collection
      const usersSnapshot = await getDocs(collection(db, 'users'));
      for (const userDoc of usersSnapshot.docs) {
        await deleteDoc(doc(db, 'users', userDoc.id));
      }
      
      // Clear active streaks collection
      const streaksSnapshot = await getDocs(collection(db, 'activeStreaks'));
      for (const streakDoc of streaksSnapshot.docs) {
        await deleteDoc(doc(db, 'activeStreaks', streakDoc.id));
      }
      
      // Clear local data
      this.taps = [];
      this.users = [];
      
      // Re-render empty leaderboard
      this.renderLeaderboard([]);
      
      console.log('All data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}
