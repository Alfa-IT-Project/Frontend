import { useQuery, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export function useApiQuery(key, fetcher, options) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      try {
        console.log(`Executing query for key: ${JSON.stringify(key)}`);
        const response = await fetcher();
        console.log(`Query response for key ${JSON.stringify(key)}:`, response);
        
        if (response && typeof response === 'object' && 'data' in response) {
          return response.data;
        }
        return response;
      } catch (error) {
        console.error(`Query error for key ${JSON.stringify(key)}:`, error);
        
        // Handle authentication errors
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            // Optionally refresh token or redirect to login
            console.error('Authentication error, need to login again');
            // Could redirect here: window.location.href = '/login';
          }
        }
        
        throw error;
      }
    },
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false;
      }
      return failureCount < 2; // retry twice for other errors
    },
    ...options,
  });
}

export function useApiMutation(mutationFn, options) {
  return useMutation({
    mutationFn: async (variables) => {
      try {
        const response = await mutationFn(variables);
        if (response && typeof response === 'object' && 'data' in response) {
          return response.data;
        }
        return response;
      } catch (error) {
        console.error('API Error:', error);
        if (error instanceof AxiosError && error.response) {
          console.error('Server response:', error.response.data);
          
          // Handle authentication errors
          if (error.response.status === 401) {
            console.error('Authentication error in mutation, need to login again');
            // Could redirect here: window.location.href = '/login';
          }
        }
        throw error;
      }
    },
    ...options,
  });
} 