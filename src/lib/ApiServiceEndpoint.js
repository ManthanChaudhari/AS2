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
  
  // Partner Management endpoints - matching OpenAPI specification
  PARTNERS: {
    LIST: `${BASE_URL}/api/partners/`,
    CREATE: `${BASE_URL}/api/partners/`,
    GET: (id) => `${BASE_URL}/api/partners/${id}`,
    UPDATE: (id) => `${BASE_URL}/api/partners/${id}`,
    DELETE: (id) => `${BASE_URL}/api/partners/${id}`,
    UPDATE_CERTIFICATE : (id) => `${BASE_URL}/api/partners/${id}/certificates`
  },

  AS2_TRANSMISSION : {
    CREATE : `${BASE_URL}/api/transmit/send`,
    GET_HISTORY : `${BASE_URL}/api/transmit/history`,
    GET_SIGNED_URL : `${BASE_URL}/api/transmit/download`,
    RETRY : `${BASE_URL}/api/transmit/retry`,
    STATUS : `${BASE_URL}/api/transmit/status`,
    DOWNLOAD_URL : `${BASE_URL}/api/transmit/artifacts`,
    GET_INBOX : `${BASE_URL}/api/receive/history`,
    GET_SIGNED_INBOX_URL : `${BASE_URL}/api/receive/download`,
    SYNC_INBOX_FILE : `${BASE_URL}/api/receive/sync`,
  },

  USER_MANAGEMENT : {
    USER_ALL : `${BASE_URL}/api/admin/users`,
  },
  
  // Legacy endpoint for backward compatibility
  refreshToken: `${BASE_URL}/api/auth/refresh`
}

export default ApiEndPoints;