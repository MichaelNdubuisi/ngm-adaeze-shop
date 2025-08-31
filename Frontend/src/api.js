// src/api.js
// Use REACT_APP_API_URL environment variable if available
// Fallback to NODE_ENV-based URLs for backward compatibility
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL || "https://your-backend-production-url.com"
    : "http://localhost:5000");

export default API_BASE_URL;
