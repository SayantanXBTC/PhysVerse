import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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

  // Get platform stats
  async getStats() {
    const response = await axios.get(`${API_URL}/gamification/stats`);
    return response.data;
  }
};
