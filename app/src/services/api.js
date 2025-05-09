import axios from 'axios';

// For Vite, use import.meta.env
const API_URL = typeof import.meta.env !== 'undefined'
  ? import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
  : 'http://localhost:3001/api';

console.log('API URL:', API_URL);

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(
    `Request: ${config.method?.toUpperCase()} ${config.url}`,
    config.data || config.params
  );
  return config;
});

// Add response interceptor for debugging
apiClient.interceptors.response.use((response) => {
  console.log(
    `Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
    response.data
  );
  return response;
}, (error) => {
  console.error(
    `Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
    error.response?.data || error.message
  );
  return Promise.reject(error);
});

export const auth = {
  login: (credentials) =>
    apiClient.post('/auth/login', credentials),
  register: (userData) =>
    apiClient.post('/auth/register', userData),
};

export const performance = {
  getReviews: () => apiClient.get('/performance/reviews'),
  getReviewById: (id) => apiClient.get(`/performance/reviews/${id}`),
  createReview: (reviewData) =>
    apiClient.post('/performance/reviews', reviewData),
};

export const leaves = {
  getAll: () => apiClient.get('/leaves'),
  getRequests: () => apiClient.get('/leaves'),
  getRequestById: (id) => apiClient.get(`/leaves/${id}`),
  create: (requestData) =>
    apiClient.post('/leaves', requestData),
  updateRequest: (id, status) =>
    apiClient.put(`/leaves/${id}`, { status }),
  getBalance: () => apiClient.get('/leaves/balance'),
  cancel: (id) => apiClient.put(`/leaves/${id}/cancel`),
  updateStatus: (id, status) =>
    apiClient.put(`/leaves/${id}`, { status }),
};

export const payroll = {
  getAll: () => apiClient.get('/payroll'),
  getById: (id) => apiClient.get(`/payroll/${id}`),
  getStaffPayroll: (userId) => apiClient.get(`/payroll/staff/${userId}`),
  create: (data) =>
    apiClient.post('/payroll', data),
  update: (id, data) =>
    apiClient.put(`/payroll/${id}`, data),
  approve: (id) => apiClient.post(`/payroll/${id}/approve`),
  markAsPaid: (id) => apiClient.post(`/payroll/${id}/paid`),
  delete: (id) => {
    console.log(`Deleting payroll with ID: ${id}`);
    return apiClient.delete(`/payroll/${id}`)
      .catch(error => {
        if (error.response?.status === 404) {
          // If the record is not found, consider it already deleted
          console.log(`Record ${id} not found - treating as already deleted`);
          return { data: { message: 'Record already deleted or not found' } };
        }
        throw error; // Re-throw other errors
      });
  },
};

export const schedules = {
  getAll: (params) =>
    apiClient.get('/schedules', { params }),
  getByUserId: (userId) => apiClient.get('/schedules', { params: { userId } }),
  create: (scheduleData) =>
    apiClient.post('/schedules', scheduleData),
  update: (id, scheduleData) =>
    apiClient.patch(`/schedules/${id}`, scheduleData),
  delete: (id) => apiClient.delete(`/schedules/${id}`),
  createBulk: (data) =>
    apiClient.post('/schedules/bulk', data),
  getStaffAvailability: (params) =>
    apiClient.get('/schedules/availability', { params }),
  requestSwap: (data) =>
    apiClient.post('/schedules/swap', data),
  updateSwapStatus: (id, status) =>
    apiClient.patch(`/schedules/swap/${id}`, { status })
};

export const attendance = {
  getAll: () => apiClient.get('/attendance').then(response => response.data),
  getRecords: async (params) => {
    try {
      console.log('Fetching attendance records with params:', params);
      const response = await apiClient.get('/attendance/records', { params });
      console.log('Attendance records response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      throw error;
    }
  },
  getSummary: () => apiClient.get('/attendance/summary').then(response => response.data),
  getPendingOTPs: () => apiClient.get('/attendance/pending-otps'),
  clockIn: async (data) => {
    console.log('ClockIn request data:', data);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/attendance/clock-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ userId: data.userId, location: 'Office' })
      });

      const result = await response.json();
      console.log('Fetch response for clock-in:', result);

      if (!response.ok) {
        // Check if the error message indicates the user is already clocked in
        if (result.message && (
          result.message.includes('Already clocked in') ||
          result.message.includes('already clocked in')
        )) {
          // Just throw the message for better handling by the UI
          throw new Error(result.message);
        }
        throw new Error(result.error || 'Clock in failed');
      }

      return result;
    } catch (error) {
      console.error('Fetch error during clock-in:', error);
      throw error;
    }
  },
  clockOut: async (data) => {
    console.log('ClockOut request data:', data);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/attendance/clock-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ userId: data.userId, location: 'Office' })
      });

      const result = await response.json();
      console.log('Fetch response for clock-out:', result);

      if (!response.ok) {
        // Check for specific error messages
        if (result.message) {
          console.log('Server error message:', result.message);
          
          if (result.message.includes('Already clocked out')) {
            throw new Error('You have already clocked out today.');
          } else if (result.message.includes('No active clock-in')) {
            throw new Error('No active clock-in found for today. Please refresh and try again.');
          } else {
            throw new Error(result.message);
          }
        }
        throw new Error(result.error || 'Clock out failed');
      }

      return result;
    } catch (error) {
      console.error('Fetch error during clock-out:', error);
      throw error;
    }
  },
  verifyClockIn: (data) => {
    console.log('Verifying clock in with data:', data);
    return apiClient.post('/attendance/verify-clock-in', { userId: data.userId, otp: data.otp })
      .then(response => {
        console.log('Verify clock in response:', response.data);

        // Ensure we return a properly formatted record
        const returnData = response.data;

        // Force clockInTime to be non-null if missing but we know the user clocked in
        if (!returnData.clockInTime && !returnData.clockIn) {
          console.warn('Clock in time missing in response, adding default value');
          returnData.clockInTime = new Date().toISOString();
        }

        return returnData;
      })
      .catch(error => {
        console.error('Verify clock in error:', error);
        throw error;
      });
  },
  verifyClockOut: (data) => {
    console.log('Calling verifyClockOut with data:', data);
    return apiClient.post('/attendance/verify-clock-out', { userId: data.userId, otp: data.otp })
      .then(response => {
        console.log('Verify clock out response:', response.data);

        // Ensure we return a properly formatted record
        const returnData = response.data;

        // Force clockOutTime to be non-null if missing but we know the user clocked out
        if (!returnData.clockOutTime && !returnData.clockOut) {
          console.warn('Clock out time missing in response, adding default value');
          returnData.clockOutTime = new Date().toISOString();
        }

        return returnData;
      })
      .catch(error => {
        console.error('Verify clock out error:', error);
        throw error;
      });
  },
};

export const users = {
  getAll: () => apiClient.get('/users').then(response => response.data.data),
  getById: (id) => apiClient.get(`/users/${id}`).then(response => response.data.data),
  create: (userData) => apiClient.post('/users', userData).then(response => response.data.data),
  update: (id, userData) => apiClient.put(`/users/${id}`, userData).then(response => response.data.data),
  delete: (id) => apiClient.delete(`/users/${id}`),
};

