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
        throw error;
      }
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
        }
        throw error;
      }
    },
    ...options,
  });
} 