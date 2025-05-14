import { apiClient } from './api';

export const settings = {
  getSettings: async userId => {
    return apiClient.get('/settings');
  },

  updateSettings: async (userId, settings) => {
    return apiClient.put('/settings', settings);
  },
}; 