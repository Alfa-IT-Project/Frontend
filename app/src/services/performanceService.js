import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Add axios interceptor to include auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createPerformanceReview = async (review) => {
  const { userId, rating, feedback, goals, strengths, areasForImprovement } = review;
  
  const currentPeriod = new Date().getFullYear() + '-Q' + Math.ceil((new Date().getMonth() + 1) / 3);
  
  const response = await axios.post(`${API_URL}/api/performance`, {
    userId,
    rating,
    feedback,
    goals,
    strengths,
    areasForImprovement,
    period: currentPeriod
  });
  return response.data;
};

export const getPerformanceReviews = async () => {
  const response = await axios.get(`${API_URL}/api/performance`);
  return response.data;
};

export const getPerformanceReview = async (id) => {
  const response = await axios.get(`${API_URL}/api/performance/${id}`);
  return response.data;
};

export const updatePerformanceReview = async (id, review) => {
  const response = await axios.put(`${API_URL}/api/performance/${id}`, review);
  return response.data;
};

export const deletePerformanceReview = async (id) => {
  await axios.delete(`${API_URL}/api/performance/${id}`);
}; 