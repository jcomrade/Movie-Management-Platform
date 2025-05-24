import axios from 'axios';

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post('/api/auth/refresh', null, {
      withCredentials: true,
    });

    return response.data.access;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    return null;
  }
};
