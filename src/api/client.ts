import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      // Display error message from backend
      alert(error.response.data.message);
    } else if (error.message) {
      // Display generic error message
      alert(`Error: ${error.message}`);
    } else {
      alert('An unexpected error occurred');
    }
    return Promise.reject(error);
  }
);