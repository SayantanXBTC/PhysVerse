import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Achievement notification queue
let achievementQueue: any[] = [];
let isProcessingQueue = false;

export const gamificationService = {
  // Get user progress (level, XP, etc.)
  async getProgress() {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/gamification/progress`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get all achievements
  async getAchievements() {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/gamification/achievements`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get leaderboard
  async getLeaderboard() {
    const response = await axios.get(`${API_URL}/gamification/leaderboard`);
    return response.data;
  },

  // Get activity feed
  async getActivities(userOnly = false, limit = 20) {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({ limit: limit.toString() });
    if (userOnly) params.append('user', 'me');
    
    const response = await axios.get(`${API_URL}/gamification/activities?${params}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data;
  },

  // Check and award achievements
  async checkAchievements() {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/gamification/check-achievements`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Real-time achievement checking with notifications
  async checkAchievementsWithNotifications() {
    try {
      const result = await this.checkAchievements();
      
      if (result.newAchievements && result.newAchievements.length > 0) {
        // Add to notification queue
        achievementQueue.push(...result.newAchievements);
        this.processAchievementQueue();
      }
      
      return result;
    } catch (error) {
      console.error('Failed to check achievements:', error);
      return { newAchievements: [] };
    }
  },

  // Process achievement notification queue
  processAchievementQueue() {
    if (isProcessingQueue || achievementQueue.length === 0) return;
    
    isProcessingQueue = true;
    const achievement = achievementQueue.shift();
    
    // Show achievement notification
    this.showAchievementNotification(achievement);
    
    // Process next after delay
    setTimeout(() => {
      isProcessingQueue = false;
      this.processAchievementQueue();
    }, 3000);
  },

  // Show achievement notification
  showAchievementNotification(achievement: any) {
    // Create achievement notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-lg shadow-2xl transform translate-x-full transition-transform duration-500';
    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="text-2xl">🏆</div>
        <div>
          <div class="font-bold">Achievement Unlocked!</div>
          <div class="text-sm opacity-90">${achievement.name}</div>
          <div class="text-xs opacity-75">+${achievement.xpReward} XP</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 4000);
  },

  // Auto-check achievements periodically
  startAchievementMonitoring() {
    // Check achievements every 30 seconds
    setInterval(() => {
      this.checkAchievementsWithNotifications();
    }, 30000);
  },

  // Get platform stats
  async getStats() {
    const response = await axios.get(`${API_URL}/gamification/stats`);
    return response.data;
  }
};
