// API Configuration
export const API_CONFIG = {
  // Змініть ці URL на ваші реальні
  BASE_URL: __DEV__ 
    ? 'https://kivvo3k-bublick-8082.exp.direct/api'  // Development
    : 'https://kivvo3k-bublick-8082.exp.direct/api',  // Production
    
  // Timeouts
  TIMEOUT: 10000, // 10 seconds
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Endpoints
export const ENDPOINTS = {
  // User endpoints
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,
  ME: '/users/me',
  
  // Car endpoints
  CARS: '/cars',
  CAR_BY_ID: (id: string) => `/cars/${id}`,
  USER_CARS: (userId: string) => `/users/${userId}/cars`,
} as const;
