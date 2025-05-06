import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', // Fallback for local dev if needed
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptor for handling token expiration and refresh (optional but recommended)
// This is a basic example; a robust implementation would handle concurrent requests during refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Check if the error is due to an expired access token (e.g., 401 Unauthorized)
    // and if we haven't already retried the request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we've retried this request
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // Make request to refresh token endpoint
          const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { 
            refresh_token: refreshToken 
          }); 
          const newAccessToken = response.data.access_token;
          
          // Update local storage and the original request's header
          localStorage.setItem('accessToken', newAccessToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          // Retry the original request with the new token
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh token failed (e.g., it's also expired or invalid)
          console.error('Token refresh failed:', refreshError);
          // Logout the user
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          // Redirect to login page (or handle logout state)
          // This might require access to navigation context or a callback
          window.location.href = '/login'; // Simple redirect
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available, redirect to login
        console.error('No refresh token available for refresh attempt.');
         window.location.href = '/login'; // Simple redirect
         return Promise.reject(error);
      }
    }
    // For other errors, just reject the promise
    return Promise.reject(error);
  }
);

export default api;

