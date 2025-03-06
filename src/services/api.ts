
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  // In a production environment, this would be a real API endpoint
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://api.chavruta-train.com' 
    : 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Service for user-related API calls
export const userService = {
  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  googleAuth: async (token: string) => {
    try {
      const response = await api.post('/auth/google', { token });
      return response.data;
    } catch (error) {
      console.error('Google auth error:', error);
      throw error;
    }
  },

  updateProfile: async (userId: string, profileData: any) => {
    try {
      const response = await api.patch(`/users/${userId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },

  getUserProfile: async (userId: string) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }
};

// Service for topic-related API calls
export const topicsService = {
  getTopics: async () => {
    try {
      const response = await api.get('/topics');
      return response.data;
    } catch (error) {
      console.error('Get topics error:', error);
      throw error;
    }
  },

  saveUserTopics: async (userId: string, topicIds: string[]) => {
    try {
      const response = await api.post(`/users/${userId}/topics`, { topicIds });
      return response.data;
    } catch (error) {
      console.error('Save topics error:', error);
      throw error;
    }
  }
};

// Service for train stations and schedules
export const trainService = {
  getStations: async () => {
    try {
      const response = await api.get('/stations');
      return response.data;
    } catch (error) {
      console.error('Get stations error:', error);
      throw error;
    }
  },

  getSchedules: async (departureId: string, arrivalId: string, date: string) => {
    try {
      const response = await api.get('/schedules', {
        params: { departureId, arrivalId, date }
      });
      return response.data;
    } catch (error) {
      console.error('Get schedules error:', error);
      throw error;
    }
  },

  saveUserRoute: async (userId: string, routeData: any) => {
    try {
      const response = await api.post(`/users/${userId}/routes`, routeData);
      return response.data;
    } catch (error) {
      console.error('Save route error:', error);
      throw error;
    }
  }
};

// Service for matches
export const matchesService = {
  findMatches: async (userId: string) => {
    try {
      const response = await api.get(`/matches/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Find matches error:', error);
      throw error;
    }
  },

  rateMatch: async (matchId: string, rating: number, feedback?: string) => {
    try {
      const response = await api.post(`/matches/${matchId}/rate`, { rating, feedback });
      return response.data;
    } catch (error) {
      console.error('Rate match error:', error);
      throw error;
    }
  }
};

// Chat service
export const chatService = {
  getMessages: async (chatId: string) => {
    try {
      const response = await api.get(`/chats/${chatId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  },

  sendMessage: async (chatId: string, message: string) => {
    try {
      const response = await api.post(`/chats/${chatId}/messages`, { content: message });
      return response.data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  },

  initiateChat: async (userId: string, matchId: string) => {
    try {
      const response = await api.post('/chats', { userId, matchId });
      return response.data;
    } catch (error) {
      console.error('Initiate chat error:', error);
      throw error;
    }
  }
};

// Analytics service
export const analyticsService = {
  logEvent: async (eventName: string, eventData: any) => {
    try {
      await api.post('/analytics/events', { eventName, eventData });
    } catch (error) {
      console.error('Log event error:', error);
    }
  }
};

export default api;
