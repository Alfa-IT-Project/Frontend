import axios from 'axios';

// For Vite, use import.meta.env
const API_URL = typeof import.meta.env !== 'undefined'
  ? import.meta.env.VITE_API_URL || 'http://localhost:4000'
  : 'http://localhost:4000';

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
  console.log('Token from localStorage:', token ? 'Present' : 'Not found');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(
    `Request: ${config.method?.toUpperCase()} ${config.url}`,
    config.data || config.params,
    'Headers:', config.headers
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
  validateUser: (username) =>
    apiClient.post('/api/auth/validate', { username })
      .then(response => {
        console.log('User validation successful:', response.data);
        return response;
      })
      .catch(error => {
        console.error('User validation failed:', error.response?.data || error.message);
        throw error;
      }),
  login: (credentials) =>
    apiClient.post('/api/auth/login', credentials)
      .then(response => {
        console.log('Login successful:', response.data);
        return response;
      })
      .catch(error => {
        console.error('Login failed:', error.response?.data || error.message);
        throw error;
      }),
  register: (userData) =>
    apiClient.post('/api/auth/register', userData),
};

export const performance = {
  getReviews: () => apiClient.get('/api/performance/reviews'),
  getReviewById: (id) => apiClient.get(`/api/performance/reviews/${id}`),
  createReview: (reviewData) =>
    apiClient.post('/api/performance/reviews', reviewData),
};

export const leaves = {
  getAll: () => apiClient.get('/api/leaves'),
  getRequests: async () => {
    try {
      console.log('Attempting to fetch leave requests...');
      const response = await apiClient.get('/api/leaves');
      console.log('Leave requests fetched successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      throw error;
    }
  },
  getRequestById: (id) => apiClient.get(`/api/leaves/${id}`),
  create: (requestData) =>
    apiClient.post('/api/leaves', requestData),
  updateRequest: (id, status) =>
    apiClient.put(`/api/leaves/${id}`, { status }),
  getBalance: () => apiClient.get('/api/leaves/balance'),
  cancel: (id) => apiClient.put(`/api/leaves/${id}/cancel`),
  updateStatus: (id, status) =>
    apiClient.put(`/api/leaves/${id}`, { status }),
};

export const payroll = {
  getAll: () => apiClient.get('/api/payroll'),
  getById: (id) => apiClient.get(`/api/payroll/${id}`),
  getStaffPayroll: (userId) => apiClient.get(`/api/payroll/staff/${userId}`),
  create: (data) =>
    apiClient.post('/api/payroll', data),
  update: (id, data) =>
    apiClient.put(`/api/payroll/${id}`, data),
  approve: (id) => apiClient.post(`/api/payroll/${id}/approve`),
  markAsPaid: (id) => apiClient.post(`/api/payroll/${id}/paid`),
  delete: (id) => {
    console.log(`Deleting payroll with ID: ${id}`);
    return apiClient.delete(`/api/payroll/${id}`)
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
    apiClient.get('/api/schedules', { params }),
  getByUserId: (userId) => apiClient.get('/api/schedules', { params: { userId } }),
  create: (scheduleData) =>
    apiClient.post('/api/schedules', scheduleData),
  update: (id, scheduleData) =>
    apiClient.patch(`/api/schedules/${id}`, scheduleData),
  delete: (id) => apiClient.delete(`/api/schedules/${id}`),
  createBulk: (data) =>
    apiClient.post('/api/schedules/bulk', data),
  getStaffAvailability: (params) =>
    apiClient.get('/api/schedules/availability', { params }),
  requestSwap: (data) =>
    apiClient.post('/api/schedules/swap', data),
  updateSwapStatus: (id, status) =>
    apiClient.patch(`/api/schedules/swap/${id}`, { status })
};

export const attendance = {
  getAll: () => apiClient.get('/api/attendance').then(response => response.data),
  getRecords: async (params) => {
    try {
      console.log('Fetching attendance records with params:', params);
      const response = await apiClient.get('/api/attendance/records', { params });
      console.log('Attendance records response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      throw error;
    }
  },
  getSummary: () => apiClient.get('/api/attendance/summary').then(response => response.data),
  getPendingOTPs: () => apiClient.get('/api/attendance/pending-otps'),
  clockIn: async (data) => {
    console.log('ClockIn request data:', data);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/attendance/clock-in`, {
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
      const response = await fetch(`${API_URL}/api/attendance/clock-out`, {
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
    return apiClient.post('/api/attendance/verify-clock-in', { userId: data.userId, otp: data.otp })
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
    return apiClient.post('/api/attendance/verify-clock-out', { userId: data.userId, otp: data.otp })
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
  getAll: () => apiClient.get('/api/users').then(response => response.data.data || []),
  getById: (id) => apiClient.get(`/api/users/${id}`).then(response => response.data.data),
  create: (userData) => {
    console.log('Creating user with data:', userData);
    
    // Ensure all required fields are present
    if (!userData.name || !userData.email || !userData.password || !userData.role) {
      console.error('Missing required fields for user creation');
      return Promise.reject(new Error('Missing required fields'));
    }
    
    // We don't need to generate a username here anymore as the backend will handle it
    return apiClient.post('/api/users', userData)
      .then(response => {
        console.log('User created successfully:', response.data);
        return response.data.data;
      })
      .catch(error => {
        console.error('Failed to create user:', error.response?.data || error.message);
        throw error;
      });
  },
  update: (id, userData) => apiClient.put(`/api/users/${id}`, userData).then(response => response.data.data),
  delete: (id) => apiClient.delete(`/api/users/${id}`),
};

