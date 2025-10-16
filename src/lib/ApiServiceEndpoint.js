// Base URL configuration
const BASE_URL = "https://d3o0xna6ndudcs.cloudfront.net";

const ApiEndPoints = {
  // Base URL
  BASE_URL,
  
  // Authentication endpoints - matching OpenAPI specification
  AUTH: {
    LOGIN: `${BASE_URL}/api/auth/login`,
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGOUT: `${BASE_URL}/api/auth/logout`,
    REFRESH_TOKEN: `${BASE_URL}/api/auth/refresh`,
    USER_ME: `${BASE_URL}/api/auth/me`
  },
  
  // Legacy endpoint for backward compatibility
  refreshToken: `${BASE_URL}/api/auth/refresh`
}

export default ApiEndPoints;